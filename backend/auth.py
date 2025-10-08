from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token,
    jwt_required, 
    get_jwt_identity,
    get_jwt,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies
)
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import logging
import os
import re
from uuid import uuid4

from firebase_client import get_user_repository, FirebaseNotConfiguredError

logger = logging.getLogger(__name__)

# Create auth blueprint
auth_bp = Blueprint('auth', __name__)

# In-memory user storage for local fallback (only used when Firebase is unavailable)
users_db = {}

# Token blacklist for logout functionality
token_blacklist = set()

_firestore_repo = None
_firebase_warning_logged = False


def get_firestore_repo():
    """Return the Firestore repository if Firebase is configured."""
    global _firestore_repo, _firebase_warning_logged

    if _firestore_repo is None:
        try:
            repo = get_user_repository()
            _firestore_repo = repo
            logger.info("Firestore repository initialised successfully")
        except FirebaseNotConfiguredError as exc:
            if not _firebase_warning_logged:
                logger.warning("Firebase not configured: %s", exc)
                _firebase_warning_logged = True
            _firestore_repo = None
    return _firestore_repo


def prepare_user_response(user_record):
    """Transform user record into response payload."""
    children = user_record.get('children', [])
    points = user_record.get('points')
    if points is None:
        points = sum(child.get('points', 0) for child in children)

    return {
        'id': user_record['id'],
        'name': user_record.get('name'),
        'email': user_record.get('email'),
        'isParent': user_record.get('isParent', True),
        'children': children,
        'points': points,
    }


def store_user_record(email, record, repo=None):
    if repo:
        repo.create_user(email, record)
        logger.debug("Stored user %s in Firestore", email)
    else:
        users_db[email] = record
        logger.debug("Stored user %s in in-memory datastore", email)


def fetch_user_by_email(email, repo=None):
    if repo:
        user = repo.get_user_by_email(email)
        logger.info(
            "Firestore lookup for email %s returned %s",
            email,
            "hit" if user else "miss",
        )
        return user

    user = users_db.get(email)
    logger.info(
        "Local datastore lookup for email %s returned %s",
        email,
        "hit" if user else "miss",
    )
    return user


def fetch_user_by_id(user_id, repo=None):
    if repo:
        user = repo.get_user_by_id(user_id)
        logger.info(
            "Firestore lookup for id %s returned %s",
            user_id,
            "hit" if user else "miss",
        )
        return user

    for user in users_db.values():
        if str(user['id']) == str(user_id):
            logger.info("Local datastore lookup for id %s returned hit", user_id)
            return user

    logger.info("Local datastore lookup for id %s returned miss", user_id)
    return None

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 6:
        return False, "Password must be at least 6 characters long"
    return True, "Valid password"

@auth_bp.route('/signup', methods=['POST', 'OPTIONS'])
def signup():
    """User registration endpoint"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json() or {}

        # Validate required fields
        required_fields = ['parentEmail', 'password', 'childName', 'childAge']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field} is required'
                }), 400

        email = data['parentEmail'].lower().strip()
        password = data['password']
        child_name = data['childName'].strip()
        child_age = int(data['childAge'])

        if not validate_email(email):
            return jsonify({
                'success': False,
                'message': 'Invalid email format'
            }), 400

        is_valid, message = validate_password(password)
        if not is_valid:
            return jsonify({
                'success': False,
                'message': message
            }), 400

        repo = get_firestore_repo()
        existing_user = fetch_user_by_email(email, repo)
        if existing_user:
            return jsonify({
                'success': False,
                'message': 'User already exists with this email'
            }), 409

        user_id = str(uuid4())
        password_hash = generate_password_hash(password)

        new_user = {
            'id': user_id,
            'email': email,
            'password_hash': password_hash,
            'name': child_name,
            'isParent': True,
            'created_at': datetime.utcnow().isoformat(),
            'children': [
                {
                    'id': user_id,
                    'name': child_name,
                    'age': child_age,
                    'grade': f'Grade {max(1, child_age - 5)}',
                    'favoriteColor': '🟦 Blue',
                    'dateAdded': datetime.utcnow().strftime('%Y-%m-%d'),
                    'lastActive': 'Just created',
                    'avatar': child_name[0].upper(),
                    'points': 0,
                    'level': 1,
                    'lessonsCompleted': 0,
                    'testsAttended': 0,
                    'currentStreak': 0,
                    'averageScore': 0,
                    'totalTime': 0,
                    'strengths': [],
                    'weaknesses': []
                }
            ],
            'points': 0,
        }

        store_user_record(email, new_user, repo)

        return jsonify({
            'success': True,
            'message': f'Account created for {child_name}. Please sign in to continue.',
            'data': {
                'user_id': user_id,
                'email': email
            }
        }), 201
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'message': 'Invalid age format'
        }), 400
    except Exception as e:
        logger.exception("Signup failed")
        return jsonify({
            'success': False,
            'message': 'Registration failed',
            'error': str(e)
        }), 500

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    """User login endpoint"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json() or {}
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({
                'success': False,
                'message': 'Email and password are required'
            }), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        remember_me = data.get('rememberMe', False)
        
        repo = get_firestore_repo()
        user = fetch_user_by_email(email, repo)
        if not user:
            return jsonify({
                'success': False,
                'message': 'No user exists with this email address',
                'error': 'user_not_found'
            }), 404

        # Verify password
        if not check_password_hash(user['password_hash'], password):
            return jsonify({
                'success': False,
                'message': 'Incorrect password',
                'error': 'invalid_password'
            }), 401
        
        # Create tokens with extended expiry if remember me is checked
        token_expires = timedelta(days=30) if remember_me else timedelta(hours=1)
        access_token = create_access_token(
            identity=str(user['id']), 
            expires_delta=token_expires
        )
        refresh_token = create_refresh_token(identity=str(user['id']))
        user['last_login'] = datetime.utcnow().isoformat()
        if repo:
            repo.update_user(email, {'last_login': user['last_login']})
        
        # Prepare user data for frontend (matching existing structure)
        user_data = prepare_user_response(user)
        user_data['rememberMe'] = remember_me

        response = jsonify({
            'success': True,
            'message': 'Welcome back to BuddySign!',
            'data': {
                'user': user_data,
                'session': {
                    'access_token_cookie': current_app.config['JWT_ACCESS_COOKIE_NAME'],
                    'refresh_token_cookie': current_app.config['JWT_REFRESH_COOKIE_NAME'],
                    'remember_me': remember_me
                }
            }
        })
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        return response, 200
        
    except Exception as e:
        logger.exception("Login failed")
        return jsonify({
            'success': False,
            'message': 'Login failed',
            'error': str(e)
        }), 500

@auth_bp.route('/verify-token', methods=['POST', 'OPTIONS'])
@jwt_required()
def verify_token():
    """Verify JWT token and return user info"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        current_user_id = get_jwt_identity()
        jti = get_jwt()['jti']
        
        # Check if token is blacklisted
        if jti in token_blacklist:
            return jsonify({
                'success': False,
                'message': 'Token has been revoked'
            }), 401
        
        repo = get_firestore_repo()
        user = fetch_user_by_id(current_user_id, repo)
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        # Prepare user data
        user_data = prepare_user_response(user)
        
        return jsonify({
            'success': True,
            'message': 'Token is valid',
            'data': {
                'user': user_data,
                'token_valid': True
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Token verification failed',
            'error': str(e)
        }), 500

@auth_bp.route('/refresh', methods=['POST', 'OPTIONS'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token using refresh token"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        current_user_id = get_jwt_identity()
        
        # Create new access token
        new_access_token = create_access_token(identity=current_user_id)

        response = jsonify({
            'success': True,
            'message': 'Token refreshed successfully',
            'data': {
                'session': {
                    'access_token_cookie': current_app.config['JWT_ACCESS_COOKIE_NAME']
                }
            }
        })
        set_access_cookies(response, new_access_token)
        return response, 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Token refresh failed',
            'error': str(e)
        }), 500

@auth_bp.route('/logout', methods=['POST', 'OPTIONS'])
@jwt_required()
def logout():
    """Logout user by blacklisting token"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        jti = get_jwt()['jti']
        token_blacklist.add(jti)

        response = jsonify({
            'success': True,
            'message': 'Successfully logged out'
        })
        unset_jwt_cookies(response)
        return response, 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Logout failed',
            'error': str(e)
        }), 500

@auth_bp.route('/user', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_current_user():
    """Get current authenticated user's information"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        current_user_id = get_jwt_identity()
        repo = get_firestore_repo()
        user = fetch_user_by_id(current_user_id, repo)
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        # Prepare user data
        user_data = prepare_user_response(user)
        user_data['created_at'] = user.get('created_at')
        
        return jsonify({
            'success': True,
            'data': user_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch user data',
            'error': str(e)
        }), 500
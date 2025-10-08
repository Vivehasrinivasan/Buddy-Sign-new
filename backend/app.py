from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Import auth blueprint
from auth import (
    auth_bp,
    token_blacklist,
    fetch_user_by_id,
    get_firestore_repo,
    prepare_user_response,
)


def str_to_bool(value, default=False):
    if value is None:
        return default
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() in {"1", "true", "t", "yes", "y"}

# Load environment variables
load_dotenv()

def create_app():
    """Application factory pattern for Flask app creation"""
    app = Flask(__name__)
    
    # Configuration
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'fallback-secret-key')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600)))
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=int(os.getenv('JWT_REFRESH_TOKEN_EXPIRES_DAYS', 30)))
    app.config['JWT_ALGORITHM'] = 'HS256'
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.config['JWT_COOKIE_SECURE'] = str_to_bool(os.getenv('JWT_COOKIE_SECURE', 'False'))
    app.config['JWT_COOKIE_SAMESITE'] = os.getenv('JWT_COOKIE_SAMESITE', 'Lax')
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False
    app.config['JWT_ACCESS_COOKIE_NAME'] = os.getenv('JWT_ACCESS_COOKIE_NAME', 'buddysign_access_token')
    app.config['JWT_REFRESH_COOKIE_NAME'] = os.getenv('JWT_REFRESH_COOKIE_NAME', 'buddysign_refresh_token')
    
    # Initialize extensions
    jwt = JWTManager(app)
    
    # Configure CORS with specific origins
    cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:4173,http://localhost:5173,http://localhost:4028').split(',')
    CORS(app, 
         origins=cors_origins,
         allow_headers=['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials'],
         supports_credentials=True,
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    
    # JWT Error Handlers
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        return jwt_payload.get('jti') in token_blacklist

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'success': False,
            'message': 'Token has expired',
            'error': 'token_expired'
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            'success': False,
            'message': 'Invalid token',
            'error': 'invalid_token'
        }), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            'success': False,
            'message': 'Authorization token required',
            'error': 'missing_token'
        }), 401
    
    # Register blueprints
    api_prefix = os.getenv('API_PREFIX', '/api')
    app.register_blueprint(auth_bp, url_prefix=f'{api_prefix}/auth')
    
    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        """Health check endpoint to verify server status"""
        return jsonify({
            'success': True,
            'message': 'BuddySign Flask Backend is running',
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'version': os.getenv('APP_VERSION', '1.0.0')
        }), 200
    
    # API Info endpoint
    @app.route(f'{api_prefix}/info', methods=['GET'])
    def api_info():
        """API information endpoint"""
        return jsonify({
            'success': True,
            'data': {
                'app_name': os.getenv('APP_NAME', 'BuddySign'),
                'version': os.getenv('APP_VERSION', '1.0.0'),
                'api_prefix': api_prefix,
                'endpoints': {
                    'auth': {
                        'signup': f'{api_prefix}/auth/signup',
                        'login': f'{api_prefix}/auth/login',
                        'verify_token': f'{api_prefix}/auth/verify-token',
                        'refresh': f'{api_prefix}/auth/refresh',
                        'logout': f'{api_prefix}/auth/logout'
                    },
                    'health': '/health'
                }
            }
        }), 200
    
    # Protected route example
    @app.route(f'{api_prefix}/profile', methods=['GET'])
    @jwt_required()
    def get_profile():
        """Return the authenticated user's profile."""
        current_user_id = get_jwt_identity()
        repo = get_firestore_repo()
        user = fetch_user_by_id(current_user_id, repo)

        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found',
                'error': 'user_not_found'
            }), 404

        user_data = prepare_user_response(user)

        return jsonify({
            'success': True,
            'data': user_data
        }), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'message': 'Endpoint not found',
            'error': 'not_found'
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'success': False,
            'message': 'Internal server error',
            'error': 'internal_server_error'
        }), 500
    
    return app

# Create Flask app instance
app = create_app()

if __name__ == '__main__':
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"🚀 Starting BuddySign Flask Backend...")
    print(f"📡 Server: http://{host}:{port}")
    print(f"🔧 Debug: {debug}")
    print(f"🌐 CORS Origins: {os.getenv('CORS_ORIGINS', 'http://localhost:3000')}")
    
    app.run(host=host, port=port, debug=debug)
# BuddySign Flask Backend

A comprehensive Flask backend for the BuddySign React application with JWT authentication, CORS support, and RESTful API endpoints.

## 🚀 Features

- **JWT Authentication**: Secure token-based authentication
- **CORS Support**: Cross-origin resource sharing for frontend integration  
- **RESTful API**: Clean, RESTful endpoints for all operations
- **User Management**: Signup, login, logout, and profile management
- **Token Verification**: Middleware for protecting routes
- **Environment Configuration**: Flexible configuration via .env files
- **Error Handling**: Comprehensive error handling with proper HTTP status codes

> ℹ️ **Note:** The backend no longer seeds demo users automatically. Create accounts through the `/auth/signup` endpoint (or seed your Firestore database manually) before attempting to log in.

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Node.js (for frontend development)

## 🛠 Installation & Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy and modify .env file with your settings
cp .env.example .env

# Start the Flask server
python app.py
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install Node.js dependencies
npm install

# Start the React development server
npm start
```

## 🔧 Configuration

### Environment Variables (.env)

```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
FLASK_HOST=0.0.0.0
FLASK_PORT=5000

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key
JWT_ACCESS_TOKEN_EXPIRES=3600

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:4173,http://localhost:5173,http://localhost:4028

# Database Configuration (for future use)
DATABASE_URL=sqlite:///buddysign.db

# Firebase / Firestore
FIREBASE_SERVICE_ACCOUNT_PATH=/absolute/path/to/service-account.json
FIRESTORE_DATABASE_ID=(default)

# Application Settings
APP_NAME=BuddySign
APP_VERSION=1.0.0
API_PREFIX=/api/v1
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

> **Note:** JWT access and refresh tokens are issued as HTTP-only cookies. Browser clients receive and send these cookies automatically. When testing with tools such as Postman or curl, make sure to capture and resend the cookies instead of using an `Authorization` header.

#### POST /auth/signup
Register a new user account.

**Request Body:**
```json
{
  "parentEmail": "parent@example.com",
  "password": "password123",
  "childName": "Child Name",
  "childAge": "7"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Account created for Child Name. Please sign in to continue.",
  "data": {
    "user_id": "3f5a3c10-6e1c-4f25-9f20-30c4b1b0c1d7",
    "email": "parent@example.com"
  }
}
```

#### POST /auth/login
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "parent@buddysign.com",
  "password": "parent123",
  "rememberMe": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Welcome back to BuddySign!",
  "data": {
    "user": {
      "id": "3f5a3c10-6e1c-4f25-9f20-30c4b1b0c1d7",
      "name": "Sarah Johnson",
      "email": "parent@example.com",
      "isParent": true,
      "children": [...],
      "points": 450
    },
    "session": {
      "access_token_cookie": "buddysign_access_token",
      "refresh_token_cookie": "buddysign_refresh_token"
    }
  }
}
```

#### POST /auth/verify-token
Verify JWT token validity (requires the access token cookie).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "user": {
      "id": 1,
      "name": "Sarah Johnson",
      "email": "parent@buddysign.com",
      "isParent": true,
      "children": [...],
      "points": 450
    },
    "token_valid": true
  }
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "access_token": "new.jwt.token.here",
    "token_type": "Bearer"
  }
}
```

#### POST /auth/logout
Logout user and blacklist token (requires the access token cookie).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

### Protected Endpoints

#### GET /profile
Get current user profile (requires the access token cookie).

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Sarah Johnson",
    "email": "parent@buddysign.com",
    "isParent": true,
    "points": 750,
    "children": [...]
  }
}
```

### Utility Endpoints

#### GET /health
Check server health status.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "BuddySign Flask Backend is running",
  "status": "healthy",
  "timestamp": "2024-10-06T10:30:00.000Z",
  "version": "1.0.0"
}
```

#### GET /info
Get API information and available endpoints.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "app_name": "BuddySign",
    "version": "1.0.0",
    "api_prefix": "/api/v1",
    "endpoints": {
      "auth": {
        "signup": "/api/v1/auth/signup",
        "login": "/api/v1/auth/login",
        "verify_token": "/api/v1/auth/verify-token",
        "refresh": "/api/v1/auth/refresh",
        "logout": "/api/v1/auth/logout"
      },
      "health": "/health"
    }
  }
}
```

## 🧪 Testing

### Run API Tests
```bash
# Run the test script to verify all endpoints
python test_api.py
```

### Test with cURL

```bash
# Health check
curl http://localhost:5000/health

# User signup
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "parentEmail": "test@example.com",
    "password": "testpass123",
    "childName": "Test Child",
    "childAge": "7"
  }'

# User login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "parent@buddysign.com",
    "password": "parent123"
  }'

# Protected endpoint (replace <token> with actual JWT)
curl -X GET http://localhost:5000/api/v1/profile \
  -H "Authorization: Bearer <token>"
```

## 🔐 Security Features

- **Password Hashing**: Uses Werkzeug's secure password hashing
- **JWT Tokens**: Secure token-based authentication
- **Token Blacklisting**: Logout invalidates tokens
- **CORS Protection**: Configurable cross-origin access
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses without sensitive data exposure

## 🗄️ Database Integration

The current implementation uses in-memory storage for demonstration. To integrate with a real database:

1. **SQLAlchemy**: Already included in requirements.txt
2. **MongoDB**: Add pymongo to requirements.txt
3. **Firebase Firestore**: firebase-admin already included

Example SQLAlchemy integration:

```python
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    # ... other fields
```

## 🚀 Production Deployment

### Using Gunicorn

```bash
# Install gunicorn (already in requirements.txt)
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Environment Variables for Production

```env
FLASK_ENV=production
FLASK_DEBUG=False
JWT_SECRET_KEY=very-secure-random-key-here
DATABASE_URL=postgresql://user:password@host:port/database
```

## 🔄 Frontend Integration

The frontend authentication service (`authService.js`) automatically handles:

- Token storage in localStorage
- Authorization headers for API requests
- Token refresh on expiration
- Automatic logout on invalid tokens

### Usage in React Components

```jsx
import authService from '../services/authService';

// Login
const handleLogin = async (formData) => {
  try {
    const result = await authService.login(formData);
    if (result.success) {
      // Redirect to dashboard
    }
  } catch (error) {
    // Handle error
  }
};

// Check authentication status
if (authService.isAuthenticated()) {
  // User is logged in
}

// Get current user
const user = authService.getCurrentUser();
```

## 📝 Development Notes

### Default Demo Account
- **Email**: parent@buddysign.com
- **Password**: parent123

### File Structure
```
backend/
├── app.py              # Main Flask application
├── auth.py             # Authentication routes and logic
├── requirements.txt    # Python dependencies
├── .env               # Environment configuration
├── test_api.py        # API testing script
└── README.md          # This file
```

### Adding New Endpoints

1. Create new Blueprint in separate file
2. Register Blueprint in `app.py`
3. Add route handlers with proper authentication
4. Update API documentation

Example:
```python
# lessons.py
from flask import Blueprint
from flask_jwt_extended import jwt_required

lessons_bp = Blueprint('lessons', __name__)

@lessons_bp.route('/lessons', methods=['GET'])
@jwt_required()
def get_lessons():
    # Implementation here
    pass

# In app.py
from lessons import lessons_bp
app.register_blueprint(lessons_bp, url_prefix=f'{api_prefix}/lessons')
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Update documentation
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**: Check CORS_ORIGINS in .env file
2. **Token Expired**: Implement token refresh in frontend
3. **Import Errors**: Ensure all dependencies are installed
4. **Port Conflicts**: Change FLASK_PORT in .env file

### Debug Mode

Set `FLASK_DEBUG=True` in .env for detailed error messages and auto-reload.

---

**Happy Coding! 🚀**
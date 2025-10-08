# BuddySign - Complete Application

A comprehensive sign language learning platform with React frontend and Flask backend, designed to make sign language learning interactive and engaging for children and families.

## 🌟 Project Overview

BuddySign is a full-stack web application that combines:
- **React Frontend**: Interactive UI with animations, games, and learning modules
- **Flask Backend**: RESTful API with JWT authentication and user management
- **Authentication System**: Secure user registration, login, and session management
- **Learning Platform**: Dictionary browser, interactive lessons, and progress tracking

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+** (for backend)
- **Node.js 16+** (for frontend)
- **npm or yarn** (package manager)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd buddysign

# Setup Backend
cd backend
pip install -r requirements.txt
python app.py

# Setup Frontend (in new terminal)
cd ../frontend
npm install
npm start
```

### 2. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/v1/info

## 📁 Project Structure

```
buddysign/
├── backend/                    # Flask API Server
│   ├── app.py                 # Main Flask application
│   ├── auth.py                # Authentication routes
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment configuration
│   ├── test_api.py           # API testing script
│   └── README.md             # Backend documentation
│
├── frontend/                   # React Application
│   ├── public/               # Static assets
│   ├── src/                  # Source code
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Application pages
│   │   ├── context/          # React context providers
│   │   ├── services/         # API and external services
│   │   ├── hooks/            # Custom React hooks
│   │   ├── styles/           # CSS and styling
│   │   └── utils/            # Utility functions
│   ├── package.json          # Node.js dependencies
│   └── README.md             # Frontend documentation
│
└── README.md                 # This file
```

## 🔧 Architecture

### Frontend (React)
- **Framework**: React 18 with Hooks and Context
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context + useReducer
- **Authentication**: JWT token management with auto-refresh
- **Build Tool**: Vite for fast development and optimized builds

### Backend (Flask)
- **Framework**: Flask 3.0 with Blueprint organization
- **Authentication**: JWT tokens with Flask-JWT-Extended
- **CORS**: Configured for multi-port frontend development
- **Security**: Password hashing, token blacklisting, input validation
- **API Design**: RESTful endpoints with consistent JSON responses

## 🎯 Key Features

### For Children
- 📚 **Interactive Dictionary**: Browse and learn sign language words
- 🎮 **Interactive Lessons**: Gamified learning experiences
- 🏆 **Progress Tracking**: Points, streaks, and achievements
- 🐼 **Panda Companion**: Animated learning buddy
- 🕒 **Time Management**: Controlled learning sessions

### For Parents
- 👨‍👩‍👧‍👦 **Family Dashboard**: Monitor children's progress
- ⚙️ **Child Controls**: Manage learning time and content
- 📊 **Progress Reports**: Detailed learning analytics
- 🛡️ **Safety Features**: Secure, child-friendly environment
- 👤 **Account Management**: Multiple child profiles

### Technical Features
- 🔐 **Secure Authentication**: JWT-based auth with refresh tokens
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- ♿ **Accessibility**: Screen reader friendly, keyboard navigation
- 🌐 **CORS Support**: Proper cross-origin configuration
- 🔄 **Auto-sync**: Real-time data synchronization
- 📊 **Error Handling**: Comprehensive error tracking and user feedback

## 🛠 Development Setup

### Backend Development

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
python app.py
```

**Environment Variables** (`.env`):
```env
FLASK_ENV=development
FLASK_DEBUG=True
JWT_SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:3000,http://localhost:4173
DATABASE_URL=sqlite:///buddysign.db
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Other commands
npm run build    # Production build
npm run preview  # Preview production build
npm test         # Run tests
```

## 🔌 API Integration

### Authentication Flow

1. **User Registration** → `POST /api/v1/auth/signup`
2. **User Login** → `POST /api/v1/auth/login`
3. **Token Verification** → `POST /api/v1/auth/verify-token`
4. **Token Refresh** → `POST /api/v1/auth/refresh`
5. **User Logout** → `POST /api/v1/auth/logout`

### Frontend Service Usage

```jsx
import authService from './services/authService';

// Login example
const handleLogin = async (credentials) => {
  try {
    const result = await authService.login(credentials);
    if (result.success) {
      // Handle successful login
      navigate('/dashboard');
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
python test_api.py  # Test all API endpoints
```

### Frontend Testing
```bash
cd frontend
npm test            # Run React tests
npm run test:coverage  # Run with coverage report
```

### Manual Testing
- Use the demo account: `parent@buddysign.com` / `parent123`
- Test all authentication flows
- Verify CORS functionality across different ports
- Check responsive design on various screen sizes

## 🚀 Production Deployment

### Backend (Flask)
```bash
# Install production server
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Environment for production
export FLASK_ENV=production
export FLASK_DEBUG=False
export JWT_SECRET_KEY="very-secure-random-key"
```

### Frontend (React)
```bash
# Build for production
npm run build

# Serve static files (example with serve)
npm install -g serve
serve -s dist
```

### Environment Configuration
- Set secure JWT secrets
- Configure production database
- Update CORS origins for production domains
- Enable HTTPS in production
- Set up proper logging and monitoring

## 🛡️ Security Considerations

- **JWT Tokens**: Secure token storage and validation
- **Password Hashing**: Werkzeug secure password hashing
- **Input Validation**: Server-side validation for all inputs
- **CORS**: Properly configured cross-origin access
- **Token Expiration**: Automatic token refresh and expiration handling
- **Error Messages**: No sensitive information in error responses

## 📚 Documentation

- **Backend API**: See `/backend/README.md` for detailed API documentation
- **Frontend Components**: See `/frontend/README.md` for component documentation
- **Authentication Guide**: See `/frontend/AUTHENTICATION_GUIDE.md` for auth implementation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Update documentation
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Submit pull request

### Development Guidelines
- Follow existing code style and patterns
- Add tests for new features
- Update documentation for API changes
- Ensure responsive design for frontend changes
- Test authentication flows thoroughly

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
```bash
# Check CORS_ORIGINS in backend/.env
CORS_ORIGINS=http://localhost:3000,http://localhost:4173,http://localhost:5173
```

**Token Issues**
- Check JWT_SECRET_KEY matches between requests
- Verify token format: `Bearer <token>`
- Check token expiration time

**Installation Issues**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Python virtual environment
python -m venv venv
pip install --upgrade pip
pip install -r requirements.txt
```

**Port Conflicts**
- Frontend: Change port in `package.json` or use `npm start -- --port 3001`
- Backend: Change FLASK_PORT in `.env`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review troubleshooting section

---

**Built with ❤️ for accessible sign language learning**
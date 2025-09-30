# 🚀 Todo Authentication App

A full-stack Todo application with comprehensive authentication, email verification, and modern UI. Built with Django REST Framework backend, React web frontend, and React Native mobile app.

![Django](https://img.shields.io/badge/Django-5.2.6-green.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.81.4-61dafb.svg)
![Expo](https://img.shields.io/badge/Expo-54.0.10-000020.svg)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange.svg)
![Email](https://img.shields.io/badge/Email-Verification-red.svg)

## ✨ Features

### 🔐 Authentication & Security
- **JWT Authentication** with access and refresh tokens
- **Email Verification** for new user accounts
- **Protected Routes** with automatic redirects
- **Persistent Sessions** that survive browser refresh
- **Automatic Token Refresh** when tokens expire
- **User Isolation** - each user sees only their data
- **Password Validation** with Django's built-in validators
- **Cross-platform Authentication** (Web & Mobile)

### 📧 Email System
- **Professional Email Templates** (HTML + Plain Text)
- **Email Verification** with secure UUID tokens
- **24-hour Token Expiration** for security
- **Resend Verification** functionality
- **Console Backend** for development
- **SMTP Ready** for production deployment

### ⚛️ Frontend Experience (Web & Mobile)
- **Modern UI** with Chakra UI (Web) and React Native Paper (Mobile)
- **Responsive Design** that works on all devices
- **Dark/Light Mode** support (Web)
- **Real-time State Management** with Zustand
- **Error Handling** with user-friendly messages
- **Loading States** and smooth transitions
- **Form Validation** and user feedback
- **Cross-platform Synchronization**

### 📋 Todo Management
- **CRUD Operations** (Create, Read, Update, Delete)
- **User-specific Todos** with proper isolation
- **Real-time Updates** with optimistic UI
- **Image Upload** support for todos
- **Search and Filter** capabilities
- **Synchronized Data** across web and mobile platforms

## 🛠️ Tech Stack

### Backend
- **Django 5.2.6** - Web framework
- **Django REST Framework 3.16.1** - API framework
- **Django Simple JWT 5.5.1** - JWT authentication
- **Django CORS Headers 4.9.0** - Cross-origin requests
- **Python Decouple 3.8** - Environment variables
- **Pillow 10.0.1** - Image processing
- **PostgreSQL/SQLite** - Database (configurable)

### Frontend (Web)
- **React 18.3.1** - UI library
- **Vite 7.1.7** - Build tool and dev server
- **Chakra UI 2.10.9** - Component library
- **React Router Dom 6.25.1** - Client-side routing
- **Zustand 4.5.7** - State management
- **Axios 1.12.2** - HTTP client
- **React Icons 5.2.1** - Icon library
- **Framer Motion 6.5.1** - Animations

### Mobile (React Native)
- **React Native 0.81.4** - Mobile framework
- **Expo 54.0.10** - Development platform
- **React Navigation 6.x** - Navigation library
- **React Native Paper** - Material Design components
- **Zustand 4.5.7** - State management (shared)
- **Axios 1.12.2** - HTTP client (shared)
- **Expo SecureStore** - Secure token storage
- **Expo Vector Icons** - Icon library

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **npm or yarn**
- **Git**

### 📥 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd todo_auth
   ```

2. **Backend Setup**
   ```bash
   cd todo_backend
   
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # On macOS/Linux:
   source venv/bin/activate
   # On Windows:
   # venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Create .env file
   cp .env.example .env  # Edit with your settings
   
   # Run migrations
   python manage.py migrate
   
   # Create superuser (optional)
   python manage.py createsuperuser
   
   # Start development server
   python manage.py runserver
   ```

3. **Frontend Setup (Web)**
   ```bash
   cd ../frontend
   
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Mobile App Setup (React Native)**
   ```bash
   cd ../mobile
   
   # Install dependencies
   npm install
   
   # Start Expo development server
   npm start
   ```

5. **Access the Applications**
   - Web Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin
   - Mobile App: Scan QR code with Expo Go app

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `todo_backend` directory:

```bash
# Database Configuration
DB_NAME=todo_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ENVIRONMENT=development

# Email Configuration (Development)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@todoapp.com
FRONTEND_URL=http://localhost:5173

# Email Configuration (Production)
# EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USE_TLS=True
# EMAIL_HOST_USER=your-email@gmail.com
# EMAIL_HOST_PASSWORD=your-app-password
```

### Database Configuration

**SQLite (Default - Development)**
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

**PostgreSQL (Production)**
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT'),
    }
}
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register/` | User registration | No |
| POST | `/api/auth/login/` | User login | No |
| POST | `/api/auth/token/refresh/` | Refresh access token | No |
| GET | `/api/auth/profile/` | Get user profile | Yes |
| GET | `/api/auth/verify-email/{token}/` | Verify email address | No |
| POST | `/api/auth/resend-verification/` | Resend verification email | No |

### Todo Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products/` | List user's todos | Yes |
| POST | `/api/products/` | Create new todo | Yes |
| GET | `/api/products/{id}/` | Get specific todo | Yes |
| PUT | `/api/products/{id}/` | Update todo | Yes |
| DELETE | `/api/products/{id}/` | Delete todo | Yes |

### Request/Response Examples

**User Registration**
```json
// POST /api/auth/register/
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}

// Response
{
  "message": "User created successfully. Please check your email for verification link.",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "email_verified": false
  },
  "email_verification_required": true
}
```

**User Login**
```json
// POST /api/auth/login/
{
  "username": "johndoe",
  "password": "securepassword123"
}

// Response
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "email_verified": true
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
}
```

## 📱 Mobile App

### React Native with Expo

The mobile app provides the full functionality of the web application in a native mobile experience:

**Key Features:**
- **Cross-platform** (iOS & Android) with single codebase
- **Native UI** with React Native Paper components
- **Secure authentication** with Expo SecureStore
- **Shared state management** with web app (Zustand)
- **Same API integration** as web frontend
- **Offline-ready architecture** with token persistence

**Quick Start:**
```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Configure backend URL in src/utils/config.js
# For Android emulator: http://10.0.2.2:8000
# For physical device: http://YOUR_IP:8000

# Start development server
npm start

# Scan QR code with Expo Go app
```

**Development Setup:**
1. Install Expo CLI: `npm install -g @expo/cli`
2. Install Expo Go app on your device
3. Make sure Django backend is running on `0.0.0.0:8000`
4. Update IP address in mobile config for physical devices

For detailed mobile setup instructions, see [mobile/README.md](mobile/README.md).

## 🎯 User Flows

### Registration & Email Verification Flow

1. **User Registration**
   - User fills registration form
   - Backend creates inactive user account
   - Verification email sent automatically
   - User redirected to email verification page

2. **Email Verification**
   - User receives email with verification link
   - Clicks link (opens verification page)
   - Frontend automatically verifies token
   - User account activated
   - User can now log in

3. **Login Process**
   - User attempts login
   - System checks email verification status
   - If verified: Login successful with JWT tokens
   - If not verified: Shows email verification prompt

### Todo Management Flow

1. **Create Todo**
   - User clicks "Add Todo" button
   - Fills form with todo details
   - Todo saved to user's account only

2. **View Todos**
   - User sees only their own todos
   - Real-time updates with Zustand state

3. **Update/Delete**
   - In-place editing with optimistic updates
   - Confirmation dialogs for destructive actions

## 🔒 Security Features

### Authentication Security
- **JWT Tokens** with short expiration (60 minutes)
- **Refresh Tokens** with longer expiration (7 days)
- **Token Rotation** on refresh
- **Automatic Token Blacklisting** after rotation

### Email Security
- **Secure UUID4 Tokens** for email verification
- **24-hour Token Expiration** prevents stale tokens
- **Single-use Tokens** cannot be reused
- **No User Enumeration** - system doesn't reveal if email exists

### API Security
- **CORS Configuration** for frontend integration
- **Authentication Required** for protected endpoints
- **User Isolation** - users can only access their data
- **Password Validation** with Django validators

### Frontend Security
- **Protected Routes** with authentication checks
- **Automatic Redirects** for unauthenticated users
- **Token Storage** in localStorage with cleanup
- **XSS Prevention** with React's built-in protections

## 🧪 Testing

### Backend Testing
```bash
cd todo_backend
source venv/bin/activate

# Run all tests
python manage.py test

# Test specific app
python manage.py test authentication
python manage.py test products

# Check user verification status
python check_users.py
```

### Frontend Testing
```bash
cd frontend

# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Manual Testing Checklist

**Authentication Flow:**
- [ ] User registration with email verification
- [ ] Login with verified account
- [ ] Login rejection for unverified accounts
- [ ] Email verification link functionality
- [ ] Resend verification email
- [ ] Token refresh functionality
- [ ] Logout and session cleanup

**Todo Management:**
- [ ] Create new todo
- [ ] View todo list
- [ ] Update existing todo
- [ ] Delete todo
- [ ] User isolation (can't see other users' todos)

**UI/UX:**
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Dark/light mode switching
- [ ] Error handling and user feedback
- [ ] Loading states and transitions

## 📦 Deployment

### Backend Deployment (Production)

1. **Environment Setup**
   ```bash
   # Set production environment variables
   ENVIRONMENT=production
   DEBUG=False
   SECRET_KEY=your-production-secret-key
   
   # Database (PostgreSQL recommended)
   DB_NAME=your_production_db
   DB_USER=your_db_user
   DB_PASSWORD=secure_password
   DB_HOST=your_db_host
   
   # Email (SMTP)
   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
   EMAIL_HOST=smtp.gmail.com
   EMAIL_HOST_USER=your-email@yourdomain.com
   EMAIL_HOST_PASSWORD=your-app-password
   ```

2. **Production Settings**
   ```bash
   # Install production dependencies
   pip install gunicorn psycopg2-binary
   
   # Collect static files
   python manage.py collectstatic --noinput
   
   # Run with Gunicorn
   gunicorn my_todo.wsgi:application --bind 0.0.0.0:8000
   ```

### Frontend Deployment

1. **Build for Production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify/Vercel**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables: `VITE_API_URL=https://your-api-domain.com`

### Recommended Hosting

**Backend:**
- **Railway** - Easy Django deployment
- **Heroku** - Classic PaaS solution
- **DigitalOcean App Platform** - Affordable and reliable
- **AWS/GCP/Azure** - Enterprise solutions

**Frontend:**
- **Netlify** - Best for React apps
- **Vercel** - Excellent performance
- **Surge.sh** - Simple deployment
- **GitHub Pages** - Free hosting

**Database:**
- **Railway PostgreSQL** - Integrated with hosting
- **AWS RDS** - Managed database service
- **ElephantSQL** - Hosted PostgreSQL
- **Supabase** - Modern PostgreSQL with extras

## 📁 Project Structure

```
todo_auth/
├── 📄 README.md
├── 📄 EMAIL_VERIFICATION_GUIDE.md
├── 📄 EMAIL_VERIFICATION_SUMMARY.md
├── 📄 PRODUCTION_EMAIL_SETUP.md
├── 📁 todo_backend/
│   ├── 📁 my_todo/
│   │   ├── 📄 settings.py
│   │   ├── 📄 urls.py
│   │   └── 📄 wsgi.py
│   ├── 📁 authentication/
│   │   ├── 📄 models.py
│   │   ├── 📄 views.py
│   │   ├── 📄 urls.py
│   │   └── 📄 utils.py
│   ├── 📁 products/
│   │   ├── 📄 models.py
│   │   ├── 📄 views.py
│   │   └── 📄 urls.py
│   ├── 📄 manage.py
│   ├── 📄 requirements.txt
│   ├── 📄 .env
│   └── 📄 check_users.py
└── 📁 frontend/
    ├── 📁 src/
    │   ├── 📁 components/
    │   │   ├── 📄 Navbar.jsx
    │   │   ├── 📄 ProductCard.jsx
    │   │   └── 📄 ProtectedRoute.jsx
    │   ├── 📁 pages/
    │   │   ├── 📄 LoginPage.jsx
    │   │   ├── 📄 RegisterPage.jsx
    │   │   ├── 📄 HomePage.jsx
    │   │   ├── 📄 CreatePage.jsx
    │   │   ├── 📄 EmailVerificationPage.jsx
    │   │   └── 📄 VerifyEmailPage.jsx
    │   ├── 📁 store/
    │   │   ├── 📄 auth-localStorage.js
    │   │   └── 📄 product.js
    │   └── 📄 App.jsx
    ├── 📄 package.json
    └── 📄 vite.config.js
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow **PEP 8** for Python code
- Use **ESLint** for JavaScript code
- Write **comprehensive tests** for new features
- Update **documentation** for API changes
- Use **meaningful commit messages**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Django REST Framework** - Excellent API framework
- **React** - Amazing UI library
- **Chakra UI** - Beautiful component library
- **Zustand** - Simple state management
- **Vite** - Fast build tool

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. **Check existing issues** in the GitHub repository
2. **Create a new issue** with detailed description
3. **Include error logs** and reproduction steps
4. **Tag appropriately** (bug, enhancement, question)

## 🚀 Future Enhancements

### Planned Features
- [ ] **Password Reset** functionality
- [ ] **Social Authentication** (Google, GitHub)
- [ ] **Two-Factor Authentication** (2FA)
- [ ] **Role-Based Permissions**
- [ ] **Todo Categories** and tags
- [ ] **File Attachments** for todos
- [ ] **Real-time Notifications**
- [ ] **API Rate Limiting**
- [ ] **Advanced Search** and filtering
- [ ] **Export/Import** functionality

### Performance Optimizations
- [ ] **Database Query Optimization**
- [ ] **Redis Caching** implementation
- [ ] **CDN Integration** for static files
- [ ] **API Pagination** for large datasets
- [ ] **Lazy Loading** for images
- [ ] **Service Worker** for offline support

---

## ✨ **Ready to Build Amazing Things!**

This Todo application provides a solid foundation for building modern web applications with authentication, email verification, and real-time features. The architecture is scalable, secure, and follows industry best practices.

**Happy coding!** 🚀

---

*Made with ❤️ by [Your Name]*
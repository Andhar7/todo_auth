# Todo Auth Mobile App

A React Native mobile application built with Expo that connects to the Django backend for todo management with authentication.

## 🚀 Features

- **User Authentication** with email verification
- **Todo Management** (Create, Read, Update, Delete)
- **Secure Token Storage** using Expo SecureStore
- **Modern UI** with React Native Paper
- **Cross-platform** (iOS & Android)
- **State Management** with Zustand
- **Auto token refresh** and error handling

## 📱 Screenshots

The app includes:
- Login/Register screens with validation
- Email verification flow
- Todo list with search functionality
- Create/Edit todo functionality
- User profile with statistics
- Pull-to-refresh and loading states

## 🛠️ Setup Instructions

### Prerequisites

1. **Node.js** (v16 or later)
2. **Expo CLI**: `npm install -g @expo/cli`
3. **Django Backend** running (see ../todo_backend)
4. **Expo Go app** on your mobile device (for testing)

### Installation

1. **Navigate to mobile directory**:
   ```bash
   cd mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Backend URL**:
   Edit `src/utils/config.js` and update the backend URL:
   
   - For **Android Emulator**: `http://10.0.2.2:8000` (default)
   - For **iOS Simulator**: `http://127.0.0.1:8000`
   - For **Physical Device**: `http://YOUR_COMPUTER_IP:8000`

   To find your computer's IP:
   ```bash
   # On macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # On Windows
   ipconfig | findstr "IPv4"
   ```

4. **Start the Django backend** (in another terminal):
   ```bash
   cd ../todo_backend
   python manage.py runserver 0.0.0.0:8000
   ```

5. **Start the Expo development server**:
   ```bash
   npm start
   ```

### Running the App

#### Option 1: Expo Go (Recommended for development)
1. Install Expo Go on your mobile device
2. Scan the QR code from the terminal/browser
3. The app will load on your device

#### Option 2: Emulator
1. **Android**: 
   ```bash
   npm run android
   ```
2. **iOS** (macOS only):
   ```bash
   npm run ios
   ```

#### Option 3: Web (Limited functionality)
```bash
npm run web
```

## 🏗️ Project Structure

```
mobile/
├── src/
│   ├── components/          # Reusable components
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.js  # Main navigation logic
│   ├── screens/             # Screen components
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── EmailVerificationScreen.js
│   │   ├── HomeScreen.js
│   │   ├── CreateTodoScreen.js
│   │   ├── ProfileScreen.js
│   │   └── LoadingScreen.js
│   ├── store/               # State management
│   │   ├── authStore.js     # Authentication state
│   │   └── todoStore.js     # Todo management state
│   └── utils/               # Utilities and configuration
│       └── config.js        # API configuration
├── App.js                   # Main app component
└── package.json
```

## 🔧 Configuration

### Backend URL Configuration

The app automatically detects and uses the appropriate backend URL. You can modify `src/utils/config.js`:

```javascript
export const API_CONFIG = {
  ANDROID_EMULATOR: "http://10.0.2.2:8000",
  IOS_SIMULATOR: "http://127.0.0.1:8000",
  PHYSICAL_DEVICE: "http://192.168.1.XXX:8000", // Replace with your IP
  PRODUCTION: "https://your-production-domain.com",
};
```

### Secure Storage

The app uses Expo SecureStore for storing sensitive data:
- JWT access token
- JWT refresh token
- User information
- Authentication state

## 📦 Key Dependencies

- **expo**: ~54.0.10 - Expo platform
- **react-native**: 0.81.4 - React Native framework
- **@react-navigation/native**: Navigation library
- **react-native-paper**: Material Design components
- **zustand**: State management
- **axios**: HTTP client
- **expo-secure-store**: Secure token storage
- **@expo/vector-icons**: Icon library

## 🔗 API Integration

The mobile app integrates with the Django backend APIs:

### Authentication Endpoints
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/resend-verification/` - Resend email verification
- `GET /api/auth/profile/` - Get user profile
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Todo Endpoints
- `GET /api/products/` - Get user's todos
- `POST /api/products/` - Create new todo
- `PUT /api/products/{id}/` - Update todo
- `DELETE /api/products/{id}/` - Delete todo

## 🐛 Troubleshooting

### Common Issues

1. **"Network Error" or "Connection Refused"**:
   - Check if Django backend is running
   - Verify the backend URL in `config.js`
   - For physical devices, use your computer's IP address

2. **"CORS Error"**:
   - Ensure Django backend has CORS configured
   - Check `CORS_ALLOWED_ORIGINS` in Django settings

3. **"Email Verification Not Working"**:
   - Check Django email backend configuration
   - For development, emails are logged to console

4. **App won't load on device**:
   - Ensure device and computer are on same WiFi network
   - Check if firewall is blocking port 8000

### Debug Mode

To enable additional logging, you can add console.log statements in the stores or check the Expo dev tools.

## 🚀 Building for Production

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

### App Store Deployment
1. Build the app using EAS Build
2. Submit to app stores
3. Update backend URL to production in config

## 🤝 Integration with Web App

This mobile app shares the same backend with the React web application, providing:
- **Synchronized data** across platforms
- **Same authentication system**
- **Consistent API endpoints**
- **Shared user accounts**

Users can seamlessly switch between web and mobile versions of the application.

## 📄 License

This project is part of the Todo Auth application suite.
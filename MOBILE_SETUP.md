# 📱 Mobile App Setup Guide

This guide will help you set up and run the React Native mobile app for the Todo Auth application.

## 🔧 Prerequisites

Before starting, make sure you have:

1. **Node.js** (v16 or later) installed
2. **Django backend** running and accessible
3. **Smartphone** with Expo Go app installed
4. **Same WiFi network** for computer and phone

## 🚀 Quick Setup

### 1. Navigate to Mobile Directory
```bash
cd mobile
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Automatic Setup
```bash
npm run setup
```

This will:
- ✅ Detect your local IP address automatically
- ✅ Update the API configuration
- ✅ Show you the next steps

### 4. Start Django Backend
In a separate terminal:
```bash
cd ../todo_backend
python manage.py runserver 0.0.0.0:8000
```

**Important:** Use `0.0.0.0:8000` (not `127.0.0.1:8000`) so the mobile app can connect!

### 5. Start Mobile Development Server
```bash
npm start
```

### 6. Open on Mobile Device
1. Open **Expo Go** app on your phone
2. Scan the QR code from the terminal
3. The app will load on your device

## 📋 Manual Configuration

If the automatic setup doesn't work, you can configure manually:

### Update API URL

Edit `src/utils/config.js`:

```javascript
export const API_CONFIG = {
  ANDROID_EMULATOR: "http://10.0.2.2:8000",
  IOS_SIMULATOR: "http://127.0.0.1:8000",
  PHYSICAL_DEVICE: "http://YOUR_IP_ADDRESS:8000", // <- Change this
  PRODUCTION: "https://your-production-domain.com",
};
```

### Find Your IP Address

**macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig | findstr "IPv4"
```

**Alternative (Node.js):**
```bash
node -e "console.log(require('os').networkInterfaces())"
```

## 🔌 Backend Connection

### Different Scenarios

1. **Android Emulator**: Uses `http://10.0.2.2:8000`
2. **iOS Simulator**: Uses `http://127.0.0.1:8000`
3. **Physical Device**: Uses `http://YOUR_IP:8000`

### Troubleshooting Connection Issues

**"Network Error" or "Connection Refused":**

1. **Check Django Backend:**
   ```bash
   cd todo_backend
   python manage.py runserver 0.0.0.0:8000
   ```

2. **Test Backend API:**
   ```bash
   curl http://YOUR_IP:8000/api/auth/login/
   ```

3. **Check Firewall:**
   - Ensure port 8000 is not blocked
   - Temporarily disable firewall to test

4. **Verify Network:**
   - Both devices on same WiFi
   - No VPN interference

## 📱 Development Workflow

### Testing the App

1. **Registration Flow:**
   - Register new user
   - Check Django console for verification email
   - Login should require email verification

2. **Todo Management:**
   - Create, edit, delete todos
   - Verify data syncs with web app
   - Test search functionality

3. **Authentication:**
   - Token persistence after app restart
   - Logout functionality
   - Profile information display

### Hot Reloading

- **Code changes** reload automatically
- **Configuration changes** may require restart
- **Press 'r'** in terminal to reload manually

## 🔧 Development Commands

```bash
# Start development server
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator (macOS only)
npm run ios

# Run in web browser (limited functionality)
npm run web

# Setup/configure app
npm run setup
```

## 📦 Building for Production

### EAS Build (Recommended)

1. **Install EAS CLI:**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Build for Android:**
   ```bash
   eas build --platform android
   ```

4. **Build for iOS:**
   ```bash
   eas build --platform ios
   ```

### Local Build

```bash
# Android APK
expo build:android

# iOS IPA (macOS only)
expo build:ios
```

## 📚 App Architecture

### State Management
- **Zustand** for global state
- **Expo SecureStore** for tokens
- **Shared stores** with web app logic

### Navigation
- **React Navigation** v6
- **Stack + Tab** navigation
- **Protected routes** with auth checks

### UI Components
- **React Native Paper** for Material Design
- **Expo Vector Icons** for icons
- **Custom styling** with StyleSheet

## 🐛 Common Issues

### 1. App Won't Load
```bash
# Clear Expo cache
expo start --clear

# Restart bundler
expo start --dev-client
```

### 2. API Connection Failed
- Verify Django backend URL
- Check network connectivity
- Test with curl/Postman

### 3. Email Verification Not Working
- Check Django email backend configuration
- Verify email appears in Django console
- Test with web app first

### 4. Build Errors
```bash
# Clear node modules
rm -rf node_modules
npm install

# Clear Expo cache
expo start --clear
```

## 🔄 Syncing with Web App

The mobile app shares the same backend as the web application:

- **Same user accounts** work on both platforms
- **Todos sync** in real-time
- **Authentication state** is independent
- **Same API endpoints** ensure consistency

## 🎯 Testing Checklist

Before deploying, test:

- [ ] User registration and email verification
- [ ] Login with verified account
- [ ] Create, edit, delete todos
- [ ] Search and filter functionality
- [ ] Profile information display
- [ ] Logout and token cleanup
- [ ] App restart persistence
- [ ] Network error handling
- [ ] Cross-platform data sync

## 🤝 Getting Help

If you encounter issues:

1. **Check logs** in Expo dev tools
2. **Test backend** with curl/Postman
3. **Verify network** connectivity
4. **Review configuration** files
5. **Create issue** with error details

## 🎉 Success!

When everything is working:
- ✅ Mobile app connects to Django backend
- ✅ Authentication flow works end-to-end
- ✅ Todos sync between web and mobile
- ✅ App persists state across restarts

**Happy mobile development!** 📱🚀
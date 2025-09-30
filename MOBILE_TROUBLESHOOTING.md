# 🔧 Mobile App Login Troubleshooting

## 🚨 "Login Failed" Error - Quick Fix Guide

If you're getting a "Login failed" error, here's how to fix it:

### Step 1: Check Django Backend

Make sure Django is running with the correct settings:

```bash
cd todo_backend
python manage.py runserver 0.0.0.0:8000
```

**Important:** Use `0.0.0.0:8000` (not `127.0.0.1:8000`)!

### Step 2: Test Backend Connection

Test if the backend is working:

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

You should see a response (even if it's an error - that means it's working).

### Step 3: Use Debug Tool

In the mobile app:
1. Go to Login screen
2. Tap "🔧 Debug Connection" button
3. Tap "Test All Connections"
4. See which URL works

### Step 4: Check Your Setup

**Are you using:**

#### 📱 **Physical Device** (iPhone/Android phone)?
- Update `mobile/src/utils/config.js`
- Find your computer's IP address:
  ```bash
  # macOS/Linux
  ifconfig | grep "inet " | grep -v 127.0.0.1
  
  # Windows  
  ipconfig | findstr "IPv4"
  ```
- Replace the IP in config:
  ```javascript
  PHYSICAL_DEVICE: "http://YOUR_IP_ADDRESS:8000"
  ```

#### 🖥️ **Android Emulator**?
- Should work with: `http://10.0.2.2:8000`
- This is already configured

#### 🍎 **iOS Simulator**?
- Should work with: `http://127.0.0.1:8000`
- This is already configured

### Step 5: Common Issues & Fixes

#### "Network Error" or "Connection Refused"
```bash
# Make sure Django is running on all interfaces
python manage.py runserver 0.0.0.0:8000

# Check if port 8000 is blocked by firewall
# On macOS, temporarily disable firewall to test
```

#### "CORS Error" 
Check Django `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Web frontend
    "http://127.0.0.1:5173",
]

# For development, you can use:
CORS_ALLOW_ALL_ORIGINS = True
```

#### Physical Device Can't Connect
1. **Same WiFi**: Make sure phone and computer are on same WiFi
2. **Find IP**: Use `npm run setup` to auto-detect IP
3. **Test IP**: Try `http://YOUR_IP:8000` in phone browser
4. **Firewall**: Temporarily disable computer firewall

### Step 6: Quick Auto-Fix

Run the auto-setup script:
```bash
cd mobile
npm run setup
```

This will:
- Detect your IP address automatically
- Update configuration
- Show you what to do next

### Step 7: Manual Configuration

If auto-setup doesn't work, manually edit `mobile/src/utils/config.js`:

```javascript
export const getBaseURL = () => {
  // Manually set your working URL here
  return "http://YOUR_WORKING_IP:8000";
};
```

Replace `YOUR_WORKING_IP` with what worked in the debug tool.

### Step 8: Verify User Account

If connection works but login still fails:

1. **Check if user exists**:
   ```bash
   cd todo_backend
   python manage.py shell
   >>> from django.contrib.auth.models import User
   >>> User.objects.all()
   ```

2. **Create test user**:
   ```bash
   python manage.py createsuperuser
   ```

3. **Check email verification**:
   ```bash
   python check_users.py
   ```

### Step 9: Create Verified User

For testing, create a user with verified email:

```bash
cd todo_backend
python manage.py shell
```

```python
from django.contrib.auth.models import User
from authentication.models import UserProfile
from django.utils import timezone

# Create user
user = User.objects.create_user(
    username='testuser',
    email='test@example.com', 
    password='testpass123',
    is_active=True
)

# Create verified profile
profile = UserProfile.objects.create(
    user=user,
    email_verified=True,
    email_verified_at=timezone.now()
)

print("Created verified user: testuser / testpass123")
```

Now try logging in with: `testuser` / `testpass123`

### Step 10: Still Not Working?

1. **Check Expo Metro logs** for error details
2. **Look at Django console** for incoming requests
3. **Try web app** first to verify backend works
4. **Restart Expo**: `expo start --clear`

## 📱 Quick Test

To verify everything is working:

1. **Web App Test**:
   - Go to http://localhost:5173
   - Try logging in
   - If web works, backend is fine

2. **Mobile App Test**:
   - Use debug tool in mobile app
   - Find working URL
   - Update config if needed
   - Try login again

## 🎯 Most Common Fix

**90% of login issues are solved by:**

1. Running Django with: `python manage.py runserver 0.0.0.0:8000`
2. Using correct IP address for your device type
3. Having a verified user account

Try these first! 🚀
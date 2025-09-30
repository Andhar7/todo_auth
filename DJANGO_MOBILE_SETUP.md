# 🔧 Django Backend Setup for Mobile Development

## ✅ **Correct Command for Mobile Apps**

```bash
python manage.py runserver 0.0.0.0:8000
```

## 🔍 **Why This Matters**

### **Default Django (`127.0.0.1:8000`)**
- ❌ Only accepts connections from **same computer**
- ❌ Mobile devices **cannot connect**
- ❌ External devices get **connection refused**

### **Mobile-Ready Django (`0.0.0.0:8000`)**
- ✅ Accepts connections from **any IP address**
- ✅ Mobile devices **can connect**
- ✅ Works with **physical devices and emulators**

## 📱 **Connection Matrix**

| Device Type | Django Host | Mobile App URL | Status |
|-------------|-------------|----------------|---------|
| **Physical Device** | `0.0.0.0:8000` | `http://172.20.10.2:8000` | ✅ Works |
| **Physical Device** | `127.0.0.1:8000` | `http://172.20.10.2:8000` | ❌ Fails |
| **Android Emulator** | `0.0.0.0:8000` | `http://10.0.2.2:8000` | ✅ Works |
| **iOS Simulator** | `127.0.0.1:8000` | `http://127.0.0.1:8000` | ✅ Works |

## 🚀 **Quick Setup Steps**

1. **Stop current Django server** (if running):
   ```bash
   # Press Ctrl+C in the terminal where Django is running
   ```

2. **Navigate to backend directory**:
   ```bash
   cd todo_backend
   source venv/bin/activate  # Activate virtual environment
   ```

3. **Start Django for mobile development**:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

4. **You should see**:
   ```
   System check identified no issues (0 silenced).
   Starting development server at http://0.0.0.0:8000/
   Quit the server with CONTROL-C.
   ```

## 🔒 **Security Note**

`0.0.0.0:8000` makes Django accessible from other devices on your network:

- ✅ **Safe for development** on trusted networks (home/office WiFi)
- ⚠️ **Don't use in production** without proper security
- 🔧 **ALLOWED_HOSTS** controls which domains can connect

## 🔧 **Current ALLOWED_HOSTS Configuration**

Your `settings.py` now includes:
```python
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '172.20.10.2']
```

This allows connections from:
- `localhost` - Web app development
- `127.0.0.1` - Local development
- `0.0.0.0` - Server binding
- `172.20.10.2` - Your mobile device IP

## 🌐 **Network Requirements**

For mobile development:
- ✅ Computer and phone on **same WiFi network**
- ✅ Django running on `0.0.0.0:8000`
- ✅ Mobile app configured with correct IP
- ✅ Firewall allows port 8000 (if needed)

## 🧪 **Test Connection**

Test if your setup works:

```bash
# From another device/terminal
curl http://172.20.10.2:8000/api/auth/login/
```

Should return Django response (not connection error).

## 📱 **Mobile App URLs**

Your mobile app will use:
- **Physical Device**: `http://172.20.10.2:8000`
- **Android Emulator**: `http://10.0.2.2:8000`
- **iOS Simulator**: `http://127.0.0.1:8000`

## 🔄 **Switch Between Development Modes**

### **Web App Only**
```bash
python manage.py runserver  # Default: 127.0.0.1:8000
```

### **Web + Mobile Apps**
```bash
python manage.py runserver 0.0.0.0:8000  # Accessible from network
```

## ✨ **Quick Checklist**

- [ ] Django running on `0.0.0.0:8000`
- [ ] Mobile device on same WiFi
- [ ] `ALLOWED_HOSTS` includes device IP
- [ ] Mobile app config uses correct IP
- [ ] Test user created and verified

**Your setup is now perfect for mobile development!** 🚀📱
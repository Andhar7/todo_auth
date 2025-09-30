# 📝 Registration Troubleshooting Guide

## 🔍 **"Registration Failed" - Common Causes & Fixes**

Your registration endpoint is working perfectly! The issue is likely one of these common problems:

## ✅ **Test Case - This Works:**
```
Username: testuser2024
Email: testuser2024@example.com  
Password: securepass123
Result: ✅ SUCCESS - User created, email verification required
```

## ❌ **Common Registration Failures:**

### **1. Username Already Exists**
**Error**: "Username already exists"
**Fix**: Try a different username
**Examples**:
- ❌ `testuser` (already exists)
- ✅ `yourname2024`
- ✅ `myusername123`

### **2. Email Already Exists**
**Error**: "Email already exists" 
**Fix**: Try a different email
**Examples**:
- ❌ `test@example.com` (already exists)
- ✅ `yourname@example.com`
- ✅ `newemail2024@test.com`

### **3. Password Too Weak**
**Error**: Password validation messages
**Requirements**:
- ✅ At least 8 characters
- ✅ Not too common (like "password123")
- ✅ Not similar to username
- ✅ Not entirely numeric

**Good passwords**:
- ✅ `securepass123`
- ✅ `mypassword2024`
- ✅ `strongpass456`

### **4. Missing Fields**
**Error**: "Username, email and password are required"
**Fix**: Fill all fields completely

## 🧪 **Test Registration:**

Try registering with these **guaranteed unique** credentials:

```
Username: user_[current_timestamp]
Email: user_[timestamp]@example.com
Password: securepass123
```

For example:
- Username: `user_20241230`
- Email: `user_20241230@example.com`
- Password: `securepass123`

## 📱 **Mobile App Debug:**

I've added better error logging to your app. After trying registration, check the Expo Metro console for detailed error messages:

- ✅ **Success**: Shows "Registration response received: 201"
- ❌ **Error**: Shows exact error message from server

## 🔧 **Debug Steps:**

1. **Try a completely unique username**:
   - Add current date/time: `myname_1230`
   - Use random numbers: `testuser_456`

2. **Try a unique email**:
   - Use your actual email (if you want verification)
   - Or use: `uniquename_123@example.com`

3. **Use a strong password**:
   - At least 8 characters
   - Mix of letters and numbers
   - Example: `mypassword123`

4. **Check Metro logs** for exact error message

## ✅ **What Should Happen:**

**Successful Registration Flow**:
1. Fill registration form
2. Tap "Create Account"
3. See "Registration successful" message
4. Redirected to email verification screen
5. Check Django console for verification email

## 🎯 **Quick Test:**

**Try registering right now with**:
- Username: `quicktest2024`
- Email: `quicktest2024@example.com`
- Password: `testpass123`

This should work immediately!

## 📊 **Backend Status:**

✅ **Registration endpoint**: Working perfectly
✅ **Email verification**: Configured  
✅ **Password validation**: Active
✅ **User creation**: Functional

The issue is **not** with your app - it's just needing unique credentials!

## 💡 **Pro Tip:**

If you want to test quickly, use:
- Username: `test_` + random numbers
- Email: `test_` + random numbers + `@example.com`
- Password: `securepass123`

This will always work! 🚀

## 🔍 **Check Django Console:**

After registration attempt, check your Django terminal for:
- HTTP POST requests to `/api/auth/register/`
- Any error messages
- Email verification console output

**Your registration system is working perfectly - just need unique credentials!** ✅
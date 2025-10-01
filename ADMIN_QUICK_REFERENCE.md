# Django Admin Quick Reference

## 🔗 Quick Access URLs

| Feature | URL | Description |
|---------|-----|-------------|
| Main Admin | `/admin/` | Main administration interface |
| Dashboard | `/admin/dashboard/` | Custom statistics dashboard |
| User Management | `/admin/auth/user/` | Manage user accounts |
| Products | `/admin/products/product/` | Manage products |
| User Profiles | `/admin/authentication/userprofile/` | Email verification status |
| Verification Tokens | `/admin/authentication/emailverificationtoken/` | Email tokens |

## 🎯 Key Admin Features

### User Management
- **Search:** Username, email, first name, last name
- **Filters:** Active status, staff status, email verified
- **Actions:** Verify email, unverify email, delete users
- **Inline:** User profile editing
- **Links:** View user's products

### Product Management  
- **Search:** Product name, owner username/email
- **Filters:** Creation date, price, owner
- **Actions:** Set as free, duplicate products
- **Features:** Image preview, price editing in list
- **Links:** Owner profile links

### Email Verification
- **Search:** User details, token
- **Filters:** Used status, expiry, user
- **Actions:** Mark used/unused, delete expired
- **Status:** Color-coded valid/expired/used

## 📊 Dashboard Metrics

| Metric | Description |
|--------|-------------|
| Total Users | All registered users |
| Verified Users | Users with verified emails |
| Unverified Users | Users pending email verification |
| Total Products | All products in system |
| Active Tokens | Valid, unused verification tokens |
| Expired Tokens | Past expiry date tokens |
| Superusers | Admin access users |
| Staff Users | Staff access users |

## ⚡ Quick Actions

### User Actions
```bash
# Create user profiles for all users
python manage.py create_user_profiles

# Create sample data
python manage.py create_sample_data --users 5 --products 10
```

### Bulk Operations (Select items and choose action)
- **Users:** Verify/unverify email, activate/deactivate
- **Products:** Set as free, duplicate
- **Tokens:** Mark used, delete expired

## 🎨 Status Colors

| Color | Meaning |
|-------|---------|
| 🟢 **Green** | Verified, Valid, Active |
| 🔴 **Red** | Unverified, Expired, Error |
| 🟠 **Orange** | Warning, Missing |
| ⚪ **Gray** | Used, Inactive |
| 🔵 **Blue** | Available, Unused |

## 🔍 Search Tips

### User Search
- Search by username: `john`
- Search by email: `john@example.com`
- Search by name: `John Smith`

### Product Search
- Search by name: `laptop`
- Search by owner: `john` (finds products owned by john)

### Advanced Filtering
- Use multiple filters simultaneously
- Date range filtering available
- Combine search with filters for precision

## 🚀 Performance Tips

1. **Large Datasets:** Use pagination controls
2. **Specific Searches:** Use exact matches when possible  
3. **Bulk Operations:** Select multiple items for batch actions
4. **Navigation:** Use breadcrumbs and back buttons
5. **Shortcuts:** Bookmark frequently used admin pages

## 🔧 Management Commands

| Command | Purpose |
|---------|---------|
| `create_user_profiles` | Ensure all users have profiles |
| `create_sample_data` | Generate test data |
| `createsuperuser` | Create admin user |
| `collectstatic` | Gather static files |

## 📱 Mobile Support

The admin interface is responsive and works on mobile devices:
- Touch-friendly interface
- Responsive tables
- Mobile-optimized forms
- Swipe-friendly navigation

---

**💡 Pro Tips:**
- Use the dashboard for quick overview
- Bookmark frequently used admin pages
- Use bulk actions for efficiency
- Keep browser tabs open for cross-reference
- Use the search function for large datasets
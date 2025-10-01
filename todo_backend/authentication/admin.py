from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html
from django.urls import reverse, path
from django.utils import timezone
from django.shortcuts import render
from django.db.models import Count
from .models import EmailVerificationToken, UserProfile


# Unregister the default User admin to customize it
admin.site.unregister(User)


class UserProfileInline(admin.StackedInline):
    """Inline admin for UserProfile"""
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    fields = ['email_verified', 'email_verified_at']
    readonly_fields = ['email_verified_at']


@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    """
    Enhanced User admin with profile integration
    """
    inlines = (UserProfileInline,)
    
    # Add custom fields to list display
    list_display = BaseUserAdmin.list_display + ('email_verified_status', 'last_login_formatted', 'products_count')
    list_filter = BaseUserAdmin.list_filter + ('profile__email_verified',)
    
    # Custom methods
    def email_verified_status(self, obj):
        """Display email verification status with color coding"""
        try:
            if obj.profile.email_verified:
                return format_html(
                    '<span style="color: green; font-weight: bold;">✓ Verified</span>'
                )
            else:
                return format_html(
                    '<span style="color: red; font-weight: bold;">✗ Not Verified</span>'
                )
        except UserProfile.DoesNotExist:
            return format_html(
                '<span style="color: orange; font-weight: bold;">? No Profile</span>'
            )
    email_verified_status.short_description = 'Email Status'
    email_verified_status.admin_order_field = 'profile__email_verified'
    
    def last_login_formatted(self, obj):
        """Format last login date nicely"""
        if obj.last_login:
            return obj.last_login.strftime('%Y-%m-%d %H:%M')
        return 'Never'
    last_login_formatted.short_description = 'Last Login'
    last_login_formatted.admin_order_field = 'last_login'
    
    def products_count(self, obj):
        """Show number of products owned by user"""
        count = obj.products.count()
        if count > 0:
            url = reverse('admin:products_product_changelist') + f'?owner__id__exact={obj.pk}'
            return format_html('<a href="{}">{} products</a>', url, count)
        return '0 products'
    products_count.short_description = 'Products'
    
    # Custom actions
    actions = list(BaseUserAdmin.actions) + ['verify_email', 'unverify_email']
    
    def verify_email(self, request, queryset):
        """Custom action to verify user emails"""
        count = 0
        for user in queryset:
            profile, created = UserProfile.objects.get_or_create(user=user)
            if not profile.email_verified:
                profile.email_verified = True
                profile.email_verified_at = timezone.now()
                profile.save()
                count += 1
        
        self.message_user(
            request,
            f'{count} user(s) email verification status updated to verified.'
        )
    verify_email.short_description = "Mark selected users as email verified"
    
    def unverify_email(self, request, queryset):
        """Custom action to unverify user emails"""
        count = 0
        for user in queryset:
            try:
                profile = user.profile
                if profile.email_verified:
                    profile.email_verified = False
                    profile.email_verified_at = None
                    profile.save()
                    count += 1
            except UserProfile.DoesNotExist:
                pass
        
        self.message_user(
            request,
            f'{count} user(s) email verification status updated to unverified.'
        )
    unverify_email.short_description = "Mark selected users as email unverified"
    
    # Override get_queryset for performance
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('profile').prefetch_related('products')


@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    """
    Admin configuration for EmailVerificationToken model
    """
    list_display = [
        'user_link',
        'token_short',
        'created_at',
        'expires_at',
        'expiration_status',
        'used_status',
    ]
    
    list_filter = [
        'used',
        'created_at',
        'expires_at',
        ('user', admin.filters.RelatedFieldListFilter),
    ]
    
    search_fields = ['user__username', 'user__email', 'token']
    
    ordering = ['-created_at']
    
    list_per_page = 30
    
    fieldsets = (
        ('Token Information', {
            'fields': ('user', 'token', 'used')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'expires_at'),
        }),
    )
    
    readonly_fields = ['created_at', 'expires_at']
    
    # Custom methods
    def user_link(self, obj):
        """Create a clickable link to the user's admin page"""
        url = reverse('admin:auth_user_change', args=[obj.user.pk])
        return format_html('<a href="{}">{}</a>', url, obj.user.username)
    user_link.short_description = 'User'
    user_link.admin_order_field = 'user__username'
    
    def token_short(self, obj):
        """Display shortened token for better readability"""
        return f"{str(obj.token)[:8]}..."
    token_short.short_description = 'Token (Short)'
    
    def expiration_status(self, obj):
        """Show if token is expired with color coding"""
        if obj.is_expired():
            return format_html(
                '<span style="color: red; font-weight: bold;">Expired</span>'
            )
        else:
            return format_html(
                '<span style="color: green; font-weight: bold;">Valid</span>'
            )
    expiration_status.short_description = 'Status'
    
    def used_status(self, obj):
        """Show if token is used with color coding"""
        if obj.used:
            return format_html(
                '<span style="color: gray; font-weight: bold;">Used</span>'
            )
        else:
            return format_html(
                '<span style="color: blue; font-weight: bold;">Unused</span>'
            )
    used_status.short_description = 'Usage'
    
    # Custom actions
    actions = ['mark_as_used', 'mark_as_unused', 'delete_expired_tokens']
    
    def mark_as_used(self, request, queryset):
        """Mark selected tokens as used"""
        updated = queryset.update(used=True)
        self.message_user(
            request,
            f'{updated} token(s) marked as used.'
        )
    mark_as_used.short_description = "Mark selected tokens as used"
    
    def mark_as_unused(self, request, queryset):
        """Mark selected tokens as unused"""
        updated = queryset.update(used=False)
        self.message_user(
            request,
            f'{updated} token(s) marked as unused.'
        )
    mark_as_unused.short_description = "Mark selected tokens as unused"
    
    def delete_expired_tokens(self, request, queryset):
        """Delete expired tokens"""
        expired_tokens = queryset.filter(expires_at__lt=timezone.now())
        count = expired_tokens.count()
        expired_tokens.delete()
        self.message_user(
            request,
            f'{count} expired token(s) deleted.'
        )
    delete_expired_tokens.short_description = "Delete expired tokens"
    
    # Override get_queryset for performance
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('user')


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """
    Admin configuration for UserProfile model
    """
    list_display = [
        'user_link',
        'email_verified_status',
        'email_verified_at',
        'user_date_joined',
        'user_last_login',
    ]
    
    list_filter = [
        'email_verified',
        'email_verified_at',
        ('user', admin.filters.RelatedFieldListFilter),
    ]
    
    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name']
    
    ordering = ['-user__date_joined']
    
    list_per_page = 30
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Email Verification', {
            'fields': ('email_verified', 'email_verified_at')
        }),
    )
    
    readonly_fields = ['email_verified_at']
    
    # Custom methods
    def user_link(self, obj):
        """Create a clickable link to the user's admin page"""
        url = reverse('admin:auth_user_change', args=[obj.user.pk])
        return format_html('<a href="{}">{}</a>', url, obj.user.username)
    user_link.short_description = 'User'
    user_link.admin_order_field = 'user__username'
    
    def email_verified_status(self, obj):
        """Display email verification status with color coding"""
        if obj.email_verified:
            return format_html(
                '<span style="color: green; font-weight: bold;">✓ Verified</span>'
            )
        else:
            return format_html(
                '<span style="color: red; font-weight: bold;">✗ Not Verified</span>'
            )
    email_verified_status.short_description = 'Email Status'
    email_verified_status.admin_order_field = 'email_verified'
    
    def user_date_joined(self, obj):
        """Show when user joined"""
        return obj.user.date_joined.strftime('%Y-%m-%d %H:%M') if obj.user.date_joined else '-'
    user_date_joined.short_description = 'Date Joined'
    user_date_joined.admin_order_field = 'user__date_joined'
    
    def user_last_login(self, obj):
        """Show user's last login"""
        return obj.user.last_login.strftime('%Y-%m-%d %H:%M') if obj.user.last_login else 'Never'
    user_last_login.short_description = 'Last Login'
    user_last_login.admin_order_field = 'user__last_login'
    
    # Custom actions
    actions = ['verify_emails', 'unverify_emails']
    
    def verify_emails(self, request, queryset):
        """Verify emails for selected profiles"""
        count = 0
        for profile in queryset.filter(email_verified=False):
            profile.email_verified = True
            profile.email_verified_at = timezone.now()
            profile.save()
            count += 1
        
        self.message_user(
            request,
            f'{count} profile(s) email verification updated to verified.'
        )
    verify_emails.short_description = "Mark selected profiles as email verified"
    
    def unverify_emails(self, request, queryset):
        """Unverify emails for selected profiles"""
        count = 0
        for profile in queryset.filter(email_verified=True):
            profile.email_verified = False
            profile.email_verified_at = None
            profile.save()
            count += 1
        
        self.message_user(
            request,
            f'{count} profile(s) email verification updated to unverified.'
        )
    unverify_emails.short_description = "Mark selected profiles as email unverified"
    
    # Override get_queryset for performance
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('user')


# Customize admin site header and title
admin.site.site_header = 'Todo App Administration'
admin.site.site_title = 'Todo Admin'
admin.site.index_title = 'Welcome to Todo App Admin Portal'

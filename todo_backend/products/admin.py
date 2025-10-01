from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Product

# Import the custom admin site from authentication
try:
    from authentication.admin import admin_site
except ImportError:
    admin_site = admin.site


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Admin configuration for Product model with comprehensive functionality
    """
    # List display configuration
    list_display = [
        'name', 
        'price', 
        'owner_link', 
        'image_preview', 
        'created_at', 
        'updated_at'
    ]
    
    # List filtering options
    list_filter = [
        'created_at',
        'updated_at',
        'owner',
        ('price', admin.filters.AllValuesFieldListFilter),
    ]
    
    # Search functionality
    search_fields = ['name', 'owner__username', 'owner__email']
    
    # Fields that can be edited in list view
    list_editable = ['price']
    
    # Default ordering
    ordering = ['-created_at']
    
    # Pagination
    list_per_page = 25
    
    # Fields organization in detail view
    fieldsets = (
        ('Product Information', {
            'fields': ('name', 'price', 'image')
        }),
        ('Ownership', {
            'fields': ('owner',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    
    # Read-only fields
    readonly_fields = ['created_at', 'updated_at']
    
    # Raw ID fields for better performance with large datasets
    raw_id_fields = ['owner']
    
    # Custom methods for list display
    def owner_link(self, obj):
        """Create a clickable link to the user's admin page"""
        if obj.owner:
            url = reverse('admin:auth_user_change', args=[obj.owner.pk])
            return format_html('<a href="{}">{}</a>', url, obj.owner.username)
        return '-'
    owner_link.short_description = 'Owner'
    owner_link.admin_order_field = 'owner__username'
    
    def image_preview(self, obj):
        """Display a small preview of the product image"""
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />',
                obj.image
            )
        return 'No Image'
    image_preview.short_description = 'Image Preview'
    
    # Custom actions
    actions = ['make_products_free', 'duplicate_products']
    
    def make_products_free(self, request, queryset):
        """Custom action to set price to 0 for selected products"""
        updated = queryset.update(price=0)
        self.message_user(
            request,
            f'{updated} product(s) were successfully marked as free.'
        )
    make_products_free.short_description = "Set selected products as free"
    
    def duplicate_products(self, request, queryset):
        """Custom action to duplicate selected products"""
        count = 0
        for product in queryset:
            product.pk = None  # This will create a new object when saved
            product.name = f"{product.name} (Copy)"
            product.save()
            count += 1
        self.message_user(
            request,
            f'{count} product(s) were successfully duplicated.'
        )
    duplicate_products.short_description = "Duplicate selected products"
    
    # Override get_queryset for performance optimization
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('owner')
    
    # Custom form validation
    def save_model(self, request, obj, form, change):
        """Custom save logic"""
        if not change:  # If creating new object
            # Set current user as owner if not specified
            if not obj.owner:
                obj.owner = request.user
        super().save_model(request, obj, form, change)


# Also register with custom admin site if it exists
if admin_site != admin.site:
    admin_site.register(Product, ProductAdmin)

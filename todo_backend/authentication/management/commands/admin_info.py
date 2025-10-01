from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from products.models import Product
from authentication.models import UserProfile, EmailVerificationToken


class Command(BaseCommand):
    help = 'Display admin information and statistics'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('=== ADMIN INFORMATION ==='))
        
        # Display superusers
        superusers = User.objects.filter(is_superuser=True)
        self.stdout.write('\n🔑 SUPERUSER ACCOUNTS:')
        for user in superusers:
            self.stdout.write(f'  • Username: {user.username}')
            self.stdout.write(f'    Email: {user.email}')
            self.stdout.write(f'    Active: {user.is_active}')
            self.stdout.write('')
        
        # Display statistics
        stats = {
            'total_users': User.objects.count(),
            'verified_users': UserProfile.objects.filter(email_verified=True).count(),
            'total_products': Product.objects.count(),
            'active_tokens': EmailVerificationToken.objects.filter(used=False).count(),
        }
        
        self.stdout.write('📊 SYSTEM STATISTICS:')
        for key, value in stats.items():
            self.stdout.write(f'  • {key.replace("_", " ").title()}: {value}')
        
        self.stdout.write('\n🌐 ADMIN ACCESS:')
        self.stdout.write('  • URL: http://127.0.0.1:8000/admin/')
        self.stdout.write('  • Dashboard: http://127.0.0.1:8000/admin/dashboard/')
        
        self.stdout.write(self.style.SUCCESS('\n✅ Admin system is ready!'))
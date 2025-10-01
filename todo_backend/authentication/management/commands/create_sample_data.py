from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from authentication.models import UserProfile, EmailVerificationToken
from products.models import Product
import random
from decimal import Decimal


class Command(BaseCommand):
    help = 'Create sample data for admin demonstration'

    def add_arguments(self, parser):
        parser.add_argument(
            '--users',
            type=int,
            default=5,
            help='Number of sample users to create'
        )
        parser.add_argument(
            '--products',
            type=int,
            default=10,
            help='Number of sample products to create'
        )

    def handle(self, *args, **options):
        users_count = options['users']
        products_count = options['products']
        
        self.stdout.write('Creating sample users...')
        created_users = []
        
        for i in range(users_count):
            username = f'sampleuser{i+1}'
            email = f'user{i+1}@example.com'
            
            if not User.objects.filter(username=username).exists():
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password='samplepass123',
                    first_name=f'Sample{i+1}',
                    last_name='User'
                )
                
                # Create profile
                profile, created = UserProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        'email_verified': random.choice([True, False]),
                        'email_verified_at': timezone.now() if random.choice([True, False]) else None
                    }
                )
                
                # Create verification token for some users
                if random.choice([True, False]):
                    EmailVerificationToken.objects.create(
                        user=user,
                        used=random.choice([True, False])
                    )
                
                created_users.append(user)
                self.stdout.write(f'Created user: {username}')
        
        self.stdout.write('Creating sample products...')
        
        product_names = [
            'Laptop', 'Smartphone', 'Headphones', 'Mouse', 'Keyboard',
            'Monitor', 'Tablet', 'Camera', 'Speaker', 'Smartwatch',
            'Router', 'Printer', 'Desk', 'Chair', 'Lamp'
        ]
        
        all_users = list(User.objects.all())
        
        for i in range(products_count):
            if created_users:
                owner = random.choice(created_users)
            else:
                owner = random.choice(all_users) if all_users else None
            
            if owner:
                product_name = random.choice(product_names)
                price = Decimal(str(random.uniform(10.0, 999.99))).quantize(Decimal('0.01'))
                
                Product.objects.create(
                    name=f'{product_name} {i+1}',
                    price=price,
                    owner=owner,
                    image=f'https://picsum.photos/seed/{product_name.lower()}{i}/300/200'
                )
                self.stdout.write(f'Created product: {product_name} {i+1} (${price})')
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {users_count} users and {products_count} products'
            )
        )
        
        # Display summary
        total_users = User.objects.count()
        total_products = Product.objects.count()
        verified_users = UserProfile.objects.filter(email_verified=True).count()
        active_tokens = EmailVerificationToken.objects.filter(
            used=False, 
            expires_at__gt=timezone.now()
        ).count()
        
        self.stdout.write('\n📊 Current Statistics:')
        self.stdout.write(f'Total users: {total_users}')
        self.stdout.write(f'Verified users: {verified_users}')
        self.stdout.write(f'Total products: {total_products}')
        self.stdout.write(f'Active tokens: {active_tokens}')
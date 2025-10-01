from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from authentication.models import UserProfile


class Command(BaseCommand):
    help = 'Create UserProfile for users who don\'t have one'

    def handle(self, *args, **options):
        users_without_profile = User.objects.filter(profile__isnull=True)
        created_count = 0
        
        for user in users_without_profile:
            UserProfile.objects.create(user=user)
            created_count += 1
            
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count} user profiles'
            )
        )
        
        total_users = User.objects.count()
        total_profiles = UserProfile.objects.count()
        
        self.stdout.write(
            f'Total users: {total_users}, Total profiles: {total_profiles}'
        )
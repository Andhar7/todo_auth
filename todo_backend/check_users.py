#!/usr/bin/env python3

import os
import sys
import django

# Add the project directory to the Python path
sys.path.append('/Users/madal/Desktop/todo_auth/todo_backend')

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_todo.settings')
django.setup()

from django.contrib.auth.models import User
from authentication.models import UserProfile, EmailVerificationToken

def check_users():
    print("=== User Status Report ===")
    
    users = User.objects.all()
    
    for user in users:
        try:
            profile = UserProfile.objects.get(user=user)
            email_verified = profile.email_verified
            verified_at = profile.email_verified_at
        except UserProfile.DoesNotExist:
            email_verified = "No Profile"
            verified_at = None
        
        # Check for active verification tokens
        active_tokens = EmailVerificationToken.objects.filter(
            user=user, 
            used=False
        )
        
        print(f"\n👤 User: {user.username}")
        print(f"   Email: {user.email}")
        print(f"   Active: {user.is_active}")
        print(f"   Email Verified: {email_verified}")
        if verified_at:
            print(f"   Verified At: {verified_at}")
        
        if active_tokens.exists():
            print(f"   🔗 Active Tokens: {active_tokens.count()}")
            for token in active_tokens:
                status = "Expired" if token.is_expired() else "Valid"
                print(f"      - Token: {token.token} ({status})")
        else:
            print(f"   🔗 Active Tokens: None")

if __name__ == "__main__":
    check_users()
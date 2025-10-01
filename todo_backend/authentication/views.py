from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from django.db import transaction
from .models import EmailVerificationToken, UserProfile
from .utils import send_verification_email


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not username or not email or not password:
            return Response({
                'error': 'Username, email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already exists
        if User.objects.filter(username=username).exists():
            return Response({
                'error': 'Username already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        if User.objects.filter(email=email).exists():
            return Response({
                'error': 'Email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate password
        try:
            validate_password(password)
        except ValidationError as e:
            return Response({
                'error': list(e.messages)
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user and profile in a transaction
        with transaction.atomic():
            # Create user (inactive until email is verified)
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                is_active=False  # User will be activated after email verification
            )
            
            # Create user profile
            UserProfile.objects.create(user=user)
            
            # Send verification email
            email_sent = send_verification_email(user)
            
            if not email_sent:
                # If email failed to send, still create user but notify
                return Response({
                    'message': 'User created successfully, but verification email failed to send',
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'email_verified': False
                    },
                    'email_verification_required': True
                }, status=status.HTTP_201_CREATED)
        
        return Response({
            'message': 'User created successfully. Please check your email for verification link.',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'email_verified': False
            },
            'email_verification_required': True
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': 'Something went wrong'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({
                'error': 'Username and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # First check if user exists and get their profile
        try:
            user_obj = User.objects.get(username=username)
            profile, created = UserProfile.objects.get_or_create(user=user_obj)
        except User.DoesNotExist:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Check if email is verified
        if not profile.email_verified:
            return Response({
                'error': 'Please verify your email address before logging in',
                'email_verification_required': True,
                'user_id': user_obj.id
            }, status=status.HTTP_403_FORBIDDEN)
        
        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'email_verified': profile.email_verified
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
        
    except Exception as e:
        return Response({
            'error': 'Something went wrong'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request, token):
    """Verify user email with token"""
    try:
        # Get the verification token
        try:
            verification_token = EmailVerificationToken.objects.get(
                token=token,
                used=False
            )
        except EmailVerificationToken.DoesNotExist:
            return Response({
                'error': 'Invalid or expired verification token'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if token is expired
        if verification_token.is_expired():
            return Response({
                'error': 'Verification token has expired'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify the email
        with transaction.atomic():
            user = verification_token.user
            profile, created = UserProfile.objects.get_or_create(user=user)
            
            # Mark email as verified
            profile.email_verified = True
            profile.email_verified_at = timezone.now()
            profile.save()
            
            # Activate user account
            user.is_active = True
            user.save()
            
            # Mark token as used
            verification_token.used = True
            verification_token.save()
        
        return Response({
            'message': 'Email verified successfully! You can now log in.',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'email_verified': True
            }
        })
        
    except Exception as e:
        return Response({
            'error': 'Something went wrong during email verification'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def resend_verification_email(request):
    """Resend verification email"""
    try:
        email = request.data.get('email')
        
        if not email:
            return Response({
                'error': 'Email is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            profile, created = UserProfile.objects.get_or_create(user=user)
        except User.DoesNotExist:
            # Don't reveal that user doesn't exist for security
            return Response({
                'message': 'If the email exists in our system, a verification email has been sent.'
            })
        
        # Check if already verified
        if profile.email_verified:
            return Response({
                'error': 'Email is already verified'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Send verification email
        email_sent = send_verification_email(user)
        
        if email_sent:
            return Response({
                'message': 'Verification email sent successfully'
            })
        else:
            return Response({
                'error': 'Failed to send verification email'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    except Exception as e:
        return Response({
            'error': 'Something went wrong'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def user_profile(request):
    """Get current user profile"""
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    return Response({
        'user': {
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'email_verified': profile.email_verified,
            'email_verified_at': profile.email_verified_at
        }
    })


# Admin Dashboard View
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required


@staff_member_required
def admin_dashboard(request):
    """Custom dashboard view with statistics"""
    from products.models import Product
    
    # Gather statistics
    stats = {
        'total_users': User.objects.count(),
        'verified_users': UserProfile.objects.filter(email_verified=True).count(),
        'unverified_users': UserProfile.objects.filter(email_verified=False).count(),
        'superusers': User.objects.filter(is_superuser=True).count(),
        'staff_users': User.objects.filter(is_staff=True).count(),
        'total_products': Product.objects.count(),
        'active_tokens': EmailVerificationToken.objects.filter(
            used=False, 
            expires_at__gt=timezone.now()
        ).count(),
        'expired_tokens': EmailVerificationToken.objects.filter(
            expires_at__lt=timezone.now()
        ).count(),
    }
    
    # Recent activity
    recent_users = User.objects.order_by('-date_joined')[:5]
    recent_products = Product.objects.select_related('owner').order_by('-created_at')[:5]
    recent_tokens = EmailVerificationToken.objects.select_related('user').order_by('-created_at')[:5]
    
    context = {
        'title': 'Dashboard',
        'site_title': 'Todo Admin Dashboard',
        'site_header': 'Todo App Administration',
        'stats': stats,
        'recent_users': recent_users,
        'recent_products': recent_products,
        'recent_tokens': recent_tokens,
    }
    
    return render(request, 'admin/dashboard.html', context)

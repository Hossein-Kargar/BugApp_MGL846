#!/usr/bin/env python
"""Script to create a new superuser with all permissions"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bugapp.settings')
django.setup()

from django.contrib.auth.models import User
from users.models import UserProfile

# Create or update superuser
username = 'superadmin'
email = 'superadmin@bugapp.com'
password = 'admin123'

try:
    # Try to get existing user
    user = User.objects.get(username=username)
    print(f"User '{username}' already exists. Updating...")
except User.DoesNotExist:
    # Create new user
    user = User.objects.create_superuser(
        username=username,
        email=email,
        password=password
    )
    print(f"✓ Superuser '{username}' created successfully!")

# Ensure all permissions are set
user.is_superuser = True
user.is_staff = True
user.is_active = True
user.set_password(password)
user.save()

# Create or get UserProfile
profile, created = UserProfile.objects.get_or_create(
    user=user,
    defaults={
        'role': 'admin',
        'is_active': True
    }
)

if not created:
    profile.role = 'admin'
    profile.is_active = True
    profile.save()

print(f"\n{'='*50}")
print(f"✓ Superuser ready!")
print(f"{'='*50}")
print(f"Username: {username}")
print(f"Email: {email}")
print(f"Password: {password}")
print(f"{'='*50}")
print(f"\nLogin at: http://127.0.0.1:8000/admin/")
print(f"{'='*50}\n")

# Check admin user
print("Checking existing 'admin' user...")
try:
    admin = User.objects.get(username='admin')
    print(f"  Username: admin")
    print(f"  Email: {admin.email}")
    print(f"  is_superuser: {admin.is_superuser}")
    print(f"  is_staff: {admin.is_staff}")
    print(f"  is_active: {admin.is_active}")
    print(f"  has_usable_password: {admin.has_usable_password()}")
    
    # Check if profile exists
    try:
        profile = admin.profile
        print(f"  Profile exists: Yes")
        print(f"  Profile role: {profile.role}")
    except:
        print(f"  Profile exists: No (creating one...)")
        UserProfile.objects.create(user=admin, role='admin', is_active=True)
        print(f"  Profile created!")
        
except User.DoesNotExist:
    print("  'admin' user does not exist!")

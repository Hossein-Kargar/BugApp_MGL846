#!/usr/bin/env python
"""Script to fix admin user permissions"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bugapp.settings')
django.setup()

from django.contrib.auth.models import User

try:
    admin_user = User.objects.get(username='admin')
    print(f"Current status:")
    print(f"  - is_superuser: {admin_user.is_superuser}")
    print(f"  - is_staff: {admin_user.is_staff}")
    print(f"  - is_active: {admin_user.is_active}")
    
    admin_user.is_superuser = True
    admin_user.is_staff = True
    admin_user.is_active = True
    admin_user.save()
    
    print(f"\n✓ Admin user permissions updated successfully!")
    print(f"  - Username: admin")
    print(f"  - Email: {admin_user.email}")
    print(f"  - is_superuser: {admin_user.is_superuser}")
    print(f"  - is_staff: {admin_user.is_staff}")
    print(f"  - is_active: {admin_user.is_active}")
    
except User.DoesNotExist:
    print("Error: Admin user does not exist!")

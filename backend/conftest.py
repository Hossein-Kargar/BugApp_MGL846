import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient

@pytest.fixture
def api_client():
    """Fixture pour le client API REST."""
    return APIClient()

@pytest.fixture
def user(db):
    """Fixture pour créer un utilisateur test."""
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )

@pytest.fixture
def authenticated_client(api_client, user):
    """Fixture pour un client authentifié."""
    api_client.force_authenticate(user=user)
    return api_client
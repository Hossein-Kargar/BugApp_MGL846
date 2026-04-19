import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from users.models import UserProfile

@pytest.fixture
def api_client():
    """Fixture pour le client API REST."""
    return APIClient()

@pytest.fixture
def user(db):
    """
    Fixture : Crée un utilisateur de test en BD avec son profil.
    """
    user = User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )
    # Créer le profil associé (important pour votre app)
    UserProfile.objects.create(
        user=user,
        role='developer'
    )
    return user

@pytest.fixture
def authenticated_client(api_client, user):
    """
    Fixture : Client API HTTP authentifié.
    """
    api_client.force_authenticate(user=user)
    return api_client
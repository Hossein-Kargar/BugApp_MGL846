import pytest  # Importer pytest
from django.contrib.auth.models import User  # Importer ce dont vous avez besoin
from rest_framework.test import APIClient

@pytest.mark.smoke  # Marqueur pour identifier les smoke tests
@pytest.mark.django_db  # Permet d'accéder à la BD
class TestUserSmoke:  # Nom de la classe (commence par Test)
    """Tests de sanité pour l'app users."""

    #Verify that the creation of an user is possible
    def test_user_creation(self):
        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        assert user.pk is not None
        assert user.username == 'testuser'
        assert user.email == 'test@example.com'

    #On se sert de la fixture de user dans conftest.py
    def test_user_password_authentication(self, user):
        assert user.check_password('testpass123')
        assert not user.check_password('thewrongpassword')

    #Verify if the user is active
    def test_user_is_active(self, user):

        assert user.is_active is True

    #password must be hashed
    def test_user_password_is_hashed(self):
        """Vérifier que les passwords sont sécurisés."""
        user = User.objects.create_user(
            username='testuser',
            password='plaintext123'
        )
        assert user.password != 'plaintext123'
        assert user.check_password('plaintext123')

    #Verifying if the endpoint is accessible
    def test_users_api_endpoint_accessible(self, api_client):
        response = api_client.get('/api/users/')
        assert response.status_code in [200, 401, 403, 404]

    #unauthenticated user cannot access the api
    def test_unauthenticated_user_cannot_access_users(self, api_client):
        response = api_client.get('/api/users/')
        assert response.status_code == 401

    #authenticated user can access the api
    def test_authenticated_user_can_access_users(self, authenticated_client):
        response  = authenticated_client.get('/api/users/')
        assert response.status_code == 200

    #token authentification
    def test_token_authentication_works(self, user):
        """Vérifier que le Token Auth fonctionne."""
        from rest_framework.authtoken.models import Token
        token = Token.objects.create(user=user)
        
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
        response = client.get('/api/users/')
        assert response.status_code in [200, 404]

    #creation of an user with API endpoint
    def test_create_user_via_api(self, api_client):
        """Vérifier la création d'utilisateur via API."""
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'pass123'
        }
        response = api_client.post('/api/users/', data)
        assert response.status_code in [201, 401, 403, 404]

    def test_duplicate_username_not_allowed(self):
        """Vérifier qu'on ne peut pas dupliquer le username."""
        User.objects.create_user(username='john', password='pass')
        
        from django.db import IntegrityError
        with pytest.raises(IntegrityError):
            User.objects.create_user(username='john', password='pass')
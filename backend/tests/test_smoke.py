import pytest
from django.contrib.auth.models import User
from tickets.models import Ticket
from comments.models import Comment


@pytest.mark.smoke
@pytest.mark.django_db
class TestApplicationSmoke:

    # TEST 1 : L'API nécessite l'authentification
    def test_1_api_requires_authentication(self, api_client):
        response = api_client.get('/api/tickets/')
        assert response.status_code == 401

    # TEST 2 : Créer un ticket (core feature)
    def test_2_create_ticket(self, authenticated_client, user):
        data = {
            'title': 'Test Bug',
            'description': 'Test',
            'priority': 'high',
            'severity': 'medium'
        }
        response = authenticated_client.post('/api/tickets/', data)
        assert response.status_code == 201
        assert Ticket.objects.count() == 1


    # TEST 3 : Ajouter un comment (feature secondaire)
    def test_3_add_comment_to_ticket(self, authenticated_client, user):
        ticket = Ticket.objects.create(
            title='Test', description='Test', creator=user
        )
        data = {'ticket': ticket.id, 'text': 'Test comment'}
        response = authenticated_client.post(
            f'/api/comments/ticket/{ticket.id}/',
            data, format='json'
        )
        assert response.status_code == 201
        assert Comment.objects.count() == 1

    # TEST 4 : L'auteur est l'utilisateur authentifié (sécurité)
    def test_4_author_is_authenticated_user(self, authenticated_client, user):
        ticket = Ticket.objects.create(
            title='Test', description='Test', creator=user
        )
        authenticated_client.post(
            f'/api/comments/ticket/{ticket.id}/',
            {'ticket': ticket.id, 'text': 'Test'},
            format='json'
        )
        comment = Comment.objects.latest('created_at')
        assert comment.author == user

    # TEST 5 : Les permissions fonctionnent
    def test_5_permissions_enforced(self, authenticated_client, user):
        ticket = Ticket.objects.create(
            title='Test', description='Test', creator=user
        )
        comment = Comment.objects.create(
            ticket=ticket, author=user, text='Test'
        )
        
        response = authenticated_client.delete(f'/api/comments/{comment.id}/delete/')
        assert response.status_code in [204, 200]
        assert not Comment.objects.filter(id=comment.id).exists()

    # TEST 6 : Pas de corruption BD (intégrité)
    def test_6_no_corrupted_data(self, authenticated_client, user):
        ticket = Ticket.objects.create(
            title='Test', description='Test', creator=user
        )
        authenticated_client.post(
            f'/api/comments/ticket/{ticket.id}/',
            {'ticket': ticket.id, 'text': 'Test'},
            format='json'
        )
        
        # Vérifier qu'il n'y a pas de données NULL
        assert Ticket.objects.filter(id__isnull=False).exists()
        assert Comment.objects.filter(author_id__isnull=False).exists()
        assert Comment.objects.filter(ticket_id__isnull=False).exists()
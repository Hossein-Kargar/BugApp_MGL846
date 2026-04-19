import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from tickets.models import Ticket
from datetime import date


@pytest.mark.smoke
@pytest.mark.django_db
class TestTicketSmoke:

    #uniauthentified user cannot access the endpoint /tickets/
    def test_tickets_api_endpoint_requires_auth(self, api_client):
        response = api_client.get('/api/tickets/')
        assert response.status_code == 401

    def test_authenticated_user_can_list_tickets(self, authenticated_client):
        response = authenticated_client.get('/api/tickets/')
        assert response.status_code == 200
        assert 'results' in response.json() or isinstance(response.json(), list)

    #authentified user can create a ticket
    def test_create_ticket_via_api(self, authenticated_client):
        data = {
            "title": "Test Bug",
            "description" : "This is a test bug",
            "priority" : "high",
            "severity" : "medium",
            "due_date" : "2026-12-31"
        }
        response = authenticated_client.post('/api/tickets/', data)
        assert response.status_code == 201
        assert response.json()['title'] == 'Test Bug'

    def test_ticket_creation_requires_authenticated_user(self, api_client):
        data = {
            "title": "Test Bug",
            "description" : "This is a test bug",
            "priority" : "high",
            "severity" : "medium",
            "due_date" : "2026-12-31"
        }

        response = api_client.post('/api/tickets/', data)
        assert response.status_code == 401

    def test_get_ticket_detail(self, authenticated_client, user):
        ticket = Ticket.objects.create(
            title='Test Ticket',
            description='Test Description',
            creator=user,
            priority='medium',
            severity='low'
        )

        response = authenticated_client.get(f'/api/tickets/{ticket.id}/')
        assert response.status_code == 200
        assert response.json()['title'] == 'Test Ticket'
        assert Ticket.objects.count() == 1

    
    def test_update_ticket_status(self, authenticated_client, user):
        """Vérifier qu'on peut changer le status d'un ticket."""
        # Créer un ticket
        ticket = Ticket.objects.create(
            title='Test Ticket',
            description='Test',
            creator=user,
            status='open'
        )
        
        # Changer le status
        data = {'status': 'in_progress'}
        response = authenticated_client.patch(
            f'/api/tickets/{ticket.id}/status/',
            data
        )
        assert response.status_code == 200
        
        # Vérifier que le ticket a été mis à jour
        ticket.refresh_from_db()
        assert ticket.status == 'in_progress'

    def test_update_ticket_status(self, authenticated_client, user):
        """Vérifier qu'on peut changer le status d'un ticket."""
        ticket = Ticket.objects.create(
            title='Test Ticket',
            description='Test',
            creator=user,
            status='open'
        )
        
        data = {'status': 'in_progress'}
        response = authenticated_client.patch(
            f'/api/tickets/{ticket.id}/status/',
            data
        )
        assert response.status_code == 200
        
        ticket.refresh_from_db()
        assert ticket.status == 'in_progress'

    def test_ticket_default_status_is_open(self, user):
        """Vérifier que le status par défaut est 'open'."""
        ticket = Ticket.objects.create(
            title='Test',
            description='Test',
            creator=user
        )
        assert ticket.status == 'open'
    
    def test_ticket_default_priority_is_medium(self, user):
        """Vérifier que la priorité par défaut est 'medium'."""
        ticket = Ticket.objects.create(
            title='Test',
            description='Test',
            creator=user
        )
        assert ticket.priority == 'medium'

    def test_delete_ticket_by_creator(self, authenticated_client, user):
        """Vérifier que le créateur peut supprimer son ticket."""
        ticket = Ticket.objects.create(
            title='Test Ticket',
            description='Test',
            creator=user
        )
        ticket_id = ticket.id
        
        response = authenticated_client.delete(f'/api/tickets/{ticket_id}/delete/')
        assert response.status_code == 204
        
        assert not Ticket.objects.filter(id=ticket_id).exists()
    

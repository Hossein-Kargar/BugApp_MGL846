import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from tickets.models import Ticket
from comments.models import Comment


@pytest.mark.smoke
@pytest.mark.django_db
class TestCommentSmoke:

    #Test 1 : Endpoint non authentifié = 401
    def test_comments_endpoint_requires_auth(self, api_client, user):

        ticket = Ticket.objects.create(
            title='Test Ticket',
            description='Test',
            creator=user
        )

        response = api_client.get(f'/api/comments/ticket/{ticket.id}/')
        assert response.status_code == 401

    def test_authenticated_user_can_list_comments(self, authenticated_client, user):
        ticket = Ticket.objects.create(
            title='Test Ticket',
            description='Test',
            creator=user
        )

        response = authenticated_client.get(f'/api/comments/ticket/{ticket.id}/')
        assert response.status_code == 200
    
    def test_create_comment_via_api(self, authenticated_client, user):
        ticket = Ticket.objects.create(
            title='Test Ticket',
            description='Test',
            creator=user
        )

        data = {
            'ticket': ticket.id,
            'text': 'This is a test comment'
        }

        response = authenticated_client.post(f'/api/comments/ticket/{ticket.id}/', data,format='json')
        assert response.status_code == 201
    
    def test_comment_creation_requires_auth(self, api_client, user):
        ticket = Ticket.objects.create(
            title='Test Ticket',
            description='Test',
            creator=user
        )

        data = {
            'text': 'This is a test comment'
        }
        response = api_client.post(f'/api/comments/ticket/{ticket.id}/', data)
        assert response.status_code == 401
    
    def test_get_comment_detail(self, authenticated_client, user):
        """Vérifier qu'on peut récupérer un comment spécifique."""
        ticket = Ticket.objects.create(
            title='Test Ticket',
            description='Test',
            creator=user
        )
        comment = Comment.objects.create(
            ticket=ticket,
            author=user,
            text='this is the comment',
        )
        response = authenticated_client.get(f'/api/comments/{comment.id}/')
        assert response.status_code == 200
        assert response.json()['text'] == "this is the comment"

    def test_update_comment(self, authenticated_client, user):
        """Vérifier qu'on peut mettre à jour un comment."""
        ticket = Ticket.objects.create(
            title='Test Ticket',
            description='Test',
            creator=user
        )
        comment = Comment.objects.create(
            ticket=ticket,
            author=user,
            text='Original text'
        )
        
        data = {
            'ticket': ticket.id,
            'text': 'Updated text'
        }
        response = authenticated_client.patch(
            f'/api/comments/{comment.id}/update/',
            data,
            format='json'
        )
        assert response.status_code == 200
        
        comment.refresh_from_db()
        assert comment.text == 'Updated text'
    
    def test_delete_comment_by_author(self, authenticated_client, user):
        """Vérifier que l'auteur peut supprimer son comment."""
        ticket = Ticket.objects.create(
            title='Test Ticket',
            description='Test',
            creator=user
        )
        comment = Comment.objects.create(
            ticket=ticket,
            author=user,
            text='Test comment'
        )
        comment_id = comment.id
        
        response = authenticated_client.delete(f'/api/comments/{comment_id}/delete/')
        assert response.status_code == 204
        
        assert not Comment.objects.filter(id=comment_id).exists()

    def test_list_multiple_comments_for_ticket(self, authenticated_client, user):
        """Vérifier qu'on peut lister plusieurs comments d'un ticket."""
        ticket = Ticket.objects.create(
            title='Test Ticket',
            description='Test',
            creator=user
        )
        
        for i in range(3):
            Comment.objects.create(
                ticket=ticket,
                author=user,
                text=f'Comment {i+1}'
            )
        
        response = authenticated_client.get(f'/api/comments/ticket/{ticket.id}/')
        assert response.status_code == 200
        
        # ✅ Changé : accéder à 'results' (pagination)
        data = response.json()
        # Vérifier si c'est paginé ou une liste directe
        if 'results' in data:
            comments = data['results']
        else:
            comments = data
        
        assert len(comments) == 3
    
    def test_comment_author_is_set_automatically(self, authenticated_client, user):
        """Vérifier que l'auteur du comment est l'utilisateur authentifié."""
        ticket = Ticket.objects.create(
            title='Test Ticket',
            description='Test',
            creator=user
        )
        
        data = {
            'ticket': ticket.id,
            'text': 'Test comment'
        }
        response = authenticated_client.post(
            f'/api/comments/ticket/{ticket.id}/',
            data,
            format='json'
        )
        assert response.status_code == 201
        
        comment = Comment.objects.latest('created_at')
        assert comment.author == user


    def test_create_comment_with_mentions(self, authenticated_client, user):
        """Vérifier qu'on peut créer un comment avec mentions."""
        ticket = Ticket.objects.create(
            title='Test Ticket',
            description='Test',
            creator=user
        )
        
        other_user = User.objects.create_user(
            username='otheruser',
            password='pass123'
        )
        
        data = {
            'ticket': ticket.id,
            'text': 'This mentions @otheruser',
            'mentioned_users': [other_user.id]
        }
        response = authenticated_client.post(
            f'/api/comments/ticket/{ticket.id}/',
            data,
            format='json'
        )
        assert response.status_code == 201
        
        comment = Comment.objects.latest('created_at')
        assert comment.mentions.count() == 1
        assert comment.mentions.first().mentioned_user == other_user


    def test_user_cannot_delete_others_comment(self, authenticated_client, user):
        """Vérifier qu'on ne peut pas supprimer le comment d'un autre."""
        ticket = Ticket.objects.create(
            title='Test Ticket',
            description='Test',
            creator=user
        )
        
        other_user = User.objects.create_user(
            username='otheruser',
            password='pass123'
        )
        
        comment = Comment.objects.create(
            ticket=ticket,
            author=other_user,
            text='Comment by other user'
        )
        
        response = authenticated_client.delete(f'/api/comments/{comment.id}/delete/')
        assert response.status_code in [403, 204]
        assert Comment.objects.filter(id=comment.id).exists()


    def test_comments_ordered_by_created_at(self, authenticated_client, user):
        """Vérifier que les comments sont triés par date de création."""
        ticket = Ticket.objects.create(
            title='Test Ticket',
            description='Test',
            creator=user
        )
        
        comment1 = Comment.objects.create(
            ticket=ticket,
            author=user,
            text='First comment'
        )
        comment2 = Comment.objects.create(
            ticket=ticket,
            author=user,
            text='Second comment'
        )
        
        response = authenticated_client.get(f'/api/comments/ticket/{ticket.id}/')
        assert response.status_code == 200
        
        # ✅ Changé : accéder à 'results' (pagination)
        data = response.json()
        if 'results' in data:
            comments = data['results']
        else:
            comments = data
        
        assert len(comments) == 2
        assert comments[0]['text'] == 'First comment'
        assert comments[1]['text'] == 'Second comment'

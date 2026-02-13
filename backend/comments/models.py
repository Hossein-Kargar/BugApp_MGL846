from django.db import models
from django.contrib.auth.models import User
from tickets.models import Ticket


class Comment(models.Model):
    """Comment model for ticket discussions"""

    ticket = models.ForeignKey(
        Ticket, on_delete=models.CASCADE, related_name="comments"
    )
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Comment by {self.author.username} on ticket {self.ticket.id}"


class CommentMention(models.Model):
    """Model for user mentions in comments"""

    comment = models.ForeignKey(
        Comment, on_delete=models.CASCADE, related_name="mentions"
    )
    mentioned_user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Mention of {self.mentioned_user.username} in comment {self.comment.id}"

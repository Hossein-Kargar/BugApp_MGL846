from django.db import models
from django.contrib.auth.models import User


STATUS_CHOICES = [
    ("open", "Open"),
    ("in_progress", "In Progress"),
    ("fixed", "Fixed"),
    ("closed", "Closed"),
    ("reopened", "Reopened"),
]

PRIORITY_CHOICES = [
    ("low", "Low"),
    ("medium", "Medium"),
    ("high", "High"),
    ("critical", "Critical"),
]

SEVERITY_CHOICES = [
    ("low", "Low"),
    ("medium", "Medium"),
    ("high", "High"),
    ("critical", "Critical"),
]


class Ticket(models.Model):
    """Bug ticket model"""

    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open")
    priority = models.CharField(
        max_length=20, choices=PRIORITY_CHOICES, default="medium"
    )
    severity = models.CharField(
        max_length=20, choices=SEVERITY_CHOICES, default="medium"
    )

    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_tickets"
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_tickets",
    )

    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.id} - {self.title}"


class Mention(models.Model):
    """Model for user mentions in tickets"""

    ticket = models.ForeignKey(
        Ticket, on_delete=models.CASCADE, related_name="mentions", null=True, blank=True
    )
    mentioned_user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Mention of {self.mentioned_user.username} in ticket {self.ticket.id}"

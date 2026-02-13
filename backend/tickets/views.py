from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.contrib.auth.models import User
from django.core.cache import cache
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework import permissions

from .models import Ticket, Mention
from .serializers import (
    TicketSerializer,
    TicketCreateSerializer,
    TicketStatusUpdateSerializer,
)


# Simple notification system (in-memory, for demo)
def notify_user(user_id, message):
    notifications = cache.get(f"user_notifications_{user_id}", [])
    notifications.append(message)
    cache.set(f"user_notifications_{user_id}", notifications, timeout=60 * 60 * 24)


class TicketListCreateView(generics.ListCreateAPIView):
    """List all tickets or create a new one"""

    queryset = Ticket.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["status", "priority", "severity", "assigned_to"]
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "priority", "status"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return TicketCreateSerializer
        return TicketSerializer

    def perform_create(self, serializer):
        assigned_to_id = self.request.data.get("assigned_to") or self.request.data.get(
            "assigned_to_id"
        )
        mentioned_user_ids = self.request.data.get("mentioned_users", [])
        ticket = serializer.save(assigned_to_id=assigned_to_id)
        # Build ticket link (frontend route)
        ticket_link = f"/tickets/{ticket.id}"
        # Notify assigned user
        if assigned_to_id:
            try:
                assigned_user = User.objects.get(id=assigned_to_id)
                if assigned_user != self.request.user:
                    notify_user(
                        assigned_user.id,
                        f"You have been assigned to ticket '<a href='{ticket_link}'>{ticket.title} (#{ticket.id})</a>'",
                    )
            except User.DoesNotExist:
                pass
        # Notify mentioned users (except creator)
        if mentioned_user_ids:
            for uid in mentioned_user_ids:
                try:
                    user = User.objects.get(id=uid)
                    if user != self.request.user:
                        notify_user(
                            user.id,
                            f"You were mentioned in ticket '<a href='{ticket_link}'>{ticket.title} (#{ticket.id})</a>'",
                        )
                except User.DoesNotExist:
                    pass


class TicketDetailView(generics.RetrieveAPIView):
    """Get ticket details"""

    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]


class TicketUpdateView(generics.UpdateAPIView):
    """Update ticket information"""

    queryset = Ticket.objects.all()
    serializer_class = TicketCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        assigned_to_id = self.request.data.get("assigned_to") or self.request.data.get(
            "assigned_to_id"
        )
        mentioned_user_ids = self.request.data.get("mentioned_users", [])
        ticket = (
            serializer.save(assigned_to_id=assigned_to_id)
            if assigned_to_id
            else serializer.save()
        )
        # Build ticket link (frontend route)
        ticket_link = f"/tickets/{ticket.id}"
        # Notify all mentioned users except the modifier
        mentioned_users = set([m.mentioned_user for m in ticket.mentions.all()])
        # Add any new mentioned users from request
        if mentioned_user_ids:
            for uid in mentioned_user_ids:
                try:
                    user = User.objects.get(id=uid)
                    mentioned_users.add(user)
                except User.DoesNotExist:
                    pass
        for user in mentioned_users:
            if user != self.request.user:
                notify_user(
                    user.id,
                    f"Ticket '<a href='{ticket_link}'>{ticket.title} (#{ticket.id})</a>' was updated.",
                )
        # Notify assigned user if changed and not the modifier
        if assigned_to_id:
            try:
                assigned_user = User.objects.get(id=assigned_to_id)
                if assigned_user != self.request.user:
                    notify_user(
                        assigned_user.id,
                        f"You have been assigned to ticket '<a href='{ticket_link}'>{ticket.title} (#{ticket.id})</a>'",
                    )
            except User.DoesNotExist:
                pass


class TicketStatusUpdateView(generics.UpdateAPIView):
    """Update ticket status"""

    queryset = Ticket.objects.all()
    serializer_class = TicketStatusUpdateSerializer
    permission_classes = [IsAuthenticated]


class TicketDeleteView(generics.DestroyAPIView):
    """Delete a ticket"""

    queryset = Ticket.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        # Only creator or admin can delete
        if (
            self.request.user == instance.creator
            or getattr(self.request.user.profile, "role", None) == "admin"
        ):
            instance.delete()
        else:
            raise PermissionDenied("You do not have permission to delete this ticket")


class NotificationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        notifications = cache.get(f"user_notifications_{request.user.id}", [])
        return Response({"notifications": notifications})

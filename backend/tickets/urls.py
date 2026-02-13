from django.urls import path
from . import views

app_name = "tickets"

urlpatterns = [
    path("", views.TicketListCreateView.as_view(), name="ticket-list-create"),
    path("<int:pk>/", views.TicketDetailView.as_view(), name="ticket-detail"),
    path("<int:pk>/update/", views.TicketUpdateView.as_view(), name="ticket-update"),
    path(
        "<int:pk>/status/",
        views.TicketStatusUpdateView.as_view(),
        name="ticket-status-update",
    ),
    path("<int:pk>/delete/", views.TicketDeleteView.as_view(), name="ticket-delete"),
    path("notifications/", views.NotificationListView.as_view(), name="notifications"),
]

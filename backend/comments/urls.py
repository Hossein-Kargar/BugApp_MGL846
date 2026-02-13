from django.urls import path
from . import views

app_name = "comments"

urlpatterns = [
    path(
        "ticket/<int:ticket_id>/",
        views.CommentListCreateView.as_view(),
        name="comment-list-create",
    ),
    path("<int:pk>/", views.CommentDetailView.as_view(), name="comment-detail"),
    path("<int:pk>/update/", views.CommentUpdateView.as_view(), name="comment-update"),
    path("<int:pk>/delete/", views.CommentDeleteView.as_view(), name="comment-delete"),
]

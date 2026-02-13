from django.urls import path
from . import views

app_name = "users"

urlpatterns = [
    # Authentication endpoints
    path("register/", views.RegisterView.as_view(), name="register"),
    path("login/", views.LoginView.as_view(), name="login"),
    path("logout/", views.LogoutView.as_view(), name="logout"),
    # User management endpoints
    path("", views.UserListView.as_view(), name="user-list"),
    path("<int:pk>/", views.UserDetailView.as_view(), name="user-detail"),
    path("<int:pk>/update/", views.UserUpdateView.as_view(), name="user-update"),
    path("<int:pk>/delete/", views.UserDeleteView.as_view(), name="user-delete"),
]

"""
URL configuration for bugapp project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include(("users.urls", "users"), namespace="auth")),
    path("api/users/", include(("users.urls", "users"), namespace="user_mgmt")),
    path("api/tickets/", include(("tickets.urls", "tickets"), namespace="tickets")),
    path("api/comments/", include(("comments.urls", "comments"), namespace="comments")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

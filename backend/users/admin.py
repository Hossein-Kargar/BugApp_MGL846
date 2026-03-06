from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin interface for UserProfile model"""

    list_display = (
        "user",
        "role",
        "department",
        "phone",
        "is_active",
        "created_at",
    )
    list_filter = ("role", "is_active", "department", "created_at")
    search_fields = ("user__username", "user__email", "user__first_name", "user__last_name", "phone")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-created_at",)

    fieldsets = (
        ("User Information", {
            "fields": ("user", "role", "is_active")
        }),
        ("Contact Details", {
            "fields": ("phone", "department")
        }),
        ("Profile", {
            "fields": ("avatar", "bio")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )

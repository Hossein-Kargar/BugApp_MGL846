from django.contrib import admin
from .models import Ticket


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    """Admin interface for Ticket model"""

    list_display = (
        "id",
        "title",
        "status",
        "priority",
        "severity",
        "creator",
        "assigned_to",
        "created_at",
    )
    list_filter = ("status", "priority", "severity", "created_at", "updated_at")
    search_fields = ("title", "description", "creator__username", "assigned_to__username")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-created_at",)
    date_hierarchy = "created_at"

    fieldsets = (
        ("Ticket Information", {
            "fields": ("title", "description")
        }),
        ("Status & Priority", {
            "fields": ("status", "priority", "severity")
        }),
        ("Assignment", {
            "fields": ("creator", "assigned_to")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )

    def get_queryset(self, request):
        """Optimize queries by selecting related users"""
        queryset = super().get_queryset(request)
        return queryset.select_related("creator", "assigned_to")

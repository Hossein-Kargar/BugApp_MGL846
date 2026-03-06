from django.contrib import admin
from .models import Comment, CommentMention


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """Admin interface for Comment model"""

    list_display = (
        "id",
        "ticket",
        "author",
        "text_preview",
        "created_at",
        "updated_at",
    )
    list_filter = ("created_at", "updated_at")
    search_fields = ("text", "author__username", "ticket__title")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-created_at",)
    date_hierarchy = "created_at"

    fieldsets = (
        ("Comment Information", {
            "fields": ("ticket", "author", "text")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )

    def text_preview(self, obj):
        """Display first 50 characters of comment text"""
        return obj.text[:50] + "..." if len(obj.text) > 50 else obj.text
    text_preview.short_description = "Text Preview"

    def get_queryset(self, request):
        """Optimize queries by selecting related objects"""
        queryset = super().get_queryset(request)
        return queryset.select_related("ticket", "author")


@admin.register(CommentMention)
class CommentMentionAdmin(admin.ModelAdmin):
    """Admin interface for CommentMention model"""

    list_display = (
        "id",
        "comment",
        "mentioned_user",
        "created_at",
    )
    list_filter = ("created_at",)
    search_fields = ("mentioned_user__username", "comment__text")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)
    date_hierarchy = "created_at"

    def get_queryset(self, request):
        """Optimize queries by selecting related objects"""
        queryset = super().get_queryset(request)
        return queryset.select_related("comment", "mentioned_user")

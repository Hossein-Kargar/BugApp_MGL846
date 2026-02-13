from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Comment, CommentMention


class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]


class CommentMentionSerializer(serializers.ModelSerializer):
    mentioned_user = UserSimpleSerializer(read_only=True)

    class Meta:
        model = CommentMention
        fields = ["id", "mentioned_user", "created_at"]


class CommentSerializer(serializers.ModelSerializer):
    author = UserSimpleSerializer(read_only=True)
    mentions = CommentMentionSerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = [
            "id",
            "ticket",
            "author",
            "text",
            "mentions",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "author", "created_at", "updated_at"]


class CommentCreateSerializer(serializers.ModelSerializer):
    mentioned_users = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, required=False, write_only=True
    )

    class Meta:
        model = Comment
        fields = ["ticket", "text", "mentioned_users"]

    def create(self, validated_data):
        mentioned_users = validated_data.pop("mentioned_users", [])
        comment = Comment.objects.create(
            author=self.context["request"].user, **validated_data
        )

        for user in mentioned_users:
            CommentMention.objects.create(comment=comment, mentioned_user=user)

        return comment

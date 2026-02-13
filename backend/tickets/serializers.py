from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Ticket, Mention


class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]


class MentionSerializer(serializers.ModelSerializer):
    mentioned_user = UserSimpleSerializer(read_only=True)

    class Meta:
        model = Mention
        fields = ["id", "mentioned_user", "created_at"]


class TicketSerializer(serializers.ModelSerializer):
    creator = UserSimpleSerializer(read_only=True)
    assigned_to = UserSimpleSerializer(read_only=True)
    mentions = MentionSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = [
            "id",
            "title",
            "description",
            "status",
            "priority",
            "severity",
            "creator",
            "assigned_to",
            "due_date",
            "mentions",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "creator", "created_at", "updated_at"]


class TicketCreateSerializer(serializers.ModelSerializer):
    assigned_to_id = serializers.IntegerField(required=False, allow_null=True)
    mentioned_users = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, required=False, write_only=True
    )

    class Meta:
        model = Ticket
        fields = [
            "title",
            "description",
            "priority",
            "severity",
            "assigned_to_id",
            "due_date",
            "mentioned_users",
        ]

    def create(self, validated_data):
        mentioned_users = validated_data.pop("mentioned_users", [])
        assigned_to_id = validated_data.pop("assigned_to_id", None)

        ticket = Ticket.objects.create(
            creator=self.context["request"].user,
            assigned_to_id=assigned_to_id,
            **validated_data
        )

        for user in mentioned_users:
            Mention.objects.create(ticket=ticket, mentioned_user=user)

        return ticket


class TicketStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ["status"]

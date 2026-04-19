from types import SimpleNamespace
from unittest.mock import Mock, call, patch

from django.contrib.auth.models import User
from django.core.cache import cache
from django.test import TestCase

from tickets.models import Mention, Ticket
from tickets.views import TicketUpdateView


class TicketUpdateWhiteBoxTests(TestCase):
    """White-box tests for the critical unit TicketUpdateView.perform_update()."""

    def setUp(self):
        cache.clear()
        self.creator = User.objects.create_user(
            username="creator", email="creator@example.com", password="pass123"
        )
        self.assignee = User.objects.create_user(
            username="assignee", email="assignee@example.com", password="pass123"
        )
        self.existing_mention = User.objects.create_user(
            username="existing", email="existing@example.com", password="pass123"
        )
        self.new_mention = User.objects.create_user(
            username="newmention", email="newmention@example.com", password="pass123"
        )

        self.ticket = Ticket.objects.create(
            title="Original Title",
            description="Original description",
            creator=self.creator,
            priority="medium",
            severity="medium",
        )
        Mention.objects.create(
            ticket=self.ticket,
            mentioned_user=self.existing_mention,
        )

    def make_view(self, data, user=None):
        view = TicketUpdateView()
        view.request = SimpleNamespace(data=data, user=user or self.creator)
        return view

    def make_serializer(self, ticket=None):
        serializer = Mock()
        serializer.save.return_value = ticket or self.ticket
        return serializer

    @patch("tickets.views.notify_user")
    def test_nominal_path_notifies_existing_mentions_new_mentions_and_assignee(
        self, notify_user
    ):
        """Path 1: assignment + new mentions + existing mentions + notifications."""
        view = self.make_view(
            {
                "assigned_to": self.assignee.id,
                "mentioned_users": [self.new_mention.id],
            }
        )
        serializer = self.make_serializer()

        view.perform_update(serializer)

        serializer.save.assert_called_once_with(assigned_to_id=self.assignee.id)
        notify_user.assert_has_calls(
            [
                call(
                    self.existing_mention.id,
                    f"Ticket '<a href='/tickets/{self.ticket.id}'>{self.ticket.title} (#{self.ticket.id})</a>' was updated.",
                ),
                call(
                    self.new_mention.id,
                    f"Ticket '<a href='/tickets/{self.ticket.id}'>{self.ticket.title} (#{self.ticket.id})</a>' was updated.",
                ),
                call(
                    self.assignee.id,
                    f"You have been assigned to ticket '<a href='/tickets/{self.ticket.id}'>{self.ticket.title} (#{self.ticket.id})</a>'",
                ),
            ],
            any_order=True,
        )
        self.assertEqual(notify_user.call_count, 3)

    @patch("tickets.views.notify_user")
    def test_without_assignment_notifies_existing_and_new_mentions_only(
        self, notify_user
    ):
        """Path 2: no assignment, but existing and new mentions are notified."""
        view = self.make_view({"mentioned_users": [self.new_mention.id]})
        serializer = self.make_serializer()

        view.perform_update(serializer)

        serializer.save.assert_called_once_with()
        notify_user.assert_has_calls(
            [
                call(
                    self.existing_mention.id,
                    f"Ticket '<a href='/tickets/{self.ticket.id}'>{self.ticket.title} (#{self.ticket.id})</a>' was updated.",
                ),
                call(
                    self.new_mention.id,
                    f"Ticket '<a href='/tickets/{self.ticket.id}'>{self.ticket.title} (#{self.ticket.id})</a>' was updated.",
                ),
            ],
            any_order=True,
        )
        self.assertEqual(notify_user.call_count, 2)

    @patch("tickets.views.notify_user")
    def test_without_new_mentions_notifies_existing_mentions_and_assignee(
        self, notify_user
    ):
        """Path 3: assignment exists, but no new mentions are provided."""
        view = self.make_view({"assigned_to": self.assignee.id})
        serializer = self.make_serializer()

        view.perform_update(serializer)

        serializer.save.assert_called_once_with(assigned_to_id=self.assignee.id)
        notify_user.assert_has_calls(
            [
                call(
                    self.existing_mention.id,
                    f"Ticket '<a href='/tickets/{self.ticket.id}'>{self.ticket.title} (#{self.ticket.id})</a>' was updated.",
                ),
                call(
                    self.assignee.id,
                    f"You have been assigned to ticket '<a href='/tickets/{self.ticket.id}'>{self.ticket.title} (#{self.ticket.id})</a>'",
                ),
            ],
            any_order=True,
        )
        self.assertEqual(notify_user.call_count, 2)

    @patch("tickets.views.notify_user")
    def test_missing_new_mentioned_user_is_ignored(self, notify_user):
        """Path 4: invalid mentioned user id is ignored by the try/except block."""
        view = self.make_view({"mentioned_users": [999999]})
        serializer = self.make_serializer(ticket=self.ticket)

        view.perform_update(serializer)

        serializer.save.assert_called_once_with()
        notify_user.assert_called_once_with(
            self.existing_mention.id,
            f"Ticket '<a href='/tickets/{self.ticket.id}'>{self.ticket.title} (#{self.ticket.id})</a>' was updated.",
        )

    @patch("tickets.views.notify_user")
    def test_missing_assigned_user_is_ignored(self, notify_user):
        """Path 5: invalid assigned user id is ignored without crashing."""
        ticket_without_mentions = Ticket.objects.create(
            title="No Mentions",
            description="No mention path",
            creator=self.creator,
            priority="medium",
            severity="medium",
        )
        view = self.make_view({"assigned_to": 999999})
        serializer = self.make_serializer(ticket=ticket_without_mentions)

        view.perform_update(serializer)

        serializer.save.assert_called_once_with(assigned_to_id=999999)
        notify_user.assert_not_called()

    @patch("tickets.views.notify_user")
    def test_self_notification_is_skipped_for_mentions_and_assignment(
        self, notify_user
    ):
        """Path 6: self-mention and self-assignment do not trigger notifications."""
        Mention.objects.create(ticket=self.ticket, mentioned_user=self.creator)
        view = self.make_view(
            {
                "assigned_to": self.creator.id,
                "mentioned_users": [self.creator.id],
            },
            user=self.creator,
        )
        serializer = self.make_serializer()

        view.perform_update(serializer)

        serializer.save.assert_called_once_with(assigned_to_id=self.creator.id)
        notify_user.assert_called_once_with(
            self.existing_mention.id,
            f"Ticket '<a href='/tickets/{self.ticket.id}'>{self.ticket.title} (#{self.ticket.id})</a>' was updated.",
        )

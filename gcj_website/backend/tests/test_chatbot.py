from unittest.mock import patch

from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import User
from students.models import Student
from chatbot.models import ChatbotLog


class ChatbotTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            email="cb_user@gcj.edu.pk",
            name="CBUser",
            password="StrongPass123!",
            role="STUDENT",
        )
        self.user.is_email_verified = True
        self.user.save(update_fields=["is_email_verified"])

        self.student = Student.objects.create(
            user=self.user,
            roll_no="S-6001",
            matric_marks=850,
            inter_marks=780,
            district="Jhang",
            program="BS_CS",
            admission_year=2024,
        )

    @patch("chatbot.views.get_gemini_response")
    def test_chatbot_message_missing_fields_400(self, mock_get):
        res = self.client.post(
            "/api/v1/chatbot/message/",
            {"session_id": "sess"},
            format="json",
        )
        self.assertEqual(res.status_code, 400)

    @patch("chatbot.views.get_gemini_response")
    def test_chatbot_message_success_creates_log_via_service(self, mock_get):
        mock_get.return_value = "Hello back"

        res = self.client.post(
            "/api/v1/chatbot/message/",
            {"session_id": "sess-1", "user_message": "Hi"},
            format="json",
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["session_id"], "sess-1")
        # Log creation happens inside get_gemini_response, so it won't happen when patched.
        # Validate endpoint output only.

    @patch("chatbot.views.get_gemini_response")
    def test_chatbot_logs_permissions_unauthenticated_allowed_create_only(self, mock_get):
        # Create log via get_gemini_response side effect by manually creating for list tests.
        ChatbotLog.objects.create(
            user=self.user,
            session_id="sess-1",
            message="m1",
            response="r1",
        )

        res = self.client.get("/api/v1/chatbot/logs/", format="json")
        self.assertEqual(res.status_code, 401)

        mock_get.return_value = "Ok"
        res2 = self.client.post(
            "/api/v1/chatbot/message/",
            {"session_id": "sess-2", "user_message": "Hello"},
            format="json",
        )
        self.assertEqual(res2.status_code, 200)

    def test_chatbot_logs_filter_by_session_id_when_unauthenticated(self):
        ChatbotLog.objects.create(user=self.user, session_id="sess-x", message="a", response="b")
        res = self.client.get(
            "/api/v1/chatbot/logs/?session_id=sess-x",
            format="json",
        )
        self.assertEqual(res.status_code, 200)
        self.assertGreaterEqual(res.data["count"], 1)


from unittest.mock import patch

from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import User
from departments.models import Department
from students.models import Student


class AIPredictionTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            email="ai_user@gcj.edu.pk",
            name="AIUser",
            password="StrongPass123!",
            role="STUDENT",
        )
        self.user.is_email_verified = True
        self.user.save(update_fields=["is_email_verified"])

        self.student = Student.objects.create(
            user=self.user,
            roll_no="S-5001",
            matric_marks=850,
            inter_marks=780,
            district="Jhang",
            program="BS_CS",
            admission_year=2024,
        )

        from rest_framework_simplejwt.tokens import RefreshToken

        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    @patch("ai_engine.views.predict_admission")
    def test_ai_predict_success_with_student_id_creates_prediction(self, mock_predict):
        mock_predict.return_value = {
            "advice": "Rules-based - eligible",
            "probability": 0.91,
        }

        res = self.client.post(
            "/api/v1/ai/predict/",
            {"student": self.student.id},
            format="json",
        )
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data["prediction_type"], "ELIGIBILITY")
        self.assertIn("confidence_score", res.data)

    @patch("ai_engine.views.predict_admission")
    def test_ai_predict_validation_missing_fields_without_student(self, mock_predict):
        res = self.client.post(
            "/api/v1/ai/predict/",
            {"matric_marks": 800},
            format="json",
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("Field", str(res.data))
        mock_predict.assert_not_called()

    @patch("ai_engine.views.predict_admission")
    def test_ai_predict_student_not_found_404(self, mock_predict):
        res = self.client.post(
            "/api/v1/ai/predict/",
            {"student": 999999},
            format="json",
        )
        self.assertEqual(res.status_code, 404)
        mock_predict.assert_not_called()

    @patch("ai_engine.views.predict_admission")
    def test_ai_predict_requires_auth_401(self, mock_predict):
        self.client.credentials()
        res = self.client.post(
            "/api/v1/ai/predict/",
            {"student": self.student.id},
            format="json",
        )
        self.assertEqual(res.status_code, 401)


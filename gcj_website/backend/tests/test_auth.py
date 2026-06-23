from unittest.mock import patch

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from accounts.models import User


class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_success_returns_201_and_creates_user_unverified(self):
        payload = {
            "email": "newuser@gcj.edu.pk",
            "name": "New User",
            "password": "StrongPass123!",
            "role": "STUDENT",
        }
        with patch("accounts.views.send_mail") as send_mail:
            res = self.client.post("/api/auth/register/", payload, format="json")

        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.data["user"]["email"], payload["email"].lower())
        self.assertFalse(User.objects.get(email=payload["email"].lower()).is_email_verified)
        send_mail.assert_called_once()

    def test_register_duplicate_email_validation_400(self):
        User.objects.create_user(
            email="dup@gcj.edu.pk",
            name="Dup",
            password="StrongPass123!",
            role="STUDENT",
        )
        payload = {
            "email": "dup@gcj.edu.pk",
            "name": "Dup2",
            "password": "StrongPass123!",
            "role": "STUDENT",
        }
        with patch("accounts.views.send_mail"):
            res = self.client.post("/api/auth/register/", payload, format="json")
        self.assertEqual(res.status_code, 400)
        self.assertIn("A user with this email already exists.", str(res.data))

    def test_login_success_returns_access_and_refresh(self):
        user = User.objects.create_user(
            email="login1@gcj.edu.pk",
            name="Login1",
            password="StrongPass123!",
            role="STUDENT",
        )
        user.is_email_verified = True
        user.save(update_fields=["is_email_verified"])

        payload = {"email": user.email, "password": "StrongPass123!"}
        res = self.client.post("/api/auth/login/", payload, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertIn("access", res.data)
        self.assertIn("refresh", res.data)

    def test_login_unverified_denied_400(self):
        user = User.objects.create_user(
            email="login2@gcj.edu.pk",
            name="Login2",
            password="StrongPass123!",
            role="STUDENT",
        )
        user.is_email_verified = False
        user.save(update_fields=["is_email_verified"])
        res = self.client.post(
            "/api/auth/login/",
            {"email": user.email, "password": "StrongPass123!"},
            format="json",
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("verify", str(res.data).lower())

    def test_refresh_success_returns_new_access(self):
        user = User.objects.create_user(
            email="refresh1@gcj.edu.pk",
            name="Refresh1",
            password="StrongPass123!",
            role="STUDENT",
        )
        user.is_email_verified = True
        user.save(update_fields=["is_email_verified"])

        from rest_framework_simplejwt.tokens import RefreshToken

        refresh = RefreshToken.for_user(user)
        res = self.client.post(
            "/api/auth/token/refresh/",
            {"refresh": str(refresh)},
            format="json",
        )
        self.assertEqual(res.status_code, 200)
        self.assertIn("access", res.data)

    def test_refresh_missing_token_400(self):
        res = self.client.post("/api/auth/token/refresh/", {}, format="json")
        self.assertEqual(res.status_code, 400)
        self.assertIn("Refresh token is required", str(res.data))

    def test_profile_requires_auth_401(self):
        res = self.client.get("/api/auth/profile/", format="json")
        self.assertEqual(res.status_code, 401)

    def test_profile_success_for_authenticated_user(self):
        user = User.objects.create_user(
            email="profile1@gcj.edu.pk",
            name="Profile1",
            password="StrongPass123!",
            role="STUDENT",
        )
        user.is_email_verified = True
        user.save(update_fields=["is_email_verified"])

        from rest_framework_simplejwt.tokens import RefreshToken

        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        res = self.client.get("/api/auth/profile/", format="json")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data["email"], user.email)

    def test_profile_update_success(self):
        user = User.objects.create_user(
            email="pu1@gcj.edu.pk",
            name="PU1",
            password="StrongPass123!",
            role="STUDENT",
        )
        user.is_email_verified = True
        user.save(update_fields=["is_email_verified"])

        from rest_framework_simplejwt.tokens import RefreshToken

        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
        res = self.client.put(
            "/api/auth/profile/update/",
            {"name": "PU1 Updated"},
            format="json",
        )
        self.assertEqual(res.status_code, 200)
        self.assertEqual(User.objects.get(pk=user.pk).name, "PU1 Updated")


"""
accounts/serializers.py

Serializers for the GCJ authentication system.

Serializers
-----------
- UserSerializer          – read-only profile representation
- RegisterSerializer      – create a new user + send verification email
- LoginSerializer         – validate credentials, return JWT pair + user data
- ProfileUpdateSerializer – partial update of own profile
- ChangePasswordSerializer – authenticated password change
- EmailVerificationSerializer – verify an account via UUID token
"""

import uuid
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser, Role


# ---------------------------------------------------------------------------
# Read-only profile serializer
# ---------------------------------------------------------------------------

class UserSerializer(serializers.ModelSerializer):
    """Minimal, safe representation of a user – never exposes sensitive data."""

    class Meta:
        model = CustomUser
        fields = (
            'id',
            'email',
            'full_name',
            'role',
            'phone',
            'department',
            'avatar_url',
            'is_email_verified',
            'date_joined',
        )
        read_only_fields = fields


# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------

class RegisterSerializer(serializers.ModelSerializer):
    """
    Validates and creates a new user account.

    - Enforces Django's built-in password validators.
    - Enforces password confirmation via `password_confirm`.
    - Role defaults to STUDENT; only admins can promote via a separate endpoint.
    - Sends an email verification link upon successful creation.
    """

    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
    )
    tokens = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = (
            'id',
            'email',
            'full_name',
            'password',
            'password_confirm',
            'phone',
            'department',
            'tokens',
        )
        read_only_fields = ('id', 'tokens')

    # ------------------------------------------------------------------
    # Validation
    # ------------------------------------------------------------------

    def validate_email(self, value: str) -> str:
        normalized = value.strip().lower()
        if CustomUser.objects.filter(email=normalized).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return normalized

    def validate_password(self, value: str) -> str:
        # Run Django's AUTH_PASSWORD_VALIDATORS
        validate_password(value)
        return value

    def validate(self, attrs: dict) -> dict:
        if attrs.get('password') != attrs.pop('password_confirm', None):
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})
        return attrs

    # ------------------------------------------------------------------
    # Creation
    # ------------------------------------------------------------------

    def create(self, validated_data: dict) -> CustomUser:
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data.get('full_name', ''),
            phone=validated_data.get('phone', ''),
            department=validated_data.get('department', ''),
            role=Role.STUDENT,
            is_email_verified=False,
        )
        # Send async-friendly verification email
        self._send_verification_email(user)
        return user

    # ------------------------------------------------------------------
    # JWT tokens for immediate login after registration
    # ------------------------------------------------------------------

    def get_tokens(self, obj: CustomUser) -> dict:
        refresh = RefreshToken.for_user(obj)
        refresh['role'] = obj.role
        refresh['email'] = obj.email
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    # ------------------------------------------------------------------
    # Email helper (falls back silently in development)
    # ------------------------------------------------------------------

    @staticmethod
    def _send_verification_email(user: CustomUser) -> None:
        token = user.email_verification_token
        frontend_base = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        link = f'{frontend_base}/verify-email/?token={token}'

        try:
            send_mail(
                subject='Verify your GCJ account',
                message=(
                    f'Hello {user.full_name},\n\n'
                    f'Please verify your email by clicking the link below:\n{link}\n\n'
                    f'This link expires in 24 hours.\n\nThe GCJ Team'
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=True,
            )
        except Exception:
            # Never block registration due to email failure
            pass


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------

class LoginSerializer(serializers.Serializer):
    """
    Validates email+password, returns JWT pair and user profile.

    Note: Rate limiting is applied at the view level.
    """

    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'},
    )

    # Populated after validate()
    user: CustomUser | None = None

    def validate(self, attrs: dict) -> dict:
        email = attrs.get('email', '').strip().lower()
        password = attrs.get('password', '')

        user = authenticate(
            request=self.context.get('request'),
            username=email,  # USERNAME_FIELD is email
            password=password,
        )

        if not user:
            raise serializers.ValidationError(
                {'non_field_errors': 'Invalid email or password.'}
            )

        if not user.is_active:
            raise serializers.ValidationError(
                {'non_field_errors': 'This account has been deactivated.'}
            )

        self.user = user
        return attrs

    def get_tokens(self) -> dict:
        """Call this from the view after successful validation."""
        refresh = RefreshToken.for_user(self.user)
        # Embed role in the token payload for client-side use
        refresh['role'] = self.user.role
        refresh['email'] = self.user.email
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


# ---------------------------------------------------------------------------
# Profile update (partial)
# ---------------------------------------------------------------------------

class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Allows an authenticated user to update their own non-sensitive profile fields."""

    class Meta:
        model = CustomUser
        fields = ('full_name', 'phone', 'department', 'avatar_url')

    def update(self, instance: CustomUser, validated_data: dict) -> CustomUser:
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save(update_fields=list(validated_data.keys()))
        return instance


# ---------------------------------------------------------------------------
# Change password
# ---------------------------------------------------------------------------

class ChangePasswordSerializer(serializers.Serializer):
    """Authenticated password change – requires current password for safety."""

    old_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'},
    )
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'},
    )
    new_password_confirm = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'},
    )

    def validate_old_password(self, value: str) -> str:
        user: CustomUser = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Old password is incorrect.')
        return value

    def validate(self, attrs: dict) -> dict:
        if attrs.get('new_password') != attrs.get('new_password_confirm'):
            raise serializers.ValidationError(
                {'new_password_confirm': 'New passwords do not match.'}
            )
        validate_password(attrs['new_password'], self.context['request'].user)
        return attrs

    def save(self, **kwargs) -> CustomUser:
        user: CustomUser = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password'])
        return user


# ---------------------------------------------------------------------------
# Email verification
# ---------------------------------------------------------------------------

class EmailVerificationSerializer(serializers.Serializer):
    """Accepts the UUID token from the verification link."""

    token = serializers.UUIDField(required=True)

    def validate_token(self, value: uuid.UUID) -> uuid.UUID:
        try:
            user = CustomUser.objects.get(email_verification_token=value)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError('Invalid or expired verification token.')

        if user.is_email_verified:
            raise serializers.ValidationError('This email has already been verified.')

        self.verified_user = user
        return value

    def save(self, **kwargs) -> CustomUser:
        user: CustomUser = self.verified_user
        user.is_email_verified = True
        user.email_verification_token = None
        user.save(update_fields=['is_email_verified', 'email_verification_token'])
        return user

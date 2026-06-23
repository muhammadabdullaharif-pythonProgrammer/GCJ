"""
accounts/models.py

Custom User model for GCJ using AbstractBaseUser.
Roles are stored as a CharField with enum-style choices rather than a
separate FK table, keeping the schema simple and queries fast.
Email is the primary login identifier (USERNAME_FIELD = 'email').
"""

import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


# ---------------------------------------------------------------------------
# Role Constants
# ---------------------------------------------------------------------------

class Role(models.TextChoices):
    ADMIN = 'ADMIN', 'Admin'
    TEACHER = 'TEACHER', 'Teacher'
    STUDENT = 'STUDENT', 'Student'


# ---------------------------------------------------------------------------
# Custom Manager
# ---------------------------------------------------------------------------

class CustomUserManager(BaseUserManager):
    """Manager that uses *email* as the unique identifier."""

    def _create_user(self, email: str, password: str, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email: str, password: str = None, **extra_fields):
        extra_fields.setdefault('role', Role.STUDENT)
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email: str, password: str, **extra_fields):
        extra_fields.setdefault('role', Role.ADMIN)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_email_verified', True)

        if not extra_fields.get('is_staff'):
            raise ValueError('Superuser must have is_staff=True.')
        if not extra_fields.get('is_superuser'):
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


# ---------------------------------------------------------------------------
# Custom User Model
# ---------------------------------------------------------------------------

class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    GCJ platform user.

    Fields
    ------
    email           – primary login identifier (unique)
    full_name       – display name
    role            – ADMIN | TEACHER | STUDENT
    is_email_verified – set to True after email token is confirmed
    email_verification_token – UUID sent in the verification link
    """

    id = models.BigAutoField(primary_key=True)

    email = models.EmailField(unique=True, db_index=True)
    full_name = models.CharField(max_length=150)

    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.STUDENT,
        db_index=True,
    )

    # Staff/active flags required by Django admin & PermissionsMixin
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Email verification
    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        null=True,
        blank=True,
    )
    email_verification_sent_at = models.DateTimeField(null=True, blank=True)

    # Timestamps
    date_joined = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    # Optional profile extras
    phone = models.CharField(max_length=20, blank=True, default='')
    department = models.CharField(max_length=100, blank=True, default='')
    avatar_url = models.URLField(blank=True, default='')

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        indexes = [
            models.Index(fields=['email'], name='idx_users_email'),
            models.Index(fields=['role'], name='idx_users_role'),
        ]

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def __str__(self) -> str:
        return f'{self.full_name} <{self.email}> [{self.role}]'

    @property
    def is_admin(self) -> bool:
        return self.role == Role.ADMIN

    @property
    def is_teacher(self) -> bool:
        return self.role == Role.TEACHER

    @property
    def is_student(self) -> bool:
        return self.role == Role.STUDENT

    def reset_verification_token(self) -> uuid.UUID:
        """Rotate the email verification token and record the send time."""
        self.email_verification_token = uuid.uuid4()
        self.email_verification_sent_at = timezone.now()
        self.save(update_fields=['email_verification_token', 'email_verification_sent_at'])
        return self.email_verification_token

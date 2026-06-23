"""
Users App - Models
Custom User model + Role model for GCJ Website
"""
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class Role(models.Model):
    """Roles with JSON-based permissions"""
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('principal', 'Principal'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
        ('staff', 'Staff'),
        ('public', 'Public'),
    ]
    role_name = models.CharField(max_length=50, unique=True, choices=ROLE_CHOICES)
    permissions_json = models.JSONField(default=dict, help_text='JSON object of permissions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'roles'
        ordering = ['role_name']
        indexes = [models.Index(fields=['role_name'])]

    def __str__(self):
        return self.role_name


class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError('Email address is required')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, name, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Custom User model for GCJ"""
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('principal', 'Principal'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
        ('staff', 'Staff'),
        ('public', 'Public'),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, db_index=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='public', db_index=True)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = UserManager()

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f'{self.name} ({self.email})'

    def get_full_name(self):
        return self.name

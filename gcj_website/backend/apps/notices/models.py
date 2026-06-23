"""
Notices App - Models
GCJ Website
"""
from django.db import models
from django.conf import settings


class Notice(models.Model):
    """Notices/Announcements"""
    TARGET_ROLE_CHOICES = [
        ('all', 'All'), ('student', 'Students'), ('teacher', 'Teachers'),
        ('staff', 'Staff'), ('admin', 'Admin'),
    ]
    PRIORITY_CHOICES = [('low', 'Low'), ('normal', 'Normal'), ('high', 'High'), ('urgent', 'Urgent')]

    title = models.CharField(max_length=500)
    content = models.TextField()
    posted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
        related_name='posted_notices', db_column='posted_by'
    )
    target_role = models.CharField(max_length=20, choices=TARGET_ROLE_CHOICES, default='all', db_index=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='normal')
    attachment = models.FileField(upload_to='notices/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    expiry_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'notices'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['target_role']),
            models.Index(fields=['is_active']),
            models.Index(fields=['priority']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return self.title

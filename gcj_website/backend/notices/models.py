from django.db import models
from django.conf import settings


class Notice(models.Model):
    TARGET_ROLE_CHOICES = (
        ('ALL', 'All'),
        ('STUDENT', 'Student'),
        ('TEACHER', 'Teacher'),
        ('ADMIN', 'Admin'),
    )

    title = models.CharField(max_length=255)
    content = models.TextField()
    posted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notices_posted',
        db_index=True
    )
    target_role = models.CharField(max_length=20, choices=TARGET_ROLE_CHOICES, default='ALL', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'notices_new'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

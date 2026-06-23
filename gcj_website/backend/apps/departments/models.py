"""
Departments App - Models
GCJ Website
"""
from django.db import models
from django.conf import settings


class Department(models.Model):
    """Academic departments at GCJ"""
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)
    hod_id = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='headed_departments',
        db_column='hod_id'
    )
    total_seats = models.PositiveIntegerField(default=0)
    image_url = models.ImageField(upload_to='departments/', null=True, blank=True)
    established_year = models.PositiveIntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'departments'
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.name

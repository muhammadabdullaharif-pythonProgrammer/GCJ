"""
Gallery App - Models
GCJ Website
"""
from django.db import models
from django.conf import settings


class Gallery(models.Model):
    """Photo gallery"""
    CATEGORY_CHOICES = [
        ('campus', 'Campus'), ('events', 'Events'), ('sports', 'Sports'),
        ('labs', 'Labs'), ('cultural', 'Cultural'), ('achievements', 'Achievements'),
        ('graduation', 'Graduation'),
    ]

    image_url = models.ImageField(upload_to='gallery/%Y/%m/')
    caption = models.CharField(max_length=500, null=True, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='campus', db_index=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
        related_name='gallery_uploads', db_column='uploaded_by'
    )
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'gallery'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f'{self.category} - {self.caption or self.id}'

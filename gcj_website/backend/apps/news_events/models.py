"""
News & Events App - Models
GCJ Website
"""
from django.db import models
from django.conf import settings


class NewsEvent(models.Model):
    """News and events for GCJ"""
    CATEGORY_CHOICES = [
        ('news', 'News'), ('event', 'Event'), ('achievement', 'Achievement'),
        ('sports', 'Sports'), ('cultural', 'Cultural'), ('academic', 'Academic'),
    ]

    title = models.CharField(max_length=500)
    slug = models.SlugField(unique=True, max_length=600)
    body = models.TextField()
    excerpt = models.TextField(null=True, blank=True, max_length=300)
    event_date = models.DateTimeField(null=True, blank=True)
    image_url = models.ImageField(upload_to='news_events/', null=True, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='news', db_index=True)
    posted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,
        related_name='news_events'
    )
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'news_events'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['is_published']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['event_date']),
            models.Index(fields=['slug']),
        ]

    def __str__(self):
        return self.title

from django.db import models
from django.conf import settings
from django.utils.text import slugify


class NewsEvent(models.Model):
    EVENT_TYPE_CHOICES = (
        ('NEWS', 'News'),
        ('EVENT', 'Event'),
        ('ANNOUNCEMENT', 'Announcement'),
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    event_type = models.CharField(
        max_length=20,
        choices=EVENT_TYPE_CHOICES,
        default='NEWS',
        db_index=True
    )
    body = models.TextField()
    event_date = models.DateTimeField(blank=True, null=True, db_index=True)
    scheduled_publish_date = models.DateTimeField(
        blank=True,
        null=True,
        db_index=True,
        help_text="Schedule auto-publish at this datetime"
    )
    image_url = models.ImageField(upload_to='news_events/', blank=True, null=True)
    is_published = models.BooleanField(default=True, db_index=True)
    tags = models.CharField(max_length=255, blank=True, help_text="Comma-separated tags")
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='news_events_authored'
    )
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'news_events_new'
        ordering = ['-created_at']
        verbose_name = 'News / Event'
        verbose_name_plural = 'News & Events'

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while NewsEvent.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.event_type}] {self.title}"

from django.db import models
from django.conf import settings


class Gallery(models.Model):
    CATEGORY_CHOICES = (
        ('CAMPUS', 'Campus'),
        ('SPORTS', 'Sports'),
        ('EVENTS', 'Events'),
        ('ACADEMICS', 'Academics'),
        ('LABS', 'Labs'),
    )

    image_url = models.ImageField(upload_to='gallery/')
    caption = models.CharField(max_length=255, blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='CAMPUS', db_index=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='uploaded_images',
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'gallery_new'
        ordering = ['-created_at']

    def __str__(self):
        return self.caption or f"Image {self.id}"

from django.db import models
from django.conf import settings
from django.utils.text import slugify


class Department(models.Model):
    name = models.CharField(max_length=255, unique=True, db_index=True)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    vision = models.TextField(blank=True, null=True, help_text="Department vision statement")
    mission = models.TextField(blank=True, null=True, help_text="Department mission statement")
    programs_offered = models.TextField(
        blank=True,
        null=True,
        help_text="List of programs offered (one per line)"
    )
    hod = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='departments_led',
        db_index=True
    )
    total_seats = models.PositiveIntegerField(default=50)
    established_year = models.PositiveIntegerField(
        blank=True,
        null=True,
        help_text="Year the department was established"
    )
    image_url = models.ImageField(upload_to='departments/', blank=True, null=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'departments_new'
        ordering = ['name']
        verbose_name = 'Department'
        verbose_name_plural = 'Departments'

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Department.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

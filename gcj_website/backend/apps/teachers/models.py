"""
Teachers App - Models
GCJ Website
"""
from django.db import models
from django.conf import settings


class Teacher(models.Model):
    """Teacher profile linked to User"""
    DESIGNATION_CHOICES = [
        ('professor', 'Professor'),
        ('associate_professor', 'Associate Professor'),
        ('assistant_professor', 'Assistant Professor'),
        ('lecturer', 'Lecturer'),
        ('visiting_lecturer', 'Visiting Lecturer'),
        ('lab_instructor', 'Lab Instructor'),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='teacher_profile'
    )
    designation = models.CharField(max_length=50, choices=DESIGNATION_CHOICES)
    department = models.ForeignKey(
        'departments.Department',
        on_delete=models.SET_NULL,
        null=True,
        related_name='teachers'
    )
    qualification = models.CharField(max_length=255, help_text='e.g. PhD, MPhil, MSc')
    specialization = models.CharField(max_length=255, null=True, blank=True)
    joining_date = models.DateField()
    employee_id = models.CharField(max_length=50, unique=True, null=True, blank=True)
    research_interests = models.TextField(null=True, blank=True)
    publications = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'teachers'
        ordering = ['designation', 'user__name']
        indexes = [
            models.Index(fields=['department']),
            models.Index(fields=['designation']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f'{self.designation} {self.user.name}'

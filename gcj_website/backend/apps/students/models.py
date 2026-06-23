"""
Students App - Models
GCJ Website
"""
from django.db import models
from django.conf import settings


class Student(models.Model):
    """Student profile linked to User"""
    PROGRAM_CHOICES = [
        ('fsc_pre_medical', 'FSc Pre-Medical'),
        ('fsc_pre_engineering', 'FSc Pre-Engineering'),
        ('fa', 'FA'),
        ('ics', 'ICS'),
        ('icom', 'ICom'),
        ('bsc', 'BSc'),
        ('ba', 'BA'),
    ]
    DISTRICT_CHOICES = [
        ('jhang', 'Jhang'),
        ('chiniot', 'Chiniot'),
        ('faisalabad', 'Faisalabad'),
        ('sargodha', 'Sargodha'),
        ('other', 'Other'),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='student_profile'
    )
    roll_no = models.CharField(max_length=50, unique=True, db_index=True)
    matric_marks = models.PositiveIntegerField(null=True, blank=True, help_text='Out of 1100')
    inter_marks = models.PositiveIntegerField(null=True, blank=True, help_text='Out of 1100')
    district = models.CharField(max_length=50, choices=DISTRICT_CHOICES, default='jhang')
    program = models.CharField(max_length=50, choices=PROGRAM_CHOICES)
    department = models.ForeignKey(
        'departments.Department',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='students'
    )
    admission_year = models.PositiveIntegerField()
    batch = models.CharField(max_length=20, null=True, blank=True)
    father_name = models.CharField(max_length=255, null=True, blank=True)
    cnic = models.CharField(max_length=15, null=True, blank=True, unique=True)
    date_of_birth = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'students'
        ordering = ['roll_no']
        indexes = [
            models.Index(fields=['roll_no']),
            models.Index(fields=['program']),
            models.Index(fields=['admission_year']),
            models.Index(fields=['department']),
        ]

    def __str__(self):
        return f'{self.user.name} - {self.roll_no}'

    @property
    def merit_score(self):
        """Calculate merit score from matric + inter marks"""
        if self.matric_marks and self.inter_marks:
            return (self.matric_marks / 1100 * 0.4 + self.inter_marks / 1100 * 0.6) * 100
        return None

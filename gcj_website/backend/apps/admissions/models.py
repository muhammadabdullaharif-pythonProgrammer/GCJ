"""
Admissions App - Models
GCJ Website
"""
from django.db import models


class Admission(models.Model):
    """Admission applications with AI recommendations"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('waitlisted', 'Waitlisted'),
    ]

    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='admissions')
    department = models.ForeignKey('departments.Department', on_delete=models.CASCADE, related_name='admissions')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    applied_date = models.DateTimeField(auto_now_add=True)
    merit_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    ai_recommendation = models.JSONField(null=True, blank=True, help_text='AI-generated admission recommendation')
    notes = models.TextField(null=True, blank=True)
    reviewed_by = models.ForeignKey(
        'users.User', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='reviewed_admissions'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'admissions'
        ordering = ['-applied_date']
        indexes = [
            models.Index(fields=['student']),
            models.Index(fields=['department']),
            models.Index(fields=['status']),
            models.Index(fields=['merit_score']),
        ]

    def __str__(self):
        return f'{self.student} -> {self.department} [{self.status}]'

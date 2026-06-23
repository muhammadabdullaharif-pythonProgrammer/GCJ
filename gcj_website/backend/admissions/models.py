from django.db import models
from students.models import Student
from departments.models import Department


class Admission(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='admissions')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='admissions')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING', db_index=True)
    applied_date = models.DateTimeField(auto_now_add=True, db_index=True)
    merit_score = models.FloatField()
    ai_recommendation = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'admissions_new'
        ordering = ['-applied_date']

    def __str__(self):
        return f"{self.student.roll_no} - {self.department.name}: {self.status}"

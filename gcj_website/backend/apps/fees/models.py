"""
Fees App - Models
GCJ Website
"""
from django.db import models


class FeeRecord(models.Model):
    """Student fee records"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
        ('waived', 'Waived'),
        ('partial', 'Partial Payment'),
    ]
    FEE_TYPE_CHOICES = [
        ('tuition', 'Tuition Fee'), ('admission', 'Admission Fee'),
        ('exam', 'Exam Fee'), ('library', 'Library Fee'),
        ('sports', 'Sports Fee'), ('misc', 'Miscellaneous'),
    ]

    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='fee_records')
    fee_type = models.CharField(max_length=20, choices=FEE_TYPE_CHOICES, default='tuition')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    due_date = models.DateField(db_index=True)
    paid_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending', db_index=True)
    semester = models.CharField(max_length=20, null=True, blank=True)
    challan_no = models.CharField(max_length=50, null=True, blank=True, unique=True)
    remarks = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'fee_records'
        ordering = ['-due_date']
        indexes = [
            models.Index(fields=['student']),
            models.Index(fields=['status']),
            models.Index(fields=['due_date']),
            models.Index(fields=['fee_type']),
        ]

    def __str__(self):
        return f'{self.student} | {self.fee_type} | {self.amount} | {self.status}'

    @property
    def balance(self):
        return float(self.amount) - float(self.paid_amount)

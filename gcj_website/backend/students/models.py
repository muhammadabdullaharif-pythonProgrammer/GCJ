from django.db import models
from django.conf import settings
from teachers.models import Course


class Student(models.Model):
    PROGRAM_CHOICES = (
        ('BS_CS', 'BS Computer Science'),
        ('BS_IT', 'BS Information Technology'),
        ('BS_ENG', 'BS English'),
        ('FSC_PRE_ENG', 'FSc Pre-Engineering'),
        ('FSC_PRE_MED', 'FSc Pre-Medical'),
        ('ICS', 'ICS'),
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student_profile')
    roll_no = models.CharField(max_length=50, unique=True, db_index=True)
    matric_marks = models.PositiveIntegerField(help_text="Matriculation Marks")
    inter_marks = models.PositiveIntegerField(help_text="Intermediate Marks")
    district = models.CharField(max_length=100, db_index=True)
    program = models.CharField(max_length=50, choices=PROGRAM_CHOICES, db_index=True)
    admission_year = models.PositiveIntegerField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'students_new'
        ordering = ['roll_no']

    def __str__(self):
        return f"{self.user.name} ({self.roll_no})"


class Result(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='results')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='results')
    marks_obtained = models.FloatField()
    total_marks = models.FloatField(default=100.0)
    grade = models.CharField(max_length=5, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'results_new'
        ordering = ['course']
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.student.roll_no} - {self.course.code}: {self.grade}"


class Attendance(models.Model):
    STATUS_CHOICES = (
        ('PRESENT', 'Present'),
        ('ABSENT', 'Absent'),
        ('LATE', 'Late'),
    )

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendance')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='attendance')
    date = models.DateField(db_index=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PRESENT')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'attendance_new'
        unique_together = ('student', 'course', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"{self.student.roll_no} - {self.date}: {self.status}"


class FeeRecord(models.Model):
    STATUS_CHOICES = (
        ('PAID', 'Paid'),
        ('UNPAID', 'Unpaid'),
        ('PENDING', 'Pending'),
    )

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='fees')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField(db_index=True)
    paid_date = models.DateField(blank=True, null=True, db_index=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='UNPAID', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'fee_records_new'
        ordering = ['-due_date']

    def __str__(self):
        return f"{self.student.roll_no} - {self.amount}: {self.status}"

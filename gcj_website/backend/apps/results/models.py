"""
Results App - Models (Results + Attendance)
GCJ Website
"""
from django.db import models


class Result(models.Model):
    """Student results per course"""
    GRADE_CHOICES = [
        ('A+', 'A+ (95-100)'), ('A', 'A (90-94)'), ('B+', 'B+ (85-89)'),
        ('B', 'B (80-84)'), ('C+', 'C+ (75-79)'), ('C', 'C (70-74)'),
        ('D', 'D (60-69)'), ('F', 'F (Below 60)'),
    ]

    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='results')
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='results')
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2)
    total_marks = models.PositiveSmallIntegerField(default=100)
    grade = models.CharField(max_length=3, choices=GRADE_CHOICES, null=True, blank=True)
    semester = models.CharField(max_length=20)
    exam_type = models.CharField(
        max_length=20,
        choices=[('midterm', 'Midterm'), ('final', 'Final'), ('sessional', 'Sessional')],
        default='final'
    )
    remarks = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'results'
        unique_together = ['student', 'course', 'semester', 'exam_type']
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['student']),
            models.Index(fields=['course']),
            models.Index(fields=['semester']),
            models.Index(fields=['grade']),
        ]

    def save(self, *args, **kwargs):
        """Auto-calculate grade"""
        percentage = (float(self.marks_obtained) / self.total_marks) * 100
        if percentage >= 95: self.grade = 'A+'
        elif percentage >= 90: self.grade = 'A'
        elif percentage >= 85: self.grade = 'B+'
        elif percentage >= 80: self.grade = 'B'
        elif percentage >= 75: self.grade = 'C+'
        elif percentage >= 70: self.grade = 'C'
        elif percentage >= 60: self.grade = 'D'
        else: self.grade = 'F'
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.student} | {self.course.code} | {self.marks_obtained}/{self.total_marks}'


class Attendance(models.Model):
    """Daily attendance records"""
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
        ('excused', 'Excused'),
    ]

    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='attendance_records')
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField(db_index=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='present')
    marked_by = models.ForeignKey(
        'teachers.Teacher', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='marked_attendances'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'attendance'
        unique_together = ['student', 'course', 'date']
        ordering = ['-date']
        indexes = [
            models.Index(fields=['student']),
            models.Index(fields=['course']),
            models.Index(fields=['date']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f'{self.student} | {self.course.code} | {self.date} | {self.status}'

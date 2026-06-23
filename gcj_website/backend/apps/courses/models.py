"""
Courses App - Models
GCJ Website
"""
from django.db import models


class Course(models.Model):
    """Academic courses"""
    SEMESTER_CHOICES = [(str(i), f'Semester {i}') for i in range(1, 9)] + [('annual', 'Annual')]

    name = models.CharField(max_length=255)
    code = models.CharField(max_length=20, unique=True, db_index=True)
    department = models.ForeignKey(
        'departments.Department',
        on_delete=models.CASCADE,
        related_name='courses'
    )
    credit_hours = models.PositiveSmallIntegerField(default=3)
    semester = models.CharField(max_length=20, choices=SEMESTER_CHOICES)
    description = models.TextField(null=True, blank=True)
    is_elective = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'courses'
        ordering = ['code']
        indexes = [
            models.Index(fields=['department']),
            models.Index(fields=['semester']),
            models.Index(fields=['code']),
        ]

    def __str__(self):
        return f'{self.code} - {self.name}'


class Enrollment(models.Model):
    """Student enrollment in courses"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('dropped', 'Dropped'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    student = models.ForeignKey('students.Student', on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    semester = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'enrollments'
        unique_together = ['student', 'course', 'semester']
        indexes = [
            models.Index(fields=['student']),
            models.Index(fields=['course']),
            models.Index(fields=['semester']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f'{self.student} -> {self.course} ({self.semester})'


class Timetable(models.Model):
    """Class timetable"""
    DAY_CHOICES = [
        ('monday', 'Monday'), ('tuesday', 'Tuesday'), ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'), ('friday', 'Friday'), ('saturday', 'Saturday'),
    ]

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='timetable_entries')
    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.SET_NULL, null=True, related_name='timetable')
    day = models.CharField(max_length=10, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=50)
    section = models.CharField(max_length=10, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'timetable'
        ordering = ['day', 'start_time']
        indexes = [
            models.Index(fields=['course']),
            models.Index(fields=['teacher']),
            models.Index(fields=['day']),
        ]

    def __str__(self):
        return f'{self.course.code} | {self.day} {self.start_time}-{self.end_time} | {self.room}'


class Assignment(models.Model):
    """Assignments posted by teachers"""
    teacher = models.ForeignKey('teachers.Teacher', on_delete=models.CASCADE, related_name='assignments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')
    title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateTimeField()
    file_url = models.FileField(upload_to='assignments/', null=True, blank=True)
    total_marks = models.PositiveSmallIntegerField(default=10)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'assignments'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['teacher']),
            models.Index(fields=['course']),
            models.Index(fields=['due_date']),
        ]

    def __str__(self):
        return f'{self.title} - {self.course.code}'

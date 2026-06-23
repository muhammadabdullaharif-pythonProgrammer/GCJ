from django.db import models
from django.conf import settings
from departments.models import Department


class Teacher(models.Model):
    DESIGNATION_CHOICES = (
        ('PROFESSOR', 'Professor'),
        ('ASSOCIATE_PROFESSOR', 'Associate Professor'),
        ('ASSISTANT_PROFESSOR', 'Assistant Professor'),
        ('LECTURER', 'Lecturer'),
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='teacher_profile')
    designation = models.CharField(max_length=50, choices=DESIGNATION_CHOICES, default='LECTURER')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='teachers')
    qualification = models.CharField(max_length=255)
    joining_date = models.DateField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'teachers_new'
        ordering = ['-joining_date']

    def __str__(self):
        return f"{self.user.name} ({self.designation})"


class Course(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True, db_index=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='courses')
    credit_hours = models.PositiveIntegerField(default=3)
    semester = models.CharField(max_length=50, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'courses_new'
        ordering = ['code']

    def __str__(self):
        return f"{self.code} - {self.name}"


class Assignment(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='assignments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')
    title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateTimeField(db_index=True)
    file_url = models.FileField(upload_to='assignments/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'assignments_new'
        ordering = ['-due_date']

    def __str__(self):
        return self.title


class Timetable(models.Model):
    DAY_CHOICES = (
        ('MONDAY', 'Monday'),
        ('TUESDAY', 'Tuesday'),
        ('WEDNESDAY', 'Wednesday'),
        ('THURSDAY', 'Thursday'),
        ('FRIDAY', 'Friday'),
    )

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='timetable_entries')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='timetable_entries')
    day = models.CharField(max_length=15, choices=DAY_CHOICES, db_index=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'timetable_new'
        ordering = ['day', 'start_time']

    def __str__(self):
        return f"{self.course.code} - {self.day} {self.start_time}-{self.end_time}"

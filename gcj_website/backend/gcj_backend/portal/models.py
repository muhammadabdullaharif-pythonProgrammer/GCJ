from django.db import models
from django.conf import settings

# 1. Department model
class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    hod = models.ForeignKey(
        'Teacher', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='headed_departments'
    )
    total_seats = models.IntegerField(default=50)
    image_url = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'departments'

    def __str__(self):
        return self.name

# 2. Teacher model
class Teacher(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='teacher_profile')
    designation = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.RESTRICT, related_name='teachers')
    qualification = models.CharField(max_length=255)
    joining_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'teachers'

    def __str__(self):
        return f"{self.user.name or self.user.username} - {self.designation}"

# 3. Student model
class Student(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student_profile')
    roll_no = models.CharField(max_length=20, unique=True)
    matric_marks = models.IntegerField()
    inter_marks = models.IntegerField()
    district = models.CharField(max_length=100)
    program = models.CharField(max_length=100)
    admission_year = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'students'
        indexes = [
            models.Index(fields=['roll_no'], name='idx_students_roll'),
        ]

    def __str__(self):
        return f"{self.roll_no} - {self.user.name or self.user.username}"

# 4. Course model
class Course(models.Model):
    name = models.CharField(max_length=150)
    code = models.CharField(max_length=20, unique=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='courses')
    credit_hours = models.IntegerField(default=3)
    semester = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'courses'
        indexes = [
            models.Index(fields=['code'], name='idx_courses_code'),
        ]

    def __str__(self):
        return f"{self.name} ({self.code})"

# 5. Enrollment model
class Enrollment(models.Model):
    STATUS_CHOICES = (
        ('Enrolled', 'Enrolled'),
        ('Completed', 'Completed'),
        ('Dropped', 'Dropped'),
        ('Failed', 'Failed'),
    )
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    semester = models.IntegerField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='Enrolled')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'enrollments'
        indexes = [
            models.Index(fields=['semester', 'status'], name='idx_enrollments_sem'),
        ]

    def __str__(self):
        return f"{self.student.roll_no} -> {self.course.code} ({self.status})"

# 6. Timetable model
class Timetable(models.Model):
    DAY_CHOICES = (
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    )
    
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='timetables')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='timetables')
    day = models.CharField(max_length=15, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'timetable'
        indexes = [
            models.Index(fields=['room', 'day'], name='idx_timetable_room'),
        ]

    def __str__(self):
        return f"{self.course.code} - {self.day} ({self.start_time}-{self.end_time})"

# 7. Admission application model
class Admission(models.Model):
    STATUS_CHOICES = (
        ('Applied', 'Applied'),
        ('Shortlisted', 'Shortlisted'),
        ('Admitted', 'Admitted'),
        ('Rejected', 'Rejected'),
    )
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='admissions')
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='admissions')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='Applied')
    applied_date = models.DateField()
    merit_score = models.DecimalField(max_digits=5, decimal_places=2)
    ai_recommendation = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'admissions'

    def __str__(self):
        return f"{self.student.roll_no} -> {self.department.name} ({self.status})"

# 8. Result model
class Result(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='results')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='results')
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2)
    total_marks = models.DecimalField(max_digits=5, decimal_places=2)
    grade = models.CharField(max_length=5)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'results'
        indexes = [
            models.Index(fields=['student', 'course'], name='idx_results_student'),
        ]

    def __str__(self):
        return f"{self.student.roll_no} - {self.course.code}: {self.marks_obtained}/{self.total_marks}"

# 9. Attendance model
class Attendance(models.Model):
    STATUS_CHOICES = (
        ('Present', 'Present'),
        ('Absent', 'Absent'),
        ('Leave', 'Leave'),
        ('Late', 'Late'),
    )
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendance')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='attendance')
    date = models.DateField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='Present')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'attendance'
        indexes = [
            models.Index(fields=['date', 'student'], name='idx_attendance_date'),
        ]

    def __str__(self):
        return f"{self.student.roll_no} - {self.date}: {self.status}"

# 10. Notice model
class Notice(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notices')
    target_role = models.CharField(max_length=50, default='All')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'notices'
        indexes = [
            models.Index(fields=['target_role'], name='idx_notices_role'),
        ]

    def __str__(self):
        return self.title

# 11. NewsEvent model
class NewsEvent(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    event_date = models.DateTimeField()
    image_url = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'news_events'

    def __str__(self):
        return self.title

# 12. AIPrediction model
class AIPrediction(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='ai_predictions')
    input_json = models.JSONField()
    output_json = models.JSONField()
    model_used = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ai_predictions'

    def __str__(self):
        return f"Prediction for student {self.student.roll_no} using {self.model_used}"

# 13. ChatbotLog model
class ChatbotLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='chatbot_logs')
    session_id = models.CharField(max_length=100)
    message = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'chatbot_logs'
        indexes = [
            models.Index(fields=['session_id'], name='idx_chatbot_session'),
        ]

    def __str__(self):
        return f"Chat log session {self.session_id}"

# 14. Gallery model
class Gallery(models.Model):
    image_url = models.CharField(max_length=255)
    caption = models.CharField(max_length=255)
    category = models.CharField(max_length=50)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='gallery_uploads')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'gallery'

    def __str__(self):
        return self.caption

# 15. FeeRecord model
class FeeRecord(models.Model):
    STATUS_CHOICES = (
        ('Unpaid', 'Unpaid'),
        ('Paid', 'Paid'),
        ('Overdue', 'Overdue'),
        ('Partially_Paid', 'Partially_Paid'),
    )
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='fee_records')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    paid_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='Unpaid')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'fee_records'
        indexes = [
            models.Index(fields=['due_date', 'status'], name='idx_fee_due'),
        ]

    def __str__(self):
        return f"{self.student.roll_no} -> {self.amount} ({self.status})"

# 16. Assignment model
class Assignment(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='assignments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    due_date = models.DateTimeField()
    file_url = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'assignments'
        indexes = [
            models.Index(fields=['due_date'], name='idx_assignments_due'),
        ]

    def __str__(self):
        return f"{self.title} - {self.course.code}"

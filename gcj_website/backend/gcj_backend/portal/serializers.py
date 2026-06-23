from rest_framework import serializers
from .models import (
    Department, Teacher, Student, Course, Enrollment, Timetable, 
    Admission, Result, Attendance, Notice, NewsEvent, 
    AIPrediction, ChatbotLog, Gallery, FeeRecord, Assignment
)

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class TeacherSerializer(serializers.ModelSerializer):
    user_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Teacher
        fields = '__all__'
        
    def get_user_details(self, obj):
        return {"id": obj.user.id, "name": obj.user.name, "email": obj.user.email}

class StudentSerializer(serializers.ModelSerializer):
    user_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Student
        fields = '__all__'
        
    def get_user_details(self, obj):
        return {"id": obj.user.id, "name": obj.user.name, "email": obj.user.email}

class CourseSerializer(serializers.ModelSerializer):
    department_details = DepartmentSerializer(source='department', read_only=True)
    
    class Meta:
        model = Course
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source='student', read_only=True)
    course_details = CourseSerializer(source='course', read_only=True)
    
    class Meta:
        model = Enrollment
        fields = '__all__'

class TimetableSerializer(serializers.ModelSerializer):
    course_details = CourseSerializer(source='course', read_only=True)
    teacher_details = TeacherSerializer(source='teacher', read_only=True)
    
    class Meta:
        model = Timetable
        fields = '__all__'

class AdmissionSerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source='student', read_only=True)
    department_details = DepartmentSerializer(source='department', read_only=True)
    
    class Meta:
        model = Admission
        fields = '__all__'

class ResultSerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source='student', read_only=True)
    course_details = CourseSerializer(source='course', read_only=True)
    
    class Meta:
        model = Result
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source='student', read_only=True)
    course_details = CourseSerializer(source='course', read_only=True)
    
    class Meta:
        model = Attendance
        fields = '__all__'

class NoticeSerializer(serializers.ModelSerializer):
    posted_by_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Notice
        fields = '__all__'
        
    def get_posted_by_details(self, obj):
        return {"id": obj.posted_by.id, "name": obj.posted_by.name}

class NewsEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsEvent
        fields = '__all__'

class AIPredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIPrediction
        fields = '__all__'

class ChatbotLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatbotLog
        fields = '__all__'

class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = '__all__'

class FeeRecordSerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source='student', read_only=True)
    
    class Meta:
        model = FeeRecord
        fields = '__all__'

class AssignmentSerializer(serializers.ModelSerializer):
    teacher_details = TeacherSerializer(source='teacher', read_only=True)
    course_details = CourseSerializer(source='course', read_only=True)
    
    class Meta:
        model = Assignment
        fields = '__all__'

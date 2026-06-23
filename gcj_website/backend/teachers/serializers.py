from rest_framework import serializers
from .models import Teacher, Course, Assignment, Timetable
from accounts.serializers import UserSerializer
from departments.serializers import DepartmentSerializer


class TeacherSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    department_details = DepartmentSerializer(source='department', read_only=True)

    class Meta:
        model = Teacher
        fields = ('id', 'user', 'user_details', 'designation', 'department', 'department_details', 'qualification', 'joining_date', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class CourseSerializer(serializers.ModelSerializer):
    department_details = DepartmentSerializer(source='department', read_only=True)

    class Meta:
        model = Course
        fields = ('id', 'name', 'code', 'department', 'department_details', 'credit_hours', 'semester', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class AssignmentSerializer(serializers.ModelSerializer):
    teacher_name = serializers.ReadOnlyField(source='teacher.user.name')
    course_code = serializers.ReadOnlyField(source='course.code')

    class Meta:
        model = Assignment
        fields = ('id', 'teacher', 'teacher_name', 'course', 'course_code', 'title', 'description', 'due_date', 'file_url', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class TimetableSerializer(serializers.ModelSerializer):
    course_name = serializers.ReadOnlyField(source='course.name')
    teacher_name = serializers.ReadOnlyField(source='teacher.user.name')

    class Meta:
        model = Timetable
        fields = ('id', 'course', 'course_name', 'teacher', 'teacher_name', 'day', 'start_time', 'end_time', 'room', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

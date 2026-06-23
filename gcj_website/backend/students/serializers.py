from rest_framework import serializers
from .models import Student, Result, Attendance, FeeRecord
from accounts.serializers import UserSerializer
from teachers.models import Course


class StudentSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Student
        fields = ('id', 'user', 'user_details', 'roll_no', 'matric_marks', 'inter_marks', 'district', 'program', 'admission_year', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_roll_no(self, value):
        if Student.objects.filter(roll_no=value).exclude(id=self.instance.id if self.instance else None).exists():
            raise serializers.ValidationError("A student with this roll number already exists.")
        return value


class ResultSerializer(serializers.ModelSerializer):
    student_roll = serializers.ReadOnlyField(source='student.roll_no')
    course_code = serializers.ReadOnlyField(source='course.code')

    class Meta:
        model = Result
        fields = ('id', 'student', 'student_roll', 'course', 'course_code', 'marks_obtained', 'total_marks', 'grade', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate(self, attrs):
        if attrs.get('marks_obtained', 0) > attrs.get('total_marks', 100):
            raise serializers.ValidationError("Marks obtained cannot exceed total marks.")
        return attrs


class AttendanceSerializer(serializers.ModelSerializer):
    student_roll = serializers.ReadOnlyField(source='student.roll_no')
    course_code = serializers.ReadOnlyField(source='course.code')

    class Meta:
        model = Attendance
        fields = ('id', 'student', 'student_roll', 'course', 'course_code', 'date', 'status', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class FeeRecordSerializer(serializers.ModelSerializer):
    student_roll = serializers.ReadOnlyField(source='student.roll_no')

    class Meta:
        model = FeeRecord
        fields = ('id', 'student', 'student_roll', 'amount', 'due_date', 'paid_date', 'status', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate(self, attrs):
        if attrs.get('status') == 'PAID' and not attrs.get('paid_date'):
            raise serializers.ValidationError("Paid date is required if the status is PAID.")
        return attrs

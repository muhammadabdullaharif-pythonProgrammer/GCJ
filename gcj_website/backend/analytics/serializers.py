from rest_framework import serializers


class AnalyticsSummarySerializer(serializers.Serializer):
    total_students = serializers.IntegerField()
    total_teachers = serializers.IntegerField()
    total_departments = serializers.IntegerField()
    total_admissions = serializers.IntegerField()


class DepartmentStatsSerializer(serializers.Serializer):
    department_name = serializers.CharField()
    student_count = serializers.IntegerField()
    teacher_count = serializers.IntegerField()
    total_seats = serializers.IntegerField()


class AdmissionStatsSerializer(serializers.Serializer):
    pending_count = serializers.IntegerField()
    approved_count = serializers.IntegerField()
    rejected_count = serializers.IntegerField()
    total_applications = serializers.IntegerField()

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.contrib.auth import get_user_model
from django.db.models import Count

from students.models import Student
from teachers.models import Teacher
from departments.models import Department
from admissions.models import Admission

from .serializers import AnalyticsSummarySerializer, DepartmentStatsSerializer, AdmissionStatsSerializer
from accounts.permissions import IsAdmin, IsTeacher

User = get_user_model()


class AnalyticsSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated, (IsAdmin | IsTeacher)]

    def get(self, request):
        data = {
            "total_students": Student.objects.count(),
            "total_teachers": Teacher.objects.count(),
            "total_departments": Department.objects.count(),
            "total_admissions": Admission.objects.count(),
        }
        serializer = AnalyticsSummarySerializer(data)
        return Response(serializer.data)


class DepartmentStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, (IsAdmin | IsTeacher)]

    def get(self, request):
        departments = Department.objects.all()
        stats = []
        for dept in departments:
            stats.append({
                "department_name": dept.name,
                "student_count": Student.objects.filter(program__icontains=dept.name[:5]).count(), # rough match
                "teacher_count": Teacher.objects.filter(department=dept).count(),
                "total_seats": dept.total_seats,
            })
        serializer = DepartmentStatsSerializer(stats, many=True)
        return Response(serializer.data)


class AdmissionStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, (IsAdmin | IsTeacher)]

    def get(self, request):
        admissions = Admission.objects.all()
        pending = admissions.filter(status='PENDING').count()
        approved = admissions.filter(status='APPROVED').count()
        rejected = admissions.filter(status='REJECTED').count()
        total = admissions.count()

        data = {
            "pending_count": pending,
            "approved_count": approved,
            "rejected_count": rejected,
            "total_applications": total,
        }
        serializer = AdmissionStatsSerializer(data)
        return Response(serializer.data)

from rest_framework import viewsets, permissions, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import Admission
from .serializers import AdmissionSerializer
from accounts.permissions import IsAdmin, IsTeacher


class IsAdminOrTeacher(IsAdmin, IsTeacher):
    def has_permission(self, request, view):
        return IsAdmin().has_permission(request, view) or IsTeacher().has_permission(request, view)



class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class AdmissionViewSet(viewsets.ModelViewSet):
    queryset = Admission.objects.all()
    serializer_class = AdmissionSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'department']
    search_fields = ['student__roll_no', 'student__user__name']
    ordering_fields = ['applied_date', 'merit_score']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Admission.objects.none()
        if user.role in ['ADMIN', 'TEACHER']:
            return Admission.objects.all()
        elif user.role == 'STUDENT':
            # Students can only see their own application
            return Admission.objects.filter(student__user=user)
        return Admission.objects.none()

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            # Restrict editing or deleting status / application to Admins and Teachers
            return [permissions.IsAuthenticated(), IsAdminOrTeacher]

        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save()

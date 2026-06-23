from rest_framework import viewsets, permissions, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from .models import Student, Result, Attendance, FeeRecord
from .serializers import StudentSerializer, ResultSerializer, AttendanceSerializer, FeeRecordSerializer
from accounts.permissions import IsAdmin, IsTeacher, IsStudent


class IsAdminOrTeacher(IsAdmin, IsTeacher):
    def has_permission(self, request, view):
        return IsAdmin().has_permission(request, view) or IsTeacher().has_permission(request, view)



class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['program', 'admission_year', 'district']
    search_fields = ['roll_no', 'user__name', 'user__email']
    ordering_fields = ['roll_no', 'admission_year', 'created_at']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Student.objects.none()
        if user.role == 'ADMIN':
            return Student.objects.all()
        elif user.role == 'TEACHER':
            return Student.objects.all()
        elif user.role == 'STUDENT':
            # Students can only view their own profile
            return Student.objects.filter(user=user)
        return Student.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [permissions.IsAuthenticated(), IsAdmin()]
        elif self.action in ['update', 'partial_update']:
            # Admin can edit all, student can edit their own (we enforce this in get_queryset or override)
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        try:
            student = Student.objects.get(user=request.user)
            serializer = self.get_serializer(student)
            return Response(serializer.data)
        except Student.DoesNotExist:
            return Response({"detail": "Student profile not found."}, status=status.HTTP_404_NOT_FOUND)


class ResultViewSet(viewsets.ModelViewSet):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['course', 'grade']
    search_fields = ['student__roll_no', 'student__user__name', 'course__code']
    ordering_fields = ['created_at', 'marks_obtained']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Result.objects.none()
        if user.role in ['ADMIN', 'TEACHER']:
            return Result.objects.all()
        elif user.role == 'STUDENT':
            return Result.objects.filter(student__user=user)
        return Result.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), (IsAdmin | IsTeacher)]
        return [permissions.IsAuthenticated()]


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['course', 'status', 'date']
    search_fields = ['student__roll_no', 'course__code']
    ordering_fields = ['date', 'created_at']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Attendance.objects.none()
        if user.role in ['ADMIN', 'TEACHER']:
            return Attendance.objects.all()
        elif user.role == 'STUDENT':
            return Attendance.objects.filter(student__user=user)
        return Attendance.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), (IsAdmin | IsTeacher)]
        return [permissions.IsAuthenticated()]


class FeeRecordViewSet(viewsets.ModelViewSet):
    queryset = FeeRecord.objects.all()
    serializer_class = FeeRecordSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'due_date']
    search_fields = ['student__roll_no']
    ordering_fields = ['due_date', 'amount']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return FeeRecord.objects.none()
        if user.role == 'ADMIN':
            return FeeRecord.objects.all()
        elif user.role == 'TEACHER':
            return FeeRecord.objects.all()
        elif user.role == 'STUDENT':
            return FeeRecord.objects.filter(student__user=user)
        return FeeRecord.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsAdmin()]
        return [permissions.IsAuthenticated()]

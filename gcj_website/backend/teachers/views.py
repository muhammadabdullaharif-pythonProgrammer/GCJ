from rest_framework import viewsets, permissions, filters, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from .models import Teacher, Course, Assignment, Timetable
from .serializers import TeacherSerializer, CourseSerializer, AssignmentSerializer, TimetableSerializer
from accounts.permissions import IsAdmin, IsTeacher


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['department', 'designation']
    search_fields = ['user__name', 'user__email', 'qualification']
    ordering_fields = ['joining_date', 'created_at']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Teacher.objects.none()
        if user.role in ['ADMIN', 'TEACHER']:
            return Teacher.objects.all()
        # Students can view teachers list
        elif user.role == 'STUDENT':
            return Teacher.objects.all()
        return Teacher.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [permissions.IsAuthenticated(), IsAdmin()]
        elif self.action in ['update', 'partial_update']:
            # Admin can edit all, teacher can edit their own
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        try:
            teacher = Teacher.objects.get(user=request.user)
            serializer = self.get_serializer(teacher)
            return Response(serializer.data)
        except Teacher.DoesNotExist:
            return Response({"detail": "Teacher profile not found."}, status=status.HTTP_404_NOT_FOUND)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['department', 'semester']
    search_fields = ['name', 'code']
    ordering_fields = ['code', 'created_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsAdmin()]
        return [permissions.IsAuthenticated()]


class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['course', 'teacher']
    search_fields = ['title', 'description']
    ordering_fields = ['due_date', 'created_at']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Assignment.objects.none()
        if user.role in ['ADMIN', 'TEACHER']:
            return Assignment.objects.all()
        elif user.role == 'STUDENT':
            # Students can view assignments for enrolled courses
            return Assignment.objects.all()
        return Assignment.objects.none()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), (IsAdmin | IsTeacher)]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        if self.request.user.role == 'TEACHER':
            teacher = Teacher.objects.get(user=self.request.user)
            serializer.save(teacher=teacher)
        else:
            serializer.save()


class TimetableViewSet(viewsets.ModelViewSet):
    queryset = Timetable.objects.all()
    serializer_class = TimetableSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['day', 'course', 'teacher']
    search_fields = ['room']
    ordering_fields = ['start_time', 'day']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsAdmin()]
        return [permissions.IsAuthenticated()]

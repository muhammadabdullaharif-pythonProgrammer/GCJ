from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import (
    Department, Teacher, Student, Course, Enrollment, Timetable,
    Admission, Result, Attendance, Notice, NewsEvent,
    AIPrediction, ChatbotLog, Gallery, FeeRecord, Assignment
)
from .serializers import (
    DepartmentSerializer, TeacherSerializer, StudentSerializer, CourseSerializer,
    EnrollmentSerializer, TimetableSerializer, AdmissionSerializer, ResultSerializer,
    AttendanceSerializer, NoticeSerializer, NewsEventSerializer,
    AIPredictionSerializer, ChatbotLogSerializer, GallerySerializer,
    FeeRecordSerializer, AssignmentSerializer
)


class IsAdminOrFaculty(permissions.BasePermission):
    """Allow admins and faculty members to manage resources."""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if hasattr(request.user, 'role') and request.user.role:
            return request.user.role.role_name in ['Administrator', 'Faculty Member']
        return request.user.is_staff


class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    """Departments are publicly readable."""
    queryset = Department.objects.all().order_by('name')
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.AllowAny]


class TeacherViewSet(viewsets.ReadOnlyModelViewSet):
    """Teacher profiles are publicly readable."""
    queryset = Teacher.objects.select_related('user', 'department').all()
    serializer_class = TeacherSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Teacher.objects.select_related('user', 'department').all()
        dept_id = self.request.query_params.get('department_id')
        if dept_id:
            queryset = queryset.filter(department_id=dept_id)
        return queryset


class StudentViewSet(viewsets.ModelViewSet):
    """Students are managed by admins; students can view their own record."""
    queryset = Student.objects.select_related('user').all()
    serializer_class = StudentSerializer
    permission_classes = [IsAdminOrFaculty]


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    """Courses are publicly readable with optional dept/semester filtering."""
    queryset = Course.objects.select_related('department').all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Course.objects.select_related('department').all()
        dept_id = self.request.query_params.get('department_id')
        semester = self.request.query_params.get('semester')
        if dept_id:
            queryset = queryset.filter(department_id=dept_id)
        if semester:
            queryset = queryset.filter(semester=semester)
        return queryset


class EnrollmentViewSet(viewsets.ModelViewSet):
    """Enrollments managed by admin/faculty."""
    queryset = Enrollment.objects.select_related('student', 'course').all()
    serializer_class = EnrollmentSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [IsAdminOrFaculty()]


class TimetableViewSet(viewsets.ReadOnlyModelViewSet):
    """Timetable publicly visible; filterable by course or day."""
    queryset = Timetable.objects.select_related('course', 'teacher').all()
    serializer_class = TimetableSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Timetable.objects.select_related('course', 'teacher').all()
        course_id = self.request.query_params.get('course_id')
        day = self.request.query_params.get('day')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        if day:
            queryset = queryset.filter(day=day)
        return queryset


class AdmissionViewSet(viewsets.ModelViewSet):
    """Anyone can submit; only admin/faculty can list/update/delete."""
    queryset = Admission.objects.select_related('student', 'department').all()
    serializer_class = AdmissionSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [IsAdminOrFaculty()]


class ResultViewSet(viewsets.ModelViewSet):
    """Faculty upload results; students can read their own."""
    queryset = Result.objects.select_related('student', 'course').all()
    serializer_class = ResultSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [IsAdminOrFaculty()]


class AttendanceViewSet(viewsets.ModelViewSet):
    """Faculty mark attendance; students view their own."""
    queryset = Attendance.objects.select_related('student', 'course').all()
    serializer_class = AttendanceSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [IsAdminOrFaculty()]

    def get_queryset(self):
        queryset = Attendance.objects.select_related('student', 'course').all()
        student_id = self.request.query_params.get('student_id')
        course_id = self.request.query_params.get('course_id')
        date = self.request.query_params.get('date')
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        if date:
            queryset = queryset.filter(date=date)
        return queryset


class NoticeViewSet(viewsets.ModelViewSet):
    """Notices publicly readable; only admin/faculty create/update."""
    queryset = Notice.objects.select_related('posted_by').order_by('-created_at').all()
    serializer_class = NoticeSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminOrFaculty()]

    def get_queryset(self):
        queryset = Notice.objects.select_related('posted_by').order_by('-created_at')
        target_role = self.request.query_params.get('target_role')
        if target_role:
            queryset = queryset.filter(target_role__in=[target_role, 'All'])
        return queryset


class NewsEventViewSet(viewsets.ReadOnlyModelViewSet):
    """News and events are publicly readable."""
    queryset = NewsEvent.objects.order_by('-event_date').all()
    serializer_class = NewsEventSerializer
    permission_classes = [permissions.AllowAny]


class AIPredictionViewSet(viewsets.ModelViewSet):
    """AI predictions managed by admin/faculty."""
    queryset = AIPrediction.objects.select_related('student').all()
    serializer_class = AIPredictionSerializer
    permission_classes = [IsAdminOrFaculty]


class ChatbotLogViewSet(viewsets.ModelViewSet):
    """Chatbot logs — any session can POST, admins read all."""
    queryset = ChatbotLog.objects.all().order_by('-created_at')
    serializer_class = ChatbotLogSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [IsAdminOrFaculty()]


class GalleryViewSet(viewsets.ModelViewSet):
    """Gallery publicly readable; admin/faculty can upload."""
    queryset = Gallery.objects.select_related('uploaded_by').all()
    serializer_class = GallerySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminOrFaculty()]

    def get_queryset(self):
        queryset = Gallery.objects.select_related('uploaded_by').all()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class FeeRecordViewSet(viewsets.ModelViewSet):
    """Fee records visible to authenticated users; admin manages all."""
    queryset = FeeRecord.objects.select_related('student').all()
    serializer_class = FeeRecordSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [IsAdminOrFaculty()]


class AssignmentViewSet(viewsets.ModelViewSet):
    """Assignments publicly readable; faculty create/update."""
    queryset = Assignment.objects.select_related('teacher', 'course').all()
    serializer_class = AssignmentSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [IsAdminOrFaculty()]

    def get_queryset(self):
        queryset = Assignment.objects.select_related('teacher', 'course').all()
        course_id = self.request.query_params.get('course_id')
        teacher_id = self.request.query_params.get('teacher_id')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        return queryset

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DepartmentViewSet,
    TeacherViewSet,
    StudentViewSet,
    CourseViewSet,
    EnrollmentViewSet,
    TimetableViewSet,
    AdmissionViewSet,
    ResultViewSet,
    AttendanceViewSet,
    NoticeViewSet,
    NewsEventViewSet,
    AIPredictionViewSet,
    ChatbotLogViewSet,
    GalleryViewSet,
    FeeRecordViewSet,
    AssignmentViewSet,
)

router = DefaultRouter()
router.register(r'departments',   DepartmentViewSet,   basename='department')
router.register(r'teachers',      TeacherViewSet,      basename='teacher')
router.register(r'students',      StudentViewSet,      basename='student')
router.register(r'courses',       CourseViewSet,       basename='course')
router.register(r'enrollments',   EnrollmentViewSet,   basename='enrollment')
router.register(r'timetable',     TimetableViewSet,    basename='timetable')
router.register(r'admissions',    AdmissionViewSet,    basename='admission')
router.register(r'results',       ResultViewSet,       basename='result')
router.register(r'attendance',    AttendanceViewSet,   basename='attendance')
router.register(r'notices',       NoticeViewSet,       basename='notice')
router.register(r'news-events',   NewsEventViewSet,    basename='news-event')
router.register(r'ai-predictions',AIPredictionViewSet, basename='ai-prediction')
router.register(r'chatbot-logs',  ChatbotLogViewSet,   basename='chatbot-log')
router.register(r'gallery',       GalleryViewSet,      basename='gallery')
router.register(r'fee-records',   FeeRecordViewSet,    basename='fee-record')
router.register(r'assignments',   AssignmentViewSet,   basename='assignment')

urlpatterns = [
    path('', include(router.urls)),
]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeacherViewSet, CourseViewSet, AssignmentViewSet, TimetableViewSet

router = DefaultRouter()
router.register(r'profiles', TeacherViewSet, basename='teacher-profile')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'assignments', AssignmentViewSet, basename='assignment')
router.register(r'timetable', TimetableViewSet, basename='timetable')

urlpatterns = [
    path('', include(router.urls)),
]

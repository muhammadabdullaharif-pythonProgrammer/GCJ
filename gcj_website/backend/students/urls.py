from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, ResultViewSet, AttendanceViewSet, FeeRecordViewSet

router = DefaultRouter()
router.register(r'profiles', StudentViewSet, basename='student-profile')
router.register(r'results', ResultViewSet, basename='student-result')
router.register(r'attendance', AttendanceViewSet, basename='student-attendance')
router.register(r'fees', FeeRecordViewSet, basename='student-fee')

urlpatterns = [
    path('', include(router.urls)),
]

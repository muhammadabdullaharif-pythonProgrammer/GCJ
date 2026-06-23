from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdmissionViewSet

router = DefaultRouter()
router.register(r'', AdmissionViewSet, basename='admission')

urlpatterns = [
    path('', include(router.urls)),
]

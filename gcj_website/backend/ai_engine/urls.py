from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AIPredictView

urlpatterns = [
    path('predict/', AIPredictView.as_view(), name='ai-predict'),
]

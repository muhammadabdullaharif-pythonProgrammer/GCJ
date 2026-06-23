from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatbotLogViewSet, ChatbotMessageView

router = DefaultRouter()
router.register(r'logs', ChatbotLogViewSet, basename='chatbotlog')

urlpatterns = [
    path('message/', ChatbotMessageView.as_view(), name='chatbot-message'),
    path('', include(router.urls)),
]

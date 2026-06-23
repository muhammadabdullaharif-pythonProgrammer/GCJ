from django.urls import path
from .views import AIAdvisorQueryView

urlpatterns = [
    path('query/', AIAdvisorQueryView.as_view(), name='ai_advisor_query'),
]

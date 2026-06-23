from django.urls import path
from .views import AnalyticsSummaryView, DepartmentStatsView, AdmissionStatsView

urlpatterns = [
    path('summary/', AnalyticsSummaryView.as_view(), name='analytics-summary'),
    path('departments/', DepartmentStatsView.as_view(), name='analytics-departments'),
    path('admissions/', AdmissionStatsView.as_view(), name='analytics-admissions'),
]

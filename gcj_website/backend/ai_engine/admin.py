from django.contrib import admin
from .models import AIPrediction


@admin.register(AIPrediction)
class AIPredictionAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'prediction_type', 'model_used', 'confidence_score', 'created_at')
    search_fields = ('student__roll_no',)
    list_filter = ('prediction_type', 'model_used', 'created_at')

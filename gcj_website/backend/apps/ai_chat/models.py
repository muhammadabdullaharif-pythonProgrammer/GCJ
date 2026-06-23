"""
AI Chat App - Models (Chatbot + Predictions)
GCJ Website
"""
from django.db import models
from django.conf import settings
import uuid


class ChatbotSession(models.Model):
    """Chatbot conversation sessions"""
    session_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, db_index=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='chatbot_sessions'
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'chatbot_sessions'
        ordering = ['-created_at']


class ChatbotLog(models.Model):
    """Individual chatbot messages and responses"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='chatbot_logs'
    )
    session_id = models.UUIDField(db_index=True)
    message = models.TextField()
    response = models.TextField()
    model_used = models.CharField(max_length=100, default='gemini-1.5-pro')
    tokens_used = models.PositiveIntegerField(null=True, blank=True)
    response_time_ms = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chatbot_logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['session_id']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f'Chat {self.session_id} at {self.created_at}'


class AIPrediction(models.Model):
    """AI/ML predictions for student performance and admissions"""
    PREDICTION_TYPE_CHOICES = [
        ('admission_merit', 'Admission Merit Prediction'),
        ('performance', 'Academic Performance Prediction'),
        ('dropout_risk', 'Dropout Risk Assessment'),
        ('grade_prediction', 'Grade Prediction'),
    ]

    student = models.ForeignKey(
        'students.Student', on_delete=models.CASCADE, related_name='ai_predictions'
    )
    prediction_type = models.CharField(max_length=30, choices=PREDICTION_TYPE_CHOICES, db_index=True)
    input_json = models.JSONField(help_text='Input features for the model')
    output_json = models.JSONField(help_text='Model output and recommendations')
    model_used = models.CharField(max_length=100, help_text='AI model name/version')
    confidence_score = models.DecimalField(max_digits=5, decimal_places=4, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ai_predictions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['student']),
            models.Index(fields=['prediction_type']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f'{self.prediction_type} for {self.student} at {self.created_at}'

from django.db import models
from students.models import Student


class AIPrediction(models.Model):
    PREDICTION_TYPE_CHOICES = (
        ('ELIGIBILITY', 'Admission Eligibility'),
        ('RECOMMENDATION', 'Department Recommendation'),
    )

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='ai_predictions')
    prediction_type = models.CharField(max_length=30, choices=PREDICTION_TYPE_CHOICES, default='ELIGIBILITY', db_index=True)
    input_json = models.JSONField()
    output_json = models.JSONField()
    model_used = models.CharField(max_length=100, default='gemini-1.5-flash')
    confidence_score = models.FloatField(default=0.85)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ai_predictions_new'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.roll_no} - {self.prediction_type}"

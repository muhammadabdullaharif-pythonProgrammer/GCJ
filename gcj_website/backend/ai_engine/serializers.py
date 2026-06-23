from rest_framework import serializers
from .models import AIPrediction
from students.serializers import StudentSerializer


class AIPredictionSerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source='student', read_only=True)

    class Meta:
        model = AIPrediction
        fields = ('id', 'student', 'student_details', 'prediction_type', 'input_json', 'output_json', 'model_used', 'confidence_score', 'created_at', 'updated_at')
        read_only_fields = ('id', 'output_json', 'created_at', 'updated_at')

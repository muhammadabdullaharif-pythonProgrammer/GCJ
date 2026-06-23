import sys
import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.conf import settings
from students.models import Student
from .models import AIPrediction
from .serializers import AIPredictionSerializer

# Add monorepo root to import path so we can access ai_engine
MONOREPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
if MONOREPO_ROOT not in sys.path:
    sys.path.append(MONOREPO_ROOT)

from ai_engine.predict import predict_admission


class AIPredictView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        student_id = request.data.get('student')
        
        # If student ID is provided, query from database.
        if student_id:
            try:
                student = Student.objects.get(id=student_id)
                student_data = {
                    'matric_marks': student.matric_marks,
                    'inter_marks': student.inter_marks,
                    'age': 18,  # Default age if not in student model
                    'district': student.district,
                    'subjects_combo': student.program,  # Program maps to combo
                    'career_interest': 'Software Engineer'  # Default career interest
                }
            except Student.DoesNotExist:
                return Response({"error": f"Student with ID {student_id} not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Fallback to direct parameters from POST body
            student_data = {
                'matric_marks': request.data.get('matric_marks'),
                'inter_marks': request.data.get('inter_marks'),
                'age': request.data.get('age', 18),
                'district': request.data.get('district'),
                'subjects_combo': request.data.get('subjects_combo'),
                'career_interest': request.data.get('career_interest', 'Software Engineer')
            }
            # Verify required parameters
            required = ['matric_marks', 'inter_marks', 'district', 'subjects_combo']
            for field in required:
                if student_data[field] is None:
                    return Response({"error": f"Field '{field}' is required if 'student' ID is not provided."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Retrieve or mock a student profile for table log
            student = Student.objects.first() # log under first student if raw inputs

        if not student:
            return Response({"error": "No students exist in database to link prediction record."}, status=status.HTTP_400_BAD_REQUEST)

        # Run model prediction
        prediction_result = predict_admission(student_data)

        # Save to database
        db_prediction = AIPrediction.objects.create(
            student=student,
            prediction_type='ELIGIBILITY',
            input_json=student_data,
            output_json=prediction_result,
            model_used=prediction_result.get('advice', '').startswith('[Rules-Based') and 'rules-fallback' or 'gemini-1.5-flash',
            confidence_score=prediction_result.get('probability', 0.85)
        )

        serializer = AIPredictionSerializer(db_prediction)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

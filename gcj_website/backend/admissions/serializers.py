from rest_framework import serializers
from .models import Admission
from students.serializers import StudentSerializer
from departments.serializers import DepartmentSerializer


class AdmissionSerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source='student', read_only=True)
    department_details = DepartmentSerializer(source='department', read_only=True)

    class Meta:
        model = Admission
        fields = ('id', 'student', 'student_details', 'department', 'department_details', 'status', 'applied_date', 'merit_score', 'ai_recommendation', 'created_at', 'updated_at')
        read_only_fields = ('id', 'applied_date', 'ai_recommendation', 'created_at', 'updated_at')

    def validate(self, attrs):
        student = attrs.get('student')
        if not student:
            raise serializers.ValidationError("Student record is required.")
        
        # Auto calculate merit score based on Student's matric and inter marks
        # Formula: 40% matric + 60% inter
        matric = student.matric_marks
        inter = student.inter_marks
        
        # Normalizing to a 100-point scale assuming max is 1100
        merit = (matric / 1100.0 * 40.0) + (inter / 1100.0 * 60.0)
        attrs['merit_score'] = round(merit, 2)
        
        return attrs

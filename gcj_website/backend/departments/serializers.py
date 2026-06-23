from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Department
from accounts.serializers import UserSerializer

User = get_user_model()


class DepartmentSerializer(serializers.ModelSerializer):
    hod_details = UserSerializer(source='hod', read_only=True)

    class Meta:
        model = Department
        fields = ('id', 'name', 'description', 'hod', 'hod_details', 'total_seats', 'image_url', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_hod(self, value):
        if value and value.role not in ['TEACHER', 'ADMIN']:
            raise serializers.ValidationError("Only users with role TEACHER or ADMIN can be HOD of a department.")
        return value

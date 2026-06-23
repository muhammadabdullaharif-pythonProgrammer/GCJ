from rest_framework import serializers
from .models import Gallery
from accounts.serializers import UserSerializer


class GallerySerializer(serializers.ModelSerializer):
    uploaded_by_details = UserSerializer(source='uploaded_by', read_only=True)

    class Meta:
        model = Gallery
        fields = ('id', 'image_url', 'caption', 'category', 'uploaded_by', 'uploaded_by_details', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

from rest_framework import serializers
from .models import NewsEvent


class NewsEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsEvent
        fields = ('id', 'title', 'body', 'event_date', 'image_url', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

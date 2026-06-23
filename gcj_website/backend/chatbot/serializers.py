from rest_framework import serializers
from .models import ChatbotLog
from accounts.serializers import UserSerializer


class ChatbotLogSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = ChatbotLog
        fields = ('id', 'user', 'user_details', 'session_id', 'message', 'response', 'created_at')
        read_only_fields = ('id', 'created_at')

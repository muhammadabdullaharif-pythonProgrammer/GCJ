from rest_framework import serializers
from .models import Notice
from accounts.serializers import UserSerializer


class NoticeSerializer(serializers.ModelSerializer):
    posted_by_details = UserSerializer(source='posted_by', read_only=True)

    class Meta:
        model = Notice
        fields = ('id', 'title', 'content', 'posted_by', 'posted_by_details', 'target_role', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

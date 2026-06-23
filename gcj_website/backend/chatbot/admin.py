from django.contrib import admin
from .models import ChatbotLog


@admin.register(ChatbotLog)
class ChatbotLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'session_id', 'message', 'response', 'created_at')
    search_fields = ('message', 'response', 'session_id')
    list_filter = ('created_at',)

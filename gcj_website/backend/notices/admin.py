from django.contrib import admin
from .models import Notice


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'posted_by', 'target_role', 'created_at')
    search_fields = ('title', 'content')
    list_filter = ('target_role', 'created_at')

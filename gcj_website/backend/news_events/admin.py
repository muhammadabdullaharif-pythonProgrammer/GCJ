from django.contrib import admin
from .models import NewsEvent


@admin.register(NewsEvent)
class NewsEventAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'event_date', 'created_at')
    search_fields = ('title', 'body')
    list_filter = ('event_date', 'created_at')

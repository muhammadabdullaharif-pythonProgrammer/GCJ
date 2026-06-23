from django.contrib import admin
from .models import Gallery


@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ('id', 'caption', 'category', 'uploaded_by', 'created_at')
    search_fields = ('caption',)
    list_filter = ('category', 'created_at')

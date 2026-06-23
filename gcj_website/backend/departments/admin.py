from django.contrib import admin
from .models import Department


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'hod', 'total_seats', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('created_at', 'total_seats')
    ordering = ('name',)

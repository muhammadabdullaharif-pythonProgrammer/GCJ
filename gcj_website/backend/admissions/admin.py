from django.contrib import admin
from .models import Admission


@admin.register(Admission)
class AdmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'department', 'status', 'applied_date', 'merit_score')
    search_fields = ('student__roll_no', 'student__user__name')
    list_filter = ('status', 'department')

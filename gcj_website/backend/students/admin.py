from django.contrib import admin
from .models import Student, Result, Attendance, FeeRecord


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('id', 'roll_no', 'user', 'program', 'admission_year')
    search_fields = ('roll_no', 'user__name', 'user__email')
    list_filter = ('program', 'admission_year')


@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'course', 'marks_obtained', 'total_marks', 'grade')
    search_fields = ('student__roll_no', 'course__code')
    list_filter = ('grade',)


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'course', 'date', 'status')
    search_fields = ('student__roll_no', 'course__code')
    list_filter = ('status', 'date')


@admin.register(FeeRecord)
class FeeRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'amount', 'due_date', 'status')
    search_fields = ('student__roll_no',)
    list_filter = ('status', 'due_date')

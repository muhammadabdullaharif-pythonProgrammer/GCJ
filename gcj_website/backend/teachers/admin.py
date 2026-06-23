from django.contrib import admin
from .models import Teacher, Course, Assignment, Timetable


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'designation', 'department', 'joining_date')
    search_fields = ('user__name', 'user__email', 'qualification')
    list_filter = ('designation', 'department')


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'code', 'department', 'credit_hours', 'semester')
    search_fields = ('name', 'code')
    list_filter = ('department', 'semester')


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'course', 'teacher', 'due_date')
    search_fields = ('title', 'course__name', 'course__code')
    list_filter = ('due_date',)


@admin.register(Timetable)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ('id', 'course', 'teacher', 'day', 'start_time', 'end_time', 'room')
    search_fields = ('room', 'course__code')
    list_filter = ('day',)

"""
Root URL Configuration for gcj_backend.
Routes all api/auth/ endpoints to accounts app.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Authentication Endpoints
    path('api/auth/', include('accounts.urls')),

    # Main API Root (api/v1)
    path('api/v1/students/', include('students.urls')),
    path('api/v1/teachers/', include('teachers.urls')),
    path('api/v1/departments/', include('departments.urls')),
    path('api/v1/admissions/', include('admissions.urls')),
    path('api/v1/notices/', include('notices.urls')),
    path('api/v1/news_events/', include('news_events.urls')),
    path('api/v1/gallery/', include('gallery.urls')),
    path('api/v1/chatbot/', include('chatbot.urls')),
    path('api/v1/analytics/', include('analytics.urls')),
    path('api/v1/ai/', include('ai_engine.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

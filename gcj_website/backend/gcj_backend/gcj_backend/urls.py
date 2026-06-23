from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints version 1
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/portal/', include('portal.urls')),
    path('api/v1/advisor/', include('ai_assistant.urls')),
]

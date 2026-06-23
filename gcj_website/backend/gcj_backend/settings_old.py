
import os
import shutil

base_dir = '/mnt/agents/output/gcj_website_v2/backend'

# Create all other project files

# gcj_backend/__init__.py
open(os.path.join(base_dir, 'gcj_backend', '__init__.py'), 'w').close()

# gcj_backend/urls.py
urls_py = '''"""gcj_backend URL Configuration"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/students/', include('students.urls')),
    path('api/teachers/', include('teachers.urls')),
    path('api/departments/', include('departments.urls')),
    path('api/admissions/', include('admissions.urls')),
    path('api/notices/', include('notices.urls')),
    path('api/news-events/', include('news_events.urls')),
    path('api/gallery/', include('gallery.urls')),
    path('api/chatbot/', include('chatbot.urls')),
    path('api/ai-engine/', include('ai_engine.urls')),
    path('api/analytics/', include('analytics.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
'''
with open(os.path.join(base_dir, 'gcj_backend', 'urls.py'), 'w') as f:
    f.write(urls_py)

# gcj_backend/wsgi.py
wsgi_py = '''"""WSGI config for gcj_backend project."""
import os
from django.core.wsgi import get_wsgi_application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gcj_backend.settings')
application = get_wsgi_application()
'''
with open(os.path.join(base_dir, 'gcj_backend', 'wsgi.py'), 'w') as f:
    f.write(wsgi_py)

# gcj_backend/asgi.py
asgi_py = '''"""ASGI config for gcj_backend project."""
import os
from django.core.asgi import get_asgi_application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gcj_backend.settings')
application = get_asgi_application()
'''
with open(os.path.join(base_dir, 'gcj_backend', 'asgi.py'), 'w') as f:
    f.write(asgi_py)

# manage.py
manage_py = '''#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gcj_backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
'''
with open(os.path.join(base_dir, 'manage.py'), 'w') as f:
    f.write(manage_py)

# Create all app files
apps = {
    'accounts': 'AccountsConfig',
    'students': 'StudentsConfig',
    'teachers': 'TeachersConfig',
    'departments': 'DepartmentsConfig',
    'admissions': 'AdmissionsConfig',
    'notices': 'NoticesConfig',
    'news_events': 'NewsEventsConfig',
    'gallery': 'GalleryConfig',
    'chatbot': 'ChatbotConfig',
    'ai_engine': 'AiEngineConfig',
    'analytics': 'AnalyticsConfig',
}

for app_name, config_name in apps.items():
    app_dir = os.path.join(base_dir, app_name)
    
    open(os.path.join(app_dir, '__init__.py'), 'w').close()
    
    apps_py = f'''from django.apps import AppConfig

class {config_name}(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = '{app_name}'
'''
    with open(os.path.join(app_dir, 'apps.py'), 'w') as f:
        f.write(apps_py)
    
    admin_py = f'''from django.contrib import admin
# Register your models here.
'''
    with open(os.path.join(app_dir, 'admin.py'), 'w') as f:
        f.write(admin_py)
    
    models_py = f'''from django.db import models
# Create your models here.
'''
    with open(os.path.join(app_dir, 'models.py'), 'w') as f:
        f.write(models_py)
    
    views_py = f'''from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def health_check(request):
    return Response({{"status": "ok", "app": "{app_name}"}})
'''
    with open(os.path.join(app_dir, 'views.py'), 'w') as f:
        f.write(views_py)
    
    urls_py = f'''from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='{app_name}-health'),
]
'''
    with open(os.path.join(app_dir, 'urls.py'), 'w') as f:
        f.write(urls_py)
    
    tests_py = f'''from django.test import TestCase
# Create your tests here.
'''
    with open(os.path.join(app_dir, 'tests.py'), 'w') as f:
        f.write(tests_py)
    
    serializers_py = f'''from rest_framework import serializers
# Create your serializers here.
'''
    with open(os.path.join(app_dir, 'serializers.py'), 'w') as f:
        f.write(serializers_py)
    
    open(os.path.join(app_dir, 'migrations', '__init__.py'), 'w').close()

# requirements.txt
requirements = '''Django>=4.2,<5.0
djangorestframework>=3.14.0
djangorestframework-simplejwt>=5.3.0
django-cors-headers>=4.3.0
django-filter>=23.5
whitenoise>=6.6.0
Pillow>=10.1.0
celery>=5.3.0
redis>=5.0.0
python-dotenv>=1.0.0
'''
with open(os.path.join(base_dir, '..', 'requirements.txt'), 'w') as f:
    f.write(requirements)

# .env
env_content = '''DEBUG=True
SECRET_KEY=django-insecure-gcj-dev-key-123456789
'''
with open(os.path.join(base_dir, '..', '.env'), 'w') as f:
    f.write(env_content)

# Create zip
zip_path = '/mnt/agents/output/gcj_website_v2'
if os.path.exists(zip_path + '.zip'):
    os.remove(zip_path + '.zip')
shutil.make_archive(zip_path, 'zip', '/mnt/agents/output/gcj_website_v2')

print("✅ Complete project v2 created!")
print(f"📦 ZIP: {zip_path}.zip")
print(f"📦 Size: {os.path.getsize(zip_path + '.zip') / 1024:.1f} KB")

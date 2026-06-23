"""
Django Settings - Development
"""
from .base import *

DEBUG = True
ALLOWED_HOSTS = ['*']

# Development-specific installed apps
INSTALLED_APPS += ['django_extensions']

# Use SQLite for quick dev if needed (comment out for MySQL)
# DATABASES['default']['ENGINE'] = 'django.db.backends.sqlite3'
# DATABASES['default']['NAME'] = BASE_DIR / 'db.sqlite3'

# Email - Print to console in development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# CORS - Allow all in development
CORS_ALLOW_ALL_ORIGINS = True

# Debug Toolbar (optional)
# INSTALLED_APPS += ['debug_toolbar']
# MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']

# Disable caching in dev
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

# Static files served by Django in dev
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

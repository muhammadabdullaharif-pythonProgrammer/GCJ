settings_content = r'''
"""
GCJ Backend - Django Settings
"""

from pathlib import Path
from datetime import timedelta

BASE_DIR = Path(**file**).resolve().parent.parent

SECRET_KEY = "django-insecure-gcj-dev-key"

DEBUG = True

ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
"jazzmin",

```
# Django Apps

"django.contrib.admin",
"django.contrib.auth",
"django.contrib.contenttypes",
"django.contrib.sessions",
"django.contrib.messages",
"django.contrib.staticfiles",

# Third-Party Apps
"rest_framework",
"rest_framework_simplejwt",
"rest_framework_simplejwt.token_blacklist",
"corsheaders",
"django_filters",

# Project Apps
"accounts",
"students",
"teachers",
"departments",
"admissions",
"notices",
"news_events",
"gallery",
"chatbot",
"ai_engine",
"analytics",
```

]

MIDDLEWARE = [
"corsheaders.middleware.CorsMiddleware",
"django.middleware.security.SecurityMiddleware",
"django.contrib.sessions.middleware.SessionMiddleware",
"django.middleware.common.CommonMiddleware",
"django.middleware.csrf.CsrfViewMiddleware",
"django.contrib.auth.middleware.AuthenticationMiddleware",
"django.contrib.messages.middleware.MessageMiddleware",
"django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "gcj_backend.urls"

TEMPLATES = [
{
"BACKEND": "django.template.backends.django.DjangoTemplates",
"DIRS": [BASE_DIR / "templates"],
"APP_DIRS": True,
"OPTIONS": {
"context_processors": [
"django.template.context_processors.debug",
"django.template.context_processors.request",
"django.contrib.auth.context_processors.auth",
"django.contrib.messages.context_processors.messages",
],
},
},
]

WSGI_APPLICATION = "gcj_backend.wsgi.application"

DATABASES = {
"default": {
"ENGINE": "django.db.backends.sqlite3",
"NAME": BASE_DIR / "db.sqlite3",
}
}

AUTH_PASSWORD_VALIDATORS = [
{
"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
},
{
"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
},
{
"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
},
{
"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
},
]

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Karachi"

USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
"DEFAULT_AUTHENTICATION_CLASSES": [
"rest_framework_simplejwt.authentication.JWTAuthentication",
],
"DEFAULT_PERMISSION_CLASSES": [
"rest_framework.permissions.IsAuthenticated",
],
}

SIMPLE_JWT = {
"ACCESS_TOKEN_LIFETIME": timedelta(hours=24),
"REFRESH_TOKEN_LIFETIME": timedelta(days=7),
}

CORS_ALLOW_ALL_ORIGINS = True
'''

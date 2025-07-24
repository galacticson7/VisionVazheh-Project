import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'django-insecure-your-unique-secret-key'
DEBUG = True

ALLOWED_HOSTS = [
    "organic-happiness-7vxjr499r5763wwvp-8000.app.github.dev",
    "localhost",
    ".githubpreview.dev",
]

# --- START: تغییر اصلی و جدید برای تشخیص آدرس صحیح ---
USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
# --- END: تغییر اصلی ---

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'phonenumber_field',
    'rest_framework_simplejwt',
    'corsheaders',
    'users',
    'content',
    'progress',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'vision_vazheh_backend.urls'
TEMPLATES = [ { 'BACKEND': 'django.template.backends.django.DjangoTemplates', 'DIRS': [], 'APP_DIRS': True, 'OPTIONS': { 'context_processors': [ 'django.template.context_processors.debug', 'django.template.context_processors.request', 'django.contrib.auth.context_processors.auth', 'django.contrib.messages.context_processors.messages', ], }, }, ]
WSGI_APPLICATION = 'vision_vazheh_backend.wsgi.application'
DATABASES = { 'default': { 'ENGINE': 'django.db.backends.sqlite3', 'NAME': BASE_DIR / 'db.sqlite3', } }

AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', 'OPTIONS': { 'min_length': 8, } },
]

LANGUAGE_CODE = 'fa-ir'
TIME_ZONE = 'Asia/Tehran'
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'users.CustomUser'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
REST_FRAMEWORK = { 'DEFAULT_AUTHENTICATION_CLASSES': ('rest_framework_simplejwt.authentication.JWTAuthentication',) }

CORS_ALLOWED_ORIGINS = [
    "https://organic-happiness-7vxjr499r5763wwvp-5173.app.github.dev",
]
CSRF_TRUSTED_ORIGINS = [
    "https://organic-happiness-7vxjr499r5763wwvp-5173.app.github.dev",
    "https://organic-happiness-7vxjr499r5763wwvp-8000.app.github.dev",
]
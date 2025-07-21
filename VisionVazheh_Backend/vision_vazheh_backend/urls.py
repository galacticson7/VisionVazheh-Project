# vision_vazheh_backend/urls.py
from django.contrib import admin
from django.urls import path, include
# این دو خط برای سرویس‌دهی فایل‌های مدیا لازم است
from django.conf import settings
from django.conf.urls.static import static

from users.views import MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/', include('content.urls')),
    path('api/users/', include('users.urls')),
    path('api/progress/', include('progress.urls')),

    path('api/users/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/users/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# --- این بخش جدید، مشکل پخش صدا را برای همیشه حل می‌کند ---
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
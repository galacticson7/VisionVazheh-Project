# users/views.py

from rest_framework import generics, permissions
from .models import CustomUser
from .serializers import UserRegistrationSerializer, UserProfileSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class UserRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = []


class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# این کلاس باید اینجا تعریف شده باشد
class MyTokenObtainPairView(TokenObtainPairView):
    """
    یک ویو سفارشی برای لاگین که از سریالایزر سفارشی ما استفاده می‌کند.
    """
    serializer_class = MyTokenObtainPairSerializer
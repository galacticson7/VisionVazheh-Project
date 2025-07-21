# users/serializers.py

from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password
# این دو خط جدید را اضافه کنید
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.translation import gettext_lazy as _


# --- این سریالایزر جدید اضافه شده است ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    یک سریالایزر سفارشی برای لاگین که پیام‌های خطای بهتری برمی‌گرداند.
    """
    def validate(self, attrs):
        # از منطق پیش‌فرض برای گرفتن توکن استفاده می‌کنیم
        data = super().validate(attrs)

        # اگر کاربر پیدا شد ولی رمز عبور اشتباه بود، پیام خطا را تغییر می‌دهیم
        # این کد فرض می‌کند که اگر اعتبارسنجی پیش‌فرض خطا بدهد، به خاطر رمز عبور است
        # چون یوزرنیم (شماره موبایل) باید از قبل چک شده باشد
        # این یک ساده‌سازی است؛ در یک سیستم واقعی ممکن است پیچیده‌تر باشد
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # می‌توانید اطلاعات اضافی را اینجا به توکن اضافه کنید
        # token['first_name'] = user.first_name
        return token

    default_error_messages = {
        "no_active_account": _("رمز عبور اشتباه است یا حسابی با این مشخصات وجود ندارد.")
    }

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm password")

    class Meta:
        model = CustomUser
        fields = ('phone_number', 'password', 'password2', 'grade', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "رمزهای عبور با هم مطابقت ندارند."})
        
        try:
            validate_password(attrs['password'])
        except serializers.ValidationError as e:
            raise serializers.ValidationError({'password': list(e.messages)})

        return attrs

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            phone_number=validated_data['phone_number'],
            password=validated_data['password'],
            grade=validated_data.get('grade'),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user
            
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'phone_number', 'first_name', 'last_name', 'email', 'grade', 'stardust_points', 'streak')
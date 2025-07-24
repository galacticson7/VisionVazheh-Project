# users/serializers.py
from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.translation import gettext_lazy as _

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    # --- برای لاگین با نام کاربری، باید این فیلد را بازنویسی کنیم ---
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # می‌توانید اطلاعات اضافی را اینجا به توکن اضافه کنید
        token['username'] = user.username
        return token

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm password")

    class Meta:
        model = CustomUser
        # فیلدهای نام و نام خانوادگی با نام کاربری جایگزین شد
        fields = ('username', 'phone_number', 'password', 'password2', 'grade')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "رمزهای عبور با هم مطابقت ندارند."})
        return attrs

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            phone_number=validated_data['phone_number'],
            password=validated_data['password'],
            grade=validated_data.get('grade')
        )
        return user
            
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        # فیلدهای نام و نام خانوادگی با نام کاربری جایگزین شد
        fields = ('id', 'username', 'phone_number', 'grade', 'stardust_points', 'streak')

class UserRankingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        # فیلدهای نام و نام خانوادگی با نام کاربری جایگزین شد
        fields = ['id', 'username', 'stardust_points']
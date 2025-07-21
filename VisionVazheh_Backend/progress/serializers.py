# progress/serializers.py

from rest_framework import serializers
from .models import UserWord, Achievement, UserAchievement
# این خط اصلاح شد: آدرس صحیح به فایل serializers است
from content.serializers import WordSerializer

class UserWordSerializer(serializers.ModelSerializer):
    word = WordSerializer(read_only=True)
    class Meta:
        model = UserWord
        fields = ['id', 'word', 'added_at']

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['name', 'description', 'icon_name']

class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)
    class Meta:
        model = UserAchievement
        fields = ['id', 'achievement', 'earned_at']
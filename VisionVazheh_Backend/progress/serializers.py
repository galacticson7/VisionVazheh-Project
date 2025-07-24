# progress/serializers.py
from rest_framework import serializers
from .models import UserWord, Achievement, UserAchievement
from content.serializers import WordSerializer

class UserWordSerializer(serializers.ModelSerializer):
    word = WordSerializer(read_only=True)

    class Meta:
        model = UserWord
        # --- تغییر اصلی اینجاست: لیست فیلدها با مدل هماهنگ شد ---
        fields = ['id', 'user', 'word', 'learning_stage', 'next_review_at']

class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = serializers.StringRelatedField()

    class Meta:
        model = UserAchievement
        fields = ['id', 'user', 'achievement', 'earned_at']
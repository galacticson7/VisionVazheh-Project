# content/serializers.py
from rest_framework import serializers
from .models import Lesson, Word

class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['id', 'english_word', 'persian_meaning', 'phonetic', 'audio_pronunciation']

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        # فیلد جدید icon_name اضافه شد
        fields = ['id', 'title', 'lesson_number', 'grade', 'icon_name']
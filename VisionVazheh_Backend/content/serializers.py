# content/serializers.py
from rest_framework import serializers
from .models import Lesson, Word, ExampleSentence

class WordSerializer(serializers.ModelSerializer):
    # --- این بخش جدید اضافه شده است ---
    # یک فیلد جدید می‌سازیم که آدرس کامل فایل صوتی را برمی‌گرداند
    audio_pronunciation_url = serializers.SerializerMethodField()

    class Meta:
        model = Word
        # فیلدهای قبلی به همراه فیلد جدید
        fields = ['id', 'english_word', 'persian_meaning', 'phonetic', 'audio_pronunciation', 'audio_pronunciation_url']

    def get_audio_pronunciation_url(self, obj):
        # اگر فایل صوتی وجود داشت
        if obj.audio_pronunciation:
            # آدرس کامل آن را با استفاده از request می‌سازیم
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.audio_pronunciation.url)
        # اگر وجود نداشت، خالی برمی‌گردانیم
        return None

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'grade', 'lesson_number', 'icon_name']

class ExampleSentenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExampleSentence
        fields = '__all__'
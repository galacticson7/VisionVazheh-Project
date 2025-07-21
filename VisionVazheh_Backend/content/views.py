# content/views.py

from rest_framework import generics, views, response, status
from django.db.models import Q
import random
from .models import Lesson, Word
from .serializers import LessonSerializer, WordSerializer

# کلاس‌های قبلی بدون تغییر باقی می‌مانند
class LessonListView(generics.ListAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

class WordListView(generics.ListAPIView):
    serializer_class = WordSerializer
    def get_queryset(self):
        lesson_id = self.kwargs['lesson_id']
        return Word.objects.filter(lesson_id=lesson_id)

# --- این کلاس جدید اضافه شده است ---
class QuizView(views.APIView):
    """
    یک سؤال چهارگزینه‌ای برای یک درس مشخص ایجاد می‌کند.
    """
    # در آینده می‌توانیم این را به IsAuthenticated تغییر دهیم
    permission_classes = [] 

    def get(self, request, lesson_id, format=None):
        try:
            # ابتدا تمام لغات مربوط به درس مورد نظر را پیدا می‌کنیم
            words_in_lesson = list(Word.objects.filter(lesson_id=lesson_id))
            if len(words_in_lesson) < 4:
                return response.Response(
                    {"error": "برای ساخت آزمون، حداقل باید ۴ لغت در این درس وجود داشته باشد."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # یک لغت را به عنوان سؤال اصلی به صورت تصادفی انتخاب می‌کنیم
            correct_word = random.choice(words_in_lesson)
            
            # سه گزینه انحرافی و غیرتکراری از همان درس انتخاب می‌کنیم
            options = random.sample([word for word in words_in_lesson if word.id != correct_word.id], 3)
            
            # گزینه صحیح را به لیست گزینه‌ها اضافه می‌کنیم
            options.append(correct_word)
            
            # ترتیب گزینه‌ها را به هم می‌ریزیم تا جای گزینه صحیح همیشه ثابت نباشد
            random.shuffle(options)
            
            # داده‌ها را برای ارسال آماده می‌کنیم
            question_data = {
                'question_word': WordSerializer(correct_word).data,
                'options': WordSerializer(options, many=True).data,
            }
            return response.Response(question_data, status=status.HTTP_200_OK)

        except Lesson.DoesNotExist:
            return response.Response(
                {"error": "درسی با این مشخصات یافت نشد."},
                status=status.HTTP_404_NOT_FOUND
            )
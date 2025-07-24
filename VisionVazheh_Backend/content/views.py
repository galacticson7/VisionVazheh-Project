# content/views.py
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from .models import Lesson, Word
from .serializers import LessonSerializer, WordSerializer
from progress.models import UserLessonTestResult # --- ۱. مدل جدید اضافه شد
import random

class LessonListView(generics.ListAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated]

class WordListView(generics.ListAPIView):
    serializer_class = WordSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        lesson_id = self.kwargs.get('lesson_id')
        return Word.objects.filter(lesson_id=lesson_id)

# ... (QuizView قدیمی بدون تغییر باقی می‌ماند) ...
class QuizView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, lesson_id, format=None):
        try:
            lesson = Lesson.objects.get(pk=lesson_id)
        except Lesson.DoesNotExist:
            return Response({"error": "درسی با این مشخصات یافت نشد."}, status=status.HTTP_404_NOT_FOUND)
        
        words_in_lesson = list(lesson.words.all())
        if len(words_in_lesson) < 4:
            return Response({"error": "این درس به تعداد کافی (حداقل ۴) لغت برای ایجاد کوییز ندارد."}, status=status.HTTP_400_BAD_REQUEST)
        
        correct_word = random.choice(words_in_lesson)
        words_in_lesson.remove(correct_word)
        options = random.sample(words_in_lesson, 3)
        options.append(correct_word)
        random.shuffle(options)
        
        question = {
            'word': WordSerializer(correct_word).data,
            'options': WordSerializer(options, many=True).data,
        }
        return Response(question)

# --- ۲. این View جدید و هوشمند به انتهای فایل اضافه می‌شود ---
class LessonTestView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    # متد GET برای ساخت آزمون
    def get(self, request, lesson_id, format=None):
        try:
            lesson = Lesson.objects.get(pk=lesson_id)
            all_words_in_lesson = list(lesson.words.all())
        except Lesson.DoesNotExist:
            return Response({"error": "درس یافت نشد."}, status=status.HTTP_404_NOT_FOUND)

        if len(all_words_in_lesson) < 4:
            return Response({"error": "این درس برای آزمون به حداقل ۴ لغت نیاز دارد."}, status=status.HTTP_400_BAD_REQUEST)

        # انتخاب ۱۰ سوال تصادفی
        num_questions = min(10, len(all_words_in_lesson))
        questions_words = random.sample(all_words_in_lesson, num_questions)

        test_questions = []
        for word in questions_words:
            # گزینه‌های اشتباه را از تمام لغات دیگر (به جز لغات همین درس) انتخاب می‌کنیم
            distractor_pool = list(Word.objects.exclude(lesson=lesson))
            if len(distractor_pool) < 3:
                # اگر کلمات کافی برای گزینه‌های انحرافی وجود نداشت، از لغات خود درس استفاده می‌کنیم
                distractor_pool = [w for w in all_words_in_lesson if w.id != word.id]
            
            distractors = random.sample(distractor_pool, 3)
            
            options = distractors + [word]
            random.shuffle(options)
            
            question_type = random.choice(['meaning', 'audio'])

            test_questions.append({
                'id': word.id,
                'question_type': question_type,
                'question_data': WordSerializer(word, context={'request': request}).data,
                'options': WordSerializer(options, many=True, context={'request': request}).data
            })
        
        return Response(test_questions)

    # متد POST برای تصحیح آزمون
    def post(self, request, lesson_id, format=None):
        user_answers = request.data.get('answers', []) # e.g., [{'id': 1, 'answer': 3}, ...]
        user = request.user
        
        try:
            lesson = Lesson.objects.get(pk=lesson_id)
        except Lesson.DoesNotExist:
            return Response({"error": "درس یافت نشد."}, status=status.HTTP_404_NOT_FOUND)

        correct_answers_count = 0
        word_ids = [answer['id'] for answer in user_answers]
        correct_words = Word.objects.in_bulk(word_ids)

        results = []
        for answer in user_answers:
            word = correct_words.get(answer['id'])
            is_correct = (word.id == answer['answer_id'])
            if is_correct:
                correct_answers_count += 1
            results.append({
                'question_id': word.id,
                'is_correct': is_correct,
                'correct_answer': WordSerializer(word, context={'request': request}).data,
            })
        
        score = int((correct_answers_count / len(user_answers)) * 100) if user_answers else 0
        passed = score >= 80

        # ذخیره نتیجه در دیتابیس
        UserLessonTestResult.objects.create(
            user=user,
            lesson=lesson,
            score=score,
            passed=passed
        )

        # منطق اعطای امتیاز (فعلاً ساده)
        points_awarded = 0
        if passed:
            # چک می‌کنیم آیا این اولین بار است که کاربر در آزمون این درس قبول می‌شود
            previous_passes = UserLessonTestResult.objects.filter(user=user, lesson=lesson, passed=True).count()
            if previous_passes == 1: # چون همین نتیجه فعلی هم ذخیره شده
                points_awarded = 50
                user.stardust_points += points_awarded
                user.save()

        return Response({
            'score': score,
            'passed': passed,
            'correct_count': correct_answers_count,
            'total_questions': len(user_answers),
            'points_awarded': points_awarded,
            'results': results,
        })
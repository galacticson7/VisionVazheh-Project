# progress/views.py
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from .models import UserWord, Achievement, UserAchievement, UserLessonTestResult
from content.models import Word, Lesson
from users.models import CustomUser
from users.serializers import UserRankingSerializer
from .serializers import UserWordSerializer, UserAchievementSerializer
from django.utils import timezone
from datetime import date, timedelta
from .achievements_logic import check_and_award_achievements
from django.db.models import Count, F

class AddUserWordView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, word_id, format=None):
        try:
            word = Word.objects.get(pk=word_id)
            user_word, created = UserWord.objects.get_or_create(user=request.user, word=word)
            if created:
                check_and_award_achievements(request.user)
                return Response({'message': 'Word added to your list.'}, status=status.HTTP_201_CREATED)
            else:
                user_word.reset_stage()
                return Response({'message': 'Word is already in your list and has been reset for review.'}, status=status.HTTP_200_OK)
        except Word.DoesNotExist:
            return Response({'error': 'Word not found.'}, status=status.HTTP_404_NOT_FOUND)

class MyWordListView(generics.ListAPIView):
    serializer_class = UserWordSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return UserWord.objects.filter(user=self.request.user)

class ReviewListView(generics.ListAPIView):
    serializer_class = UserWordSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        now = timezone.now()
        # این کوئری اصلاح شده تا از بروز خطا جلوگیری کند
        return UserWord.objects.filter(
            user=self.request.user, 
            next_review_at__lte=now,
            learning_stage__lt=5 
        ).order_by('next_review_at')

class UserWordKnowView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, user_word_id, format=None):
        try:
            user_word = UserWord.objects.get(pk=user_word_id, user=request.user)
            user_word.advance_stage()
            user = request.user
            today = date.today()
            yesterday = today - timedelta(days=1)
            if user.last_activity_date is None or user.last_activity_date < yesterday:
                user.streak = 1
            elif user.last_activity_date == yesterday:
                user.streak += 1
            user.stardust_points += 10
            user.last_activity_date = today
            user.save()
            check_and_award_achievements(user)
            return Response({'message': 'Stage advanced.'}, status=status.HTTP_200_OK)
        except UserWord.DoesNotExist:
            return Response({'error': 'UserWord not found.'}, status=status.HTTP_404_NOT_FOUND)

class UserWordForgetView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, user_word_id, format=None):
        try:
            user_word = UserWord.objects.get(pk=user_word_id, user=request.user)
            user_word.reset_stage()
            return Response({'message': 'Stage reset.'}, status=status.HTTP_200_OK)
        except UserWord.DoesNotExist:
            return Response({'error': 'UserWord not found.'}, status=status.HTTP_404_NOT_FOUND)

class UserAchievementListView(generics.ListAPIView):
    serializer_class = UserAchievementSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return UserAchievement.objects.filter(user=self.request.user)

class UpcomingReviewsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, format=None):
        now = timezone.now()
        tomorrow = now + timedelta(days=1)
        three_days = now + timedelta(days=3)
        a_week = now + timedelta(days=7)
        summary = {
            'tomorrow': UserWord.objects.filter(user=request.user, next_review_at__date=tomorrow.date()).count(),
            'in_three_days': UserWord.objects.filter(user=request.user, next_review_at__date__gt=tomorrow.date(), next_review_at__date__lte=three_days.date()).count(),
            'in_a_week': UserWord.objects.filter(user=request.user, next_review_at__date__gt=three_days.date(), next_review_at__date__lte=a_week.date()).count(),
        }
        return Response(summary)

class CompletedLessonsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, format=None):
        user = request.user
        lessons = Lesson.objects.annotate(total_words=Count('words'))
        mastered_words_by_lesson = UserWord.objects.filter(user=user, learning_stage=5).values('word__lesson').annotate(mastered_count=Count('id')).values('word__lesson', 'mastered_count')
        mastered_map = {item['word__lesson']: item['mastered_count'] for item in mastered_words_by_lesson}
        completed_lessons_ids = []
        for lesson in lessons:
            if lesson.total_words > 0 and mastered_map.get(lesson.id, 0) == lesson.total_words:
                completed_lessons_ids.append(lesson.id)
        return Response({'completed_lessons': completed_lessons_ids})

class UpdateUserWordStatusView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, word_id, format=None):
        action = request.data.get('action')
        if action not in ['known', 'unknown']:
            return Response({"error": "Action must be 'known' or 'unknown'."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            word = Word.objects.get(pk=word_id)
        except Word.DoesNotExist:
            return Response({"error": "Word not found."}, status=status.HTTP_404_NOT_FOUND)
        if action == 'known':
            defaults = {'learning_stage': 5}
        else:
            defaults = {'learning_stage': 1, 'next_review_at': timezone.now()}
        user_word, created = UserWord.objects.update_or_create(user=request.user, word=word, defaults=defaults)
        check_and_award_achievements(request.user)
        message = "Word status updated successfully."
        if created:
            message = "Word added to your list and status updated."
        return Response({"message": message}, status=status.HTTP_200_OK)

class LeaderboardView(generics.ListAPIView):
    queryset = CustomUser.objects.order_by('-stardust_points')[:100]
    serializer_class = UserRankingSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserRankView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, format=None):
        user = request.user
        higher_rank_count = CustomUser.objects.filter(stardust_points__gt=user.stardust_points).count()
        rank = higher_rank_count + 1
        return Response({'rank': rank, 'stardust_points': user.stardust_points})
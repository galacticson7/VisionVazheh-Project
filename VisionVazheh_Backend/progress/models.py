# progress/models.py
from django.db import models
from django.conf import settings
from content.models import Word, Lesson
from django.utils import timezone
from datetime import timedelta

class UserWord(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="کاربر")
    word = models.ForeignKey(Word, on_delete=models.CASCADE, verbose_name="لغت")
    learning_stage = models.IntegerField(default=1, verbose_name="مرحله یادگیری")
    next_review_at = models.DateTimeField(default=timezone.now, verbose_name="زمان مرور بعدی")
    
    # ... (متدهای advance_stage و reset_stage بدون تغییر باقی می‌مانند) ...
    SRS_STAGES = {
        1: timedelta(days=1),
        2: timedelta(days=3),
        3: timedelta(days=7),
        4: timedelta(days=16),
        5: timedelta(days=3650) # 10 years for "mastered"
    }
    def advance_stage(self):
        if self.learning_stage < 5:
            self.learning_stage += 1
        self.next_review_at = timezone.now() + self.SRS_STAGES[self.learning_stage]
        self.save()
    def reset_stage(self):
        self.learning_stage = 1
        self.next_review_at = timezone.now()
        self.save()

    class Meta:
        verbose_name = "لغت کاربر"
        verbose_name_plural = "لغات کاربران"
        unique_together = ('user', 'word')
    def __str__(self):
        return f"{self.user.username} - {self.word.english_word}"

class Achievement(models.Model):
    name = models.CharField(max_length=100, verbose_name="نام دستاورد")
    description = models.TextField(verbose_name="توضیحات")
    icon_name = models.CharField(max_length=50, verbose_name="نام آیکون", help_text="نام آیکونی که در فرانت‌اند استفاده می‌شود")
    def __str__(self):
        return self.name

class UserAchievement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('user', 'achievement')
    def __str__(self):
        return f"{self.user.username} - {self.achievement.name}"

# --- مدل جدید برای ذخیره نتایج آزمون ---
class UserLessonTestResult(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    score = models.PositiveIntegerField() # نمره از ۱۰۰
    passed = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "نتیجه آزمون کاربر"
        verbose_name_plural = "نتایج آزمون کاربران"
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user.username} - {self.lesson.title} - Score: {self.score}"
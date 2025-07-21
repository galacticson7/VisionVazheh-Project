# progress/models.py
from django.db import models
from django.conf import settings
from content.models import Word
from django.utils import timezone
from datetime import timedelta

class UserWord(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="کاربر")
    word = models.ForeignKey(Word, on_delete=models.CASCADE, verbose_name="لغت")
    added_at = models.DateTimeField(auto_now_add=True, verbose_name="زمان اضافه شدن")
    learning_stage = models.IntegerField(default=1, verbose_name="مرحله یادگیری")
    next_review_at = models.DateTimeField(default=timezone.now, verbose_name="زمان مرور بعدی")

    class Meta:
        verbose_name = "لغت کاربر"
        verbose_name_plural = "لغات کاربران"
        unique_together = ('user', 'word')

    def __str__(self):
        return f"{self.user} - {self.word}"

    def advance_stage(self):
        review_intervals = {1: 1, 2: 3, 3: 7, 4: 16, 5: 35}
        if self.learning_stage < 5:
            self.learning_stage += 1
        days_to_add = review_intervals.get(self.learning_stage, 60)
        self.next_review_at = timezone.now() + timedelta(days=days_to_add)
        self.save()

    def reset_stage(self):
        self.learning_stage = 1
        # این تغییر باعث می‌شود لغت فوراً برای مرور در دسترس باشد
        self.next_review_at = timezone.now() 
        self.save()


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
        return f"{self.user} earned {self.achievement.name}"
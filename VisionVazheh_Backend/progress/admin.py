# progress/admin.py
from django.contrib import admin
from .models import UserWord, Achievement, UserAchievement, UserLessonTestResult

# یک کلاس ادمین برای نمایش بهتر نتایج آزمون
class UserLessonTestResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'score', 'passed', 'timestamp')
    list_filter = ('passed', 'lesson')
    search_fields = ('user__username', 'lesson__title')

admin.site.register(UserWord)
admin.site.register(Achievement)
admin.site.register(UserAchievement)
# --- مدل جدید اینجا ثبت می‌شود ---
admin.site.register(UserLessonTestResult, UserLessonTestResultAdmin)
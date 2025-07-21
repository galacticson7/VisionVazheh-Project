# progress/admin.py
from django.contrib import admin
from .models import UserWord, Achievement, UserAchievement

admin.site.register(UserWord)
admin.site.register(Achievement)
admin.site.register(UserAchievement)
# progress/achievements_logic.py

from .models import Achievement, UserAchievement, UserWord
from django.contrib.auth import get_user_model

User = get_user_model()

def check_and_award_achievements(user):
    """
    این تابع اصلی است که تمام شرایط دستاوردها را برای یک کاربر چک می‌کند.
    """
    check_first_word_achievement(user)
    check_streak_achievements(user)
    check_learned_words_achievements(user)


def award_achievement(user, achievement_name):
    """
    یک تابع کمکی برای اعطای یک دستاورد به کاربر، در صورتی که قبلاً آن را نداشته باشد.
    """
    try:
        achievement = Achievement.objects.get(icon_name=achievement_name)
        if not UserAchievement.objects.filter(user=user, achievement=achievement).exists():
            UserAchievement.objects.create(user=user, achievement=achievement)
            print(f"Awarded '{achievement.name}' to {user.phone_number}")
    except Achievement.DoesNotExist:
        print(f"Achievement with icon_name '{achievement_name}' not found.")


# --- توابع بررسی برای هر نوع دستاورد ---

def check_first_word_achievement(user):
    """
    چک می‌کند آیا کاربر اولین لغت خود را مرور کرده است.
    """
    if UserWord.objects.filter(user=user).exists():
        award_achievement(user, 'first_word')

def check_streak_achievements(user):
    """
    چک می‌کند آیا کاربر به استریک مورد نظر رسیده است.
    """
    # --- تغییر اصلی اینجاست ---
    if user.streak >= 30:
        # ما به دنبال دستاوردی با نام آیکون 'streak_30' می‌گردیم
        award_achievement(user, 'streak_30')
    

def check_learned_words_achievements(user):
    """
    چک می‌کند کاربر چه تعداد لغت را به طور کامل یاد گرفته است.
    """
    learned_count = UserWord.objects.filter(user=user, learning_stage=5).count()
    # --- تغییر اصلی اینجاست ---
    if learned_count >= 500:
         # ما به دنبال دستاوردی با نام آیکون 'learned_500' می‌گردیم
        award_achievement(user, 'learned_500')
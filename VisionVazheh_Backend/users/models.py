# users/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField
from .managers import CustomUserManager

class CustomUser(AbstractUser):
    # فیلدهای قبلی حذف شدند
    first_name = None
    last_name = None
    email = None # ایمیل را هم اختیاری می‌کنیم و از فرم حذف می‌کنیم

    # فیلد جدید نام کاربری
    username = models.CharField(_('username'), max_length=150, unique=True, help_text=_('Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.'))
    
    phone_number = PhoneNumberField(_('phone number'), unique=True, help_text='مثال: +989123456789')
    
    # --- فیلد اصلی برای لاگین را به نام کاربری تغییر می‌دهیم ---
    USERNAME_FIELD = 'username'
    # هنگام ساخت سوپریوزر، شماره تلفن هم پرسیده می‌شود
    REQUIRED_FIELDS = ['phone_number']

    objects = CustomUserManager()

    TENTH_GRADE = 10
    ELEVENTH_GRADE = 11
    TWELFTH_GRADE = 12
    GRADE_CHOICES = [(TENTH_GRADE, 'دهم'), (ELEVENTH_GRADE, 'یازدهم'), (TWELFTH_GRADE, 'دوازدهم')]
    grade = models.IntegerField(choices=GRADE_CHOICES, verbose_name="پایه تحصیلی", null=True, blank=True)
    
    stardust_points = models.IntegerField(default=0, verbose_name="امتیاز گرد و غبار ستاره‌ای")
    streak = models.PositiveIntegerField(default=0, verbose_name="استریک روزانه")
    last_activity_date = models.DateField(null=True, blank=True, verbose_name="آخرین روز فعالیت")

    def __str__(self):
        return self.username
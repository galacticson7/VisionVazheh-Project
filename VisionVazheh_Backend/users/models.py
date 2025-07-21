# users/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField
from .managers import CustomUserManager

class CustomUser(AbstractUser):
    username = None
    phone_number = PhoneNumberField(_('phone number'), unique=True, help_text='مثال: +989123456789')
    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()
    TENTH_GRADE = 10
    ELEVENTH_GRADE = 11
    TWELFTH_GRADE = 12
    GRADE_CHOICES = [(TENTH_GRADE, 'دهم'), (ELEVENTH_GRADE, 'یازدهم'), (TWELFTH_GRADE, 'دوازدهم')]
    grade = models.IntegerField(choices=GRADE_CHOICES, verbose_name="پایه تحصیلی", null=True, blank=True)
    # این دو فیلد برای امتیاز و استریک اضافه شده‌اند
    stardust_points = models.IntegerField(default=0, verbose_name="امتیاز گرد و غبار ستاره‌ای")
    streak = models.PositiveIntegerField(default=0, verbose_name="استریک روزانه")
    last_activity_date = models.DateField(null=True, blank=True, verbose_name="آخرین روز فعالیت")

    def __str__(self):
        return str(self.phone_number)
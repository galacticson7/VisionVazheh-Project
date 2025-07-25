# users/managers.py

from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _

class CustomUserManager(BaseUserManager):
    """
    مدیر سفارشی مدل کاربر که در آن شماره موبایل به عنوان شناسه یکتا استفاده می‌شود.
    """
    def create_user(self, phone_number, password, **extra_fields):
        """
        یک کاربر عادی با شماره موبایل و رمز عبور می‌سازد.
        """
        if not phone_number:
            raise ValueError(_('The Phone number must be set'))
        user = self.model(phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, phone_number, password, **extra_fields):
        """
        یک کاربر مدیر (superuser) با شماره موبایل و رمز عبور می‌سازد.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(phone_number, password, **extra_fields)
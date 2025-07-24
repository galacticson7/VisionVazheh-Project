# users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'phone_number', 'stardust_points', 'is_staff')
    ordering = ('-stardust_points',)
    search_fields = ('username', 'phone_number')
    
    # فیلدهایی که در صفحه ویرایش کاربر در ادمین نمایش داده می‌شوند
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('phone_number', 'grade')}),
        ('Stats', {'fields': ('stardust_points', 'streak', 'last_activity_date')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    # فیلدهایی که هنگام ساخت کاربر جدید در ادمین نمایش داده می‌شوند
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'phone_number', 'password', 'password2'),
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)
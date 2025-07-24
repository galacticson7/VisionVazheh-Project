# content/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('lessons/', views.LessonListView.as_view(), name='lesson-list'),
    path('lessons/<int:lesson_id>/words/', views.WordListView.as_view(), name='word-list'),
    path('lessons/<int:lesson_id>/quiz/', views.QuizView.as_view(), name='quiz-view'),

    # --- این مسیر جدید برای سیستم آزمون اضافه می‌شود ---
    path('lessons/<int:lesson_id>/test/', views.LessonTestView.as_view(), name='lesson-test'),
]
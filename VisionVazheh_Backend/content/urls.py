# content/urls.py
from django.urls import path
from . import views
# --- خط زیر به طور کامل حذف می‌شود ---
# from progress.views import AddUserWordView 

urlpatterns = [
    path('lessons/', views.LessonListView.as_view(), name='lesson-list'),
    path('lessons/<int:lesson_id>/words/', views.WordListView.as_view(), name='word-list'),
    path('lessons/<int:lesson_id>/quiz/', views.QuizView.as_view(), name='quiz-view'),
    
    # --- و مسیر مربوط به آن نیز از اینجا حذف می‌شود ---
]
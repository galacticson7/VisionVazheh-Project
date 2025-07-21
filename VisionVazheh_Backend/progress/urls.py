# progress/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # --- مسیر جدید اینجا اضافه می‌شود ---
    path('words/add-to-my-list/<int:word_id>/', views.AddUserWordView.as_view(), name='add-word-to-list'),
    
    path('my-words/', views.MyWordListView.as_view(), name='my-word-list'),
    path('review-list/', views.ReviewListView.as_view(), name='review-list'),
    path('my-words/<int:user_word_id>/know/', views.UserWordKnowView.as_view(), name='user-word-know'),
    path('my-words/<int:user_word_id>/forget/', views.UserWordForgetView.as_view(), name='user-word-forget'),
    path('my-achievements/', views.UserAchievementListView.as_view(), name='my-achievements'),
    path('upcoming-reviews/', views.UpcomingReviewsView.as_view(), name='upcoming-reviews'),
    path('lessons-status/', views.CompletedLessonsView.as_view(), name='lessons-status'),
    path('my-words/update-status/<int:word_id>/', views.UpdateUserWordStatusView.as_view(), name='update-word-status'),
]
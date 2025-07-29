# urls.py

from django.urls import path 
from .views import (
    QuestionListView,
    QuestionDetailView,
    AskQuestionView,
    AnswerQuestionView,
    ViewCountCreateView,
    UpdateQuestionView,
    DeleteQuestionView,
)

urlpatterns = [
    path('', QuestionListView.as_view(), name='question-list'),
    path('<int:question_id>/', QuestionDetailView.as_view(), name='question-detail'),
    path('ask/', AskQuestionView.as_view(), name='question-ask'),
    path('<int:question_id>/update/', UpdateQuestionView.as_view(), name='question-update'),
    path('<int:question_id>/delete/', DeleteQuestionView.as_view(), name='question-delete'),
    path('<int:question_id>/answer/', AnswerQuestionView.as_view(), name='question-answer'),
    path('views/', ViewCountCreateView.as_view(), name='view-count-create'),
]

# answers/urls.py
from django.urls import path
from .views import AnswerListCreateView, AnswerDetailView

urlpatterns = [
    path('question/<int:question_id>/', AnswerListCreateView.as_view(), name='answer-list-create'),
    path('<int:answer_id>/', AnswerDetailView.as_view(), name='answer-detail'),
]


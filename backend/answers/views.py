# answers/views.py
from rest_framework import generics, permissions
from .models import Answer
from .serializers import AnswerSerializer
from questions.models import Question
from rest_framework.exceptions import NotFound
from rest_framework.generics import RetrieveUpdateDestroyAPIView

class AnswerListCreateView(generics.ListCreateAPIView):
    serializer_class = AnswerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        question_id = self.kwargs.get('question_id')
        return Answer.objects.filter(question_id=question_id)

    def perform_create(self, serializer):
        question_id = self.kwargs.get('question_id')
        try:
            question = Question.objects.get(pk=question_id)
        except Question.DoesNotExist:
            raise NotFound("Question not found.")
        serializer.save(user=self.request.user, question=question)

class AnswerDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'answer_id'

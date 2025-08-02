# answers/views.py
from rest_framework import generics, permissions
from .models import Answer
from .serializers import AnswerSerializer
from questions.models import Question
from rest_framework.exceptions import NotFound
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.exceptions import PermissionDenied
from notifications.utils import create_notification

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

        # ✅ Notify the question owner (except self)
        # answers/views.py

        if question.user != self.request.user:
            create_notification(
                user=question.user,
                message=f"{self.request.user.name} answered your question: '{question.title}' (ID: {question.question_id})"
            )


class AnswerDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    lookup_field = 'answer_id'
    lookup_url_kwarg = 'answer_id'
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("You do not have permission to delete this answer.")
        instance.delete()

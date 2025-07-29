from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Question, ViewCount, QuestionTag
from tags.models import Tag
from answers.models import Answer
from .serializers import (
    QuestionSerializer, QuestionDetailSerializer,
    AnswerSerializer, ViewCountSerializer
)

class QuestionListView(generics.ListAPIView):
    queryset = Question.objects.all().order_by('-created_at')
    serializer_class = QuestionSerializer
    permission_classes = [permissions.AllowAny]

class QuestionDetailView(generics.RetrieveAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'question_id'

class AskQuestionView(generics.CreateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        tag_names = self.request.data.get('tags', [])  # expects a list of tag names like ["#django", "restapi"]
        question = serializer.save(user=self.request.user)

        for raw_name in tag_names:
            clean_name = raw_name.lstrip('#').lower().strip()  # normalize tag
            if not clean_name:
                continue  # skip empty names

            tag, _ = Tag.objects.get_or_create(tag_name=clean_name)
            QuestionTag.objects.create(question=question, tag=tag)

# views.py (continued)

class UpdateQuestionView(generics.UpdateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'question_id'

    def perform_update(self, serializer):
        question = self.get_object()
        if question.user != self.request.user:
            raise PermissionDenied("You do not have permission to update this question.")
        
        serializer.save()
        new_tag_ids = self.request.data.get('tag_id', [])
        QuestionTag.objects.filter(question=question).delete()
        for tag_id in new_tag_ids:
            try:
                tag = Tag.objects.get(tag_id=tag_id)
                QuestionTag.objects.create(question=question, tag=tag)
            except Tag.DoesNotExist:
                continue

class DeleteQuestionView(generics.DestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'question_id'

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("You do not have permission to delete this question.")
        instance.delete()


class AnswerQuestionView(generics.CreateAPIView):
    serializer_class = AnswerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        question_id = self.kwargs.get('question_id')
        try:
            question = Question.objects.get(question_id=question_id)
        except Question.DoesNotExist:
            raise PermissionDenied("Invalid question.")
        serializer.save(user=self.request.user, question=question)

class ViewCountCreateView(generics.CreateAPIView):
    serializer_class = ViewCountSerializer
    queryset = ViewCount.objects.all()
    permission_classes = [permissions.AllowAny]

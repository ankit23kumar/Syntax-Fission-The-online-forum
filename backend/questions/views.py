from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Question, ViewCount, QuestionTag
from tags.models import Tag
from answers.models import Answer
from .serializers import (
    QuestionSerializer, QuestionDetailSerializer,
    AnswerSerializer, ViewCountSerializer
)
from django.db.models import Q, Count, Max
from django.utils import timezone
from datetime import timedelta

# class QuestionListView(generics.ListAPIView):
#     queryset = Question.objects.all().order_by('-created_at')
#     serializer_class = QuestionSerializer
#     permission_classes = [permissions.AllowAny]

class QuestionListView(generics.ListAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Question.objects.all().distinct()
        request = self.request
        params = request.query_params

        # FILTER: search in title/content
        search = params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(content__icontains=search)
            )

        # FILTER: tags (comma-separated)
        tags = params.get('tags')
        if tags:
            tag_list = [tag.strip().lower() for tag in tags.split(",") if tag.strip()]
            queryset = queryset.filter(
                questiontag__tag__tag_name__in=tag_list
            ).distinct()

        # FILTER: filter type (Newest, Active, Unanswered, Week, Month)
        filter_type = params.get('filter', 'Newest')

        if filter_type == "Active":
            queryset = queryset.annotate(
                last_answer_time=Max("answer__created_at")
            ).order_by("-last_answer_time", "-created_at")

        elif filter_type == "Unanswered":
            queryset = queryset.annotate(
                answer_count=Count("answer")
            ).filter(answer_count=0).order_by("-created_at")

        elif filter_type == "Week":
            one_week_ago = timezone.now() - timedelta(days=7)
            queryset = queryset.filter(created_at__gte=one_week_ago).order_by("-created_at")

        elif filter_type == "Month":
            one_month_ago = timezone.now() - timedelta(days=30)
            queryset = queryset.filter(created_at__gte=one_month_ago).order_by("-created_at")

        else:  # Default is Newest
            queryset = queryset.order_by("-created_at")

        return queryset

        
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

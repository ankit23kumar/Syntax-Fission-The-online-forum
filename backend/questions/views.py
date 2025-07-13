from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Question, ViewCount, QuestionTag
from .serializers import QuestionSerializer, ViewCountSerializer, QuestionTagSerializer

class QuestionListCreateView(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    lookup_field = 'question_id'

class ViewCountCreateView(generics.CreateAPIView):
    queryset = ViewCount.objects.all()
    serializer_class = ViewCountSerializer

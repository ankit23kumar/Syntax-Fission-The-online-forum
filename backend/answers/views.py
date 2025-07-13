from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Answer
from .serializers import AnswerSerializer

class AnswerListCreateView(generics.ListCreateAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

class AnswerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    lookup_field = 'answer_id'

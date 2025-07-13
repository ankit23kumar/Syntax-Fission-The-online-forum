from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Vote
from .serializers import VoteSerializer

class VoteCreateView(generics.CreateAPIView):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer

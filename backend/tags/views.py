from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Tag
from .serializers import TagSerializer

class TagListCreateView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

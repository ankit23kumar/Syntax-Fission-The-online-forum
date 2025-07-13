from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(generics.ListAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

class NotificationUpdateView(generics.UpdateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    lookup_field = 'notification_id'

from django.urls import path
from . import admin_views

urlpatterns = [
    path("", admin_views.list_notifications, name="admin-notifications-list"),
]

from django.urls import path
from . import admin_views

urlpatterns = [
    path("", admin_views.list_answers, name="admin-answer-list"),
    path("<int:pk>/delete/", admin_views.delete_answer, name="admin-answer-delete"),
]

from django.urls import path
from . import admin_views

urlpatterns = [
    path("", admin_views.list_questions, name="admin-question-list"),
    path("<int:pk>/delete/", admin_views.delete_question, name="admin-question-delete"),
]

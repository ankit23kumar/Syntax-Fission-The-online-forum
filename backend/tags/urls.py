from django.urls import path
from .views import TagListCreateView

urlpatterns = [
    path('', TagListCreateView.as_view(), name="tag-list-create"),
]

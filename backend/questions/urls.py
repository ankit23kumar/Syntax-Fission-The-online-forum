# from django.urls import path
# from rest_framework.routers import DefaultRouter
# from .views import QuestionViewSet, QuestionTagViewSet, ViewCountViewSet

# router = DefaultRouter()
# router.register(r'', QuestionViewSet, basename='question')
# router.register(r'tags', QuestionTagViewSet, basename='question-tags')
# router.register(r'views', ViewCountViewSet, basename='view-counts')

# urlpatterns = router.urls

from django.urls import path
from .views import (
    QuestionListCreateView,
    QuestionDetailView,
    ViewCountCreateView
)

urlpatterns = [
    path('', QuestionListCreateView.as_view(), name='question-list-create'),
    path('<int:question_id>/', QuestionDetailView.as_view(), name='question-detail'),
    path('views/', ViewCountCreateView.as_view(), name='view-count-create'),
]

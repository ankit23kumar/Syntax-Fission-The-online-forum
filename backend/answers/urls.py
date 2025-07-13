# from django.urls import path
# from rest_framework.routers import DefaultRouter
# from .views import AnswerViewSet

# router = DefaultRouter()
# router.register(r'', AnswerViewSet, basename='answer')

# urlpatterns = router.urls

from django.urls import path
from .views import AnswerListCreateView, AnswerDetailView

urlpatterns = [
    path('', AnswerListCreateView.as_view(), name='answer-list-create'),
    path('<int:answer_id>/', AnswerDetailView.as_view(), name='answer-detail'),
]

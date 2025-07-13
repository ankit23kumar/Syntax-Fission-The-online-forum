from django.urls import path
# from rest_framework.routers import DefaultRouter
# from .views import VoteViewSet

# router = DefaultRouter()
# router.register(r'', VoteViewSet, basename='vote')

# urlpatterns = router.urls
from .views import VoteCreateView

urlpatterns = [
    path('', VoteCreateView.as_view(), name='vote-create'),
]

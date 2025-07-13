
# from rest_framework.routers import DefaultRouter
# from .views import UserViewSet

# router = DefaultRouter()
# router.register(r'', UserViewSet, basename='user')

# urlpatterns = router.urls

from django.urls import path
from .views import UserCreateView, UserDetailView, UserLoginView

urlpatterns = [
    path('create/', UserCreateView.as_view(), name='user-create'),
    path('<int:user_id>/', UserDetailView.as_view(), name='user-detail'),
    path('login/', UserLoginView.as_view(), name='user-login'),
]

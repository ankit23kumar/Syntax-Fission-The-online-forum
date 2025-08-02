#users/urls.py

from django.urls import path
from .views import (UserCreateView, UserDetailView, UserLoginView, GoogleAuthView,UserProfileView,
                    EditUserProfileView,
                    UserActivityView,
                    UserAccountView,
                    DeleteUserAccountView,
                    UpdatePasswordView,
                    verify_email
                )
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('create/', UserCreateView.as_view(), name='user-create'),
    path('<int:user_id>/', UserDetailView.as_view(), name='user-detail'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('google-auth/', GoogleAuthView.as_view(), name='google-auth'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/edit/', EditUserProfileView.as_view(), name='edit-profile'),
    path('activity/', UserActivityView.as_view(), name='user-activity'),
    path('account/', UserAccountView.as_view(), name='user-account'),
    path('delete/', DeleteUserAccountView.as_view(), name='delete-user'),
    path('update-password/', UpdatePasswordView.as_view(), name='update-password'),
    path('verify-email/<uidb64>/<token>/', verify_email, name='verify-email'),
]

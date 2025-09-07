# users/urls.py

from django.urls import path
from .views import (
    # --- Core Views ---
    UserCreateView,
    UserLoginView,
    logout_view,
    
    # --- New OTP Views ---
    VerifyOTPView,
    resend_verification_email, # This is now the 'resend OTP' view
    
    # --- Profile & Account Management ---
    UserProfileView,
    EditUserProfileView,
    UserDetailView,
    UserActivityView,
    UserAccountView,
    DeleteUserAccountView,
    UpdatePasswordView,
    CompleteProfileView,
    
    # --- Other Auth ---
    GoogleAuthView,
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Core user actions
    path('create/', UserCreateView.as_view(), name='user-create'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('logout/', logout_view, name='user-logout'),
    
    # New OTP verification paths
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('resend-otp/', resend_verification_email, name='resend-otp'),
    
    # JWT and Google Auth
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('google-auth/', GoogleAuthView.as_view(), name='google-auth'),
    
    # User profile and account management
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/edit/', EditUserProfileView.as_view(), name='edit-profile'),
    path('activity/', UserActivityView.as_view(), name='user-activity'),
    path('account/', UserAccountView.as_view(), name='user-account'),
    path('delete/', DeleteUserAccountView.as_view(), name='delete-user'),
    path('update-password/', UpdatePasswordView.as_view(), name='update-password'),
    path('complete-profile/', CompleteProfileView.as_view(), name='complete-profile'),
    
    # Detail view should be last to avoid catching other URL patterns
    path('<int:user_id>/', UserDetailView.as_view(), name='user-detail'),
]
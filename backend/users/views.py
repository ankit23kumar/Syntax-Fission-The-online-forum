# users/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

import requests as http_requests
from django.core.files.base import ContentFile
from urllib.parse import urlparse
import os

from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.utils.crypto import get_random_string
from django.contrib.auth import logout

from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import get_object_or_404
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.urls import reverse
from datetime import datetime

from .models import User
from .serializers import (
    UserProfileSerializer,
    UserSerializer,
    LoginSerializer,
    GoogleAuthSerializer,
    PasswordUpdateSerializer
)
from questions.models import Question
from answers.models import Answer
from questions.serializers import QuestionTitleSerializer
from answers.serializers import AnswerSummarySerializer


# Helper: Build verification URL based on ENV_MODE & USE_FRONTEND_FOR_VERIFY
def build_verification_url(uidb64, token):
    if settings.ENV_MODE in ["localhost", "lan"]:
        if getattr(settings, "USE_FRONTEND_FOR_VERIFY", True):
            return f"{settings.FRONTEND_URL}/verify-email/{uidb64}/{token}/"
        else:
            return f"{settings.BACKEND_URL}{reverse('verify-email', kwargs={'uidb64': uidb64, 'token': token})}"
    return f"{settings.FRONTEND_URL}/verify-email/{uidb64}/{token}/"


class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(is_active=False)  # inactive until verification

        current_year = datetime.now().year
        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        verification_url = build_verification_url(uidb64, token)

        # Send verification email
        subject = 'Verify your email - Syntax Fission'
        message = render_to_string('emails/verify_email.html', {
            'user': user,
            'verify_url': verification_url,
            'current_year': current_year
        })
        email = EmailMultiAlternatives(
            subject=subject,
            body="Please verify your email.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
            headers={"Reply-To": settings.EMAIL_REPLY_TO}
        )
        email.attach_alternative(message, "text/html")
        email.send(fail_silently=False)

        return Response({
            "message": "Registration successful. Please verify your email to continue.",
            "email": user.email,
            "uidb64": uidb64,
            "verification_url": verification_url
        }, status=status.HTTP_201_CREATED)


class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'user_id'


class UserLoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.user_id,
            'name': user.name,
            'email': user.email,
            'is_admin': user.is_admin,
        })


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data.get("id_token")
        current_year = datetime.now().year

        try:
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), settings.GOOGLE_CLIENT_ID)
            email, name, picture = idinfo.get("email"), idinfo.get("name", ""), idinfo.get("picture", "")

            user, created = User.objects.get_or_create(
                email=email,
                defaults={"name": name, "password": make_password(get_random_string(12)), "is_active": True}
            )

            if created and picture:
                try:
                    response = http_requests.get(picture)
                    if response.status_code == 200:
                        img_name = os.path.basename(urlparse(picture).path)
                        user.profile_picture.save(img_name, ContentFile(response.content))
                except Exception:
                    pass
                user.save()

            # Send welcome email for Google users
            login_url = f"{settings.FRONTEND_URL}/login"
            welcome_msg = render_to_string('emails/welcome_credentials.html', {
                'user': user,
                'email': user.email,
                'password': 'Google Account (OAuth)',
                'login_url': login_url,
                'current_year': current_year
            })
            email = EmailMultiAlternatives(
                subject='Welcome to Syntax Fission',
                body="Welcome to Syntax Fission.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email],
                headers={"Reply-To": settings.EMAIL_REPLY_TO}
            )
            email.attach_alternative(welcome_msg, "text/html")
            email.send(fail_silently=True)

            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user_id": user.user_id,
                "name": user.name,
                "email": user.email,
                "profile_picture": user.profile_picture.url if user.profile_picture else None
            })

        except ValueError:
            return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class EditUserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserActivityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "total_questions": Question.objects.filter(user=user).count(),
            "total_answers": Answer.objects.filter(user=user).count(),
            "questions": QuestionTitleSerializer(Question.objects.filter(user=user), many=True).data,
            "answers": AnswerSummarySerializer(Answer.objects.filter(user=user), many=True).data,
        })


class UserAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "user_id": request.user.user_id,
            "email": request.user.email,
            "date_joined": request.user.created_at,
            "last_login": request.user.last_login,
        })


class DeleteUserAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        request.user.delete()
        return Response({"detail": "Your account has been deleted."})


class UpdatePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = PasswordUpdateSerializer(data=request.data)
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data['password'])
            request.user.save()

            raw_password = serializer.validated_data['password']
            current_year = datetime.now().year
            subject = 'Your password has been updated - Syntax Fission'
            message = render_to_string('emails/password_changed.html', {
                'user': request.user,
                'email': request.user.email,
                'password': raw_password,
                'current_year': current_year
            })
            email = EmailMultiAlternatives(
                subject=subject,
                body="Your password has been updated.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[request.user.email],
                headers={"Reply-To": settings.EMAIL_REPLY_TO}
            )
            email.attach_alternative(message, "text/html")
            email.send(fail_silently=False)

            return Response({"detail": "Password updated successfully."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({"detail": "Logged out successfully."})

@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = get_object_or_404(User, pk=uid)
    except Exception:
        return Response({'error': 'Invalid verification link.'}, status=status.HTTP_400_BAD_REQUEST)

    # --- THIS IS THE KEY CHANGE ---
    # We will now handle both the first verification and subsequent clicks the same way.
    # The goal is always to log the user in by providing tokens.

    is_first_verification = not user.is_active

    if default_token_generator.check_token(user, token) or user.is_active:
        if not user.is_active:
            user.is_active = True
            user.save()

        # Always issue fresh tokens. This solves the race condition.
        refresh = RefreshToken.for_user(user)
        response_data = {
            'message': 'Email successfully verified!',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.user_id,
            'name': user.name,
            'email': user.email
        }

        # Only send the full welcome email on the very first verification.
        if is_first_verification:
            current_year = datetime.now().year
            login_url = f"{settings.FRONTEND_URL}/login"
            welcome_msg = render_to_string('emails/welcome_credentials.html', {
                'user': user, 'email': user.email, 'password': '(Set during registration)',
                'login_url': login_url, 'current_year': current_year
            })
            email = EmailMultiAlternatives(
                subject='Welcome to Syntax Fission', body="Welcome to Syntax Fission.",
                from_email=settings.DEFAULT_FROM_EMAIL, to=[user.email],
                headers={"Reply-To": settings.EMAIL_REPLY_TO}
            )
            email.attach_alternative(welcome_msg, "text/html")
            email.send(fail_silently=False)

        return Response(response_data)

    return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['GET'])
# @permission_classes([AllowAny])
# def verify_email(request, uidb64, token):
#     try:
#         uid = force_str(urlsafe_base64_decode(uidb64))
#         user = get_object_or_404(User, pk=uid)
#     except Exception:
#         return Response({'error': 'Invalid verification link.'}, status=status.HTTP_400_BAD_REQUEST)

#     if user.is_active:
#         return Response({'message': 'Email already verified.'})

#     if default_token_generator.check_token(user, token):
#         user.is_active = True
#         user.save()

#         # Issue tokens after successful verification
#         refresh = RefreshToken.for_user(user)

#         current_year = datetime.now().year
#         login_url = f"{settings.FRONTEND_URL}/login"
#         welcome_msg = render_to_string('emails/welcome_credentials.html', {
#             'user': user,
#             'email': user.email,
#             'password': getattr(user, 'raw_password', '(Set during registration)'),
#             'login_url': login_url,
#             'current_year': current_year
#         })
#         email = EmailMultiAlternatives(
#             subject='Welcome to Syntax Fission',
#             body="Welcome to Syntax Fission.",
#             from_email=settings.DEFAULT_FROM_EMAIL,
#             to=[user.email],
#             headers={"Reply-To": settings.EMAIL_REPLY_TO}
#         )
#         email.attach_alternative(welcome_msg, "text/html")
#         email.send(fail_silently=False)

#         return Response({
#             'message': 'Email successfully verified!',
#             'refresh': str(refresh),
#             'access': str(refresh.access_token),
#             'user_id': user.user_id,
#             'name': user.name,
#             'email': user.email
#         })

#     return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def check_email_verification(request):
    email = request.query_params.get("email", "").strip().lower()
    if not email:
        return Response({"verified": False, "error": "Email is required"}, status=400)

    user = User.objects.filter(email__iexact=email).first()
    if not user:
        # Don’t 404 here — frontend modal expects a consistent shape
        return Response({"verified": False})

    return Response({"verified": user.is_active})

@api_view(['POST'])
@permission_classes([AllowAny])
def resend_verification_email(request):
    email = request.data.get('email')
    user = User.objects.filter(email=email).first()
    if not user:
        return Response({'error': 'User not found'}, status=404)
    if user.is_active:
        return Response({'message': 'Email already verified'}, status=400)

    token = default_token_generator.make_token(user)
    uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
    verification_url = build_verification_url(uidb64, token)
    current_year = datetime.now().year

    message = render_to_string('emails/verify_email.html', {
        'user': user,
        'verify_url': verification_url,
        'current_year': current_year
    })
    email = EmailMultiAlternatives(
        subject='Resend Email Verification - Syntax Fission',
        body="Please verify your email.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
        headers={"Reply-To": settings.EMAIL_REPLY_TO}
    )
    email.attach_alternative(message, "text/html")
    email.send(fail_silently=False)

    return Response({'message': 'Verification email resent successfully'})


class CompleteProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        user = request.user
        bio = request.data.get("bio")
        if bio:
            user.bio = bio

        if "profile_picture" in request.FILES:
            user.profile_picture = request.FILES["profile_picture"]

        user.save()

        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
# Clean and optimized version of users/views.py with all discussed functionality

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view

from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.utils.crypto import get_random_string
from django.contrib.auth import logout

from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import get_object_or_404
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.urls import reverse

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


class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save(is_active=False)

        # Generate verification token
        token = default_token_generator.make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        verification_url = self.request.build_absolute_uri(
            reverse('verify-email', kwargs={'uidb64': uidb64, 'token': token})
        )

        # Send verification email
        subject = 'Verify your email - Syntax Fission'
        message = render_to_string('emails/verify_email.html', {
            'user': user,
            'verification_url': verification_url
        })
        EmailMessage(subject, message, to=[user.email], headers={"Reply-To": "noreply@syntaxfission.com"}).send()

        # Send welcome email with credentials
        raw_password = serializer.validated_data['password']
        welcome_msg = render_to_string('emails/welcome_credentials.html', {
            'user': user,
            'password': raw_password
        })
        EmailMessage('Welcome to Syntax Fission', welcome_msg, to=[user.email]).send()


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
            'email': user.email
        })


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data.get("id_token")

        try:
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), settings.GOOGLE_CLIENT_ID)
            email, name, picture = idinfo.get("email"), idinfo.get("name", ""), idinfo.get("picture", "")

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "name": name,
                    "profile_picture": picture or None,
                    "password": make_password(get_random_string(12)),
                    "is_active": True  # Assume Google accounts are already verified
                }
            )

            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user_id": user.user_id,
                "name": user.name,
                "email": user.email,
                "profile_picture": user.profile_picture
            })

        except ValueError:
            return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class EditUserProfileView(APIView):
    permission_classes = [IsAuthenticated]

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
            return Response({"detail": "Password updated successfully."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({"detail": "Logged out successfully."})


@api_view(['GET'])
def verify_email(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = get_object_or_404(User, pk=uid)
    except Exception:
        return Response({'error': 'Invalid verification link.'}, status=status.HTTP_400_BAD_REQUEST)

    if user.is_active:
        return Response({'message': 'Email already verified.'})

    if default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return Response({'message': 'Email successfully verified!'})
    return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)

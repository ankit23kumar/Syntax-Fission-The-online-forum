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
import random
from datetime import datetime
from django.utils import timezone

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
    PasswordUpdateSerializer,
    ContactSubmissionSerializer
)
from questions.models import Question
from answers.models import Answer
from questions.serializers import QuestionTitleSerializer
from answers.serializers import AnswerSummarySerializer

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(is_active=False)

        # Generate and save OTP
        otp = str(random.randint(100000, 999999))
        user.otp = otp
        user.otp_expiry = timezone.now() + timezone.timedelta(minutes=10)
        user.save()

        # Send OTP email
        current_year = datetime.now().year
        subject = f'Your Syntax Fission Verification Code: {otp}'
        message = render_to_string('emails/verify_otp.html', {
            'user': user,
            'otp': otp,
            'current_year': current_year
        })
        email = EmailMultiAlternatives(
            subject=subject,
            body=f"Your verification code is {otp}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
            headers={"Reply-To": settings.EMAIL_REPLY_TO}
        )
        email.attach_alternative(message, "text/html")
        email.send(fail_silently=False)

        return Response({
            "message": "Registration successful. Please check your email for a 6-digit OTP.",
            "email": user.email,
        }, status=status.HTTP_201_CREATED)


# --- NEW: View to verify the OTP ---
class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email", "").strip().lower()
        otp = request.data.get("otp", "").strip()

        if not email or not otp:
            return Response({"error": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(email__iexact=email).first()

        if not user:
            return Response({"error": "User with this email not found."}, status=status.HTTP_404_NOT_FOUND)

        if user.is_active:
            return Response({'message': 'This account is already active.'}, status=status.HTTP_400_BAD_REQUEST)

        if not (user.otp == otp and user.otp_expiry and timezone.now() < user.otp_expiry):
            return Response({"error": "The OTP is invalid or has expired."}, status=status.HTTP_400_BAD_REQUEST)

        # OTP is valid, activate the user and clear OTP fields
        user.is_active = True
        user.otp = None
        user.otp_expiry = None
        user.save()

        # +++ ADDED: Send the Welcome Email upon successful verification +++
        current_year = datetime.now().year
        login_url = f"{settings.FRONTEND_URL}/login"
        welcome_msg = render_to_string('emails/welcome_credentials.html', {
            'user': user,
            'email': user.email,
            'password': '(The password you set during registration)',
            'login_url': login_url,
            'current_year': current_year
        })
        email_msg = EmailMultiAlternatives(
            subject='Welcome to Syntax Fission!',
            body="Welcome! Your account is now active.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
            headers={"Reply-To": settings.EMAIL_REPLY_TO}
        )
        email_msg.attach_alternative(welcome_msg, "text/html")
        email_msg.send(fail_silently=False)
        # +++ END OF ADDED CODE +++

        # Issue tokens to automatically log the user in
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Email successfully verified! You are now logged in.',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.user_id,
            'name': user.name,
            'email': user.email
        })


# --- REWRITTEN: Now resends an OTP, not a link ---
@api_view(['POST'])
@permission_classes([AllowAny])
def resend_verification_email(request):
    email = request.data.get('email', "").strip().lower()
    if not email:
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.filter(email__iexact=email).first()

    if not user:
        return Response({'error': 'User with this email not found.'}, status=status.HTTP_404_NOT_FOUND)

    if user.is_active:
        return Response({'message': 'This account has already been verified.'}, status=status.HTTP_400_BAD_REQUEST)

    # Generate and save a new OTP
    otp = str(random.randint(100000, 999999))
    user.otp = otp
    user.otp_expiry = timezone.now() + timezone.timedelta(minutes=10)
    user.save()

    # Send the new OTP email
    current_year = datetime.now().year
    subject = f'Your New Syntax Fission Verification Code: {otp}'
    message = render_to_string('emails/verify_otp.html', {
        'user': user,
        'otp': otp,
        'current_year': current_year
    })
    email_msg = EmailMultiAlternatives(
        subject=subject,
        body=f"Your new verification code is {otp}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
        headers={"Reply-To": settings.EMAIL_REPLY_TO}
    )
    email_msg.attach_alternative(message, "text/html")
    email_msg.send(fail_silently=False)

    return Response({'message': 'A new OTP has been sent to your email.'})


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



# +++ ADD THIS NEW VIEW +++
class ContactSubmissionView(APIView):
    """
    Handles submissions from the public contact form.
    It works for both authenticated and anonymous users.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = ContactSubmissionSerializer(data=request.data)
        if serializer.is_valid():
            # Save the submission to the database
            if request.user.is_authenticated:
                serializer.save(user=request.user)
            else:
                serializer.save()

            submission_data = serializer.validated_data
            user_email = submission_data['email']
            user_name = submission_data['first_name']
            current_year = datetime.now().year

            # --- LOGIC TO SEND CONFIRMATION EMAIL TO THE USER ---
            try:
                user_subject = 'We have received your message - Syntax Fission'
                user_message_html = render_to_string('emails/contact_confirmation.html', {
                    'user_name': user_name,
                    'current_year': current_year
                })
                
                email_to_user = EmailMultiAlternatives(
                    subject=user_subject,
                    body=f"Hi {user_name}, thank you for contacting us. We will get back to you shortly.", # Plain text fallback
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[user_email],
                    headers={"Reply-To": settings.EMAIL_REPLY_TO[0]} # Use the admin/support email for replies
                )
                email_to_user.attach_alternative(user_message_html, "text/html")
                email_to_user.send(fail_silently=False)
            except Exception as e:
                # Log the error, but don't block the user's success response
                print(f"Error sending contact confirmation email: {e}")
            # --- END OF USER CONFIRMATION EMAIL LOGIC ---


            # --- (Optional) Logic to send a notification email to yourself ---
            # This part is unchanged. You can uncomment it to get notified of new messages.
            # admin_subject = f"New Contact Form Submission from {user_name}"
            # ... (rest of the admin notification code) ...


            return Response({"message": "Thank you for your message! We will get back to you soon."}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings
from django.template.loader import render_to_string

def send_verification_email(user, request):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))

    verify_url = f"{request.scheme}://{request.get_host()}/verify-email/{uid}/{token}/"

    subject = "Verify your Syntax Fission account"
    message = render_to_string("emails/verify_email.html", {
        "user": user,
        "verify_url": verify_url,
    })

    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])

def send_credentials_email(user, password, request):
    subject = "Welcome to Syntax Fission!"
    message = render_to_string("emails/welcome_credentials.html", {
        "user": user,
        "email": user.email,
        "password": password,
        "login_url": f"{request.scheme}://{request.get_host()}/login"
    })

    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])

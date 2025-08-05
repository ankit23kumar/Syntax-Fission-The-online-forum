from django.urls import path, include

urlpatterns = [
    path('users/', include('users.admin_urls')),
    path('questions/', include('questions.admin_urls')),
    path('answers/', include('answers.admin_urls')),
    path('votes/', include('votes.admin_urls')),
    path('tags/', include('tags.admin_urls')),
    path('notifications/', include('notifications.admin_urls')),
]

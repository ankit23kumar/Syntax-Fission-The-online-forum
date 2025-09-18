# notifications/serializers.py

from rest_framework import serializers
from .models import Notification
# +++ Import the User model to create a simple serializer for it +++
from users.models import User

# +++ NEW: A simple serializer for the user's name and picture +++
class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'name', 'profile_picture']

# --- Your existing NotificationSerializer is good for user-facing views ---
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

# +++ NEW: The definitive serializer for the ADMIN LIST VIEW +++
class AdminNotificationSerializer(serializers.ModelSerializer):
    """
    Provides rich, nested data about the recipient for the admin panel.
    """
    user = UserMiniSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = [
            'notification_id',
            'user',
            'message',
            'is_read',
            'created_at',
        ]
#users/serializers.py
from rest_framework import serializers
from .models import User , ContactSubmission
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'name', 'email', 'password', 'profile_picture', 'bio', 'is_admin', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data.get('name', ''),
            profile_picture=validated_data.get('profile_picture', None),
            bio=validated_data.get('bio', '')
        )

    def get_profile_picture(self, obj):
        try:
            return obj.profile_picture.url if obj.profile_picture else None
        except Exception:
            return None
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data['email']
        password = data['password']
        user = authenticate(email=email, password=password)
        if user and user.is_active:
            data['user'] = user
            return data
        raise serializers.ValidationError("Invalid credentials")
    
    
class GoogleAuthSerializer(serializers.Serializer):
    id_token = serializers.CharField()


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email','name', 'bio', 'profile_picture']  
        read_only_fields = ['email'] 


class PasswordUpdateSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ['first_name', 'last_name', 'email', 'message']
# questions/serializers.py

from rest_framework import serializers
from .models import Question, ViewCount
from answers.models import Answer
from tags.models import Tag
from users.models import User
from django.utils import timezone # Import timezone
from datetime import timedelta # Import timedelta


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['tag_id', 'tag_name']

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'name', 'profile_picture']

class AnswerSerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True)
    class Meta:
        model = Answer
        fields = ['answer_id', 'user', 'content', 'upvotes', 'downvotes', 'created_at']

# --- THIS IS THE MAIN SERIALIZER TO FIX ---
class QuestionSerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True)
    
    # This field will be used for READING tags. It correctly uses the model method.
    tags = TagSerializer(source='get_tags', many=True, read_only=True)
    
    # This new field is used for WRITING tags. It accepts a list of strings from the frontend.
    tag_names = serializers.ListField(
        child=serializers.CharField(max_length=100),
        write_only=True,  # This field is only used for creating/updating, not for displaying
        required=False    # Make it optional
    )

    answer_count = serializers.SerializerMethodField()
    view_count = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            'question_id', 'user', 'title', 'content', 'upvotes', 'downvotes',
            'category', 'created_at', 
            'tags', # For reading
            'tag_names', # For writing
            'answer_count', 'view_count'
        ]
        # We don't need a custom create method here anymore, the view will handle it.

    def get_answer_count(self, obj):
        return obj.answer_set.count()
    
    def get_view_count(self, obj):
        return obj.viewcount_set.count()



# --- The rest of the serializers are correct ---

class QuestionTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['question_id', 'title']

class QuestionDetailSerializer(QuestionSerializer):
    answers = AnswerSerializer(source='answer_set', many=True, read_only=True)
    class Meta(QuestionSerializer.Meta):
        fields = [
            'question_id', 'user', 'title', 'content', 'upvotes', 'downvotes',
            'category', 'created_at', 'tags', 'answer_count', 'view_count', 'answers'
        ]


# --- THIS IS THE DEFINITIVE, CORRECTED SERIALIZER ---
class ViewCountSerializer(serializers.ModelSerializer):
    class Meta:
        model = ViewCount
        fields = ['question'] # Simplified for creation

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None
        question = validated_data.get('question')

        # --- NEW, ROBUST LOGIC ---
        if user:
            # For logged-in users, only record a new view if their last view
            # for this specific question was more than an hour ago.
            # This prevents spamming the view count on every refresh.
            one_hour_ago = timezone.now() - timedelta(hours=1)
            
            # Check if a recent view by this user for this question exists
            has_recent_view = ViewCount.objects.filter(
                user=user,
                question=question,
                viewed_at__gte=one_hour_ago
            ).exists()

            if not has_recent_view:
                # If no recent view, create a new one.
                ViewCount.objects.create(user=user, question=question)
        else:
            # For anonymous users, we can't track them reliably,
            # so we'll just add a new view count record.
            # In a production system, you might use IP address or session tracking here.
            ViewCount.objects.create(user=None, question=question)
            
        # The create method must return the created instance or validated_data
        # In this case, returning validated_data is simplest as we don't need the new object.
        return validated_data
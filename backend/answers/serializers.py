# from rest_framework import serializers
# from .models import Answer

# class AnswerSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Answer
#         fields = '__all__'
#         read_only_fields = ['answer_id', 'user', 'question', 'created_at', 'upvotes', 'downvotes']

# class AnswerSummarySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Answer
#         fields = ['answer_id', 'question', 'created_at']

# answers/serializers.py

from rest_framework import serializers
from .models import Answer
# +++ Import related models to get their data +++
from users.models import User
from questions.models import Question

# +++ NEW: A simple serializer for the question title +++
class QuestionTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['question_id', 'title']

# +++ NEW: A simple serializer for the user's name +++
class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'name', 'profile_picture']

# --- Your existing AnswerSerializer for creating/updating is perfect ---
class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'
        read_only_fields = ['answer_id', 'user', 'question', 'created_at', 'upvotes', 'downvotes']

# +++ NEW: The definitive serializer for the ADMIN LIST VIEW +++
class AdminAnswerSerializer(serializers.ModelSerializer):
    """
    Provides rich, nested data for the admin panel to display.
    """
    user = UserMiniSerializer(read_only=True)
    question = QuestionTitleSerializer(read_only=True)

    class Meta:
        model = Answer
        fields = [
            'answer_id',
            'content',
            'user',
            'question',
            'created_at',
            'upvotes',
            'downvotes',
        ]

# --- Your existing AnswerSummarySerializer is also perfect ---
class AnswerSummarySerializer(serializers.ModelSerializer):
    question_title = serializers.CharField(source='question.title', read_only=True)
    class Meta:
        model = Answer
        fields = ['answer_id', 'question_id', 'question_title', 'created_at']
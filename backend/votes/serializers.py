# votes/serializers.py

from rest_framework import serializers
from .models import Vote
# +++ Import all related models and their simple serializers +++
from users.models import User
from questions.models import Question
from answers.models import Answer

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'name']

class QuestionTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['question_id', 'title']

class AnswerContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['answer_id', 'content']

# --- Your existing VoteSerializer is good for creating votes ---
class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = '__all__'

# +++ NEW: The definitive serializer for the ADMIN LIST VIEW +++
class AdminVoteSerializer(serializers.ModelSerializer):
    """
    Provides rich, nested data and dynamically fetches the
    details of the question or answer that was voted on.
    """
    user = UserMiniSerializer(read_only=True)
    # This special field will call the get_target_object method below
    target_object = serializers.SerializerMethodField()

    class Meta:
        model = Vote
        fields = [
            'vote_id', 'user', 'vote_type', 'target_type',
            'target_id', 'target_object', 'created_at',
        ]

    def get_target_object(self, obj):
        """
        Dynamically fetches and serializes the related question or answer.
        """
        if obj.target_type == 'question':
            try:
                question = Question.objects.get(pk=obj.target_id)
                return QuestionTitleSerializer(question).data
            except Question.DoesNotExist:
                return None
        elif obj.target_type == 'answer':
            try:
                answer = Answer.objects.get(pk=obj.target_id)
                return AnswerContentSerializer(answer).data
            except Answer.DoesNotExist:
                return None
        return None
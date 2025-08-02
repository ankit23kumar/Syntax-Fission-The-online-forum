from rest_framework import serializers
from .models import Answer

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'
        read_only_fields = ['answer_id', 'user', 'question', 'created_at', 'upvotes', 'downvotes']

class AnswerSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['answer_id', 'question', 'created_at']
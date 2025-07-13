from rest_framework import serializers
from .models import Question, QuestionTag, ViewCount

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class ViewCountSerializer(serializers.ModelSerializer):
    class Meta:
        model = ViewCount
        fields = '__all__'

class QuestionTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionTag
        fields = '__all__'

from rest_framework import serializers
from .models import Question, ViewCount, QuestionTag
from answers.models import Answer
from tags.models import Tag
from users.models import User

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

class QuestionSerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True, source='get_tags')
    answer_count = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            'question_id', 'user', 'title', 'content', 'upvotes', 'downvotes',
            'category', 'created_at', 'tags', 'answer_count'
        ]

    def get_answer_count(self, obj):
        return obj.answer_set.count()

class QuestionTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['question_id', 'title']

class QuestionDetailSerializer(QuestionSerializer):
    answers = AnswerSerializer(source='answer_set', many=True, read_only=True)

    class Meta(QuestionSerializer.Meta):
        fields = QuestionSerializer.Meta.fields + ['answers']

# class ViewCountSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ViewCount
#         fields = '__all__'

class ViewCountSerializer(serializers.ModelSerializer):
    class Meta:
        model = ViewCount
        fields = ['question', 'viewed_at']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None
        return ViewCount.objects.create(user=user, **validated_data)

class QuestionTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionTag
        fields = '__all__'

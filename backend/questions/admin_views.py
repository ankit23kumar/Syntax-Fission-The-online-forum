from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import Question
from .serializers import QuestionSerializer

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_questions(request):
    questions = Question.objects.all().select_related('user')
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_question(request, pk):
    try:
        q = Question.objects.get(pk=pk)
        q.delete()
        return Response(status=204)
    except Question.DoesNotExist:
        return Response({"error": "Question not found"}, status=404)

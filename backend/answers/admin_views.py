from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import Answer
from .serializers import AnswerSerializer

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_answers(request):
    answers = Answer.objects.select_related('question', 'user').all()
    return Response(AnswerSerializer(answers, many=True).data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_answer(request, pk):
    try:
        answer = Answer.objects.get(pk=pk)
        answer.delete()
        return Response(status=204)
    except Answer.DoesNotExist:
        return Response({"error": "Answer not found"}, status=404)

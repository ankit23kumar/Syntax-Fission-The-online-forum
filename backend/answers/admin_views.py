# answers/admin_views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import Answer
# +++ Import our new serializer +++
from .serializers import AdminAnswerSerializer

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_answers(request):
    answers = Answer.objects.select_related('question', 'user').all().order_by('-created_at')
    # +++ Use the new serializer +++
    serializer = AdminAnswerSerializer(answers, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_answer(request, pk):
    try:
        answer = Answer.objects.get(pk=pk)
        answer.delete()
        return Response(status=204)
    except Answer.DoesNotExist:
        return Response({"error": "Answer not found"}, status=404)
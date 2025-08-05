from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import Vote
from .serializers import VoteSerializer

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_votes(request):
    votes = Vote.objects.select_related('user') 
    return Response(VoteSerializer(votes, many=True).data)
    # return Response(VoteSerializer(Vote.objects.select_related('user', 'question', 'answer'), many=True).data)

# votes/admin_views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status # +++ Import status
from .models import Vote
# +++ Import our new serializer +++
from .serializers import AdminVoteSerializer

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_votes(request):
    votes = Vote.objects.select_related('user').all().order_by('-created_at')
    # Use the new serializer to get rich data
    serializer = AdminVoteSerializer(votes, many=True)
    return Response(serializer.data)

# +++ NEW: View to handle deleting a vote +++
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_vote(request, pk):
    try:
        vote = Vote.objects.get(pk=pk)
        vote.delete()
        # Return 204 No Content on successful deletion
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Vote.DoesNotExist:
        return Response({"error": "Vote not found"}, status=status.HTTP_404_NOT_FOUND)
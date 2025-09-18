# notifications/admin_views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status # +++ Import status
from .models import Notification
# +++ Import our new serializer +++
from .serializers import AdminNotificationSerializer

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_notifications(request):
    notifications = Notification.objects.select_related('user').all().order_by('-created_at')
    # +++ Use the new serializer to get rich user data +++
    serializer = AdminNotificationSerializer(notifications, many=True)
    return Response(serializer.data)

# +++ NEW: View to handle deleting a notification +++
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_notification(request, pk):
    try:
        notification = Notification.objects.get(pk=pk)
        notification.delete()
        # Return 204 No Content on successful deletion
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)
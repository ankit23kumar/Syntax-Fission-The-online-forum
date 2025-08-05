from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_notifications(request):
    # return Response(NotificationSerializer(Notification.objects.select_related('recipient').all(), many=True).data)
    notifications = Notification.objects.select_related('user')  # Use actual FK field
    return Response(NotificationSerializer(notifications, many=True).data)
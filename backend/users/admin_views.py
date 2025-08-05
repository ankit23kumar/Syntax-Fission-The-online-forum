from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer, PasswordUpdateSerializer

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_user_admin(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    data = request.data

    # Fields allowed to be updated via admin
    editable_fields = ['name', 'bio', 'is_active', 'is_admin', 'is_staff']

    for field in editable_fields:
        if field in data:
            setattr(user, field, data[field])

    # Handle profile picture separately (expects multipart/form-data)
    if request.FILES.get('profile_picture'):
        user.profile_picture = request.FILES['profile_picture']

    user.save()
    return Response({"message": "User updated successfully"})

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
        user.delete()
        return Response(status=204)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def admin_reset_password(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    serializer = PasswordUpdateSerializer(data=request.data)
    if serializer.is_valid():
        user.set_password(serializer.validated_data['password'])
        user.save()
        return Response({"message": "Password updated successfully"})
    return Response(serializer.errors, status=400)

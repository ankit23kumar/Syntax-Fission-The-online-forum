from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import Tag
from .serializers import TagSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def tags_list_create(request):
    if request.method == 'GET':
        tags = Tag.objects.all()
        return Response(TagSerializer(tags, many=True).data)
    elif request.method == 'POST':
        serializer = TagSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAdminUser])
def update_or_delete_tag(request, pk):
    try:
        tag = Tag.objects.get(pk=pk)
    except Tag.DoesNotExist:
        return Response({"error": "Tag not found"}, status=404)

    if request.method == 'PUT':
        serializer = TagSerializer(tag, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        tag.delete()
        return Response(status=204)


# @api_view(['DELETE'])
# @permission_classes([IsAdminUser])
# def delete_tag(request, pk):
#     try:
#         tag = Tag.objects.get(pk=pk)
#         tag.delete()
#         return Response(status=204)
#     except Tag.DoesNotExist:
#         return Response({"error": "Tag not found"}, status=404)

# @api_view(['PUT'])
# @permission_classes([IsAdminUser])
# def update_tag(request, pk):
#     try:
#         tag = Tag.objects.get(pk=pk)
#     except Tag.DoesNotExist:
#         return Response({"error": "Tag not found"}, status=404)

#     serializer = TagSerializer(tag, data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data)
#     return Response(serializer.errors, status=400)

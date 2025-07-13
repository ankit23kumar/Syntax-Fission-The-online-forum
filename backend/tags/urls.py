# from django.urls import path
# from rest_framework.routers import DefaultRouter
# from .views import TagViewSet

# router = DefaultRouter()
# router.register(r'', TagViewSet, basename='tag')

# urlpatterns = router.urls


from django.urls import path
from .views import TagListCreateView

urlpatterns = [
    path('',TagListCreateView.as_view,name="TagListCreateView"),
]

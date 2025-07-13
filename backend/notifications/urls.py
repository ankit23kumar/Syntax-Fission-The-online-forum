# from django.urls import path
# from rest_framework.routers import DefaultRouter
# from .views import NotificationViewSet

# router = DefaultRouter()
# router.register(r'', NotificationViewSet, basename='notification')

# urlpatterns = router.urls

from django.urls import path

from .views import NotificationListView, NotificationUpdateView

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('<int:notification_id>/', NotificationUpdateView.as_view(), name='notification-update'),
]

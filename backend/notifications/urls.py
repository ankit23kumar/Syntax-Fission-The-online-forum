# notifications/urls.py

from django.urls import path

from .views import NotificationListView, NotificationUpdateView, MarkAllNotificationsReadView

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('<int:notification_id>/', NotificationUpdateView.as_view(), name='notification-update'),
    path('mark-all-read/', MarkAllNotificationsReadView.as_view(), name='mark-all-read'),

]

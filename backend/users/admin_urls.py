from django.urls import path
from . import admin_views

urlpatterns = [
    path("", admin_views.get_all_users, name="admin-user-list"),
    path("<int:pk>/", admin_views.update_user_admin, name="admin-user-update"),
    path("<int:pk>/delete/", admin_views.delete_user, name="admin-user-delete"),
    path("<int:pk>/reset-password/", admin_views.admin_reset_password, name="admin-user-reset-password"),
]

from django.urls import path
from . import admin_views

urlpatterns = [
    path("", admin_views.tags_list_create, name="admin-tags-list-create"),
    path("<int:pk>/", admin_views.update_or_delete_tag, name="admin-tags-update-delete"),
]
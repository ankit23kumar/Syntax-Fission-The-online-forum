#users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    model = User
    list_display = ('user_id', 'name', 'email', 'is_admin', 'created_at')
    list_filter = ('is_admin', 'is_staff', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('name', 'bio', 'profile_picture')}),
        ('Permissions', {'fields': ('is_admin', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'created_at')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2', 'is_admin', 'is_staff')}
        ),
    )
    search_fields = ('email', 'name')
    ordering = ('created_at',)

admin.site.register(User, UserAdmin)

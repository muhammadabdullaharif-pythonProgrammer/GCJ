from rest_framework.permissions import BasePermission
from functools import wraps
from django.core.exceptions import PermissionDenied


class IsAdmin(BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'ADMIN'
        )


class IsTeacher(BasePermission):
    """
    Allows access only to teacher users.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'TEACHER'
        )


class IsStudent(BasePermission):
    """
    Allows access only to student users.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'STUDENT'
        )


def role_required(*allowed_roles):
    """
    Decorator for views that checks whether the user has one of the allowed roles.
    Works for both Django function views and REST framework API views.
    """
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            # For REST framework Request object or Django Request object
            user = getattr(request, 'user', None)
            if not user or not user.is_authenticated:
                raise PermissionDenied("Authentication credentials were not provided.")
            
            if user.role not in allowed_roles:
                raise PermissionDenied("You do not have permission to perform this action.")
            
            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator

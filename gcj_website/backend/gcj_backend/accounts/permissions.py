"""
accounts/permissions.py

Role-Based Access Control (RBAC) permission classes for GCJ.

Usage in views
--------------
    from accounts.permissions import IsAdmin, IsTeacher, IsStudent, IsAdminOrTeacher

    class SomeView(APIView):
        permission_classes = [IsAuthenticated, IsTeacher]

Usage with decorators
---------------------
    from accounts.permissions import role_required
    from rest_framework.decorators import api_view

    @api_view(['GET'])
    @role_required('TEACHER', 'ADMIN')
    def my_view(request):
        ...
"""

from functools import wraps

from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Role


# ---------------------------------------------------------------------------
# Base helper
# ---------------------------------------------------------------------------

class _RolePermission(BasePermission):
    """Abstract base that checks membership in `allowed_roles`."""

    allowed_roles: tuple[str, ...] = ()

    def has_permission(self, request, view) -> bool:
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in self.allowed_roles
        )


# ---------------------------------------------------------------------------
# Concrete permission classes
# ---------------------------------------------------------------------------

class IsAdmin(_RolePermission):
    """Allow access only to users with the ADMIN role."""

    allowed_roles = (Role.ADMIN,)
    message = 'Only admins are allowed to perform this action.'


class IsTeacher(_RolePermission):
    """Allow access only to users with the TEACHER role."""

    allowed_roles = (Role.TEACHER,)
    message = 'Only teachers are allowed to perform this action.'


class IsStudent(_RolePermission):
    """Allow access only to users with the STUDENT role."""

    allowed_roles = (Role.STUDENT,)
    message = 'Only students are allowed to perform this action.'


class IsAdminOrTeacher(_RolePermission):
    """Allow access to ADMIN or TEACHER users."""

    allowed_roles = (Role.ADMIN, Role.TEACHER)
    message = 'Only admins or teachers are allowed to perform this action.'


class IsAdminOrStudent(_RolePermission):
    """Allow access to ADMIN or STUDENT users."""

    allowed_roles = (Role.ADMIN, Role.STUDENT)
    message = 'Only admins or students are allowed to perform this action.'


class IsOwnerOrAdmin(BasePermission):
    """
    Object-level permission.
    Grants access if the requesting user owns the object (obj.user == request.user)
    OR is an ADMIN.
    """

    message = 'You do not have permission to access this resource.'

    def has_object_permission(self, request, view, obj) -> bool:
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role == Role.ADMIN:
            return True
        # Support both obj.user and obj itself being a user
        owner = getattr(obj, 'user', obj)
        return owner == request.user


# ---------------------------------------------------------------------------
# Decorator factory
# ---------------------------------------------------------------------------

def role_required(*roles: str):
    """
    Function-based view decorator that enforces role membership.

    Args:
        *roles: One or more role strings (e.g., 'ADMIN', 'TEACHER').

    Example::

        @api_view(['GET'])
        @role_required('ADMIN')
        def admin_only_view(request):
            return Response({'message': 'Hello, admin!'})
    """
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped(request, *args, **kwargs):
            if not request.user or not request.user.is_authenticated:
                return Response(
                    {'detail': 'Authentication credentials were not provided.'},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            if request.user.role not in roles:
                return Response(
                    {'detail': f'Access restricted to: {", ".join(roles)}.'},
                    status=status.HTTP_403_FORBIDDEN,
                )
            return view_func(request, *args, **kwargs)
        return _wrapped
    return decorator

from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from .models import Department
from .serializers import DepartmentSerializer
from accounts.permissions import IsAdmin


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['hod']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at', 'total_seats']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            # Allow public read
            return [permissions.AllowAny()]
        # Restrict create, update, delete to Admins
        return [permissions.IsAuthenticated(), IsAdmin()]

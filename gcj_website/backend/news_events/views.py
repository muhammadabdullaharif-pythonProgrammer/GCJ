from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from .models import NewsEvent
from .serializers import NewsEventSerializer
from accounts.permissions import IsAdmin


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class NewsEventViewSet(viewsets.ModelViewSet):
    queryset = NewsEvent.objects.all()
    serializer_class = NewsEventSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['event_date']
    search_fields = ['title', 'body']
    ordering_fields = ['created_at', 'event_date']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Only Admins can modify news or events
            return [permissions.IsAuthenticated(), IsAdmin()]
        # Allow anyone to view news or events
        return [permissions.AllowAny()]

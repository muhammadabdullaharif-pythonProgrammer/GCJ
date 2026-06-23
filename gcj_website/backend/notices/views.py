from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from .models import Notice
from .serializers import NoticeSerializer
from accounts.permissions import IsAdmin, IsTeacher


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['target_role', 'posted_by']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at']

    def get_queryset(self):
        user = self.request.user
        
        # If user is not logged in, they can only see ALL notices
        if not user or not user.is_authenticated:
            return Notice.objects.filter(target_role='ALL')
        
        # If logged in, filter by user role
        if user.role == 'ADMIN':
            return Notice.objects.all()
        elif user.role == 'TEACHER':
            return Notice.objects.filter(target_role__in=['ALL', 'TEACHER'])
        elif user.role == 'STUDENT':
            return Notice.objects.filter(target_role__in=['ALL', 'STUDENT'])
        
        return Notice.objects.filter(target_role='ALL')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Only Admin or Teacher can write announcements
            return [permissions.IsAuthenticated(), (IsAdmin | IsTeacher)]
        # Anyone can read/list notices
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)

from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from .models import Gallery
from .serializers import GallerySerializer
from accounts.permissions import IsAdmin, IsTeacher


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class GalleryViewSet(viewsets.ModelViewSet):
    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'uploaded_by']
    search_fields = ['caption']
    ordering_fields = ['created_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Only Admins and Teachers can upload/edit images in gallery
            return [permissions.IsAuthenticated(), (IsAdmin | IsTeacher)]
        # Allow anyone to view gallery images
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

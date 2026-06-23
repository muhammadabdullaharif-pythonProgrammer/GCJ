from django.utils import timezone
from rest_framework import viewsets, permissions, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination

from .models import ChatbotLog
from .serializers import ChatbotLogSerializer
from .gemini_client import get_gemini_response
from accounts.permissions import IsAdmin


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class ChatbotLogViewSet(viewsets.ModelViewSet):
    queryset = ChatbotLog.objects.all()
    serializer_class = ChatbotLogSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['session_id', 'user']
    search_fields = ['message', 'response']
    ordering_fields = ['created_at']

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            session_id = self.request.query_params.get('session_id')
            if session_id:
                return ChatbotLog.objects.filter(session_id=session_id)
            return ChatbotLog.objects.none()
        
        if user.role == 'ADMIN':
            return ChatbotLog.objects.all()
        
        return ChatbotLog.objects.filter(user=user)

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)


class ChatbotMessageView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        session_id = request.data.get('session_id')
        user_message = request.data.get('user_message')
        language = request.data.get('language', 'English')

        if not session_id or not user_message:
            return Response({"error": "session_id and user_message are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve logged in user if exists
        user = request.user if request.user.is_authenticated else None

        # Fetch response from Gemini / Fallback
        response_text = get_gemini_response(
            session_id=session_id,
            user_message=user_message,
            user=user,
            language=language
        )

        return Response({
            "response": response_text,
            "session_id": session_id,
            "timestamp": timezone.now()
        }, status=status.HTTP_200_OK)

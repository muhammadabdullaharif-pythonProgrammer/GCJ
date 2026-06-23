import os
import sys
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

# Add ai_engine directory to sys.path to allow monorepo cross-imports
from django.conf import settings
ai_engine_path = os.path.join(settings.BASE_DIR.parent.parent, 'ai_engine')
if ai_engine_path not in sys.path:
    sys.path.append(ai_engine_path)

try:
    from gemini_advisor import GCJAmiAdvisor
    advisor = GCJAmiAdvisor()
except ImportError:
    advisor = None

class AIAdvisorQueryView(APIView):
    """
    Exposes a post request endpoint to consult the GCJ Jhang Academic AI Advisor.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user_query = request.data.get('query')
        if not user_query:
            return Response(
                {"error": "The field 'query' is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check advisor import
        if not advisor:
            return Response(
                {
                    "query": user_query,
                    "response": "The GCJ AI advisor is currently offline. Please try again later."
                },
                status=status.HTTP_200_OK
            )
        
        try:
            # Get advice from Google Gemini
            advisor_response = advisor.get_advice(user_query)
            return Response({
                "query": user_query,
                "response": advisor_response
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "error": f"AI Engine execution failed: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# Quick test url configuration placeholder

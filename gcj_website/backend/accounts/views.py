from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.core.signing import Signer, BadSignature
from django.conf import settings
from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.throttling import SimpleRateThrottle

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, UserProfileUpdateSerializer

User = get_user_model()
signer = Signer()


class LoginRateThrottle(SimpleRateThrottle):
    """
    Rate limiting on login endpoint: 5 attempts per minute.
    """
    rate = '5/min'

    def get_cache_key(self, request, view):
        if request.method == 'POST':
            # Use client IP address as throttle key
            return self.get_ident(request)
        return None


class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Generate verification token
            token = signer.sign(user.email)
            verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"

            # Send verification email
            try:
                send_mail(
                    subject="Verify your GCJ Official Website account",
                    message=f"Hello {user.name},\n\nPlease verify your email by clicking the link below:\n{verification_url}\n\nThank you,\nGCJ Admin Team",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False,
                )
            except Exception as e:
                # Log the error but don't fail registration
                print(f"Error sending verification email: {e}")

            return Response({
                "message": "User registered successfully. Please check your email to verify your account.",
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        token = request.query_params.get('token')
        if not token:
            return Response({"error": "Token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            email = signer.unsign(token, max_age=86400) # Token valid for 24 hours
            user = User.objects.get(email=email)
            if user.is_email_verified:
                return Response({"message": "Email is already verified."}, status=status.HTTP_200_OK)
            
            user.is_email_verified = True
            user.save()
            return Response({"message": "Email verified successfully. You can now log in."}, status=status.HTTP_200_OK)
        except BadSignature:
            return Response({"error": "Invalid or expired verification link."}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)


class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)
    throttle_classes = (LoginRateThrottle,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])

            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Invalid token or token already blacklisted."}, status=status.HTTP_400_BAD_REQUEST)


class RefreshTokenView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            return Response({
                "access": str(token.access_token),
                "refresh": str(token)
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Invalid or expired refresh token."}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProfileUpdateView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def put(self, request):
        serializer = UserProfileUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Profile updated successfully.",
                "user": UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

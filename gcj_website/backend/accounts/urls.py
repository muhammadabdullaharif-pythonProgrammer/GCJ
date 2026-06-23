from django.urls import path
from .views import (
    RegisterView,
    VerifyEmailView,
    LoginView,
    LogoutView,
    RefreshTokenView,
    ProfileView,
    ProfileUpdateView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('verify-email/', VerifyEmailView.as_view(), name='auth_verify_email'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('token/refresh/', RefreshTokenView.as_view(), name='auth_token_refresh'),
    path('profile/', ProfileView.as_view(), name='auth_profile'),
    path('profile/update/', ProfileUpdateView.as_view(), name='auth_profile_update'),
]

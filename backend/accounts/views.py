# accounts/views.py
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from .serializers import SignupSerializer, UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated


class SignupView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = SignupSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        if serializer.is_valid():
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]
            User.objects.create_user(username=username, password=password)


class CurrentUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        user = request.user
        email = request.data.get("email")
        password = request.data.get("password")

        if email:
            user.email = email
        if password:
            user.set_password(password)
        user.save()

        return Response({
            "username": user.username,
            "email": user.email,
        }, status=status.HTTP_200_OK)

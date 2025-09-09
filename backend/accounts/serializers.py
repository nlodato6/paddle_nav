# accounts/serializers.py
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from django.contrib.auth.models import User


class SignupSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "password"]



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

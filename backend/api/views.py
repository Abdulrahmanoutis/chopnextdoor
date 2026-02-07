from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.utils import timezone
from django.shortcuts import get_object_or_404

from core.models import UserProfile as CoreUserProfile
from .models import (
    UserProfileAPI,
    KitchenAPI,
    TodayMenuAPI,
    MenuItemAPI,
    OrderAPI,
    OrderItemAPI,
    StoryAPI,
)
from .serializers import (
    UserSerializer,
    UserProfileSerializer,
    KitchenSerializer,
    TodayMenuSerializer,
    MenuItemSerializer,
    OrderSerializer,
    OrderItemSerializer,
    StorySerializer,
)

import random
import string


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfileAPI.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.AllowAny]

    def _normalize_user_types(self, user_type: str):
        api_user_type = (user_type or "CUSTOMER").upper()
        core_user_type = api_user_type.lower()
        return core_user_type, api_user_type

    @action(detail=False, methods=["post"])
    def register(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        user_type = request.data.get("user_type", "CUSTOMER")
        core_user_type, api_user_type = self._normalize_user_types(user_type)

        if not username or not password:
            return Response({"error": "username and password required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        # ensure core profile exists (used for followers/customers)
        core_profile, _ = CoreUserProfile.objects.get_or_create(
            user=user, defaults={"user_type": core_user_type}
        )
        # create API profile record
        api_profile = UserProfileAPI.objects.create(
            user=user, user_type=api_user_type, phone=request.data.get("phone", "")
        )

        return Response({"message": "User created successfully", "id": api_profile.id}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"])
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({"message": "Logged in"})
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


class KitchenViewSet(viewsets.ModelViewSet):
    queryset = KitchenAPI.objects.filter(is_active=True)
    serializer_class = KitchenSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def follow(self, request, pk=None):
        kitchen = self.get_object()
        try:
            user_profile = CoreUserProfile.objects.get(user=request.user)
        except CoreUserProfile.DoesNotExist:
            return Response({"error": "User profile not found"}, status=status.HTTP_400_BAD_REQUEST)

        if kitchen.followers.filter(id=user_profile.id).exists():
            kitchen.followers.remove(user_profile)
            return Response({"status": "unfollowed", "follower_count": kitchen.followers.count()})
        else:
            kitchen.followers.add(user_profile)
            return Response({"status": "followed", "follower_count": kitchen.followers.count()})

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def followed(self, request):
        try:
            user_profile = CoreUserProfile.objects.get(user=request.user)
        except CoreUserProfile.DoesNotExist:
            return Response([], status=status.HTTP_200_OK)
        followed_kitchens = KitchenAPI.objects.filter(followers=user_profile)
        serializer = self.get_serializer(followed_kitchens, many=True, context={"request": request})
        return Response(serializer.data)


class TodayMenuViewSet(viewsets.ModelViewSet):
    queryset = TodayMenuAPI.objects.filter(is_active=True, expires_at__gt=timezone.now())
    serializer_class = TodayMenuSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        kitchen_id = self.request.query_params.get("kitchen_id")
        if kitchen_id:
            queryset = queryset.filter(kitchen_id=kitchen_id)
        return queryset


class OrderViewSet(viewsets.ModelViewSet):
    queryset = OrderAPI.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return OrderAPI.objects.none()
        if user.is_staff or user.is_superuser:
            return OrderAPI.objects.all()
        try:
            core_profile = CoreUserProfile.objects.get(user=user)
        except CoreUserProfile.DoesNotExist:
            return OrderAPI.objects.none()
        return OrderAPI.objects.filter(customer=core_profile)

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def seller(self, request):
        try:
            core_profile = CoreUserProfile.objects.get(user=request.user)
        except CoreUserProfile.DoesNotExist:
            return Response([], status=status.HTTP_200_OK)

        if core_profile.user_type != "seller":
            return Response([], status=status.HTTP_200_OK)

        orders = OrderAPI.objects.filter(kitchen__seller=core_profile).order_by("-created_at")
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    def generate_order_number(self):
        numbers = "".join(random.choices(string.digits, k=4))
        return f"CDN-{numbers}"

    def perform_create(self, serializer):
        try:
            core_profile = CoreUserProfile.objects.get(user=self.request.user)
        except CoreUserProfile.DoesNotExist:
            core_profile = CoreUserProfile.objects.create(user=self.request.user, user_type="customer")

        serializer.save(order_number=self.generate_order_number(), customer=core_profile)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get("status")
        valid = [choice[0] for choice in OrderAPI.STATUS_CHOICES]
        if new_status in valid:
            order.status = new_status
            order.save()
            return Response({"status": "updated"})
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)


class StoryViewSet(viewsets.ModelViewSet):
    queryset = StoryAPI.objects.filter(expires_at__gt=timezone.now())
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItemAPI.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return OrderItemAPI.objects.none()
        if user.is_staff or user.is_superuser:
            return OrderItemAPI.objects.all()
        try:
            core_profile = CoreUserProfile.objects.get(user=user)
        except CoreUserProfile.DoesNotExist:
            return OrderItemAPI.objects.none()
        return OrderItemAPI.objects.filter(order__customer=core_profile)

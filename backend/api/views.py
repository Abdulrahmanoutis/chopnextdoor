from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.utils import timezone

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
    permission_classes = [permissions.IsAdminUser]


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfileAPI.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in {"register", "login"}:
            return [permissions.AllowAny()]
        return super().get_permissions()

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return UserProfileAPI.objects.none()
        if self.request.user.is_staff or self.request.user.is_superuser:
            return UserProfileAPI.objects.all()
        return UserProfileAPI.objects.filter(user=self.request.user)

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

        # Ensure seller accounts immediately have a kitchen profile.
        if core_profile.user_type == "seller":
            KitchenAPI.objects.get_or_create(
                seller=core_profile,
                defaults={
                    "name": f"{user.username} Kitchen",
                    "description": "",
                    "location": "",
                    "is_active": True,
                },
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

    def _get_core_profile(self):
        try:
            return CoreUserProfile.objects.get(user=self.request.user)
        except CoreUserProfile.DoesNotExist:
            return None

    def _require_seller_profile(self):
        core_profile = self._get_core_profile()
        if not core_profile or core_profile.user_type != "seller":
            raise PermissionDenied("Seller account required")
        return core_profile

    @action(detail=False, methods=["get", "patch"], permission_classes=[permissions.IsAuthenticated])
    def mine(self, request):
        core_profile = self._get_core_profile()
        if not core_profile:
            return Response({"error": "User profile not found"}, status=status.HTTP_400_BAD_REQUEST)

        kitchen = KitchenAPI.objects.filter(seller=core_profile).first()
        if not kitchen:
            if core_profile.user_type != "seller":
                return Response({"error": "Kitchen not found"}, status=status.HTTP_404_NOT_FOUND)
            kitchen = KitchenAPI.objects.create(
                seller=core_profile,
                name=f"{request.user.username} Kitchen",
                description="",
                location="",
                is_active=True,
            )

        if request.method.lower() == "patch":
            serializer = self.get_serializer(kitchen, data=request.data, partial=True, context={"request": request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        serializer = self.get_serializer(kitchen, context={"request": request})
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def follow(self, request, pk=None):
        kitchen = self.get_object()
        user_profile = self._get_core_profile()
        if not user_profile:
            return Response({"error": "User profile not found"}, status=status.HTTP_400_BAD_REQUEST)

        if kitchen.followers.filter(id=user_profile.id).exists():
            kitchen.followers.remove(user_profile)
            return Response({"status": "unfollowed", "follower_count": kitchen.followers.count()})
        else:
            kitchen.followers.add(user_profile)
            return Response({"status": "followed", "follower_count": kitchen.followers.count()})

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def followed(self, request):
        user_profile = self._get_core_profile()
        if not user_profile:
            return Response([], status=status.HTTP_200_OK)
        followed_kitchens = KitchenAPI.objects.filter(followers=user_profile)
        serializer = self.get_serializer(followed_kitchens, many=True, context={"request": request})
        return Response(serializer.data)

    def perform_create(self, serializer):
        core_profile = self._require_seller_profile()
        serializer.save(seller=core_profile)

    def perform_update(self, serializer):
        if self.request.user.is_staff or self.request.user.is_superuser:
            serializer.save()
            return
        core_profile = self._require_seller_profile()
        if serializer.instance.seller_id != core_profile.id:
            raise PermissionDenied("You can only update your own kitchen")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.is_staff or self.request.user.is_superuser:
            instance.delete()
            return
        core_profile = self._require_seller_profile()
        if instance.seller_id != core_profile.id:
            raise PermissionDenied("You can only delete your own kitchen")
        instance.delete()


class TodayMenuViewSet(viewsets.ModelViewSet):
    queryset = TodayMenuAPI.objects.filter(is_active=True, expires_at__gt=timezone.now())
    serializer_class = TodayMenuSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def _require_seller_profile(self):
        try:
            core_profile = CoreUserProfile.objects.get(user=self.request.user)
        except CoreUserProfile.DoesNotExist as exc:
            raise PermissionDenied("Seller account required") from exc
        if core_profile.user_type != "seller":
            raise PermissionDenied("Seller account required")
        return core_profile

    def get_queryset(self):
        queryset = super().get_queryset()
        kitchen_id = self.request.query_params.get("kitchen_id")
        if kitchen_id:
            queryset = queryset.filter(kitchen_id=kitchen_id)
        return queryset

    def perform_create(self, serializer):
        core_profile = self._require_seller_profile()
        kitchen = serializer.validated_data["kitchen"]
        if kitchen.seller_id != core_profile.id:
            raise PermissionDenied("You can only create menus for your own kitchen")
        serializer.save()

    def perform_update(self, serializer):
        if self.request.user.is_staff or self.request.user.is_superuser:
            serializer.save()
            return
        core_profile = self._require_seller_profile()
        kitchen = serializer.instance.kitchen
        if kitchen.seller_id != core_profile.id:
            raise PermissionDenied("You can only edit menus for your own kitchen")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.is_staff or self.request.user.is_superuser:
            instance.delete()
            return
        core_profile = self._require_seller_profile()
        if instance.kitchen.seller_id != core_profile.id:
            raise PermissionDenied("You can only delete menus for your own kitchen")
        instance.delete()


class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItemAPI.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def _require_seller_profile(self):
        try:
            core_profile = CoreUserProfile.objects.get(user=self.request.user)
        except CoreUserProfile.DoesNotExist as exc:
            raise PermissionDenied("Seller account required") from exc
        if core_profile.user_type != "seller":
            raise PermissionDenied("Seller account required")
        return core_profile

    def perform_create(self, serializer):
        core_profile = self._require_seller_profile()
        menu = serializer.validated_data["today_menu"]
        if menu.kitchen.seller_id != core_profile.id:
            raise PermissionDenied("You can only add items to your own menu")
        serializer.save()

    def perform_update(self, serializer):
        if self.request.user.is_staff or self.request.user.is_superuser:
            serializer.save()
            return
        core_profile = self._require_seller_profile()
        if serializer.instance.today_menu.kitchen.seller_id != core_profile.id:
            raise PermissionDenied("You can only edit items in your own menu")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.is_staff or self.request.user.is_superuser:
            instance.delete()
            return
        core_profile = self._require_seller_profile()
        if instance.today_menu.kitchen.seller_id != core_profile.id:
            raise PermissionDenied("You can only delete items from your own menu")
        instance.delete()


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

        kitchen = serializer.validated_data["kitchen"]
        today_menu = serializer.validated_data["today_menu"]
        if today_menu.kitchen_id != kitchen.id:
            raise ValidationError({"today_menu": "Selected menu does not belong to this kitchen"})
        if not today_menu.is_active or today_menu.expires_at <= timezone.now():
            raise ValidationError({"today_menu": "Selected menu is not active"})

        serializer.save(order_number=self.generate_order_number(), customer=core_profile)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def update_status(self, request, pk=None):
        order = OrderAPI.objects.filter(pk=pk).select_related("kitchen__seller").first()
        if not order:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        if not request.user.is_staff and not request.user.is_superuser:
            try:
                core_profile = CoreUserProfile.objects.get(user=request.user)
            except CoreUserProfile.DoesNotExist:
                return Response({"error": "User profile not found"}, status=status.HTTP_403_FORBIDDEN)
            if core_profile.user_type != "seller" or order.kitchen.seller_id != core_profile.id:
                return Response({"error": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

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

    def perform_create(self, serializer):
        if self.request.user.is_staff or self.request.user.is_superuser:
            serializer.save()
            return

        try:
            core_profile = CoreUserProfile.objects.get(user=self.request.user)
        except CoreUserProfile.DoesNotExist as exc:
            raise PermissionDenied("User profile not found") from exc

        order = serializer.validated_data["order"]
        menu_item = serializer.validated_data["menu_item"]
        if order.customer_id != core_profile.id:
            raise PermissionDenied("You can only add items to your own order")
        if menu_item.today_menu_id != order.today_menu_id:
            raise ValidationError({"menu_item_id": "Menu item is not part of the selected order menu"})
        serializer.save()

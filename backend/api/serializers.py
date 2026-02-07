from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils import timezone

from .models import (
    UserProfileAPI,
    KitchenAPI,
    TodayMenuAPI,
    MenuItemAPI,
    OrderAPI,
    OrderItemAPI,
    StoryAPI,
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserProfileAPI
        fields = ["id", "user", "user_type", "phone", "address", "profile_image", "created_at"]
        depth = 1


class KitchenSerializer(serializers.ModelSerializer):
    follower_count = serializers.IntegerField(read_only=True)
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = KitchenAPI
        fields = [
            "id",
            "name",
            "description",
            "location",
            "cover_image",
            "logo",
            "rating",
            "follower_count",
            "is_following",
            "seller",
            "is_active",
            "created_at",
        ]

    def get_is_following(self, obj):
        request = self.context.get("request")
        if request and request.user and request.user.is_authenticated:
            return obj.followers.filter(user=request.user).exists()
        return False


class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItemAPI
        fields = ["id", "name", "description", "price", "image", "stock", "is_available"]


class TodayMenuSerializer(serializers.ModelSerializer):
    items = MenuItemSerializer(many=True, read_only=True)
    time_remaining = serializers.SerializerMethodField()

    class Meta:
        model = TodayMenuAPI
        fields = ["id", "kitchen", "is_active", "expires_at", "items", "time_remaining"]

    def get_time_remaining(self, obj):
        if obj.expires_at and obj.expires_at > timezone.now():
            diff = obj.expires_at - timezone.now()
            total_seconds = int(diff.total_seconds())
            hours = total_seconds // 3600
            minutes = (total_seconds % 3600) // 60
            seconds = total_seconds % 60
            return f"{hours:02d}:{minutes:02d}:{seconds:02d}"
        return "EXPIRED"


class OrderItemSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer(read_only=True)
    order = serializers.PrimaryKeyRelatedField(queryset=OrderAPI.objects.all())
    menu_item_id = serializers.PrimaryKeyRelatedField(
        source="menu_item", queryset=MenuItemAPI.objects.all(), write_only=True
    )

    class Meta:
        model = OrderItemAPI
        fields = ["id", "order", "menu_item", "menu_item_id", "quantity", "price_at_time"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    kitchen_name = serializers.CharField(source="kitchen.name", read_only=True)
    order_number = serializers.CharField(read_only=True)
    customer = serializers.PrimaryKeyRelatedField(read_only=True)
    customer_name = serializers.CharField(source="customer.user.username", read_only=True)

    class Meta:
        model = OrderAPI
        fields = [
            "id",
            "order_number",
            "customer",
            "customer_name",
            "today_menu",
            "kitchen",
            "kitchen_name",
            "status",
            "total_amount",
            "pickup_time",
            "delivery_address",
            "is_delivery",
            "payment_method",
            "payment_status",
            "items",
            "created_at",
        ]

    def validate(self, data):
        # Basic validation example: pickup_time must be in the future
        pickup = data.get("pickup_time")
        if pickup and pickup <= timezone.now():
            raise serializers.ValidationError({"pickup_time": "pickup_time must be in the future"})
        return data


class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryAPI
        fields = ["id", "kitchen", "image", "caption", "created_at", "expires_at"]

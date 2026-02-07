from django.contrib import admin
from .models import (
    UserProfileAPI,
    KitchenAPI,
    TodayMenuAPI,
    MenuItemAPI,
    OrderAPI,
    StoryAPI,
)


@admin.register(UserProfileAPI)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "user_type", "phone", "created_at"]
    list_filter = ["user_type"]
    search_fields = ["user__username", "phone"]


@admin.register(KitchenAPI)
class KitchenAdmin(admin.ModelAdmin):
    list_display = ["name", "seller", "location", "rating", "follower_count", "is_active", "created_at"]
    list_filter = ["is_active", "location"]
    search_fields = ["name", "seller__user__username"]

    def follower_count(self, obj):
        return obj.followers.count()

    follower_count.short_description = "follower_count"


@admin.register(TodayMenuAPI)
class TodayMenuAdmin(admin.ModelAdmin):
    list_display = ["kitchen", "expires_at", "is_active", "created_at"]
    list_filter = ["is_active", "expires_at"]
    search_fields = ["kitchen__name"]


@admin.register(MenuItemAPI)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ["name", "today_menu", "price", "stock", "is_available"]
    list_filter = ["is_available"]
    search_fields = ["name", "today_menu__kitchen__name"]


@admin.register(OrderAPI)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["order_number", "customer", "kitchen", "status", "total_amount", "created_at"]
    list_filter = ["status", "payment_method"]
    search_fields = ["order_number", "customer__user__username"]


@admin.register(StoryAPI)
class StoryAdmin(admin.ModelAdmin):
    list_display = ["kitchen", "caption", "created_at", "expires_at"]
    list_filter = ["expires_at"]
    search_fields = ["kitchen__name", "caption"]

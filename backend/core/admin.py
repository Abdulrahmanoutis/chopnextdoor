from django.contrib import admin
from . import models


@admin.register(models.UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "user_type", "phone", "created_at")


@admin.register(models.Kitchen)
class KitchenAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "rating", "is_live", "created_at")
    search_fields = ("name", "owner__username")


class MenuItemInline(admin.TabularInline):
    model = models.MenuItem
    extra = 0


@admin.register(models.TodayMenu)
class TodayMenuAdmin(admin.ModelAdmin):
    list_display = ("kitchen", "title", "starts_at", "expires_at", "is_active")
    inlines = [MenuItemInline]


@admin.register(models.MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ("name", "kitchen", "price", "stock", "is_available")
    search_fields = ("name", "kitchen__name")


class OrderItemInline(admin.TabularInline):
    model = models.OrderItem
    readonly_fields = ("price",)
    extra = 0


@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "kitchen", "customer", "status", "total", "created_at")
    inlines = [OrderItemInline]
    list_filter = ("status",)


@admin.register(models.Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ("id", "kitchen", "created_at", "expires_at", "is_active")

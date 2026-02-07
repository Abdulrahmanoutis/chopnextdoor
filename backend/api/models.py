from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

from core.models import UserProfile


class UserProfileAPI(models.Model):
    # Mirror of core.UserProfile for API examples (kept separate intentionally)
    USER_TYPES = [
        ("CUSTOMER", "Customer"),
        ("SELLER", "Seller"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default="CUSTOMER")
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to="profiles/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} ({self.user_type})"


class KitchenAPI(models.Model):
    seller = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="kitchens")
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    cover_image = models.ImageField(upload_to="kitchen_covers/", blank=True, null=True)
    logo = models.ImageField(upload_to="kitchen_logos/", blank=True, null=True)
    rating = models.FloatField(default=0.0)
    is_active = models.BooleanField(default=True)
    followers = models.ManyToManyField(UserProfile, related_name="following", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def follower_count(self):
        return self.followers.count()


class TodayMenuAPI(models.Model):
    kitchen = models.ForeignKey(KitchenAPI, on_delete=models.CASCADE, related_name="today_menus")
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"{self.kitchen.name}'s Menu ({self.expires_at})"


class MenuItemAPI(models.Model):
    today_menu = models.ForeignKey(TodayMenuAPI, on_delete=models.CASCADE, related_name="items")
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="menu_items/", blank=True, null=True)
    stock = models.IntegerField(default=0)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class OrderAPI(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("CONFIRMED", "Confirmed"),
        ("PREPARING", "Preparing"),
        ("READY", "Ready"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
    ]

    customer = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="orders")
    kitchen = models.ForeignKey(KitchenAPI, on_delete=models.CASCADE, related_name="orders")
    today_menu = models.ForeignKey(TodayMenuAPI, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    pickup_time = models.DateTimeField()
    delivery_address = models.TextField(blank=True)
    is_delivery = models.BooleanField(default=False)
    payment_method = models.CharField(max_length=20, choices=[("ONLINE", "Online"), ("CASH", "Cash on Delivery")])
    payment_status = models.BooleanField(default=False)
    order_number = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.order_number}"


class OrderItemAPI(models.Model):
    order = models.ForeignKey(OrderAPI, on_delete=models.CASCADE, related_name="items")
    menu_item = models.ForeignKey(MenuItemAPI, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price_at_time = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name}"


class StoryAPI(models.Model):
    kitchen = models.ForeignKey(KitchenAPI, on_delete=models.CASCADE, related_name="stories")
    image = models.ImageField(upload_to="stories/", blank=True, null=True)
    caption = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"Story by {self.kitchen.name}"

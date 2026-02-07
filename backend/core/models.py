from django.db import models
from django.conf import settings
from django.utils import timezone


class UserProfile(models.Model):
    USER_TYPE_CUSTOMER = "customer"
    USER_TYPE_SELLER = "seller"
    USER_TYPE_CHOICES = [
        (USER_TYPE_CUSTOMER, "Customer"),
        (USER_TYPE_SELLER, "Seller"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile"
    )
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default=USER_TYPE_CUSTOMER)
    phone = models.CharField(max_length=30, blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} ({self.user_type})"


class Kitchen(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="kitchens")
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, blank=True, null=True)
    description = models.TextField(blank=True)
    avatar = models.ImageField(upload_to="kitchens/avatars/", blank=True, null=True)
    cover_image = models.ImageField(upload_to="kitchens/covers/", blank=True, null=True)
    tags = models.JSONField(default=list, blank=True)
    followers = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="followed_kitchens", blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    is_live = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class TodayMenu(models.Model):
    kitchen = models.ForeignKey(Kitchen, on_delete=models.CASCADE, related_name="today_menus")
    title = models.CharField(max_length=150, blank=True)
    description = models.TextField(blank=True)
    starts_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-starts_at"]

    def __str__(self):
        return f"{self.kitchen.name} — {self.title or 'Today'}"

    def save(self, *args, **kwargs):
        # auto-set is_active based on expiry
        if self.expires_at and timezone.now() > self.expires_at:
            self.is_active = False
        super().save(*args, **kwargs)


class MenuItem(models.Model):
    menu = models.ForeignKey(TodayMenu, on_delete=models.CASCADE, related_name="items")
    kitchen = models.ForeignKey(Kitchen, on_delete=models.CASCADE, related_name="menu_items")
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    is_available = models.BooleanField(default=True)
    image = models.ImageField(upload_to="menu_items/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.kitchen.name}"


class Order(models.Model):
    STATUS_PENDING = "pending"
    STATUS_ACCEPTED = "accepted"
    STATUS_PREPARING = "preparing"
    STATUS_OUT_FOR_DELIVERY = "out_for_delivery"
    STATUS_DELIVERED = "delivered"
    STATUS_CANCELLED = "cancelled"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_ACCEPTED, "Accepted"),
        (STATUS_PREPARING, "Preparing"),
        (STATUS_OUT_FOR_DELIVERY, "Out for delivery"),
        (STATUS_DELIVERED, "Delivered"),
        (STATUS_CANCELLED, "Cancelled"),
    ]

    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    kitchen = models.ForeignKey(Kitchen, on_delete=models.CASCADE, related_name="orders")
    items = models.ManyToManyField(MenuItem, through="OrderItem")
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default=STATUS_PENDING)
    delivery_address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order #{self.id} — {self.kitchen.name} — {self.status}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="order_items")
    item = models.ForeignKey(MenuItem, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.item.name}"

    @property
    def subtotal(self):
        return self.price * self.quantity


class Story(models.Model):
    kitchen = models.ForeignKey(Kitchen, on_delete=models.CASCADE, related_name="stories")
    image = models.ImageField(upload_to="stories/images/", blank=True, null=True)
    video = models.FileField(upload_to="stories/videos/", blank=True, null=True)
    caption = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Story {self.id} — {self.kitchen.name}"

    def save(self, *args, **kwargs):
        if self.expires_at and timezone.now() > self.expires_at:
            self.is_active = False
        super().save(*args, **kwargs)

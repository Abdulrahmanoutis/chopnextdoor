import os
import random
from datetime import timedelta

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "shopnextdoor_backend.settings")
import django
django.setup()

from django.utils import timezone
from django.contrib.auth import get_user_model

from core.models import UserProfile as CoreUserProfile
from api.models import (
    UserProfileAPI,
    KitchenAPI,
    TodayMenuAPI,
    MenuItemAPI,
    OrderAPI,
    OrderItemAPI,
    StoryAPI,
)

User = get_user_model()


def to_core_user_type(user_type: str) -> str:
    return user_type.lower()


def to_api_user_type(user_type: str) -> str:
    return user_type.upper()


def get_or_create_user(username, email, password, user_type="CUSTOMER"):
    user, created = User.objects.get_or_create(username=username, defaults={"email": email})
    if created:
        user.set_password(password)
        user.save()
    core_profile, _ = CoreUserProfile.objects.get_or_create(
        user=user, defaults={"user_type": to_core_user_type(user_type)}
    )
    api_profile, _ = UserProfileAPI.objects.get_or_create(
        user=user, defaults={"user_type": to_api_user_type(user_type)}
    )
    return user, core_profile, api_profile


def create_sample_data():
    print("Seeding ChopNextDoor sample data...")

    # Customers
    customers = [
        ("alice", "alice@example.com", "password123"),
        ("bob", "bob@example.com", "password123"),
    ]
    customer_profiles = []
    for u, e, p in customers:
        user, core_profile, api_profile = get_or_create_user(u, e, p, user_type="CUSTOMER")
        customer_profiles.append(core_profile)

    # Sellers / Kitchens (Kano-based)
    sellers = [
        {
            "username": "kano_seller1",
            "email": "seller1@kano.com",
            "password": "sellerpass",
            "kitchen": "Nasarawa Eats",
            "location": "Nasarawa GRA",
            "specials": [
                ("Tuwo Shinkafa", "Rice meal served with miyan kuka", 1200),
                ("Miyan Kuka", "Baobab leaf soup", 800),
            ],
        },
        {
            "username": "kano_seller2",
            "email": "seller2@kano.com",
            "password": "sellerpass",
            "kitchen": "Sabon Gari Suya",
            "location": "Sabon Gari",
            "specials": [
                ("Suya", "Spicy skewered beef", 600),
                ("Kilishi", "Air-dried spiced beef", 700),
            ],
        },
        {
            "username": "kano_seller3",
            "email": "seller3@kano.com",
            "password": "sellerpass",
            "kitchen": "Tarauni Masa",
            "location": "Tarauni",
            "specials": [
                ("Masa", "Fermented rice cake", 300),
                ("Fura da Nono", "Millet balls with fermented milk", 250),
            ],
        },
    ]

    kitchens = []
    for s in sellers:
        user, core_profile, api_profile = get_or_create_user(
            s["username"], s["email"], s["password"], user_type="SELLER"
        )

        kitchen_obj, created = KitchenAPI.objects.get_or_create(
            name=s["kitchen"],
            defaults={
                "seller": core_profile,
                "description": f"Traditional Kano flavors from {s['location']}",
                "location": s["location"],
                "rating": round(random.uniform(3.5, 5.0), 2),
                "is_active": True,
            },
        )
        if not created:
            # ensure seller relationship
            kitchen_obj.seller = core_profile
            kitchen_obj.location = s["location"]
            kitchen_obj.is_active = True
            kitchen_obj.save()

        kitchens.append((kitchen_obj, s["specials"]))

    # Create TodayMenus and MenuItems
    for kitchen, specials in kitchens:
        expires = timezone.now() + timedelta(days=1)
        menu, _ = TodayMenuAPI.objects.update_or_create(
            kitchen=kitchen, defaults={"expires_at": expires, "is_active": True}
        )

        for name, desc, price in specials:
            MenuItemAPI.objects.update_or_create(
                today_menu=menu,
                name=name,
                defaults={
                    "description": desc,
                    "price": price,
                    "stock": 20,
                    "is_available": True,
                },
            )

    # Create a few orders for customers
    for idx, customer in enumerate(customer_profiles):
        # choose first kitchen and first item
        if not kitchens:
            break
        kitchen_obj, specials = kitchens[idx % len(kitchens)]
        today_menu = TodayMenuAPI.objects.filter(kitchen=kitchen_obj, is_active=True).first()
        if not today_menu:
            continue
        item = today_menu.items.first()
        if not item:
            continue

        order_number = f"CDN-{random.randint(1000,9999)}"
        total = item.price * 2
        order, ocreated = OrderAPI.objects.get_or_create(
            order_number=order_number,
            defaults={
                "customer": customer,
                "kitchen": kitchen_obj,
                "today_menu": today_menu,
                "status": OrderAPI.STATUS_CHOICES[0][0],
                "total_amount": total,
                "pickup_time": timezone.now() + timedelta(hours=1),
                "is_delivery": False,
                "payment_method": "CASH",
                "payment_status": False,
            },
        )
        if ocreated:
            OrderItemAPI.objects.create(order=order, menu_item=item, quantity=2, price_at_time=item.price)

    # Create stories for each kitchen
    for kitchen, _ in kitchens:
        expires = timezone.now() + timedelta(days=1)
        StoryAPI.objects.update_or_create(
            kitchen=kitchen,
            caption=f"Fresh from {kitchen.location}: try our specialty!",
            defaults={"expires_at": expires},
        )

    print("Seeding complete.")


if __name__ == "__main__":
    create_sample_data()

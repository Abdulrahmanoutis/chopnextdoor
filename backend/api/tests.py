from datetime import timedelta

from django.contrib.auth.models import User
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase

from core.models import UserProfile
from api.models import KitchenAPI, TodayMenuAPI, OrderAPI
from api.serializers import TodayMenuSerializer


class TodayMenuSerializerTests(APITestCase):
    def setUp(self):
        seller_user = User.objects.create_user(username="seller_test", password="pass12345")
        seller_profile = UserProfile.objects.create(user=seller_user, user_type="seller")
        self.kitchen = KitchenAPI.objects.create(name="Test Kitchen", seller=seller_profile, is_active=True)

    def test_time_remaining_for_active_menu(self):
        menu = TodayMenuAPI.objects.create(
            kitchen=self.kitchen,
            is_active=True,
            expires_at=timezone.now() + timedelta(minutes=30),
        )

        data = TodayMenuSerializer(menu).data
        self.assertIn("time_remaining", data)
        self.assertNotEqual(data["time_remaining"], "EXPIRED")

    def test_time_remaining_for_expired_menu(self):
        menu = TodayMenuAPI.objects.create(
            kitchen=self.kitchen,
            is_active=False,
            expires_at=timezone.now() - timedelta(minutes=1),
        )

        data = TodayMenuSerializer(menu).data
        self.assertEqual(data["time_remaining"], "EXPIRED")


class KitchenFollowTests(APITestCase):
    def setUp(self):
        seller_user = User.objects.create_user(username="seller_follow", password="pass12345")
        seller_profile = UserProfile.objects.create(user=seller_user, user_type="seller")
        self.kitchen = KitchenAPI.objects.create(name="Follow Kitchen", seller=seller_profile, is_active=True)

        self.buyer_user = User.objects.create_user(username="buyer_follow", password="pass12345")
        self.buyer_profile = UserProfile.objects.create(user=self.buyer_user, user_type="customer")

    def test_follow_and_unfollow_toggle(self):
        self.client.force_authenticate(user=self.buyer_user)
        url = reverse("kitchenapi-follow", kwargs={"pk": self.kitchen.pk})

        follow_response = self.client.post(url)
        self.assertEqual(follow_response.status_code, 200)
        self.assertEqual(follow_response.data["status"], "followed")
        self.assertTrue(self.kitchen.followers.filter(id=self.buyer_profile.id).exists())

        unfollow_response = self.client.post(url)
        self.assertEqual(unfollow_response.status_code, 200)
        self.assertEqual(unfollow_response.data["status"], "unfollowed")
        self.assertFalse(self.kitchen.followers.filter(id=self.buyer_profile.id).exists())


class SellerPermissionTests(APITestCase):
    def setUp(self):
        self.seller_user = User.objects.create_user(username="seller_owner", password="pass12345")
        self.seller_profile = UserProfile.objects.create(user=self.seller_user, user_type="seller")
        self.kitchen = KitchenAPI.objects.create(name="Owner Kitchen", seller=self.seller_profile, is_active=True)
        self.today_menu = TodayMenuAPI.objects.create(
            kitchen=self.kitchen,
            is_active=True,
            expires_at=timezone.now() + timedelta(hours=2),
        )

        self.other_seller_user = User.objects.create_user(username="other_seller", password="pass12345")
        self.other_seller_profile = UserProfile.objects.create(user=self.other_seller_user, user_type="seller")
        self.other_kitchen = KitchenAPI.objects.create(
            name="Other Kitchen", seller=self.other_seller_profile, is_active=True
        )

        self.customer_user = User.objects.create_user(username="buyer_one", password="pass12345")
        self.customer_profile = UserProfile.objects.create(user=self.customer_user, user_type="customer")
        self.order = OrderAPI.objects.create(
            order_number="CDN-9001",
            customer=self.customer_profile,
            kitchen=self.kitchen,
            today_menu=self.today_menu,
            status="PENDING",
            total_amount=2500,
            pickup_time=timezone.now() + timedelta(hours=1),
            is_delivery=False,
            payment_method="CASH",
            payment_status=False,
        )

    def test_customer_cannot_create_today_menu(self):
        self.client.force_authenticate(user=self.customer_user)
        response = self.client.post(
            reverse("todaymenuapi-list"),
            {
                "kitchen": self.kitchen.id,
                "is_active": True,
                "expires_at": (timezone.now() + timedelta(hours=1)).isoformat(),
            },
            format="json",
        )
        self.assertEqual(response.status_code, 403)

    def test_seller_cannot_create_menu_for_another_seller_kitchen(self):
        self.client.force_authenticate(user=self.seller_user)
        response = self.client.post(
            reverse("todaymenuapi-list"),
            {
                "kitchen": self.other_kitchen.id,
                "is_active": True,
                "expires_at": (timezone.now() + timedelta(hours=1)).isoformat(),
            },
            format="json",
        )
        self.assertEqual(response.status_code, 403)

    def test_customer_cannot_update_order_status(self):
        self.client.force_authenticate(user=self.customer_user)
        response = self.client.post(
            reverse("orderapi-update-status", kwargs={"pk": self.order.id}),
            {"status": "CONFIRMED"},
            format="json",
        )
        self.assertEqual(response.status_code, 403)

    def test_kitchen_owner_can_update_order_status(self):
        self.client.force_authenticate(user=self.seller_user)
        response = self.client.post(
            reverse("orderapi-update-status", kwargs={"pk": self.order.id}),
            {"status": "CONFIRMED"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, "CONFIRMED")

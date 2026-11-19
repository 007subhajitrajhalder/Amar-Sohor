import unittest
from helpers import ApiTestCase


class AuthEndpointsTests(ApiTestCase):
    def test_register_success(self):
        status_code, body = self.request(
            method="POST",
            path="/auth/register",
            body={
                "full_name": "New Citizen",
                "email": "newcitizen@example.com",
                "phone": "9876543210",
                "password": "strongPassword123"
            }
        )
        self.assertEqual(status_code, 201)
        self.assertEqual(body["full_name"], "New Citizen")
        self.assertEqual(body["email"], "newcitizen@example.com")
        self.assertEqual(body["phone"], "9876543210")
        self.assertEqual(body["role"], "USER")
        self.assertIn("user_id", body)

    def test_register_duplicate_email_rejected(self):
        # user1@example.com was seeded in helpers
        status_code, body = self.request(
            method="POST",
            path="/auth/register",
            body={
                "full_name": "Duplicate Email",
                "email": "user1@example.com",
                "phone": "9998887776",
                "password": "password123"
            }
        )
        self.assertEqual(status_code, 409)
        self.assertEqual(body["detail"], "Email already registered")

    def test_register_duplicate_phone_rejected(self):
        # 5550001 was seeded for user 1
        status_code, body = self.request(
            method="POST",
            path="/auth/register",
            body={
                "full_name": "Duplicate Phone",
                "email": "unique@example.com",
                "phone": "5550001",
                "password": "password123"
            }
        )
        self.assertEqual(status_code, 409)
        self.assertEqual(body["detail"], "Phone number already registered")

    def test_login_success(self):
        # Register a user first
        self.request(
            method="POST",
            path="/auth/register",
            body={
                "full_name": "Login Test",
                "email": "logintest@example.com",
                "phone": "9123456789",
                "password": "mypassword123"
            }
        )

        status_code, body = self.request(
            method="POST",
            path="/auth/login",
            body={
                "email": "logintest@example.com",
                "password": "mypassword123"
            }
        )
        self.assertEqual(status_code, 200)
        self.assertIn("access_token", body)
        self.assertEqual(body["token_type"], "bearer")
        self.assertEqual(body["user"]["email"], "logintest@example.com")
        self.assertEqual(body["user"]["role"], "USER")

    def test_login_invalid_password_rejected(self):
        self.request(
            method="POST",
            path="/auth/register",
            body={
                "full_name": "Login Fail Test",
                "email": "failtest@example.com",
                "phone": "9123456788",
                "password": "correctPassword"
            }
        )

        status_code, body = self.request(
            method="POST",
            path="/auth/login",
            body={
                "email": "failtest@example.com",
                "password": "wrongPassword"
            }
        )
        self.assertEqual(status_code, 401)
        self.assertEqual(body["detail"], "Invalid email or password")

    def test_get_me_with_token(self):
        # user 3 is seeded with role "USER"
        status_code, body = self.request(
            method="GET",
            path="/auth/me",
            user_id=3
        )
        self.assertEqual(status_code, 200)
        self.assertEqual(body["user_id"], 3)
        self.assertEqual(body["role"], "USER")

    def test_get_me_unauthorized_without_token(self):
        status_code, body = self.request(
            method="GET",
            path="/auth/me"
        )
        self.assertEqual(status_code, 401)

    def test_update_my_profile_success(self):
        status_code, body = self.request(
            method="PUT",
            path="/users/me",
            user_id=3,
            body={
                "full_name": "Updated Citizen Name",
                "email": "updated.citizen@example.com",
                "phone": "5559998888"
            }
        )
        self.assertEqual(status_code, 200)
        self.assertEqual(body["full_name"], "Updated Citizen Name")
        self.assertEqual(body["email"], "updated.citizen@example.com")
        self.assertEqual(body["phone"], "5559998888")

    def test_update_my_profile_duplicate_email_rejected(self):
        # Attempt to change user 3's email to user 1's email
        status_code, body = self.request(
            method="PUT",
            path="/users/me",
            user_id=3,
            body={
                "full_name": "Citizen",
                "email": "user1@example.com",
                "phone": "5550003"
            }
        )
        self.assertEqual(status_code, 409)
        self.assertIn("Email address is already in use", body["detail"])


if __name__ == "__main__":
    unittest.main()

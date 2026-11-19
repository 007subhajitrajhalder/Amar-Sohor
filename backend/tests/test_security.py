import unittest

import bcrypt

from app.core.security import hash_password, verify_password


class PasswordSecurityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.password = "dashboard-test-password"
        cls.password_hash = hash_password(cls.password)

    def test_hash_is_compatible_with_bcrypt(self):
        self.assertNotEqual(self.password_hash, self.password)
        self.assertTrue(
            bcrypt.checkpw(self.password.encode(), self.password_hash.encode())
        )
        self.assertTrue(verify_password(self.password, self.password_hash))

    def test_incorrect_password_is_rejected(self):
        self.assertFalse(verify_password("wrong-password", self.password_hash))

    def test_existing_bcrypt_hash_variants_are_supported(self):
        for prefix in ("2a", "2b", "2y"):
            with self.subTest(prefix=prefix):
                existing_hash = "$" + prefix + self.password_hash[3:]
                self.assertTrue(verify_password(self.password, existing_hash))

    def test_invalid_stored_hash_is_rejected(self):
        for stored_hash in ("", "legacy-plaintext", "$2b$invalid"):
            with self.subTest(stored_hash=stored_hash):
                self.assertFalse(verify_password(self.password, stored_hash))

    def test_overlong_password_is_rejected_without_truncating(self):
        with self.assertRaises(ValueError):
            hash_password("x" * 73)
        self.assertFalse(verify_password("x" * 73, self.password_hash))

    def test_limit_is_measured_in_utf8_bytes(self):
        password = "\u00e9" * 36
        password_hash = hash_password(password)
        self.assertTrue(verify_password(password, password_hash))
        with self.assertRaises(ValueError):
            hash_password("\u00e9" * 37)
        self.assertFalse(verify_password("\u00e9" * 37, password_hash))


if __name__ == "__main__":
    unittest.main()

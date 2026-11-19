"""Reset an existing account locally without exposing its password in command arguments.

python scripts/reset_password.py --admin
python scripts/reset_password.py --email you@example.com
"""
import argparse
import getpass
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from sqlalchemy import select
from app.database.connection import SessionLocal
from app.models.user import User
from app.core.security import hash_password

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    target = parser.add_mutually_exclusive_group(required=True)
    target.add_argument("--admin", action="store_true", help="Select the sole existing administrator")
    target.add_argument("--email", help="Select an existing account by email")
    args = parser.parse_args()
    with SessionLocal() as db:
        records = db.scalars(select(User).where(User.role == "ADMIN" if args.admin else User.email == args.email)).all()
        if len(records) != 1:
            parser.error("Select one existing account; use --email if multiple administrators exist.")
        password = getpass.getpass("New password (at least 8 characters, input hidden): ")
        if len(password) < 8 or len(password.encode("utf-8")) > 72:
            parser.error("Password must have at least 8 characters and at most 72 UTF-8 bytes.")
        if password != getpass.getpass("Confirm new password: "):
            parser.error("Passwords do not match.")
        records[0].password_hash = hash_password(password)
        db.commit()
    print("Password updated. Sign in with the account's existing email.")

if __name__ == "__main__":
    main()

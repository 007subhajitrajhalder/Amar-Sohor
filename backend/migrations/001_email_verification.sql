-- Email OTP verification for registration.
-- Existing accounts predate verification and are marked verified.
ALTER TABLE `users`
  ADD COLUMN `email_verified` TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN `email_otp_hash` VARCHAR(255) NULL,
  ADD COLUMN `email_otp_expires_at` DATETIME NULL,
  ADD COLUMN `email_otp_attempts` INT NOT NULL DEFAULT 0,
  ADD COLUMN `email_otp_sent_at` DATETIME NULL;

UPDATE `users` SET `email_verified` = 1;

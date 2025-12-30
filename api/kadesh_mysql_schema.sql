-- MySQL Schema for Kadesh Platform (Adapted from PostgreSQL)
-- This script is compatible with the PHP Pure backend.

-- Set character set and collation
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY, -- UUID converted to VARCHAR(36)
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL, -- Renamed from password_hash for simplicity in PHP backend
    `user_type` ENUM('client', 'provider', 'admin', 'both') NOT NULL DEFAULT 'client', -- Added 'both' based on auth.js analysis
    `status` ENUM('active', 'inactive', 'suspended', 'pending') NOT NULL DEFAULT 'active',
    `avatar_url` VARCHAR(500),
    `phone` VARCHAR(20),
    `bio` TEXT,
    `website` VARCHAR(500),
    `location` VARCHAR(255),
    `timezone` VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    `language` VARCHAR(10) DEFAULT 'pt-BR',
    `email_verified` BOOLEAN DEFAULT FALSE,
    `phone_verified` BOOLEAN DEFAULT FALSE,
    `last_login` DATETIME,
    `password_reset_token` VARCHAR(255), -- Added for forgot/reset password functionality
    `password_reset_expires` DATETIME,   -- Added for forgot/reset password functionality
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `provider_profiles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `provider_profiles`;
CREATE TABLE `provider_profiles` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(255),
    `hourly_rate` DECIMAL(10,2),
    `skills` JSON, -- Converted from TEXT[]
    `experience_years` INT DEFAULT 0,
    `portfolio_url` VARCHAR(500),
    `github_url` VARCHAR(500),
    `linkedin_url` VARCHAR(500),
    `availability` VARCHAR(50) DEFAULT 'available',
    `rating` DECIMAL(3,2) DEFAULT 0.00,
    `total_reviews` INT DEFAULT 0,
    `total_projects` INT DEFAULT 0,
    `total_earnings` DECIMAL(12,2) DEFAULT 0.00,
    `response_time_hours` INT DEFAULT 24,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `projects`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `client_id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `budget` DECIMAL(10,2) NOT NULL,
    `budget_type` VARCHAR(20) DEFAULT 'fixed', -- 'fixed' or 'hourly'
    `bidding_ends_at` DATETIME, -- Renamed from 'deadline' for clarity, as seen in server.js
    `requirements` TEXT,
    `skills_required` JSON, -- Converted from TEXT[]
    `status` ENUM('open', 'in_progress', 'completed', 'cancelled', 'deleted') DEFAULT 'open',
    `priority` INT DEFAULT 3, -- 1=urgent, 2=high, 3=normal, 4=low
    `views` INT DEFAULT 0,
    `featured` BOOLEAN DEFAULT FALSE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`client_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `project_attachments`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `project_attachments`;
CREATE TABLE `project_attachments` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `project_id` VARCHAR(36) NOT NULL,
    `filename` VARCHAR(255) NOT NULL,
    `original_name` VARCHAR(255) NOT NULL,
    `file_url` VARCHAR(500) NOT NULL,
    `file_size` INT,
    `mime_type` VARCHAR(100),
    `uploaded_by` VARCHAR(36) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `bids`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `bids`;
CREATE TABLE `bids` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `project_id` VARCHAR(36) NOT NULL,
    `provider_id` VARCHAR(36) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `proposal` TEXT NOT NULL,
    `delivery_time` INT, -- in days
    `status` ENUM('pending', 'accepted', 'rejected', 'withdrawn') DEFAULT 'pending',
    `is_featured` BOOLEAN DEFAULT FALSE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_bid` (`project_id`, `provider_id`),
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`provider_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `contracts`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `contracts`;
CREATE TABLE `contracts` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `project_id` VARCHAR(36) NOT NULL,
    `client_id` VARCHAR(36) NOT NULL,
    `provider_id` VARCHAR(36) NOT NULL,
    `bid_id` VARCHAR(36) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `start_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `end_date` DATETIME,
    `actual_completion_date` DATETIME,
    `status` ENUM('open', 'in_progress', 'completed', 'cancelled', 'deleted') DEFAULT 'in_progress',
    `terms` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`client_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`provider_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`bid_id`) REFERENCES `bids`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `payments`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `contract_id` VARCHAR(36) NOT NULL,
    `payer_id` VARCHAR(36) NOT NULL,
    `receiver_id` VARCHAR(36) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `platform_fee` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `net_amount` DECIMAL(10,2) NOT NULL,
    `currency` VARCHAR(3) DEFAULT 'BRL',
    `payment_method` VARCHAR(50),
    `gateway_transaction_id` VARCHAR(255),
    `gateway_payment_id` VARCHAR(255),
    `status` ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    `processed_at` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`payer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `payment_intents`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `payment_intents`;
CREATE TABLE `payment_intents` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `payment_method` VARCHAR(50) DEFAULT 'mercadopago',
    `amount` DECIMAL(10,2) NOT NULL,
    `currency` VARCHAR(3) DEFAULT 'BRL',
    `status` ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    `description` TEXT,
    `reference_type` VARCHAR(50),
    `reference_id` VARCHAR(36),
    `preference_id` VARCHAR(255),
    `checkout_url` TEXT,
    `notification_url` TEXT,
    `gateway_payment_id` VARCHAR(255),
    `gateway_reference` VARCHAR(255),
    `metadata` JSON, -- Converted from JSONB
    `error_message` TEXT,
    `processed_at` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `wallet_transactions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `wallet_transactions`;
CREATE TABLE `wallet_transactions` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `balance_after` DECIMAL(10,2) NOT NULL,
    `description` TEXT,
    `reference_type` VARCHAR(50),
    `reference_id` VARCHAR(36),
    `metadata` JSON, -- Converted from JSONB
    `status` VARCHAR(20) DEFAULT 'completed',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `reviews`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `contract_id` VARCHAR(36) NOT NULL,
    `reviewer_id` VARCHAR(36) NOT NULL,
    `reviewed_id` VARCHAR(36) NOT NULL,
    `rating` INT NOT NULL,
    `comment` TEXT,
    `is_public` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_review` (`contract_id`, `reviewer_id`),
    CHECK (`rating` >= 1 AND `rating` <= 5), -- MySQL 8.0.16+ supports CHECK constraints
    FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`reviewed_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `messages`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `project_id` VARCHAR(36),
    `contract_id` VARCHAR(36),
    `sender_id` VARCHAR(36) NOT NULL,
    `receiver_id` VARCHAR(36) NOT NULL,
    `content` TEXT NOT NULL,
    `attachment_url` VARCHAR(500),
    `is_read` BOOLEAN DEFAULT FALSE,
    `is_system_message` BOOLEAN DEFAULT FALSE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `notifications`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL,
    `type` ENUM('project', 'bid', 'payment', 'system', 'message') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT,
    `data` JSON, -- Converted from JSONB
    `is_read` BOOLEAN DEFAULT FALSE,
    `action_url` VARCHAR(500),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `system_settings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `system_settings`;
CREATE TABLE `system_settings` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `key` VARCHAR(255) UNIQUE NOT NULL,
    `value` TEXT,
    `description` TEXT,
    `is_public` BOOLEAN DEFAULT FALSE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `file_uploads`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `file_uploads`;
CREATE TABLE `file_uploads` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL,
    `filename` VARCHAR(255) NOT NULL,
    `original_name` VARCHAR(255) NOT NULL,
    `file_url` VARCHAR(500) NOT NULL,
    `file_path` VARCHAR(500),
    `file_size` INT,
    `mime_type` VARCHAR(100),
    `category` VARCHAR(50), -- 'avatar', 'document', 'image', 'attachment'
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `admin_users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE `admin_users` (
    `id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `username` VARCHAR(100) UNIQUE NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL, -- Renamed from password_hash
    `name` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) DEFAULT 'admin', -- 'super_admin', 'admin', 'moderator'
    `permissions` JSON, -- Converted from JSONB
    `is_active` BOOLEAN DEFAULT TRUE,
    `last_login` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Indexes for better performance
-- -----------------------------------------------------
CREATE INDEX `idx_users_email` ON `users`(`email`);
CREATE INDEX `idx_users_type` ON `users`(`user_type`);
CREATE INDEX `idx_users_status` ON `users`(`status`);

CREATE INDEX `idx_projects_client_id` ON `projects`(`client_id`);
CREATE INDEX `idx_projects_status` ON `projects`(`status`);
CREATE INDEX `idx_projects_category` ON `projects`(`category`);
CREATE INDEX `idx_projects_created_at` ON `projects`(`created_at` DESC);
CREATE INDEX `idx_projects_budget` ON `projects`(`budget`);
CREATE INDEX `idx_projects_featured` ON `projects`(`featured`);

CREATE INDEX `idx_bids_project_id` ON `bids`(`project_id`);
CREATE INDEX `idx_bids_provider_id` ON `bids`(`provider_id`);
CREATE INDEX `idx_bids_status` ON `bids`(`status`);
CREATE INDEX `idx_bids_created_at` ON `bids`(`created_at` DESC);

CREATE INDEX `idx_contracts_project_id` ON `contracts`(`project_id`);
CREATE INDEX `idx_contracts_client_id` ON `contracts`(`client_id`);
CREATE INDEX `idx_contracts_provider_id` ON `contracts`(`provider_id`);
CREATE INDEX `idx_contracts_status` ON `contracts`(`status`);

CREATE INDEX `idx_payments_contract_id` ON `payments`(`contract_id`);
CREATE INDEX `idx_payments_status` ON `payments`(`status`);
CREATE INDEX `idx_payments_created_at` ON `payments`(`created_at` DESC);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Note on UUIDs:
-- MySQL does not have a native UUID type that auto-generates like PostgreSQL's uuid_generate_v4().
-- The PHP backend is expected to generate a UUID (e.g., using PHP's `uuid_create()` or similar library)
-- and insert it as a VARCHAR(36) string.
-- For auto-generation, you could use a trigger, but for simplicity and compatibility with the PHP backend,
-- the application layer should handle UUID generation.

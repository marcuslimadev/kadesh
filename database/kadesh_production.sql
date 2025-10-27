/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `is_super_admin` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `last_login_at` datetime DEFAULT NULL,
  `last_login_ip` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admin_users` (`id`, `name`, `email`, `password`, `permissions`, `is_super_admin`, `is_active`, `last_login_at`, `last_login_ip`, `created_at`, `updated_at`) VALUES
	(1, 'Administrador', 'admin@kadesh.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 1, 1, NULL, NULL, '2025-10-17 15:46:32', '2025-10-17 15:46:32'),
	(2, 'Administrador Teste', 'admin@teste.com', '$2y$10$KdUmRMOXmqQl92FPcIy0iOmNoHmk84AxfSTpE1AkCTaUIsaxq.chC', NULL, 1, 1, '2025-10-17 17:24:51', '::1', '2025-10-17 16:18:08', '2025-10-17 20:24:51')
ON DUPLICATE KEY UPDATE
`name`=VALUES(`name`), `email`=VALUES(`email`), `password`=VALUES(`password`), `permissions`=VALUES(`permissions`),
`is_super_admin`=VALUES(`is_super_admin`), `is_active`=VALUES(`is_active`), `last_login_at`=VALUES(`last_login_at`),
`last_login_ip`=VALUES(`last_login_ip`), `created_at`=VALUES(`created_at`), `updated_at`=VALUES(`updated_at`);

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_type` enum('contractor','provider','both','admin') NOT NULL,
  `document` varchar(255) DEFAULT NULL,
  `person_type` enum('individual','company') DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`skills`)),
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `total_ratings` int(11) NOT NULL DEFAULT 0,
  `wallet_balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `last_activity` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(255) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `setting_type` varchar(50) DEFAULT 'string',
  `setting_category` varchar(100) DEFAULT 'general',
  `description` text DEFAULT NULL,
  `is_encrypted` tinyint(1) DEFAULT 0,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`),
  KEY `idx_key` (`setting_key`),
  KEY `idx_category` (`setting_category`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `system_settings_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `system_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `setting_category`, `description`, `is_encrypted`, `updated_by`, `created_at`, `updated_at`) VALUES
	(1, 'mp_public_key_test', '', 'string', 'payment', 'Chave pública TEST do Mercado Pago', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 15:46:39'),
	(2, 'mp_access_token_test', '', 'string', 'payment', 'Access Token TEST do Mercado Pago', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 15:46:39'),
	(3, 'mp_public_key_prod', '', 'string', 'payment', 'Chave pública PRODUÇÃO do Mercado Pago', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 15:46:39'),
	(4, 'mp_access_token_prod', '', 'string', 'payment', 'Access Token PRODUÇÃO do Mercado Pago', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 15:46:39'),
	(5, 'mp_environment', 'test', 'string', 'payment', 'Ambiente MP: test ou prod', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 15:46:39'),
	(6, 'platform_fee_percentage', '1.0', 'number', 'payment', 'Percentual de taxa da plataforma (%)', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 20:21:19'),
	(7, 'site_name', 'Kadesh', 'string', 'general', 'Nome do site', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 15:46:39'),
	(8, 'site_email', 'contato@kadesh.com', 'string', 'general', 'Email de contato principal', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 15:46:39'),
	(9, 'site_phone', '', 'string', 'general', 'Telefone de contato', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 15:46:39'),
	(10, 'maintenance_mode', 'false', 'boolean', 'general', 'Modo manutenção ativado', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 15:46:39'),
	(11, 'smtp_host', '', 'string', 'email', 'Servidor SMTP', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 15:46:39'),
	(12, 'smtp_port', '587', 'number', 'email', 'Porta SMTP', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 15:46:39'),
	(13, 'smtp_user', '', 'string', 'email', 'Usuário SMTP', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 15:46:39'),
	(14, 'smtp_password', '', 'string', 'email', 'Senha SMTP', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 15:46:39'),
	(15, 'smtp_from_email', 'noreply@kadesh.com', 'string', 'email', 'Email remetente', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 15:46:39'),
	(16, 'smtp_from_name', 'Kadesh', 'string', 'email', 'Nome remetente', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 15:46:39'),
	(17, 'max_projects_per_user', '50', 'number', 'limits', 'Máximo de projetos ativos por usuário', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 15:46:39'),
	(18, 'max_bids_per_project', '100', 'number', 'limits', 'Máximo de propostas por projeto', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 15:46:39'),
	(19, 'max_portfolio_images', '30', 'number', 'limits', 'Máximo de imagens no portfólio', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 15:46:39'),
	(20, 'max_image_size_mb', '5', 'number', 'limits', 'Tamanho máximo de imagem (MB)', 0, NULL, '2025-10-17 15:46:39', '2025-10-17 15:46:39')
ON DUPLICATE KEY UPDATE
`setting_key`=VALUES(`setting_key`), `setting_value`=VALUES(`setting_value`), `setting_type`=VALUES(`setting_type`),
`setting_category`=VALUES(`setting_category`), `description`=VALUES(`description`), `is_encrypted`=VALUES(`is_encrypted`),
`updated_by`=VALUES(`updated_by`), `created_at`=VALUES(`created_at`), `updated_at`=VALUES(`updated_at`);

-- Demais tabelas conforme estrutura original...
-- (Projects, Bids, Messages, Payments, etc.)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
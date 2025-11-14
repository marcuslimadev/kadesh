-- ============================================
-- SCRIPT SQL COMPLETO - KADESH PRODUCTION
-- ============================================
-- Execute este script no phpMyAdmin ou terminal MySQL
-- Inclui TODAS as tabelas necessárias para funcionamento completo

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- ============================================
-- TABELA DE USUARIOS PRINCIPAIS
-- ============================================

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_type` enum('contractor','provider','both','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'contractor',
  `document` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `person_type` enum('individual','company') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `skills` json DEFAULT NULL,
  `rating` decimal(3,2) NOT NULL DEFAULT '0.00',
  `total_ratings` int(11) NOT NULL DEFAULT '0',
  `wallet_balance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_activity` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `idx_user_type` (`user_type`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA DE ADMINISTRADORES
-- ============================================

CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `permissions` json DEFAULT NULL,
  `is_super_admin` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `last_login_at` datetime DEFAULT NULL,
  `last_login_ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA DE PROJETOS
-- ============================================

CREATE TABLE IF NOT EXISTS `projects` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `contractor_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subcategory` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `max_budget` decimal(10,2) DEFAULT NULL,
  `min_budget` decimal(10,2) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `status` enum('draft','open','in_progress','completed','cancelled','withdrawn','disputed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `auction_end_date` timestamp NULL DEFAULT NULL,
  `selected_bid_id` bigint(20) UNSIGNED DEFAULT NULL,
  `featured` tinyint(1) DEFAULT '0',
  `urgency_level` enum('low','medium','high','urgent') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `required_skills` json DEFAULT NULL,
  `attachments` json DEFAULT NULL,
  `views_count` int(11) DEFAULT '0',
  `bids_count` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `projects_contractor_id_foreign` (`contractor_id`),
  KEY `projects_selected_bid_id_foreign` (`selected_bid_id`),
  KEY `idx_status` (`status`),
  KEY `idx_auction_end` (`auction_end_date`),
  KEY `idx_featured` (`featured`),
  CONSTRAINT `projects_contractor_id_foreign` FOREIGN KEY (`contractor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA DE PROPOSTAS/BIDS
-- ============================================

CREATE TABLE IF NOT EXISTS `bids` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `provider_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `proposal` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_time_days` int(11) NOT NULL DEFAULT '30',
  `status` enum('pending','accepted','rejected','withdrawn','expired') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `attachments` json DEFAULT NULL,
  `questions` json DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bids_project_id_foreign` (`project_id`),
  KEY `bids_provider_id_foreign` (`provider_id`),
  KEY `idx_status` (`status`),
  KEY `idx_amount` (`amount`),
  CONSTRAINT `bids_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bids_provider_id_foreign` FOREIGN KEY (`provider_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA DE PERFIS DE USUARIO
-- ============================================

CREATE TABLE IF NOT EXISTS `user_profiles` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `rating` decimal(3,2) DEFAULT '0.00',
  `total_projects` int(11) DEFAULT '0',
  `portfolio_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkedin_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `github_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hourly_rate` decimal(8,2) DEFAULT NULL,
  `available_for_work` tinyint(1) DEFAULT '1',
  `timezone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `languages` json DEFAULT NULL,
  `certifications` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_profiles_user_id_unique` (`user_id`),
  CONSTRAINT `user_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA DE PORTFOLIO
-- ============================================

CREATE TABLE IF NOT EXISTS `provider_portfolio` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `provider_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `technologies` json DEFAULT NULL,
  `images` json DEFAULT NULL,
  `project_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `completion_date` date DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `order_position` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `provider_portfolio_provider_id_foreign` (`provider_id`),
  KEY `idx_featured` (`is_featured`),
  CONSTRAINT `provider_portfolio_provider_id_foreign` FOREIGN KEY (`provider_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA DE PAGAMENTOS
-- ============================================

CREATE TABLE IF NOT EXISTS `payments` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `payer_id` bigint(20) UNSIGNED NOT NULL,
  `recipient_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `platform_fee` decimal(10,2) DEFAULT '0.00',
  `net_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','completed','failed','refunded','disputed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `external_payment_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_data` json DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_project_id_foreign` (`project_id`),
  KEY `payments_payer_id_foreign` (`payer_id`),
  KEY `payments_recipient_id_foreign` (`recipient_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `payments_payer_id_foreign` FOREIGN KEY (`payer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_recipient_id_foreign` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA DE REVIEWS/AVALIACOES
-- ============================================

CREATE TABLE IF NOT EXISTS `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `reviewer_id` bigint(20) UNSIGNED NOT NULL,
  `reviewed_id` bigint(20) UNSIGNED NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `comment` text COLLATE utf8mb4_unicode_ci,
  `is_public` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reviews_project_id_foreign` (`project_id`),
  KEY `reviews_reviewer_id_foreign` (`reviewer_id`),
  KEY `reviews_reviewed_id_foreign` (`reviewed_id`),
  KEY `idx_rating` (`rating`),
  CONSTRAINT `reviews_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_reviewed_id_foreign` FOREIGN KEY (`reviewed_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_reviewer_id_foreign` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA DE NOTIFICACOES
-- ============================================

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'info',
  `related_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `related_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `action_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_user_id_foreign` (`user_id`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_type` (`type`),
  CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA DE CONFIGURACOES DO SISTEMA
-- ============================================

CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci,
  `setting_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'string',
  `setting_category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'general',
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_encrypted` tinyint(1) DEFAULT '0',
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`),
  KEY `idx_key` (`setting_key`),
  KEY `idx_category` (`setting_category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA DE MENSAGENS
-- ============================================

CREATE TABLE IF NOT EXISTS `messages` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) UNSIGNED DEFAULT NULL,
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `recipient_id` bigint(20) UNSIGNED NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `attachments` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `messages_project_id_foreign` (`project_id`),
  KEY `messages_sender_id_foreign` (`sender_id`),
  KEY `messages_recipient_id_foreign` (`recipient_id`),
  KEY `idx_is_read` (`is_read`),
  CONSTRAINT `messages_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_recipient_id_foreign` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELA DE TRANSACOES DA CARTEIRA
-- ============================================

CREATE TABLE IF NOT EXISTS `wallet_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `type` enum('credit','debit') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference_id` bigint(20) UNSIGNED DEFAULT NULL,
  `balance_before` decimal(10,2) NOT NULL,
  `balance_after` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `wallet_transactions_user_id_foreign` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_reference` (`reference_type`,`reference_id`),
  CONSTRAINT `wallet_transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DADOS INICIAIS PARA TESTE
-- ============================================

-- Usuario administrador (senha: admin123)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `user_type`, `wallet_balance`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Administrador', 'admin@kadesh.com', '$2y$10$FpLs1wPx.ydH6OD9c88eguCzybfClWSDdatqsLFacP5wpTyoEgNfG', 'admin', 0.00, 1, NOW(), NOW());

-- Admin separado para painel administrativo
INSERT INTO `admin_users` (`id`, `name`, `email`, `password`, `is_super_admin`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'admin@kadesh.com', '$2y$10$FpLs1wPx.ydH6OD9c88eguCzybfClWSDdatqsLFacP5wpTyoEgNfG', 1, 1, NOW(), NOW());

-- Usuario contratante de exemplo
INSERT INTO `users` (`id`, `name`, `email`, `password`, `user_type`, `person_type`, `phone`, `wallet_balance`, `is_active`, `created_at`, `updated_at`) VALUES
(2, 'João Silva', 'joao@empresa.com', '$2y$10$FpLs1wPx.ydH6OD9c88eguCzybfClWSDdatqsLFacP5wpTyoEgNfG', 'contractor', 'company', '(11) 99999-9999', 5000.00, 1, NOW(), NOW());

-- Usuario provider de exemplo
INSERT INTO `users` (`id`, `name`, `email`, `password`, `user_type`, `person_type`, `bio`, `rating`, `total_ratings`, `wallet_balance`, `is_active`, `created_at`, `updated_at`) VALUES
(3, 'Maria Santos', 'maria@freelancer.com', '$2y$10$FpLs1wPx.ydH6OD9c88eguCzybfClWSDdatqsLFacP5wpTyoEgNfG', 'provider', 'individual', 'Desenvolvedora Full Stack com 5 anos de experiência. Especialista em Vue.js, PHP e MySQL.', 4.80, 25, 2500.00, 1, NOW(), NOW());

-- Perfis de usuario
INSERT INTO `user_profiles` (`user_id`, `bio`, `rating`, `total_projects`, `hourly_rate`, `available_for_work`, `created_at`, `updated_at`) VALUES
(3, 'Desenvolvedora Full Stack com 5 anos de experiência. Especialista em Vue.js, PHP e MySQL. Projetos entregues com qualidade e no prazo.', 4.80, 15, 75.00, 1, NOW(), NOW());

-- Projetos de exemplo
INSERT INTO `projects` (`id`, `contractor_id`, `title`, `description`, `category`, `max_budget`, `min_budget`, `deadline`, `status`, `auction_end_date`, `featured`, `urgency_level`, `views_count`, `bids_count`, `created_at`, `updated_at`) VALUES
(1, 2, 'Desenvolvimento de Site Institucional', 'Preciso de um site institucional moderno para minha empresa. Deve incluir: home, sobre, serviços, portfolio e contato. Design responsivo obrigatório. Preferência por tecnologias modernas como Vue.js ou React.', 'Desenvolvimento Web', 5000.00, 2000.00, '2025-01-15', 'open', '2025-12-31 23:59:59', 1, 'medium', 45, 3, NOW(), NOW()),
(2, 2, 'Sistema de Gestão de Estoque', 'Sistema web para controle de estoque com funcionalidades de: cadastro de produtos, entrada/saída, relatórios e alertas de estoque baixo. Necessário integração com API de fornecedores.', 'Desenvolvimento de Software', 8000.00, 4000.00, '2025-02-20', 'open', '2025-12-31 23:59:59', 0, 'high', 67, 5, NOW(), NOW()),
(3, 2, 'App Mobile para Delivery', 'Aplicativo mobile completo para delivery de comida. Funcionalidades: cardápio, carrinho, pagamento, acompanhamento de pedido. Plataformas iOS e Android.', 'Desenvolvimento Mobile', 15000.00, 8000.00, '2025-03-30', 'open', '2025-12-31 23:59:59', 1, 'urgent', 89, 7, NOW(), NOW());

-- Propostas/bids de exemplo
INSERT INTO `bids` (`id`, `project_id`, `provider_id`, `amount`, `proposal`, `delivery_time_days`, `status`, `score`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 3500.00, 'Olá! Tenho experiência sólida em desenvolvimento web com Vue.js e PHP. Proposta inclui: design responsivo, otimização SEO, painel administrativo e 3 meses de suporte gratuito.', 20, 'pending', 85.50, NOW(), NOW()),
(2, 2, 3, 6500.00, 'Sistema completo de estoque com dashboard intuitivo, relatórios em tempo real e integração com principais fornecedores do mercado. Inclui treinamento da equipe.', 35, 'pending', 78.30, NOW(), NOW());

-- Portfolio de exemplo
INSERT INTO `provider_portfolio` (`provider_id`, `title`, `description`, `category`, `project_url`, `completion_date`, `is_featured`, `order_position`, `created_at`, `updated_at`) VALUES
(3, 'E-commerce de Roupas', 'Loja virtual completa com carrinho, pagamento e painel administrativo', 'E-commerce', 'https://exemplo.com', '2024-12-01', 1, 1, NOW(), NOW()),
(3, 'Sistema de CRM', 'CRM personalizado para gestão de clientes e vendas', 'Sistema Web', 'https://exemplo2.com', '2024-11-15', 1, 2, NOW(), NOW());

-- Configurações do sistema
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `setting_type`, `setting_category`, `description`, `created_at`, `updated_at`) VALUES
('site_name', 'Kadesh', 'string', 'general', 'Nome do site', NOW(), NOW()),
('site_email', 'contato@kadesh.com', 'string', 'general', 'Email de contato principal', NOW(), NOW()),
('platform_fee_percentage', '2.5', 'number', 'payment', 'Percentual de taxa da plataforma (%)', NOW(), NOW()),
('max_projects_per_user', '50', 'number', 'limits', 'Máximo de projetos ativos por usuário', NOW(), NOW()),
('max_bids_per_project', '100', 'number', 'limits', 'Máximo de propostas por projeto', NOW(), NOW()),
('maintenance_mode', 'false', 'boolean', 'general', 'Modo manutenção ativado', NOW(), NOW()),
('smtp_host', '', 'string', 'email', 'Servidor SMTP', NOW(), NOW()),
('smtp_port', '587', 'number', 'email', 'Porta SMTP', NOW(), NOW()),
('mp_environment', 'test', 'string', 'payment', 'Ambiente MP: test ou prod', NOW(), NOW());

-- Reviews de exemplo
INSERT INTO `reviews` (`project_id`, `reviewer_id`, `reviewed_id`, `rating`, `comment`, `is_public`, `created_at`, `updated_at`) VALUES
(1, 2, 3, 5, 'Excelente trabalho! Entrega no prazo e qualidade excepcional. Recomendo!', 1, NOW(), NOW()),
(2, 2, 3, 4, 'Muito bom profissional. Comunicação clara e resultado satisfatório.', 1, NOW(), NOW());

-- Notificações de exemplo
INSERT INTO `notifications` (`user_id`, `title`, `message`, `type`, `related_type`, `related_id`, `is_read`, `created_at`, `updated_at`) VALUES
(2, 'Nova proposta recebida', 'Você recebeu uma nova proposta para o projeto "Desenvolvimento de Site Institucional"', 'bid', 'bid', 1, 0, NOW(), NOW()),
(3, 'Projeto interessante', 'Encontramos um projeto que pode interessar você: "App Mobile para Delivery"', 'project', 'project', 3, 0, NOW(), NOW());

-- ============================================
-- INDICES ADICIONAIS PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_auction_end ON projects(auction_end_date);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_bids_status ON bids(status);
CREATE INDEX IF NOT EXISTS idx_bids_amount ON bids(amount);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ============================================
-- CONSTRAINTS FINAIS
-- ============================================

-- Adicionar constraint de selected_bid_id após inserção dos dados
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_selected_bid_id_foreign` FOREIGN KEY (`selected_bid_id`) REFERENCES `bids` (`id`) ON DELETE SET NULL;

-- Confirmar transação
COMMIT;

-- ============================================
-- VERIFICACAO FINAL
-- ============================================

-- Mostrar resumo das tabelas criadas
SELECT 
    TABLE_NAME as 'Tabela',
    TABLE_ROWS as 'Registros'
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- ============================================
-- DADOS DE LOGIN PARA TESTE
-- ============================================

/*
USUARIOS DE TESTE:

1. ADMIN:
   Email: admin@kadesh.com
   Senha: admin123
   Tipo: Administrador do sistema

2. CONTRATANTE:
   Email: joao@empresa.com  
   Senha: admin123
   Tipo: Contratante (publica projetos)

3. PRESTADOR:
   Email: maria@freelancer.com
   Senha: admin123  
   Tipo: Prestador de serviços (faz propostas)

OBSERVAÇÕES:
- Todas as senhas são: admin123
- Sistema configurado com dados realistas
- Portfolio e avaliações de exemplo incluídos
- Pronto para uso em produção
*/
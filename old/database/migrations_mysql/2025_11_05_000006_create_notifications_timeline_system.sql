-- Migração: Sistema de Notificações e Timeline (MySQL)
-- Data: 2025-11-05

-- Tabela de Notificações Unificadas
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    notification_type ENUM(
        'auction_new_bid', 'auction_outbid', 'auction_leading', 'auction_ending_soon',
        'auction_extended', 'auction_ended', 'auction_won', 'auction_lost',
        'project_created', 'project_updated', 'project_started', 'project_completed',
        'milestone_created', 'milestone_submitted', 'milestone_approved', 'milestone_rejected',
        'payment_received', 'payment_released', 'payment_pending',
        'dispute_opened', 'dispute_message', 'dispute_resolved',
        'review_received', 'message_received', 'document_verified', 'document_rejected',
        'account_warning', 'account_suspended', 'kyc_approved', 'kyc_rejected'
    ) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    reference_type VARCHAR(50) COMMENT 'project, bid, milestone, dispute, etc',
    reference_id BIGINT UNSIGNED,
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    icon VARCHAR(50),
    action_url VARCHAR(500),
    action_label VARCHAR(100),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    sent_email BOOLEAN DEFAULT FALSE,
    sent_whatsapp BOOLEAN DEFAULT FALSE,
    sent_sms BOOLEAN DEFAULT FALSE,
    sent_push BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    INDEX idx_notifications_user_id (user_id),
    INDEX idx_notifications_is_read (is_read),
    INDEX idx_notifications_created_at (created_at DESC),
    INDEX idx_notifications_reference (reference_type, reference_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Timeline de Eventos do Projeto
CREATE TABLE IF NOT EXISTS project_timeline (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    event_type ENUM(
        'created', 'published', 'auction_started', 'bid_placed', 'bid_withdrawn',
        'auction_extended', 'auction_ended', 'winner_selected', 'contract_accepted',
        'started', 'milestone_created', 'milestone_submitted', 'milestone_approved',
        'milestone_rejected', 'milestone_released', 'payment_deposited', 'payment_released',
        'dispute_opened', 'dispute_resolved', 'revision_requested', 'revision_completed',
        'completed', 'reviewed', 'cancelled', 'refunded'
    ) NOT NULL,
    event_category ENUM('auction', 'execution', 'financial', 'dispute', 'administrative'),
    actor_id BIGINT UNSIGNED COMMENT 'Usuário que causou o evento',
    target_id BIGINT UNSIGNED COMMENT 'Usuário afetado pelo evento',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20) COMMENT 'Cor para exibição visual',
    reference_type VARCHAR(50) COMMENT 'bid, milestone, payment, etc',
    reference_id BIGINT UNSIGNED,
    metadata JSON COMMENT 'JSON com dados adicionais',
    ip_address VARCHAR(45),
    is_public BOOLEAN DEFAULT TRUE COMMENT 'Visível para todos os participantes',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_project_timeline_project_id (project_id),
    INDEX idx_project_timeline_created_at (created_at DESC),
    INDEX idx_project_timeline_event_type (event_type),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (target_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Mensagens do Projeto (Chat)
CREATE TABLE IF NOT EXISTS project_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    sender_id BIGINT UNSIGNED NOT NULL,
    message TEXT NOT NULL,
    message_type ENUM('text', 'file', 'image', 'system') DEFAULT 'text',
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size BIGINT UNSIGNED,
    mime_type VARCHAR(100),
    is_system_message BOOLEAN DEFAULT FALSE,
    reply_to_id BIGINT UNSIGNED COMMENT 'Referência para resposta',
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_project_messages_project_id (project_id),
    INDEX idx_project_messages_sender_id (sender_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (reply_to_id) REFERENCES project_messages(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Leitura de Mensagens
CREATE TABLE IF NOT EXISTS message_read_status (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    message_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_message_user (message_id, user_id),
    INDEX idx_message_read_status_user_id (user_id),
    FOREIGN KEY (message_id) REFERENCES project_messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Templates de Notificação
CREATE TABLE IF NOT EXISTS notification_templates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    template_key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    subject_template TEXT NOT NULL,
    body_template TEXT NOT NULL,
    sms_template TEXT,
    push_template TEXT,
    variables JSON COMMENT 'JSON com variáveis disponíveis',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Fila de Envio de Notificações
CREATE TABLE IF NOT EXISTS notification_queue (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    notification_id BIGINT UNSIGNED NOT NULL,
    channel ENUM('email', 'whatsapp', 'sms', 'push') NOT NULL,
    recipient VARCHAR(255) NOT NULL COMMENT 'Email, telefone, etc',
    status ENUM('pending', 'sending', 'sent', 'failed', 'cancelled') DEFAULT 'pending',
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    last_attempt_at TIMESTAMP NULL,
    sent_at TIMESTAMP NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notification_queue_status (status),
    FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de WebSocket Connections (para notificações em tempo real)
CREATE TABLE IF NOT EXISTS websocket_connections (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    connection_id VARCHAR(255) NOT NULL UNIQUE,
    socket_id VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_ping_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    disconnected_at TIMESTAMP NULL,
    INDEX idx_websocket_connections_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir Templates Padrão de Notificação
INSERT INTO notification_templates (template_key, name, subject_template, body_template, sms_template, push_template, variables) VALUES
('new_bid', 'Novo Lance Recebido', 'Novo lance no projeto {{project_title}}', 'Você recebeu um novo lance de R$ {{bid_amount}} no projeto "{{project_title}}".', 'Novo lance de R$ {{bid_amount}} em {{project_title}}', 'Novo lance recebido', '["project_title", "bid_amount", "bidder_name"]'),
('outbid', 'Lance Superado', 'Seu lance foi superado', 'Seu lance no projeto "{{project_title}}" foi superado. Lance atual: R$ {{current_bid_amount}}', 'Você foi superado em {{project_title}}', 'Lance superado!', '["project_title", "current_bid_amount", "your_bid_amount"]'),
('auction_won', 'Você Venceu o Leilão!', 'Parabéns! Você venceu o leilão', 'Parabéns! Você venceu o leilão do projeto "{{project_title}}" com o lance de R$ {{winning_bid_amount}}', 'Você venceu o leilão de {{project_title}}!', 'Parabéns! Você venceu!', '["project_title", "winning_bid_amount"]'),
('payment_received', 'Pagamento Recebido', 'Pagamento de R$ {{amount}} recebido', 'Você recebeu um pagamento de R$ {{amount}} referente ao projeto "{{project_title}}".', 'Pagamento de R$ {{amount}} recebido', 'Pagamento recebido', '["amount", "project_title"]'),
('milestone_approved', 'Marco Aprovado', 'Marco aprovado no projeto {{project_title}}', 'O marco "{{milestone_title}}" foi aprovado. Valor de R$ {{amount}} será liberado.', 'Marco aprovado em {{project_title}}', 'Marco aprovado!', '["milestone_title", "project_title", "amount"]'),
('dispute_opened', 'Nova Disputa Aberta', 'Disputa aberta no projeto {{project_title}}', 'Uma disputa foi aberta no projeto "{{project_title}}". Por favor, responda o mais breve possível.', 'Disputa aberta em {{project_title}}', 'Nova disputa', '["project_title", "dispute_type"]')
ON DUPLICATE KEY UPDATE name=VALUES(name);

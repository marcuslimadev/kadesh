-- Migração: Sistema de Leilão Reverso (MySQL)
-- Data: 2025-11-05

-- Tabela de Configurações de Leilão por Projeto
CREATE TABLE IF NOT EXISTS project_auction_config (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL UNIQUE,
    min_budget DECIMAL(10,2) NOT NULL,
    max_budget DECIMAL(10,2) NOT NULL,
    min_bid_decrement DECIMAL(10,2) DEFAULT 50.00 COMMENT 'Decremento mínimo entre lances',
    auction_duration_minutes INT DEFAULT 10080 COMMENT '7 dias padrão',
    soft_close_minutes INT DEFAULT 2 COMMENT 'Extensão se houver lance nos últimos minutos',
    max_soft_close_extensions INT DEFAULT 5 COMMENT 'Máximo de extensões',
    price_weight DECIMAL(3,2) DEFAULT 0.70 CHECK(price_weight BETWEEN 0 AND 1),
    reputation_weight DECIMAL(3,2) DEFAULT 0.30 CHECK(reputation_weight BETWEEN 0 AND 1),
    is_confidential BOOLEAN DEFAULT FALSE COMMENT 'Lances ocultos',
    allow_questions BOOLEAN DEFAULT TRUE,
    requires_portfolio BOOLEAN DEFAULT FALSE,
    min_reputation_required DECIMAL(3,2) DEFAULT 0.00,
    started_at TIMESTAMP NULL,
    ends_at TIMESTAMP NULL,
    actual_end_time TIMESTAMP NULL COMMENT 'Pode ser diferente devido a soft close',
    status ENUM('draft', 'open', 'extended', 'closed', 'cancelled') DEFAULT 'draft',
    winner_bid_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_project_auction_config_status (status),
    INDEX idx_project_auction_config_ends_at (ends_at),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (winner_bid_id) REFERENCES bids(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Lances (Bids) - Atualização da existente se necessário
-- Verificar se já existe antes de criar
CREATE TABLE IF NOT EXISTS bids_auction (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    provider_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    original_amount DECIMAL(10,2) NULL COMMENT 'Valor original se houve edição',
    proposal_text TEXT NOT NULL,
    estimated_duration_days INT,
    portfolio_attachments JSON COMMENT 'Array de arquivos',
    is_withdrawn BOOLEAN DEFAULT FALSE,
    withdrawn_at TIMESTAMP NULL,
    withdrawn_reason TEXT,
    reputation_score DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Reputação do provider no momento do lance',
    calculated_score DECIMAL(5,2) COMMENT 'Score final = (price_weight * price_score) + (reputation_weight * reputation_score)',
    rank_position INT COMMENT 'Posição no ranking',
    is_winner BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_bids_project_id (project_id),
    INDEX idx_bids_provider_id (provider_id),
    INDEX idx_bids_calculated_score (calculated_score DESC),
    INDEX idx_bids_is_winner (is_winner),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Histórico de Lances (para rastreabilidade)
CREATE TABLE IF NOT EXISTS bid_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    bid_id BIGINT UNSIGNED NOT NULL,
    previous_amount DECIMAL(10,2),
    new_amount DECIMAL(10,2) NOT NULL,
    previous_rank INT,
    new_rank INT,
    action ENUM('created', 'updated', 'withdrawn', 'winner', 'outbid') NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_bid_history_bid_id (bid_id),
    FOREIGN KEY (bid_id) REFERENCES bids(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Perguntas sobre o Projeto
CREATE TABLE IF NOT EXISTS project_questions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    question TEXT NOT NULL,
    answer TEXT,
    answered_by BIGINT UNSIGNED,
    answered_at TIMESTAMP NULL,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_project_questions_project_id (project_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (answered_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Notificações de Leilão em Tempo Real
CREATE TABLE IF NOT EXISTS auction_notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    auction_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    notification_type ENUM(
        'new_bid', 'outbid', 'leading', 'ending_soon', 
        'extended', 'ended', 'won', 'lost'
    ) NOT NULL,
    bid_id BIGINT UNSIGNED,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_auction_notifications_user_id (user_id),
    INDEX idx_auction_notifications_is_read (is_read),
    FOREIGN KEY (auction_id) REFERENCES project_auction_config(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bid_id) REFERENCES bids(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Logs de Eventos do Leilão
CREATE TABLE IF NOT EXISTS auction_event_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    auction_id BIGINT UNSIGNED NOT NULL,
    event_type ENUM(
        'created', 'started', 'bid_placed', 'bid_withdrawn', 
        'extended', 'ended', 'winner_selected', 'cancelled'
    ) NOT NULL,
    user_id BIGINT UNSIGNED,
    bid_id BIGINT UNSIGNED,
    event_data JSON COMMENT 'JSON com detalhes do evento',
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_auction_event_logs_auction_id (auction_id),
    FOREIGN KEY (auction_id) REFERENCES project_auction_config(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (bid_id) REFERENCES bids(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

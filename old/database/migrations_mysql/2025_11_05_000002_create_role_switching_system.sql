-- Migração: Sistema de Alternância de Papéis (MySQL)
-- Data: 2025-11-05

-- Tabela de Histórico de Alteração de Papéis
CREATE TABLE IF NOT EXISTS user_role_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    previous_role ENUM('contractor', 'provider', 'both', 'admin'),
    new_role ENUM('contractor', 'provider', 'both', 'admin') NOT NULL,
    reason TEXT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_role_history_user_id (user_id),
    INDEX idx_user_role_history_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Contexto Ativo do Usuário
CREATE TABLE IF NOT EXISTS user_active_context (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    active_role ENUM('contractor', 'provider') NOT NULL,
    switched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    INDEX idx_user_active_context_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migração: Sistema de Escrow e Carteira Virtual (MySQL)
-- Data: 2025-11-05

-- Tabela de Carteira Virtual
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    transaction_type ENUM(
        'deposit', 'withdraw', 'escrow_hold', 'escrow_release', 
        'payment_received', 'payment_sent', 'refund', 'fee', 
        'bonus', 'penalty'
    ) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    balance_before DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    reference_type VARCHAR(50) COMMENT 'project, milestone, dispute, etc',
    reference_id BIGINT UNSIGNED,
    description TEXT,
    status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'completed',
    payment_method ENUM('pix', 'ted', 'doc', 'boleto', 'credit_card', 'debit_card'),
    external_transaction_id VARCHAR(255),
    ip_address VARCHAR(45),
    hash VARCHAR(64) NOT NULL COMMENT 'Hash imutável da transação',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    INDEX idx_wallet_transactions_user_id (user_id),
    INDEX idx_wallet_transactions_created_at (created_at),
    INDEX idx_wallet_transactions_reference (reference_type, reference_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Escrow (Valores em Garantia)
CREATE TABLE IF NOT EXISTS escrow_accounts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL UNIQUE,
    contractor_id BIGINT UNSIGNED NOT NULL,
    provider_id BIGINT UNSIGNED NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    held_amount DECIMAL(10,2) DEFAULT 0.00,
    released_amount DECIMAL(10,2) DEFAULT 0.00,
    refunded_amount DECIMAL(10,2) DEFAULT 0.00,
    platform_fee_percentage DECIMAL(5,2) DEFAULT 10.00,
    platform_fee_amount DECIMAL(10,2) DEFAULT 0.00,
    status ENUM(
        'pending', 'active', 'completed', 'disputed', 'refunded', 'cancelled'
    ) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_escrow_accounts_project_id (project_id),
    INDEX idx_escrow_accounts_status (status),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (contractor_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Marcos/Milestones do Projeto
CREATE TABLE IF NOT EXISTS project_milestones (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    escrow_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    percentage DECIMAL(5,2) COMMENT 'Porcentagem do total',
    sequence_order INT NOT NULL,
    estimated_completion_date DATE,
    status ENUM(
        'pending', 'in_progress', 'submitted', 'approved', 
        'rejected', 'released', 'disputed'
    ) DEFAULT 'pending',
    submitted_at TIMESTAMP NULL,
    approved_at TIMESTAMP NULL,
    rejected_at TIMESTAMP NULL,
    rejection_reason TEXT,
    released_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_project_milestones_project_id (project_id),
    INDEX idx_project_milestones_status (status),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (escrow_id) REFERENCES escrow_accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Evidências dos Marcos
CREATE TABLE IF NOT EXISTS milestone_evidences (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    milestone_id BIGINT UNSIGNED NOT NULL,
    uploaded_by BIGINT UNSIGNED NOT NULL,
    evidence_type ENUM('document', 'image', 'video', 'link', 'note'),
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size BIGINT UNSIGNED,
    mime_type VARCHAR(100),
    url VARCHAR(1000),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_milestone_evidences_milestone_id (milestone_id),
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Revisões Solicitadas
CREATE TABLE IF NOT EXISTS milestone_revisions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    milestone_id BIGINT UNSIGNED NOT NULL,
    requested_by BIGINT UNSIGNED NOT NULL,
    revision_number INT NOT NULL,
    description TEXT NOT NULL,
    status ENUM('pending', 'completed', 'rejected') DEFAULT 'pending',
    completed_at TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id) ON DELETE CASCADE,
    FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Notas Fiscais
CREATE TABLE IF NOT EXISTS invoices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    milestone_id BIGINT UNSIGNED,
    issuer_user_id BIGINT UNSIGNED NOT NULL,
    recipient_user_id BIGINT UNSIGNED NOT NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    invoice_type ENUM('nfse', 'nfe', 'nfce', 'recibo'),
    amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    net_amount DECIMAL(10,2) NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE,
    payment_date DATE,
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    status ENUM('issued', 'sent', 'paid', 'cancelled') DEFAULT 'issued',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_invoices_project_id (project_id),
    INDEX idx_invoices_issuer_user_id (issuer_user_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id) ON DELETE SET NULL,
    FOREIGN KEY (issuer_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Logs de Liberação de Fundos
CREATE TABLE IF NOT EXISTS escrow_release_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    escrow_id BIGINT UNSIGNED NOT NULL,
    milestone_id BIGINT UNSIGNED,
    amount DECIMAL(10,2) NOT NULL,
    released_by BIGINT UNSIGNED NOT NULL,
    release_type ENUM('milestone', 'partial', 'full', 'refund'),
    transaction_id BIGINT UNSIGNED,
    reason TEXT,
    hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_escrow_release_logs_escrow_id (escrow_id),
    FOREIGN KEY (escrow_id) REFERENCES escrow_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id) ON DELETE SET NULL,
    FOREIGN KEY (released_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (transaction_id) REFERENCES wallet_transactions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

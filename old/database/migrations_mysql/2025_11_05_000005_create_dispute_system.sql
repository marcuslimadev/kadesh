-- Migração: Sistema de Disputas e Mediações (MySQL)
-- Data: 2025-11-05

-- Tabela de Disputas
CREATE TABLE IF NOT EXISTS disputes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    escrow_id BIGINT UNSIGNED,
    milestone_id BIGINT UNSIGNED,
    opened_by BIGINT UNSIGNED NOT NULL,
    against_user_id BIGINT UNSIGNED NOT NULL,
    dispute_type ENUM(
        'entrega_insatisfatoria', 'atraso', 'divergencia_escopo', 
        'divergencia_valor', 'qualidade', 'comunicacao', 
        'nao_pagamento', 'abandono', 'outros'
    ) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    amount_disputed DECIMAL(10,2),
    status ENUM(
        'open', 'under_review', 'mediation', 'resolved', 
        'closed', 'escalated', 'cancelled'
    ) DEFAULT 'open',
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    resolution ENUM(
        'favor_contractor', 'favor_provider', 'split', 
        'partial_refund', 'cancelled', 'no_resolution'
    ),
    resolution_amount DECIMAL(10,2),
    resolution_notes TEXT,
    mediator_id BIGINT UNSIGNED,
    assigned_at TIMESTAMP NULL,
    resolved_at TIMESTAMP NULL,
    closed_at TIMESTAMP NULL,
    auto_close_at TIMESTAMP NULL COMMENT 'Data para fechamento automático',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_disputes_project_id (project_id),
    INDEX idx_disputes_opened_by (opened_by),
    INDEX idx_disputes_against_user_id (against_user_id),
    INDEX idx_disputes_status (status),
    INDEX idx_disputes_mediator_id (mediator_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (escrow_id) REFERENCES escrow_accounts(id) ON DELETE SET NULL,
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id) ON DELETE SET NULL,
    FOREIGN KEY (opened_by) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (against_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (mediator_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Mensagens da Disputa
CREATE TABLE IF NOT EXISTS dispute_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dispute_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    message TEXT NOT NULL,
    is_mediator_message BOOLEAN DEFAULT FALSE,
    is_internal_note BOOLEAN DEFAULT FALSE COMMENT 'Apenas mediadores veem',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_dispute_messages_dispute_id (dispute_id),
    FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Evidências da Disputa
CREATE TABLE IF NOT EXISTS dispute_evidences (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dispute_id BIGINT UNSIGNED NOT NULL,
    uploaded_by BIGINT UNSIGNED NOT NULL,
    evidence_type ENUM('document', 'image', 'video', 'audio', 'screenshot', 'chat_log'),
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size BIGINT UNSIGNED,
    mime_type VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_dispute_evidences_dispute_id (dispute_id),
    FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Histórico de Status da Disputa
CREATE TABLE IF NOT EXISTS dispute_status_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dispute_id BIGINT UNSIGNED NOT NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by BIGINT UNSIGNED NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_dispute_status_history_dispute_id (dispute_id),
    FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Ações de Mediação
CREATE TABLE IF NOT EXISTS mediation_actions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dispute_id BIGINT UNSIGNED NOT NULL,
    mediator_id BIGINT UNSIGNED NOT NULL,
    action_type ENUM(
        'requested_evidence', 'scheduled_meeting', 'proposed_solution', 
        'issued_warning', 'suspended_account', 'escalated', 'closed'
    ),
    action_details TEXT,
    deadline TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_mediation_actions_dispute_id (dispute_id),
    FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE,
    FOREIGN KEY (mediator_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Propostas de Resolução
CREATE TABLE IF NOT EXISTS dispute_resolution_proposals (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    dispute_id BIGINT UNSIGNED NOT NULL,
    proposed_by BIGINT UNSIGNED NOT NULL,
    proposal_type ENUM(
        'full_refund', 'partial_refund', 'split', 'additional_work', 
        'extension', 'compensation', 'cancellation'
    ),
    proposed_amount DECIMAL(10,2),
    description TEXT NOT NULL,
    contractor_acceptance ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    provider_acceptance ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    mediator_approval ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    status ENUM('pending', 'accepted', 'rejected', 'expired') DEFAULT 'pending',
    expires_at TIMESTAMP NULL,
    accepted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_dispute_resolution_proposals_dispute_id (dispute_id),
    FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE,
    FOREIGN KEY (proposed_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Penalidades Aplicadas
CREATE TABLE IF NOT EXISTS user_penalties (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    dispute_id BIGINT UNSIGNED,
    penalty_type ENUM(
        'warning', 'temporary_suspension', 'permanent_ban', 
        'reputation_deduction', 'financial_penalty', 'restriction'
    ),
    severity ENUM('minor', 'moderate', 'severe', 'critical'),
    description TEXT NOT NULL,
    reputation_impact DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Pontos deduzidos',
    financial_amount DECIMAL(10,2) DEFAULT 0.00,
    starts_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    applied_by BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_penalties_user_id (user_id),
    INDEX idx_user_penalties_is_active (is_active),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE SET NULL,
    FOREIGN KEY (applied_by) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

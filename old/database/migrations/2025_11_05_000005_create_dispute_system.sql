-- Migração: Sistema de Disputas e Mediações
-- Data: 2025-11-05

-- Tabela de Disputas
CREATE TABLE IF NOT EXISTS disputes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    escrow_id INTEGER,
    milestone_id INTEGER,
    opened_by INTEGER NOT NULL,
    against_user_id INTEGER NOT NULL,
    dispute_type TEXT NOT NULL CHECK(dispute_type IN (
        'entrega_insatisfatoria', 'atraso', 'divergencia_escopo', 
        'divergencia_valor', 'qualidade', 'comunicacao', 
        'nao_pagamento', 'abandono', 'outros'
    )),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    amount_disputed REAL,
    status TEXT DEFAULT 'open' CHECK(status IN (
        'open', 'under_review', 'mediation', 'resolved', 
        'closed', 'escalated', 'cancelled'
    )),
    priority TEXT DEFAULT 'normal' CHECK(priority IN ('low', 'normal', 'high', 'urgent')),
    resolution TEXT CHECK(resolution IN (
        'favor_contractor', 'favor_provider', 'split', 
        'partial_refund', 'cancelled', 'no_resolution'
    )),
    resolution_amount REAL,
    resolution_notes TEXT,
    mediator_id INTEGER,
    assigned_at DATETIME,
    resolved_at DATETIME,
    closed_at DATETIME,
    auto_close_at DATETIME, -- Data para fechamento automático
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (escrow_id) REFERENCES escrow_accounts(id),
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id),
    FOREIGN KEY (opened_by) REFERENCES users(id),
    FOREIGN KEY (against_user_id) REFERENCES users(id),
    FOREIGN KEY (mediator_id) REFERENCES users(id)
);

-- Tabela de Mensagens da Disputa
CREATE TABLE IF NOT EXISTS dispute_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dispute_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    is_mediator_message INTEGER DEFAULT 0,
    is_internal_note INTEGER DEFAULT 0, -- Apenas mediadores veem
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de Evidências da Disputa
CREATE TABLE IF NOT EXISTS dispute_evidences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dispute_id INTEGER NOT NULL,
    uploaded_by INTEGER NOT NULL,
    evidence_type TEXT CHECK(evidence_type IN ('document', 'image', 'video', 'audio', 'screenshot', 'chat_log')),
    file_path TEXT,
    file_name TEXT,
    file_size INTEGER,
    mime_type TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Tabela de Histórico de Status da Disputa
CREATE TABLE IF NOT EXISTS dispute_status_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dispute_id INTEGER NOT NULL,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    changed_by INTEGER NOT NULL,
    reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- Tabela de Ações de Mediação
CREATE TABLE IF NOT EXISTS mediation_actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dispute_id INTEGER NOT NULL,
    mediator_id INTEGER NOT NULL,
    action_type TEXT CHECK(action_type IN (
        'requested_evidence', 'scheduled_meeting', 'proposed_solution', 
        'issued_warning', 'suspended_account', 'escalated', 'closed'
    )),
    action_details TEXT,
    deadline DATETIME,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE,
    FOREIGN KEY (mediator_id) REFERENCES users(id)
);

-- Tabela de Propostas de Resolução
CREATE TABLE IF NOT EXISTS dispute_resolution_proposals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dispute_id INTEGER NOT NULL,
    proposed_by INTEGER NOT NULL,
    proposal_type TEXT CHECK(proposal_type IN (
        'full_refund', 'partial_refund', 'split', 'additional_work', 
        'extension', 'compensation', 'cancellation'
    )),
    proposed_amount REAL,
    description TEXT NOT NULL,
    contractor_acceptance TEXT CHECK(contractor_acceptance IN ('pending', 'accepted', 'rejected')),
    provider_acceptance TEXT CHECK(provider_acceptance IN ('pending', 'accepted', 'rejected')),
    mediator_approval TEXT CHECK(mediator_approval IN ('pending', 'approved', 'rejected')),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected', 'expired')),
    expires_at DATETIME,
    accepted_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE,
    FOREIGN KEY (proposed_by) REFERENCES users(id)
);

-- Tabela de Penalidades Aplicadas
CREATE TABLE IF NOT EXISTS user_penalties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    dispute_id INTEGER,
    penalty_type TEXT CHECK(penalty_type IN (
        'warning', 'temporary_suspension', 'permanent_ban', 
        'reputation_deduction', 'financial_penalty', 'restriction'
    )),
    severity TEXT CHECK(severity IN ('minor', 'moderate', 'severe', 'critical')),
    description TEXT NOT NULL,
    reputation_impact REAL DEFAULT 0, -- Pontos deduzidos
    financial_amount REAL DEFAULT 0,
    starts_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    is_active INTEGER DEFAULT 1,
    applied_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dispute_id) REFERENCES disputes(id),
    FOREIGN KEY (applied_by) REFERENCES users(id)
);

-- Índices para Performance
CREATE INDEX IF NOT EXISTS idx_disputes_project_id ON disputes(project_id);
CREATE INDEX IF NOT EXISTS idx_disputes_opened_by ON disputes(opened_by);
CREATE INDEX IF NOT EXISTS idx_disputes_against_user_id ON disputes(against_user_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_mediator_id ON disputes(mediator_id);
CREATE INDEX IF NOT EXISTS idx_dispute_messages_dispute_id ON dispute_messages(dispute_id);
CREATE INDEX IF NOT EXISTS idx_dispute_evidences_dispute_id ON dispute_evidences(dispute_id);
CREATE INDEX IF NOT EXISTS idx_dispute_status_history_dispute_id ON dispute_status_history(dispute_id);
CREATE INDEX IF NOT EXISTS idx_mediation_actions_dispute_id ON mediation_actions(dispute_id);
CREATE INDEX IF NOT EXISTS idx_dispute_resolution_proposals_dispute_id ON dispute_resolution_proposals(dispute_id);
CREATE INDEX IF NOT EXISTS idx_user_penalties_user_id ON user_penalties(user_id);
CREATE INDEX IF NOT EXISTS idx_user_penalties_is_active ON user_penalties(is_active);

-- Migração: Sistema de Escrow e Carteira Virtual
-- Data: 2025-11-05

-- Tabela de Carteira Virtual
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    transaction_type TEXT NOT NULL CHECK(transaction_type IN (
        'deposit', 'withdraw', 'escrow_hold', 'escrow_release', 
        'payment_received', 'payment_sent', 'refund', 'fee', 
        'bonus', 'penalty'
    )),
    amount REAL NOT NULL,
    balance_before REAL NOT NULL,
    balance_after REAL NOT NULL,
    currency TEXT DEFAULT 'BRL',
    reference_type TEXT, -- 'project', 'milestone', 'dispute', etc
    reference_id INTEGER,
    description TEXT,
    status TEXT DEFAULT 'completed' CHECK(status IN ('pending', 'completed', 'failed', 'cancelled')),
    payment_method TEXT CHECK(payment_method IN ('pix', 'ted', 'doc', 'boleto', 'credit_card', 'debit_card')),
    external_transaction_id TEXT,
    ip_address TEXT,
    hash TEXT NOT NULL, -- Hash imutável da transação
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de Escrow (Valores em Garantia)
CREATE TABLE IF NOT EXISTS escrow_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL UNIQUE,
    contractor_id INTEGER NOT NULL,
    provider_id INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    held_amount REAL DEFAULT 0,
    released_amount REAL DEFAULT 0,
    refunded_amount REAL DEFAULT 0,
    platform_fee_percentage REAL DEFAULT 10.0,
    platform_fee_amount REAL DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK(status IN (
        'pending', 'active', 'completed', 'disputed', 'refunded', 'cancelled'
    )),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (contractor_id) REFERENCES users(id),
    FOREIGN KEY (provider_id) REFERENCES users(id)
);

-- Tabela de Marcos/Milestones do Projeto
CREATE TABLE IF NOT EXISTS project_milestones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    escrow_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    amount REAL NOT NULL,
    percentage REAL, -- Porcentagem do total
    sequence_order INTEGER NOT NULL,
    estimated_completion_date DATE,
    status TEXT DEFAULT 'pending' CHECK(status IN (
        'pending', 'in_progress', 'submitted', 'approved', 
        'rejected', 'released', 'disputed'
    )),
    submitted_at DATETIME,
    approved_at DATETIME,
    rejected_at DATETIME,
    rejection_reason TEXT,
    released_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (escrow_id) REFERENCES escrow_accounts(id) ON DELETE CASCADE
);

-- Tabela de Evidências dos Marcos
CREATE TABLE IF NOT EXISTS milestone_evidences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    milestone_id INTEGER NOT NULL,
    uploaded_by INTEGER NOT NULL,
    evidence_type TEXT CHECK(evidence_type IN ('document', 'image', 'video', 'link', 'note')),
    file_path TEXT,
    file_name TEXT,
    file_size INTEGER,
    mime_type TEXT,
    url TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Tabela de Revisões Solicitadas
CREATE TABLE IF NOT EXISTS milestone_revisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    milestone_id INTEGER NOT NULL,
    requested_by INTEGER NOT NULL,
    revision_number INTEGER NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'rejected')),
    completed_at DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id) ON DELETE CASCADE,
    FOREIGN KEY (requested_by) REFERENCES users(id)
);

-- Tabela de Notas Fiscais
CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    milestone_id INTEGER,
    issuer_user_id INTEGER NOT NULL,
    recipient_user_id INTEGER NOT NULL,
    invoice_number TEXT UNIQUE NOT NULL,
    invoice_type TEXT CHECK(invoice_type IN ('nfse', 'nfe', 'nfce', 'recibo')),
    amount REAL NOT NULL,
    tax_amount REAL DEFAULT 0,
    net_amount REAL NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE,
    payment_date DATE,
    file_path TEXT,
    file_name TEXT,
    status TEXT DEFAULT 'issued' CHECK(status IN ('issued', 'sent', 'paid', 'cancelled')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id),
    FOREIGN KEY (issuer_user_id) REFERENCES users(id),
    FOREIGN KEY (recipient_user_id) REFERENCES users(id)
);

-- Tabela de Logs de Liberação de Fundos
CREATE TABLE IF NOT EXISTS escrow_release_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    escrow_id INTEGER NOT NULL,
    milestone_id INTEGER,
    amount REAL NOT NULL,
    released_by INTEGER NOT NULL,
    release_type TEXT CHECK(release_type IN ('milestone', 'partial', 'full', 'refund')),
    transaction_id INTEGER,
    reason TEXT,
    hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (escrow_id) REFERENCES escrow_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id),
    FOREIGN KEY (released_by) REFERENCES users(id),
    FOREIGN KEY (transaction_id) REFERENCES wallet_transactions(id)
);

-- Índices para Performance
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_reference ON wallet_transactions(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_escrow_accounts_project_id ON escrow_accounts(project_id);
CREATE INDEX IF NOT EXISTS idx_escrow_accounts_status ON escrow_accounts(status);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_status ON project_milestones(status);
CREATE INDEX IF NOT EXISTS idx_milestone_evidences_milestone_id ON milestone_evidences(milestone_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_issuer_user_id ON invoices(issuer_user_id);
CREATE INDEX IF NOT EXISTS idx_escrow_release_logs_escrow_id ON escrow_release_logs(escrow_id);

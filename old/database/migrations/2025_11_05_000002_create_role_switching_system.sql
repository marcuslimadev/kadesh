-- Migração: Sistema de Alternância de Papéis
-- Data: 2025-11-05

-- Tabela de Histórico de Alteração de Papéis
CREATE TABLE IF NOT EXISTS user_role_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    previous_role TEXT CHECK(previous_role IN ('contractor', 'provider', 'both', 'admin')),
    new_role TEXT NOT NULL CHECK(new_role IN ('contractor', 'provider', 'both', 'admin')),
    reason TEXT,
    ip_address TEXT,
    user_agent TEXT,
    session_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de Contexto Ativo do Usuário
CREATE TABLE IF NOT EXISTS user_active_context (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    active_role TEXT NOT NULL CHECK(active_role IN ('contractor', 'provider')),
    switched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_role_history_user_id ON user_role_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_role_history_created_at ON user_role_history(created_at);

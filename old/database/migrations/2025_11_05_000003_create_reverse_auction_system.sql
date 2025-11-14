-- Migração: Sistema de Leilão Reverso
-- Data: 2025-11-05

-- Atualizar tabela de projetos para incluir campos de leilão
-- (Como SQLite não suporta ALTER TABLE completamente, vamos criar triggers)

-- Tabela de Configurações de Leilão por Projeto
CREATE TABLE IF NOT EXISTS project_auction_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL UNIQUE,
    min_budget REAL NOT NULL,
    max_budget REAL NOT NULL,
    min_bid_decrement REAL DEFAULT 50.00, -- Decremento mínimo entre lances
    auction_duration_minutes INTEGER DEFAULT 10080, -- 7 dias padrão
    soft_close_minutes INTEGER DEFAULT 2, -- Extensão se houver lance nos últimos minutos
    max_soft_close_extensions INTEGER DEFAULT 5, -- Máximo de extensões
    price_weight REAL DEFAULT 0.70 CHECK(price_weight BETWEEN 0 AND 1),
    reputation_weight REAL DEFAULT 0.30 CHECK(reputation_weight BETWEEN 0 AND 1),
    is_confidential INTEGER DEFAULT 0, -- Lances ocultos
    allow_questions INTEGER DEFAULT 1,
    requires_portfolio INTEGER DEFAULT 0,
    min_reputation_required REAL DEFAULT 0,
    started_at DATETIME,
    ends_at DATETIME,
    actual_end_time DATETIME, -- Pode ser diferente devido a soft close
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'open', 'extended', 'closed', 'cancelled')),
    winner_bid_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (winner_bid_id) REFERENCES bids(id)
);

-- Tabela de Lances (Bids)
CREATE TABLE IF NOT EXISTS bids (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    provider_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    original_amount REAL, -- Valor original se houve edição
    proposal_text TEXT NOT NULL,
    estimated_duration_days INTEGER,
    portfolio_attachments TEXT, -- JSON array de arquivos
    is_withdrawn INTEGER DEFAULT 0,
    withdrawn_at DATETIME,
    withdrawn_reason TEXT,
    reputation_score REAL DEFAULT 0, -- Reputação do provider no momento do lance
    calculated_score REAL, -- Score final = (price_weight * price_score) + (reputation_weight * reputation_score)
    rank_position INTEGER, -- Posição no ranking
    is_winner INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de Histórico de Lances (para rastreabilidade)
CREATE TABLE IF NOT EXISTS bid_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bid_id INTEGER NOT NULL,
    previous_amount REAL,
    new_amount REAL NOT NULL,
    previous_rank INTEGER,
    new_rank INTEGER,
    action TEXT NOT NULL CHECK(action IN ('created', 'updated', 'withdrawn', 'winner', 'outbid')),
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bid_id) REFERENCES bids(id) ON DELETE CASCADE
);

-- Tabela de Perguntas sobre o Projeto
CREATE TABLE IF NOT EXISTS project_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    answer TEXT,
    answered_by INTEGER,
    answered_at DATETIME,
    is_public INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (answered_by) REFERENCES users(id)
);

-- Tabela de Notificações de Leilão em Tempo Real
CREATE TABLE IF NOT EXISTS auction_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auction_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    notification_type TEXT NOT NULL CHECK(notification_type IN (
        'new_bid', 'outbid', 'leading', 'ending_soon', 
        'extended', 'ended', 'won', 'lost'
    )),
    bid_id INTEGER,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (auction_id) REFERENCES project_auction_config(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bid_id) REFERENCES bids(id)
);

-- Tabela de Logs de Eventos do Leilão
CREATE TABLE IF NOT EXISTS auction_event_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auction_id INTEGER NOT NULL,
    event_type TEXT NOT NULL CHECK(event_type IN (
        'created', 'started', 'bid_placed', 'bid_withdrawn', 
        'extended', 'ended', 'winner_selected', 'cancelled'
    )),
    user_id INTEGER,
    bid_id INTEGER,
    event_data TEXT, -- JSON com detalhes do evento
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (auction_id) REFERENCES project_auction_config(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (bid_id) REFERENCES bids(id)
);

-- Índices para Performance
CREATE INDEX IF NOT EXISTS idx_project_auction_config_status ON project_auction_config(status);
CREATE INDEX IF NOT EXISTS idx_project_auction_config_ends_at ON project_auction_config(ends_at);
CREATE INDEX IF NOT EXISTS idx_bids_project_id ON bids(project_id);
CREATE INDEX IF NOT EXISTS idx_bids_provider_id ON bids(provider_id);
CREATE INDEX IF NOT EXISTS idx_bids_calculated_score ON bids(calculated_score DESC);
CREATE INDEX IF NOT EXISTS idx_bids_is_winner ON bids(is_winner);
CREATE INDEX IF NOT EXISTS idx_bid_history_bid_id ON bid_history(bid_id);
CREATE INDEX IF NOT EXISTS idx_project_questions_project_id ON project_questions(project_id);
CREATE INDEX IF NOT EXISTS idx_auction_notifications_user_id ON auction_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_auction_notifications_is_read ON auction_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_auction_event_logs_auction_id ON auction_event_logs(auction_id);

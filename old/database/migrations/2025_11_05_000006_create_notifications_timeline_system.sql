-- Migração: Sistema de Notificações e Timeline
-- Data: 2025-11-05

-- Tabela de Notificações Unificadas
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    notification_type TEXT NOT NULL CHECK(notification_type IN (
        'auction_new_bid', 'auction_outbid', 'auction_leading', 'auction_ending_soon',
        'auction_extended', 'auction_ended', 'auction_won', 'auction_lost',
        'project_created', 'project_updated', 'project_started', 'project_completed',
        'milestone_created', 'milestone_submitted', 'milestone_approved', 'milestone_rejected',
        'payment_received', 'payment_released', 'payment_pending',
        'dispute_opened', 'dispute_message', 'dispute_resolved',
        'review_received', 'message_received', 'document_verified', 'document_rejected',
        'account_warning', 'account_suspended', 'kyc_approved', 'kyc_rejected'
    )),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    reference_type TEXT, -- 'project', 'bid', 'milestone', 'dispute', etc
    reference_id INTEGER,
    priority TEXT DEFAULT 'normal' CHECK(priority IN ('low', 'normal', 'high', 'urgent')),
    icon TEXT,
    action_url TEXT,
    action_label TEXT,
    is_read INTEGER DEFAULT 0,
    read_at DATETIME,
    sent_email INTEGER DEFAULT 0,
    sent_whatsapp INTEGER DEFAULT 0,
    sent_sms INTEGER DEFAULT 0,
    sent_push INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de Timeline de Eventos do Projeto
CREATE TABLE IF NOT EXISTS project_timeline (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    event_type TEXT NOT NULL CHECK(event_type IN (
        'created', 'published', 'auction_started', 'bid_placed', 'bid_withdrawn',
        'auction_extended', 'auction_ended', 'winner_selected', 'contract_accepted',
        'started', 'milestone_created', 'milestone_submitted', 'milestone_approved',
        'milestone_rejected', 'milestone_released', 'payment_deposited', 'payment_released',
        'dispute_opened', 'dispute_resolved', 'revision_requested', 'revision_completed',
        'completed', 'reviewed', 'cancelled', 'refunded'
    )),
    event_category TEXT CHECK(event_category IN ('auction', 'execution', 'financial', 'dispute', 'administrative')),
    actor_id INTEGER, -- Usuário que causou o evento
    target_id INTEGER, -- Usuário afetado pelo evento
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT, -- Cor para exibição visual
    reference_type TEXT, -- 'bid', 'milestone', 'payment', etc
    reference_id INTEGER,
    metadata TEXT, -- JSON com dados adicionais
    ip_address TEXT,
    is_public INTEGER DEFAULT 1, -- Visível para todos os participantes
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES users(id),
    FOREIGN KEY (target_id) REFERENCES users(id)
);

-- Tabela de Mensagens do Projeto (Chat)
CREATE TABLE IF NOT EXISTS project_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK(message_type IN ('text', 'file', 'image', 'system')),
    file_path TEXT,
    file_name TEXT,
    file_size INTEGER,
    mime_type TEXT,
    is_system_message INTEGER DEFAULT 0,
    reply_to_id INTEGER, -- Referência para resposta
    is_edited INTEGER DEFAULT 0,
    edited_at DATETIME,
    is_deleted INTEGER DEFAULT 0,
    deleted_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (reply_to_id) REFERENCES project_messages(id)
);

-- Tabela de Leitura de Mensagens
CREATE TABLE IF NOT EXISTS message_read_status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES project_messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(message_id, user_id)
);

-- Tabela de Templates de Notificação
CREATE TABLE IF NOT EXISTS notification_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    subject_template TEXT NOT NULL,
    body_template TEXT NOT NULL,
    sms_template TEXT,
    push_template TEXT,
    variables TEXT, -- JSON com variáveis disponíveis
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Fila de Envio de Notificações
CREATE TABLE IF NOT EXISTS notification_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    notification_id INTEGER NOT NULL,
    channel TEXT NOT NULL CHECK(channel IN ('email', 'whatsapp', 'sms', 'push')),
    recipient TEXT NOT NULL, -- Email, telefone, etc
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'sending', 'sent', 'failed', 'cancelled')),
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    last_attempt_at DATETIME,
    sent_at DATETIME,
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE
);

-- Tabela de WebSocket Connections (para notificações em tempo real)
CREATE TABLE IF NOT EXISTS websocket_connections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    connection_id TEXT NOT NULL UNIQUE,
    socket_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    connected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_ping_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    disconnected_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para Performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_reference ON notifications(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_project_timeline_project_id ON project_timeline(project_id);
CREATE INDEX IF NOT EXISTS idx_project_timeline_created_at ON project_timeline(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_timeline_event_type ON project_timeline(event_type);
CREATE INDEX IF NOT EXISTS idx_project_messages_project_id ON project_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_project_messages_sender_id ON project_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_message_read_status_user_id ON message_read_status(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_queue_status ON notification_queue(status);
CREATE INDEX IF NOT EXISTS idx_websocket_connections_user_id ON websocket_connections(user_id);

-- Inserir Templates Padrão de Notificação
INSERT OR IGNORE INTO notification_templates (template_key, name, subject_template, body_template, sms_template, push_template, variables) VALUES
('new_bid', 'Novo Lance Recebido', 'Novo lance no projeto {{project_title}}', 'Você recebeu um novo lance de R$ {{bid_amount}} no projeto "{{project_title}}".', 'Novo lance de R$ {{bid_amount}} em {{project_title}}', 'Novo lance recebido', '["project_title", "bid_amount", "bidder_name"]'),
('outbid', 'Lance Superado', 'Seu lance foi superado', 'Seu lance no projeto "{{project_title}}" foi superado. Lance atual: R$ {{current_bid_amount}}', 'Você foi superado em {{project_title}}', 'Lance superado!', '["project_title", "current_bid_amount", "your_bid_amount"]'),
('auction_won', 'Você Venceu o Leilão!', 'Parabéns! Você venceu o leilão', 'Parabéns! Você venceu o leilão do projeto "{{project_title}}" com o lance de R$ {{winning_bid_amount}}', 'Você venceu o leilão de {{project_title}}!', 'Parabéns! Você venceu!', '["project_title", "winning_bid_amount"]'),
('payment_received', 'Pagamento Recebido', 'Pagamento de R$ {{amount}} recebido', 'Você recebeu um pagamento de R$ {{amount}} referente ao projeto "{{project_title}}".', 'Pagamento de R$ {{amount}} recebido', 'Pagamento recebido', '["amount", "project_title"]'),
('milestone_approved', 'Marco Aprovado', 'Marco aprovado no projeto {{project_title}}', 'O marco "{{milestone_title}}" foi aprovado. Valor de R$ {{amount}} será liberado.', 'Marco aprovado em {{project_title}}', 'Marco aprovado!', '["milestone_title", "project_title", "amount"]'),
('dispute_opened', 'Nova Disputa Aberta', 'Disputa aberta no projeto {{project_title}}', 'Uma disputa foi aberta no projeto "{{project_title}}". Por favor, responda o mais breve possível.', 'Disputa aberta em {{project_title}}', 'Nova disputa', '["project_title", "dispute_type"]');

-- Migration: Atualizar tabela Projects
-- Adicionar campos para histórico e pagamento

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS winner_bid_id BIGINT UNSIGNED NULL COMMENT 'Lance vencedor' AFTER status,
ADD COLUMN IF NOT EXISTS payment_status ENUM('pending', 'paid', 'released', 'refunded') DEFAULT 'pending' AFTER winner_bid_id,
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP NULL COMMENT 'Quando projeto iniciou' AFTER bidding_ends_at,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP NULL COMMENT 'Quando foi concluído' AFTER started_at,
ADD COLUMN IF NOT EXISTS final_price DECIMAL(10,2) NULL COMMENT 'Preço final acordado' AFTER max_budget;

-- Adicionar foreign key para winner_bid_id
ALTER TABLE projects
ADD CONSTRAINT fk_winner_bid 
FOREIGN KEY (winner_bid_id) REFERENCES bids(id) ON DELETE SET NULL;

-- Índices
ALTER TABLE projects
ADD INDEX IF NOT EXISTS idx_payment_status (payment_status),
ADD INDEX IF NOT EXISTS idx_completed (completed_at);

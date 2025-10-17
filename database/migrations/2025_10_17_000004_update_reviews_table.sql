-- Migration: Atualizar tabela Reviews
-- Adicionar campos para avaliação completa

ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS quality_rating INT NULL COMMENT 'Nota qualidade (1-5)' AFTER rating,
ADD COLUMN IF NOT EXISTS communication_rating INT NULL COMMENT 'Nota comunicação (1-5)' AFTER quality_rating,
ADD COLUMN IF NOT EXISTS deadline_rating INT NULL COMMENT 'Nota prazo (1-5)' AFTER communication_rating,
ADD COLUMN IF NOT EXISTS would_hire_again BOOLEAN DEFAULT TRUE COMMENT 'Contrataria novamente?' AFTER deadline_rating,
ADD COLUMN IF NOT EXISTS review_photos JSON NULL COMMENT 'Fotos da avaliação' AFTER comment,
ADD COLUMN IF NOT EXISTS provider_response TEXT NULL COMMENT 'Resposta do fornecedor' AFTER review_photos,
ADD COLUMN IF NOT EXISTS provider_responded_at TIMESTAMP NULL AFTER provider_response,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE COMMENT 'Avaliação verificada' AFTER provider_responded_at,
ADD COLUMN IF NOT EXISTS helpful_count INT DEFAULT 0 COMMENT 'Quantos acharam útil' AFTER is_verified;

-- Índices para otimização
ALTER TABLE reviews
ADD INDEX IF NOT EXISTS idx_quality (quality_rating),
ADD INDEX IF NOT EXISTS idx_verified (is_verified);

-- Migração: Adicionar tabela de anúncios
-- Data: 2025-12-01
-- Descrição: Cria tabela advertisements para gerenciamento de anúncios publicitários

-- Advertisements table
CREATE TABLE IF NOT EXISTS advertisements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    link_url VARCHAR(500),
    image_url VARCHAR(500),
    position VARCHAR(10) DEFAULT 'left', -- 'left' or 'right'
    slot INTEGER DEFAULT 1, -- 1 or 2 (order in the rail)
    is_active BOOLEAN DEFAULT TRUE,
    click_count INTEGER DEFAULT 0,
    impression_count INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for active ads by position
CREATE INDEX IF NOT EXISTS idx_advertisements_active ON advertisements(is_active, position, slot) WHERE is_active = TRUE;

-- Comment
COMMENT ON TABLE advertisements IS 'Advertisement banners for AdRail component';

-- Inserir anúncios de exemplo
INSERT INTO advertisements (title, description, position, slot, is_active)
VALUES 
  ('Espaço reservado', 'Reserve um banner premium e destaque sua marca para contratantes e prestadores.', 'left', 1, TRUE),
  ('Campanhas 360º', 'Ative ações especiais com lead tracking direto no Service Bridge.', 'left', 2, TRUE);

-- Sucesso!
SELECT 'Migração concluída com sucesso!' as status;

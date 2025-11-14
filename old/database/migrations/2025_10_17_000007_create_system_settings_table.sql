-- Tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS system_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL COMMENT 'Chave única da configuração',
    setting_value TEXT DEFAULT NULL COMMENT 'Valor da configuração (pode ser JSON)',
    setting_type VARCHAR(50) DEFAULT 'string' COMMENT 'Tipo: string, number, boolean, json',
    setting_category VARCHAR(100) DEFAULT 'general' COMMENT 'Categoria: general, payment, email, etc',
    description TEXT DEFAULT NULL COMMENT 'Descrição da configuração',
    is_encrypted BOOLEAN DEFAULT FALSE COMMENT 'Se true, valor está criptografado',
    updated_by BIGINT UNSIGNED DEFAULT NULL COMMENT 'Admin que fez última alteração',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_key (setting_key),
    INDEX idx_category (setting_category),
    FOREIGN KEY (updated_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir configurações padrão
INSERT INTO system_settings (setting_key, setting_value, setting_type, setting_category, description) VALUES

-- Mercado Pago
('mp_public_key_test', '', 'string', 'payment', 'Chave pública TEST do Mercado Pago'),
('mp_access_token_test', '', 'string', 'payment', 'Access Token TEST do Mercado Pago'),
('mp_public_key_prod', '', 'string', 'payment', 'Chave pública PRODUÇÃO do Mercado Pago'),
('mp_access_token_prod', '', 'string', 'payment', 'Access Token PRODUÇÃO do Mercado Pago'),
('mp_environment', 'test', 'string', 'payment', 'Ambiente MP: test ou prod'),
('platform_fee_percentage', '10', 'number', 'payment', 'Percentual de taxa da plataforma (%)'),

-- Geral
('site_name', 'Kadesh', 'string', 'general', 'Nome do site'),
('site_email', 'contato@kadesh.com', 'string', 'general', 'Email de contato principal'),
('site_phone', '', 'string', 'general', 'Telefone de contato'),
('maintenance_mode', 'false', 'boolean', 'general', 'Modo manutenção ativado'),

-- Email
('smtp_host', '', 'string', 'email', 'Servidor SMTP'),
('smtp_port', '587', 'number', 'email', 'Porta SMTP'),
('smtp_user', '', 'string', 'email', 'Usuário SMTP'),
('smtp_password', '', 'string', 'email', 'Senha SMTP'),
('smtp_from_email', 'noreply@kadesh.com', 'string', 'email', 'Email remetente'),
('smtp_from_name', 'Kadesh', 'string', 'email', 'Nome remetente'),

-- Limites
('max_projects_per_user', '50', 'number', 'limits', 'Máximo de projetos ativos por usuário'),
('max_bids_per_project', '100', 'number', 'limits', 'Máximo de propostas por projeto'),
('max_portfolio_images', '30', 'number', 'limits', 'Máximo de imagens no portfólio'),
('max_image_size_mb', '5', 'number', 'limits', 'Tamanho máximo de imagem (MB)');

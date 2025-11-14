-- Migração: Sistema Completo de KYC e Verificação
-- Data: 2025-11-05
-- MySQL/MariaDB

-- Tabela de Documentos do Usuário
CREATE TABLE IF NOT EXISTS user_documents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    document_type ENUM('rg', 'cnh', 'cpf', 'cnpj', 'contrato_social', 'comprovante_residencia', 'selfie', 'certificacao') NOT NULL,
    document_number VARCHAR(50),
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT UNSIGNED,
    mime_type VARCHAR(100),
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    verified_at DATETIME NULL,
    verified_by BIGINT UNSIGNED NULL,
    expires_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Dados Pessoais Estendidos
CREATE TABLE IF NOT EXISTS user_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    cpf_cnpj TEXT UNIQUE,
    phone TEXT,
    phone_verified_at DATETIME,
    whatsapp TEXT,
    address_street TEXT,
    address_number TEXT,
    address_complement TEXT,
    address_neighborhood TEXT,
    address_city TEXT,
    address_state TEXT,
    address_zipcode TEXT,
    address_country TEXT DEFAULT 'BR',
    birth_date DATE,
    gender TEXT CHECK(gender IN ('masculino', 'feminino', 'outro', 'nao_informar')),
    company_name TEXT,
    company_type TEXT CHECK(company_type IN ('mei', 'me', 'ltda', 'sa', 'eireli', 'autonomo')),
    state_registration TEXT,
    municipal_registration TEXT,
    service_radius_km INTEGER DEFAULT 0, -- 0 = remoto apenas
    is_remote_worker INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de Categorias de Serviço
CREATE TABLE IF NOT EXISTS service_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    is_active INTEGER DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES service_categories(id) ON DELETE CASCADE
);

-- Tabela de Categorias do Usuário
CREATE TABLE IF NOT EXISTS user_service_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    experience_years INTEGER DEFAULT 0,
    is_primary INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE CASCADE,
    UNIQUE(user_id, category_id)
);

-- Tabela de Certificações e Licenças
CREATE TABLE IF NOT EXISTS user_certifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    certification_type TEXT NOT NULL CHECK(certification_type IN (
        'crea', 'cau', 'crc', 'oab', 'mei', 'nr10', 'nr12', 
        'nr33', 'nr35', 'iso', 'cnae', 'outros'
    )),
    certification_name TEXT NOT NULL,
    issuing_organization TEXT,
    registration_number TEXT,
    issue_date DATE,
    expiry_date DATE,
    document_file TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'verified', 'expired', 'revoked')),
    verified_at DATETIME,
    verified_by INTEGER,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- Tabela de Dados Bancários
CREATE TABLE IF NOT EXISTS user_bank_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    bank_code TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    account_type TEXT NOT NULL CHECK(account_type IN ('corrente', 'poupanca', 'pagamento')),
    agency TEXT NOT NULL,
    account_number TEXT NOT NULL,
    account_digit TEXT,
    account_holder_name TEXT NOT NULL,
    account_holder_document TEXT NOT NULL,
    pix_key TEXT,
    pix_key_type TEXT CHECK(pix_key_type IN ('cpf', 'cnpj', 'email', 'telefone', 'aleatoria')),
    is_default INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'verified', 'blocked')),
    verified_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de Consentimentos LGPD
CREATE TABLE IF NOT EXISTS user_consents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    consent_type TEXT NOT NULL CHECK(consent_type IN (
        'termos_uso', 'politica_privacidade', 'lgpd', 
        'marketing', 'whatsapp', 'email', 'sms'
    )),
    consent_version TEXT NOT NULL,
    is_granted INTEGER NOT NULL DEFAULT 0,
    granted_at DATETIME,
    revoked_at DATETIME,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de Preferências do Usuário
CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    language TEXT DEFAULT 'pt_BR',
    timezone TEXT DEFAULT 'America/Sao_Paulo',
    currency TEXT DEFAULT 'BRL',
    notify_email INTEGER DEFAULT 1,
    notify_whatsapp INTEGER DEFAULT 0,
    notify_sms INTEGER DEFAULT 0,
    notify_push INTEGER DEFAULT 1,
    notify_new_bids INTEGER DEFAULT 1,
    notify_bid_won INTEGER DEFAULT 1,
    notify_bid_lost INTEGER DEFAULT 1,
    notify_payment_received INTEGER DEFAULT 1,
    notify_payment_released INTEGER DEFAULT 1,
    notify_milestone_approved INTEGER DEFAULT 1,
    notify_dispute_opened INTEGER DEFAULT 1,
    notify_new_message INTEGER DEFAULT 1,
    notify_new_review INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de Logs de Auditoria Imutáveis
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    entity_type TEXT NOT NULL,
    entity_id INTEGER,
    action TEXT NOT NULL,
    old_values TEXT, -- JSON
    new_values TEXT, -- JSON
    ip_address TEXT,
    user_agent TEXT,
    session_id TEXT,
    hash_previous TEXT,
    hash_current TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de Questionário de Reputação Inicial
CREATE TABLE IF NOT EXISTS user_reputation_survey (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    experience_level INTEGER CHECK(experience_level BETWEEN 0 AND 5),
    completed_projects_count INTEGER DEFAULT 0,
    average_project_value REAL DEFAULT 0,
    specialization_areas TEXT, -- JSON
    self_rating INTEGER CHECK(self_rating BETWEEN 0 AND 5),
    portfolio_quality INTEGER CHECK(portfolio_quality BETWEEN 0 AND 5),
    response_time_commitment INTEGER CHECK(response_time_commitment BETWEEN 0 AND 5),
    deadline_commitment INTEGER CHECK(deadline_commitment BETWEEN 0 AND 5),
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para Performance
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_status ON user_documents(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_cpf_cnpj ON user_profiles(cpf_cnpj);
CREATE INDEX IF NOT EXISTS idx_user_certifications_user_id ON user_certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_certifications_status ON user_certifications(status);
CREATE INDEX IF NOT EXISTS idx_user_bank_accounts_user_id ON user_bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_consents_user_id ON user_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Inserir Categorias Padrão
INSERT OR IGNORE INTO service_categories (id, parent_id, name, slug, description, icon, display_order) VALUES
(1, NULL, 'Tecnologia', 'tecnologia', 'Serviços de TI e Desenvolvimento', 'laptop', 1),
(2, 1, 'Desenvolvimento Web', 'desenvolvimento-web', 'Sites, aplicativos web e APIs', 'code', 1),
(3, 1, 'Desenvolvimento Mobile', 'desenvolvimento-mobile', 'Aplicativos iOS e Android', 'smartphone', 2),
(4, 1, 'Design UI/UX', 'design-ui-ux', 'Interface e experiência do usuário', 'palette', 3),
(5, NULL, 'Construção e Reformas', 'construcao-reformas', 'Obras e serviços de construção civil', 'hammer', 2),
(6, 5, 'Pedreiro', 'pedreiro', 'Alvenaria e acabamentos', 'brick', 1),
(7, 5, 'Eletricista', 'eletricista', 'Instalações elétricas', 'bolt', 2),
(8, 5, 'Encanador', 'encanador', 'Instalações hidráulicas', 'droplet', 3),
(9, NULL, 'Marketing e Vendas', 'marketing-vendas', 'Marketing digital e estratégias de venda', 'megaphone', 3),
(10, 9, 'Marketing Digital', 'marketing-digital', 'SEO, SEM, redes sociais', 'trending-up', 1),
(11, 9, 'Redação e Conteúdo', 'redacao-conteudo', 'Textos, artigos e copywriting', 'edit', 2),
(12, NULL, 'Design e Arte', 'design-arte', 'Design gráfico e criação visual', 'image', 4),
(13, 12, 'Design Gráfico', 'design-grafico', 'Logotipos, materiais impressos', 'layers', 1),
(14, 12, 'Ilustração', 'ilustracao', 'Desenhos e ilustrações digitais', 'pen-tool', 2),
(15, NULL, 'Consultoria', 'consultoria', 'Consultorias especializadas', 'briefcase', 5);

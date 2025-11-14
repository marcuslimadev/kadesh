-- Migração: Sistema Completo de KYC e Verificação - MySQL
-- Data: 2025-11-05

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
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    cpf_cnpj VARCHAR(18) UNIQUE,
    phone VARCHAR(20),
    phone_verified_at DATETIME NULL,
    whatsapp VARCHAR(20),
    address_street VARCHAR(255),
    address_number VARCHAR(20),
    address_complement VARCHAR(100),
    address_neighborhood VARCHAR(100),
    address_city VARCHAR(100),
    address_state VARCHAR(2),
    address_zipcode VARCHAR(10),
    address_country VARCHAR(2) DEFAULT 'BR',
    birth_date DATE,
    gender ENUM('masculino', 'feminino', 'outro', 'nao_informar'),
    company_name VARCHAR(255),
    company_type ENUM('mei', 'me', 'ltda', 'sa', 'eireli', 'autonomo'),
    state_registration VARCHAR(50),
    municipal_registration VARCHAR(50),
    service_radius_km INT DEFAULT 0,
    is_remote_worker BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_cpf_cnpj (cpf_cnpj)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Categorias de Serviço
CREATE TABLE IF NOT EXISTS service_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT UNSIGNED NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES service_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Categorias do Usuário
CREATE TABLE IF NOT EXISTS user_service_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    experience_years INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_category (user_id, category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Certificações e Licenças
CREATE TABLE IF NOT EXISTS user_certifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    certification_type ENUM('crea', 'cau', 'crc', 'oab', 'mei', 'nr10', 'nr12', 'nr33', 'nr35', 'iso', 'cnae', 'outros') NOT NULL,
    certification_name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255),
    registration_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    document_file VARCHAR(500),
    status ENUM('pending', 'verified', 'expired', 'revoked') NOT NULL DEFAULT 'pending',
    verified_at DATETIME NULL,
    verified_by BIGINT UNSIGNED NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Dados Bancários
CREATE TABLE IF NOT EXISTS user_bank_accounts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    bank_code VARCHAR(10) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    account_type ENUM('corrente', 'poupanca', 'pagamento') NOT NULL,
    agency VARCHAR(10) NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    account_digit VARCHAR(2),
    account_holder_name VARCHAR(255) NOT NULL,
    account_holder_document VARCHAR(18) NOT NULL,
    pix_key VARCHAR(255),
    pix_key_type ENUM('cpf', 'cnpj', 'email', 'telefone', 'aleatoria'),
    is_default BOOLEAN DEFAULT FALSE,
    status ENUM('pending', 'verified', 'blocked') NOT NULL DEFAULT 'pending',
    verified_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Consentimentos LGPD
CREATE TABLE IF NOT EXISTS user_consents (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    consent_type ENUM('termos_uso', 'politica_privacidade', 'lgpd', 'marketing', 'whatsapp', 'email', 'sms') NOT NULL,
    consent_version VARCHAR(20) NOT NULL,
    is_granted BOOLEAN NOT NULL DEFAULT FALSE,
    granted_at DATETIME NULL,
    revoked_at DATETIME NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Preferências do Usuário
CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    language VARCHAR(10) DEFAULT 'pt_BR',
    timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    currency VARCHAR(3) DEFAULT 'BRL',
    notify_email BOOLEAN DEFAULT TRUE,
    notify_whatsapp BOOLEAN DEFAULT FALSE,
    notify_sms BOOLEAN DEFAULT FALSE,
    notify_push BOOLEAN DEFAULT TRUE,
    notify_new_bids BOOLEAN DEFAULT TRUE,
    notify_bid_won BOOLEAN DEFAULT TRUE,
    notify_bid_lost BOOLEAN DEFAULT TRUE,
    notify_payment_received BOOLEAN DEFAULT TRUE,
    notify_payment_released BOOLEAN DEFAULT TRUE,
    notify_milestone_approved BOOLEAN DEFAULT TRUE,
    notify_dispute_opened BOOLEAN DEFAULT TRUE,
    notify_new_message BOOLEAN DEFAULT TRUE,
    notify_new_review BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Logs de Auditoria Imutáveis
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT UNSIGNED NULL,
    action VARCHAR(50) NOT NULL,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    session_id VARCHAR(100),
    hash_previous VARCHAR(64),
    hash_current VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Questionário de Reputação Inicial
CREATE TABLE IF NOT EXISTS user_reputation_survey (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    experience_level TINYINT CHECK(experience_level BETWEEN 0 AND 5),
    completed_projects_count INT DEFAULT 0,
    average_project_value DECIMAL(10,2) DEFAULT 0,
    specialization_areas JSON,
    self_rating TINYINT CHECK(self_rating BETWEEN 0 AND 5),
    portfolio_quality TINYINT CHECK(portfolio_quality BETWEEN 0 AND 5),
    response_time_commitment TINYINT CHECK(response_time_commitment BETWEEN 0 AND 5),
    deadline_commitment TINYINT CHECK(deadline_commitment BETWEEN 0 AND 5),
    completed_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir Categorias Padrão
INSERT IGNORE INTO service_categories (id, parent_id, name, slug, description, icon, display_order) VALUES
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

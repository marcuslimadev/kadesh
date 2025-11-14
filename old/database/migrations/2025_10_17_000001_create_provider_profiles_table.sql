-- Migration: Provider Profiles
-- Perfil detalhado dos fornecedores com informações comerciais

CREATE TABLE IF NOT EXISTS provider_profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    
    -- Informações do Negócio
    business_name VARCHAR(255) NULL COMMENT 'Nome fantasia do negócio',
    tagline VARCHAR(255) NULL COMMENT 'Slogan/descrição curta',
    about TEXT NULL COMMENT 'Sobre o fornecedor/empresa',
    
    -- Especialidades e Habilidades
    specialties JSON NULL COMMENT 'Array de especialidades',
    services_offered JSON NULL COMMENT 'Serviços oferecidos',
    
    -- Experiência e Qualificações
    years_experience INT NULL COMMENT 'Anos de experiência',
    certifications JSON NULL COMMENT 'Certificações e cursos',
    
    -- Localização e Contato
    city VARCHAR(100) NULL,
    state VARCHAR(50) NULL,
    phone VARCHAR(20) NULL,
    whatsapp VARCHAR(20) NULL,
    website VARCHAR(255) NULL,
    
    -- Disponibilidade
    availability_status ENUM('available', 'busy', 'unavailable') DEFAULT 'available',
    max_concurrent_projects INT DEFAULT 3 COMMENT 'Projetos simultâneos máximos',
    
    -- Estatísticas (calculadas)
    total_projects INT DEFAULT 0,
    completed_projects INT DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    
    -- Configurações
    profile_visible BOOLEAN DEFAULT TRUE,
    accept_new_projects BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_availability (availability_status),
    INDEX idx_rating (average_rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

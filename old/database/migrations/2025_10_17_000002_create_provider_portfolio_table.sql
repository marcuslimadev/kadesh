-- Migration: Provider Portfolio
-- Galeria de fotos/trabalhos dos fornecedores

CREATE TABLE IF NOT EXISTS provider_portfolio (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    
    -- Arquivo
    filename VARCHAR(255) NOT NULL COMMENT 'Nome do arquivo salvo',
    original_name VARCHAR(255) NOT NULL COMMENT 'Nome original do arquivo',
    file_path VARCHAR(500) NOT NULL COMMENT 'Caminho relativo do arquivo',
    file_size INT NOT NULL COMMENT 'Tamanho em bytes',
    mime_type VARCHAR(100) NOT NULL,
    
    -- Metadados
    title VARCHAR(255) NULL COMMENT 'Título da imagem',
    description TEXT NULL COMMENT 'Descrição do trabalho',
    project_type VARCHAR(100) NULL COMMENT 'Tipo de projeto (ex: Logo, Website, etc)',
    
    -- Ordenação e destaque
    display_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE COMMENT 'Destacar no perfil',
    
    -- Controle
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_featured (is_featured),
    INDEX idx_public (is_public),
    INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

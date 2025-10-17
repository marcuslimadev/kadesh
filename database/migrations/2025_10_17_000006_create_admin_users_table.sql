-- Tabela de administradores do sistema
CREATE TABLE IF NOT EXISTS admin_users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    permissions JSON DEFAULT NULL COMMENT 'Permissões específicas do admin',
    is_super_admin BOOLEAN DEFAULT FALSE COMMENT 'Super admin tem acesso total',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at DATETIME DEFAULT NULL,
    last_login_ip VARCHAR(45) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir admin padrão (senha: Kadesh@2025)
-- Hash gerado com password_hash('Kadesh@2025', PASSWORD_DEFAULT)
INSERT INTO admin_users (name, email, password, is_super_admin, is_active) VALUES 
('Administrador', 'admin@kadesh.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE, TRUE);

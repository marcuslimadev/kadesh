-- Migração: Sistema de Reputação e Avaliações (MySQL)
-- Data: 2025-11-05

-- Tabela de Avaliações
CREATE TABLE IF NOT EXISTS reviews_detailed (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    reviewer_id BIGINT UNSIGNED NOT NULL COMMENT 'Quem avalia',
    reviewed_id BIGINT UNSIGNED NOT NULL COMMENT 'Quem é avaliado',
    reviewer_role ENUM('contractor', 'provider') NOT NULL,
    rating DECIMAL(2,1) NOT NULL CHECK(rating BETWEEN 0 AND 5),
    communication_rating DECIMAL(2,1) CHECK(communication_rating BETWEEN 0 AND 5),
    quality_rating DECIMAL(2,1) CHECK(quality_rating BETWEEN 0 AND 5),
    deadline_rating DECIMAL(2,1) CHECK(deadline_rating BETWEEN 0 AND 5),
    professionalism_rating DECIMAL(2,1) CHECK(professionalism_rating BETWEEN 0 AND 5),
    value_for_money_rating DECIMAL(2,1) CHECK(value_for_money_rating BETWEEN 0 AND 5),
    comment TEXT,
    pros TEXT COMMENT 'Pontos positivos',
    cons TEXT COMMENT 'Pontos negativos',
    would_work_again BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE COMMENT 'Verificado pela plataforma',
    verified_at TIMESTAMP NULL,
    response_text TEXT COMMENT 'Resposta do avaliado',
    responded_at TIMESTAMP NULL,
    helpful_count INT DEFAULT 0 COMMENT 'Quantas pessoas acharam útil',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_project_reviewer (project_id, reviewer_id),
    INDEX idx_reviews_project_id (project_id),
    INDEX idx_reviews_reviewer_id (reviewer_id),
    INDEX idx_reviews_reviewed_id (reviewed_id),
    INDEX idx_reviews_rating (rating),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (reviewed_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Votos de Utilidade nas Avaliações
CREATE TABLE IF NOT EXISTS review_votes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    review_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    vote_type ENUM('helpful', 'not_helpful'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_review_user (review_id, user_id),
    INDEX idx_review_votes_review_id (review_id),
    FOREIGN KEY (review_id) REFERENCES reviews_detailed(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Badges/Conquistas
CREATE TABLE IF NOT EXISTS achievement_badges (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    badge_key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    category ENUM('projects', 'quality', 'speed', 'communication', 'reliability', 'special'),
    criteria JSON COMMENT 'JSON com critérios para conquistar',
    points INT DEFAULT 0,
    rarity ENUM('common', 'uncommon', 'rare', 'epic', 'legendary'),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Badges Conquistados pelos Usuários
CREATE TABLE IF NOT EXISTS user_badges (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    badge_id BIGINT UNSIGNED NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress_data JSON COMMENT 'JSON com progresso',
    UNIQUE KEY unique_user_badge (user_id, badge_id),
    INDEX idx_user_badges_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES achievement_badges(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Estatísticas de Reputação
CREATE TABLE IF NOT EXISTS user_reputation_stats (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    overall_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    positive_reviews INT DEFAULT 0,
    negative_reviews INT DEFAULT 0,
    communication_avg DECIMAL(3,2) DEFAULT 0.00,
    quality_avg DECIMAL(3,2) DEFAULT 0.00,
    deadline_avg DECIMAL(3,2) DEFAULT 0.00,
    professionalism_avg DECIMAL(3,2) DEFAULT 0.00,
    value_for_money_avg DECIMAL(3,2) DEFAULT 0.00,
    -- Estatísticas como Contratante
    as_contractor_rating DECIMAL(3,2) DEFAULT 0.00,
    as_contractor_projects INT DEFAULT 0,
    as_contractor_total_spent DECIMAL(12,2) DEFAULT 0.00,
    -- Estatísticas como Prestador
    as_provider_rating DECIMAL(3,2) DEFAULT 0.00,
    as_provider_projects INT DEFAULT 0,
    as_provider_total_earned DECIMAL(12,2) DEFAULT 0.00,
    as_provider_completed_on_time INT DEFAULT 0,
    as_provider_completion_rate DECIMAL(5,2) DEFAULT 0.00,
    as_provider_response_time_hours DECIMAL(6,2) DEFAULT 0.00,
    -- Engajamento
    badges_count INT DEFAULT 0,
    total_points INT DEFAULT 0,
    response_rate DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Taxa de resposta a mensagens',
    dispute_rate DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Taxa de disputas',
    cancellation_rate DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Taxa de cancelamento',
    rehire_rate DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Taxa de recontratação',
    -- Datas
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Histórico de Pontuação de Reputação
CREATE TABLE IF NOT EXISTS reputation_history (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    change_type ENUM(
        'review_received', 'project_completed', 'dispute_won', 'dispute_lost',
        'badge_earned', 'penalty_applied', 'bonus_awarded', 'achievement_unlocked'
    ) NOT NULL,
    points_change DECIMAL(10,2) NOT NULL,
    rating_change DECIMAL(3,2),
    previous_rating DECIMAL(3,2),
    new_rating DECIMAL(3,2),
    reference_type VARCHAR(50),
    reference_id BIGINT UNSIGNED,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reputation_history_user_id (user_id),
    INDEX idx_reputation_history_created_at (created_at DESC),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Rank/Nível do Usuário
CREATE TABLE IF NOT EXISTS user_levels (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    level_number INT NOT NULL UNIQUE,
    level_name VARCHAR(100) NOT NULL,
    required_points INT NOT NULL,
    required_projects INT DEFAULT 0,
    required_rating DECIMAL(3,2) DEFAULT 0.00,
    benefits JSON COMMENT 'JSON com benefícios do nível',
    badge_icon VARCHAR(50),
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Nível Atual do Usuário
CREATE TABLE IF NOT EXISTS user_current_level (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    level_id BIGINT UNSIGNED NOT NULL,
    level_number INT NOT NULL,
    progress_to_next DECIMAL(5,2) DEFAULT 0.00,
    achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (level_id) REFERENCES user_levels(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir Níveis Padrão
INSERT INTO user_levels (level_number, level_name, required_points, required_projects, required_rating, benefits, badge_icon, color) VALUES
(1, 'Iniciante', 0, 0, 0, '{"description": "Bem-vindo à plataforma!"}', 'star', '#94A3B8'),
(2, 'Aprendiz', 100, 1, 3.0, '{"description": "Primeiro projeto concluído", "benefits": ["Visibilidade básica"]}', 'award', '#60A5FA'),
(3, 'Profissional', 500, 5, 3.5, '{"description": "Profissional estabelecido", "benefits": ["Destaque em buscas", "Badge profissional"]}', 'briefcase', '#34D399'),
(4, 'Especialista', 1500, 15, 4.0, '{"description": "Especialista reconhecido", "benefits": ["Prioridade em leilões", "Taxa reduzida 8%"]}', 'trending-up', '#FBBF24'),
(5, 'Mestre', 5000, 50, 4.5, '{"description": "Mestre da plataforma", "benefits": ["Selo de qualidade", "Taxa reduzida 6%", "Suporte prioritário"]}', 'crown', '#F59E0B'),
(6, 'Lendário', 15000, 150, 4.8, '{"description": "Status lendário", "benefits": ["Selo exclusivo", "Taxa reduzida 5%", "Destaque premium", "Acesso antecipado"]}', 'zap', '#8B5CF6')
ON DUPLICATE KEY UPDATE level_name=VALUES(level_name);

-- Inserir Badges Padrão
INSERT INTO achievement_badges (badge_key, name, description, icon, color, category, criteria, points, rarity) VALUES
('first_project', 'Primeiro Projeto', 'Complete seu primeiro projeto', 'check-circle', '#10B981', 'projects', '{"projects_completed": 1}', 50, 'common'),
('five_projects', '5 Projetos Completos', 'Complete 5 projetos com sucesso', 'layers', '#3B82F6', 'projects', '{"projects_completed": 5}', 200, 'uncommon'),
('perfect_rating', 'Avaliação Perfeita', 'Receba uma avaliação 5 estrelas', 'star', '#F59E0B', 'quality', '{"min_rating": 5, "min_reviews": 1}', 100, 'uncommon'),
('speed_demon', 'Rápido como Raio', 'Complete 3 projetos antes do prazo', 'zap', '#EF4444', 'speed', '{"early_completions": 3}', 150, 'rare'),
('communicator', 'Comunicador Excelente', 'Mantenha 95% de taxa de resposta', 'message-circle', '#06B6D4', 'communication', '{"response_rate": 95}', 100, 'uncommon'),
('reliable', 'Confiável', 'Complete 10 projetos sem disputas', 'shield', '#8B5CF6', 'reliability', '{"projects_no_disputes": 10}', 300, 'rare'),
('early_bird', 'Madrugador', 'Seja o primeiro a dar lance em 10 projetos', 'sunrise', '#F97316', 'special', '{"first_bids": 10}', 150, 'uncommon'),
('negotiator', 'Negociador', 'Vença 20 leilões', 'trending-down', '#14B8A6', 'projects', '{"auctions_won": 20}', 500, 'epic'),
('perfectionist', 'Perfeccionista', 'Mantenha média 4.8+ em 20 projetos', 'award', '#A855F7', 'quality', '{"min_rating": 4.8, "min_projects": 20}', 1000, 'epic'),
('legend', 'Lenda Viva', 'Complete 100 projetos com 4.9+ de média', 'crown', '#DC2626', 'special', '{"projects_completed": 100, "min_rating": 4.9}', 5000, 'legendary')
ON DUPLICATE KEY UPDATE name=VALUES(name);

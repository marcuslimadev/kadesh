-- Migração: Sistema de Reputação e Avaliações
-- Data: 2025-11-05

-- Tabela de Avaliações
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    reviewer_id INTEGER NOT NULL, -- Quem avalia
    reviewed_id INTEGER NOT NULL, -- Quem é avaliado
    reviewer_role TEXT NOT NULL CHECK(reviewer_role IN ('contractor', 'provider')),
    rating REAL NOT NULL CHECK(rating BETWEEN 0 AND 5),
    communication_rating REAL CHECK(communication_rating BETWEEN 0 AND 5),
    quality_rating REAL CHECK(quality_rating BETWEEN 0 AND 5),
    deadline_rating REAL CHECK(deadline_rating BETWEEN 0 AND 5),
    professionalism_rating REAL CHECK(professionalism_rating BETWEEN 0 AND 5),
    value_for_money_rating REAL CHECK(value_for_money_rating BETWEEN 0 AND 5),
    comment TEXT,
    pros TEXT, -- Pontos positivos
    cons TEXT, -- Pontos negativos
    would_work_again INTEGER DEFAULT 1,
    is_public INTEGER DEFAULT 1,
    is_verified INTEGER DEFAULT 0, -- Verificado pela plataforma
    verified_at DATETIME,
    response_text TEXT, -- Resposta do avaliado
    responded_at DATETIME,
    helpful_count INTEGER DEFAULT 0, -- Quantas pessoas acharam útil
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id),
    FOREIGN KEY (reviewed_id) REFERENCES users(id),
    UNIQUE(project_id, reviewer_id) -- Cada usuário só pode avaliar uma vez por projeto
);

-- Tabela de Votos de Utilidade nas Avaliações
CREATE TABLE IF NOT EXISTS review_votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    review_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    vote_type TEXT CHECK(vote_type IN ('helpful', 'not_helpful')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(review_id, user_id)
);

-- Tabela de Badges/Conquistas
CREATE TABLE IF NOT EXISTS achievement_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    badge_key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    category TEXT CHECK(category IN ('projects', 'quality', 'speed', 'communication', 'reliability', 'special')),
    criteria TEXT, -- JSON com critérios para conquistar
    points INTEGER DEFAULT 0,
    rarity TEXT CHECK(rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Badges Conquistados pelos Usuários
CREATE TABLE IF NOT EXISTS user_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    badge_id INTEGER NOT NULL,
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    progress_data TEXT, -- JSON com progresso
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES achievement_badges(id) ON DELETE CASCADE,
    UNIQUE(user_id, badge_id)
);

-- Tabela de Estatísticas de Reputação
CREATE TABLE IF NOT EXISTS user_reputation_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    overall_rating REAL DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    positive_reviews INTEGER DEFAULT 0,
    negative_reviews INTEGER DEFAULT 0,
    communication_avg REAL DEFAULT 0,
    quality_avg REAL DEFAULT 0,
    deadline_avg REAL DEFAULT 0,
    professionalism_avg REAL DEFAULT 0,
    value_for_money_avg REAL DEFAULT 0,
    -- Estatísticas como Contratante
    as_contractor_rating REAL DEFAULT 0,
    as_contractor_projects INTEGER DEFAULT 0,
    as_contractor_total_spent REAL DEFAULT 0,
    -- Estatísticas como Prestador
    as_provider_rating REAL DEFAULT 0,
    as_provider_projects INTEGER DEFAULT 0,
    as_provider_total_earned REAL DEFAULT 0,
    as_provider_completed_on_time INTEGER DEFAULT 0,
    as_provider_completion_rate REAL DEFAULT 0,
    as_provider_response_time_hours REAL DEFAULT 0,
    -- Engajamento
    badges_count INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    response_rate REAL DEFAULT 0, -- Taxa de resposta a mensagens
    dispute_rate REAL DEFAULT 0, -- Taxa de disputas
    cancellation_rate REAL DEFAULT 0, -- Taxa de cancelamento
    rehire_rate REAL DEFAULT 0, -- Taxa de recontratação
    -- Datas
    last_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de Histórico de Pontuação de Reputação
CREATE TABLE IF NOT EXISTS reputation_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    change_type TEXT NOT NULL CHECK(change_type IN (
        'review_received', 'project_completed', 'dispute_won', 'dispute_lost',
        'badge_earned', 'penalty_applied', 'bonus_awarded', 'achievement_unlocked'
    )),
    points_change REAL NOT NULL,
    rating_change REAL,
    previous_rating REAL,
    new_rating REAL,
    reference_type TEXT,
    reference_id INTEGER,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de Rank/Nível do Usuário
CREATE TABLE IF NOT EXISTS user_levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level_number INTEGER NOT NULL UNIQUE,
    level_name TEXT NOT NULL,
    required_points INTEGER NOT NULL,
    required_projects INTEGER DEFAULT 0,
    required_rating REAL DEFAULT 0,
    benefits TEXT, -- JSON com benefícios do nível
    badge_icon TEXT,
    color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Nível Atual do Usuário
CREATE TABLE IF NOT EXISTS user_current_level (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    level_id INTEGER NOT NULL,
    level_number INTEGER NOT NULL,
    progress_to_next REAL DEFAULT 0,
    achieved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (level_id) REFERENCES user_levels(id)
);

-- Índices para Performance
CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON reviews(project_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_id ON reviews(reviewed_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_review_votes_review_id ON review_votes(review_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_reputation_history_user_id ON reputation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_reputation_history_created_at ON reputation_history(created_at DESC);

-- Inserir Níveis Padrão
INSERT OR IGNORE INTO user_levels (level_number, level_name, required_points, required_projects, required_rating, benefits, badge_icon, color) VALUES
(1, 'Iniciante', 0, 0, 0, '{"description": "Bem-vindo à plataforma!"}', 'star', '#94A3B8'),
(2, 'Aprendiz', 100, 1, 3.0, '{"description": "Primeiro projeto concluído", "benefits": ["Visibilidade básica"]}', 'award', '#60A5FA'),
(3, 'Profissional', 500, 5, 3.5, '{"description": "Profissional estabelecido", "benefits": ["Destaque em buscas", "Badge profissional"]}', 'briefcase', '#34D399'),
(4, 'Especialista', 1500, 15, 4.0, '{"description": "Especialista reconhecido", "benefits": ["Prioridade em leilões", "Taxa reduzida 8%"]}', 'trending-up', '#FBBF24'),
(5, 'Mestre', 5000, 50, 4.5, '{"description": "Mestre da plataforma", "benefits": ["Selo de qualidade", "Taxa reduzida 6%", "Suporte prioritário"]}', 'crown', '#F59E0B'),
(6, 'Lendário', 15000, 150, 4.8, '{"description": "Status lendário", "benefits": ["Selo exclusivo", "Taxa reduzida 5%", "Destaque premium", "Acesso antecipado"]}', 'zap', '#8B5CF6');

-- Inserir Badges Padrão
INSERT OR IGNORE INTO achievement_badges (badge_key, name, description, icon, color, category, criteria, points, rarity) VALUES
('first_project', 'Primeiro Projeto', 'Complete seu primeiro projeto', 'check-circle', '#10B981', 'projects', '{"projects_completed": 1}', 50, 'common'),
('five_projects', '5 Projetos Completos', 'Complete 5 projetos com sucesso', 'layers', '#3B82F6', 'projects', '{"projects_completed": 5}', 200, 'uncommon'),
('perfect_rating', 'Avaliação Perfeita', 'Receba uma avaliação 5 estrelas', 'star', '#F59E0B', 'quality', '{"min_rating": 5, "min_reviews": 1}', 100, 'uncommon'),
('speed_demon', 'Rápido como Raio', 'Complete 3 projetos antes do prazo', 'zap', '#EF4444', 'speed', '{"early_completions": 3}', 150, 'rare'),
('communicator', 'Comunicador Excelente', 'Mantenha 95% de taxa de resposta', 'message-circle', '#06B6D4', 'communication', '{"response_rate": 95}', 100, 'uncommon'),
('reliable', 'Confiável', 'Complete 10 projetos sem disputas', 'shield', '#8B5CF6', 'reliability', '{"projects_no_disputes": 10}', 300, 'rare'),
('early_bird', 'Madrugador', 'Seja o primeiro a dar lance em 10 projetos', 'sunrise', '#F97316', 'special', '{"first_bids": 10}', 150, 'uncommon'),
('negotiator', 'Negociador', 'Vença 20 leilões', 'trending-down', '#14B8A6', 'projects', '{"auctions_won": 20}', 500, 'epic'),
('perfectionist', 'Perfeccionista', 'Mantenha média 4.8+ em 20 projetos', 'award', '#A855F7', 'quality', '{"min_rating": 4.8, "min_projects": 20}', 1000, 'epic'),
('legend', 'Lenda Viva', 'Complete 100 projetos com 4.9+ de média', 'crown', '#DC2626', 'special', '{"projects_completed": 100, "min_rating": 4.9}', 5000, 'legendary');

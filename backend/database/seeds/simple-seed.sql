-- Seed Simples para Kadesh (MySQL - Schema Real)
-- Senha padrão: kadesh2025
-- Hash: $2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.

-- 1. Limpar dados (mantém admin ID 50)
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM bids WHERE id > 0;
DELETE FROM projects WHERE id > 0;
DELETE FROM provider_profiles WHERE user_id != 50;
DELETE FROM wallet_transactions WHERE user_id != 50;
DELETE FROM users WHERE id != 50;
SET FOREIGN_KEY_CHECKS = 1;

-- 2. Criar Contratantes
INSERT INTO users (name, email, password, user_type, phone, bio, wallet_balance, created_at) VALUES
('Maria Silva', 'maria.silva@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'contractor', '+55 11 98765-4321', 'CEO de startup de tecnologia', 15000.00, DATE_SUB(NOW(), INTERVAL 90 DAY)),
('João Santos', 'joao.santos@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'contractor', '+55 21 97654-3210', 'Dono de e-commerce em crescimento', 12000.00, DATE_SUB(NOW(), INTERVAL 60 DAY)),
('Ana Costa', 'ana.costa@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'contractor', '+55 85 96543-2109', 'Agência de marketing digital', 8500.00, DATE_SUB(NOW(), INTERVAL 45 DAY)),
('Carlos Ferreira', 'carlos.ferreira@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'contractor', '+55 19 95432-1098', 'Gerente de TI em indústria', 20000.00, DATE_SUB(NOW(), INTERVAL 30 DAY));

-- 3. Criar Prestadores
INSERT INTO users (name, email, password, user_type, phone, bio, skills, rating, total_ratings, wallet_balance, created_at) VALUES
('Pedro Oliveira', 'pedro.oliveira@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'provider', '+55 11 95432-1098', 'Desenvolvedor Full Stack com 8 anos de experiência', '["React","Node.js","MySQL","JavaScript","Vue.js"]', 4.80, 24, 5400.00, DATE_SUB(NOW(), INTERVAL 120 DAY)),
('Carla Mendes', 'carla.mendes@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'provider', '+55 31 94321-0987', 'Designer UX/UI apaixonada por criar experiências', '["Figma","Adobe XD","UX Research","Prototyping"]', 4.90, 18, 3200.00, DATE_SUB(NOW(), INTERVAL 100 DAY)),
('Ricardo Alves', 'ricardo.alves@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'provider', '+55 41 93210-9876', 'Desenvolvedor mobile iOS e Android', '["React Native","Flutter","iOS","Android","Firebase"]', 4.70, 15, 4100.00, DATE_SUB(NOW(), INTERVAL 80 DAY)),
('Juliana Pereira', 'juliana.pereira@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'provider', '+55 51 92109-8765', 'Redatora criativa e estrategista de conteúdo', '["SEO","Copywriting","Content Strategy","Blog Posts"]', 4.60, 22, 2800.00, DATE_SUB(NOW(), INTERVAL 70 DAY)),
('Lucas Martins', 'lucas.martins@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'provider', '+55 47 91098-7654', 'Engenheiro DevOps especializado em AWS', '["AWS","Docker","Kubernetes","CI/CD","Terraform"]', 4.90, 19, 6200.00, DATE_SUB(NOW(), INTERVAL 65 DAY)),
('Fernanda Lima', 'fernanda.lima@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'provider', '+55 61 90987-6543', 'Cientista de dados com foco em ML', '["Python","Machine Learning","TensorFlow","Data Analysis"]', 5.00, 12, 7500.00, DATE_SUB(NOW(), INTERVAL 55 DAY));

-- 4. Criar Perfis de Prestadores
INSERT INTO provider_profiles (user_id, business_name, tagline, about, specialties, years_experience, city, state, availability_status, total_projects, completed_projects, average_rating, total_reviews)
SELECT 
    id,
    CONCAT(SUBSTRING_INDEX(name, ' ', 1), ' - Professional Services'),
    CASE 
        WHEN email = 'pedro.oliveira@example.com' THEN 'Full Stack Developer'
        WHEN email = 'carla.mendes@example.com' THEN 'UX/UI Designer'
        WHEN email = 'ricardo.alves@example.com' THEN 'Mobile Developer'
        WHEN email = 'juliana.pereira@example.com' THEN 'Content Writer'
        WHEN email = 'lucas.martins@example.com' THEN 'DevOps Engineer'
        WHEN email = 'fernanda.lima@example.com' THEN 'Data Scientist'
    END,
    bio,
    CASE 
        WHEN email = 'pedro.oliveira@example.com' THEN '["Web Development","Full Stack","Backend","Frontend"]'
        WHEN email = 'carla.mendes@example.com' THEN '["UX Design","UI Design","Prototyping","User Research"]'
        WHEN email = 'ricardo.alves@example.com' THEN '["Mobile Apps","iOS","Android","Cross-platform"]'
        WHEN email = 'juliana.pereira@example.com' THEN '["Content Writing","SEO","Copywriting","Marketing"]'
        WHEN email = 'lucas.martins@example.com' THEN '["DevOps","Cloud","AWS","Infrastructure"]'
        WHEN email = 'fernanda.lima@example.com' THEN '["Data Science","Machine Learning","Analytics","AI"]'
    END,
    CASE 
        WHEN email = 'pedro.oliveira@example.com' THEN 8
        WHEN email = 'carla.mendes@example.com' THEN 5
        WHEN email = 'ricardo.alves@example.com' THEN 6
        WHEN email = 'juliana.pereira@example.com' THEN 4
        WHEN email = 'lucas.martins@example.com' THEN 6
        WHEN email = 'fernanda.lima@example.com' THEN 7
    END,
    SUBSTRING_INDEX(SUBSTRING_INDEX(phone, ')', 1), '(', -1),
    'BR',
    'available',
    FLOOR(RAND() * 30) + 15,
    FLOOR(RAND() * 25) + 10,
    rating,
    total_ratings
FROM users 
WHERE user_type = 'provider';

-- 5. Criar Projetos em Leilão (status = 'open')
INSERT INTO projects (contractor_id, title, description, max_budget, status, bidding_ends_at, required_skills, created_at)
SELECT 
    (SELECT id FROM users WHERE email = 'maria.silva@example.com'),
    'Sistema de Gestão de Projetos',
    'Preciso de um sistema web para gerenciar projetos internos da startup. Deve ter dashboard, kanban, relatórios e integração com Slack. Stack preferencial: Vue.js + Node.js + MySQL.',
    8500.00,
    'open',
    DATE_ADD(NOW(), INTERVAL 5 DAY),
    '["Vue.js","Node.js","MySQL","REST API"]',
    DATE_SUB(NOW(), INTERVAL 2 DAY)
UNION ALL
SELECT 
    (SELECT id FROM users WHERE email = 'joao.santos@example.com'),
    'Redesign de Loja Virtual',
    'Meu e-commerce precisa de um redesign completo. Quero interface moderna, responsiva e otimizada para conversão. Deve manter integração com Mercado Pago.',
    5200.00,
    'open',
    DATE_ADD(NOW(), INTERVAL 3 DAY),
    '["Figma","UX/UI Design","Responsive Design"]',
    DATE_SUB(NOW(), INTERVAL 1 DAY)
UNION ALL
SELECT 
    (SELECT id FROM users WHERE email = 'ana.costa@example.com'),
    'App Mobile para Delivery',
    'Aplicativo de delivery para restaurantes locais. Precisa ter: cardápio, carrinho, pagamento, rastreamento de pedidos. React Native ou Flutter.',
    12000.00,
    'open',
    DATE_ADD(NOW(), INTERVAL 7 DAY),
    '["React Native","Flutter","Firebase","Mobile Development"]',
    DATE_SUB(NOW(), INTERVAL 3 HOUR)
UNION ALL
SELECT 
    (SELECT id FROM users WHERE email = 'carlos.ferreira@example.com'),
    'Automação de Processos Industriais',
    'Sistema para automação de linha de produção. Integração com sensores IoT, dashboard em tempo real e geração de relatórios. Python + Docker.',
    15000.00,
    'open',
    DATE_ADD(NOW(), INTERVAL 10 DAY),
    '["Python","Docker","IoT","Dashboard"]',
    DATE_SUB(NOW(), INTERVAL 6 HOUR)
UNION ALL
SELECT 
    (SELECT id FROM users WHERE email = 'maria.silva@example.com'),
    'Landing Page Institucional',
    'Landing page responsiva para captação de leads. Precisa ter formulário integrado com RD Station e analytics.',
    2800.00,
    'open',
    DATE_ADD(NOW(), INTERVAL 4 DAY),
    '["HTML","CSS","JavaScript","Responsive"]',
    DATE_SUB(NOW(), INTERVAL 1 DAY);

-- 6. Criar Lances nos Projetos
INSERT INTO bids (project_id, provider_id, amount, delivery_time_days, proposal, status, created_at)
SELECT 
    p.id,
    (SELECT id FROM users WHERE email = 'pedro.oliveira@example.com'),
    p.max_budget * 0.85,
    CASE 
        WHEN p.title LIKE '%Sistema%' THEN 30
        WHEN p.title LIKE '%Automação%' THEN 45
        WHEN p.title LIKE '%Landing%' THEN 10
        ELSE 20
    END,
    CONCAT('Olá! Tenho experiência sólida nos requisitos do projeto. Posso entregar com qualidade e no prazo. Meu portfólio está disponível para consulta.'),
    'pending',
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 20) HOUR)
FROM projects p
WHERE p.status = 'open' AND (p.title LIKE '%Sistema%' OR p.title LIKE '%Automação%' OR p.title LIKE '%Landing%');

INSERT INTO bids (project_id, provider_id, amount, delivery_time_days, proposal, status, created_at)
SELECT 
    p.id,
    (SELECT id FROM users WHERE email = 'carla.mendes@example.com'),
    p.max_budget * 0.78,
    15,
    'Designer com 5 anos de experiência em e-commerce. Crio interfaces que convertem! Incluo protótipo interativo e design system.',
    'pending',
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 15) HOUR)
FROM projects p
WHERE p.status = 'open' AND p.title LIKE '%Redesign%';

INSERT INTO bids (project_id, provider_id, amount, delivery_time_days, proposal, status, created_at)
SELECT 
    p.id,
    (SELECT id FROM users WHERE email = 'ricardo.alves@example.com'),
    p.max_budget * 0.88,
    40,
    'Desenvolvedor mobile especializado em apps de delivery. Posso usar React Native para iOS e Android. Já publiquei 8 apps nas lojas.',
    'pending',
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 10) HOUR)
FROM projects p
WHERE p.status = 'open' AND p.title LIKE '%App Mobile%';

INSERT INTO bids (project_id, provider_id, amount, delivery_time_days, proposal, status, created_at)
SELECT 
    p.id,
    (SELECT id FROM users WHERE email = 'lucas.martins@example.com'),
    p.max_budget * 0.92,
    35,
    'Engenheiro DevOps com experiência em automação industrial. Posso configurar infraestrutura completa em AWS com monitoramento 24/7.',
    'pending',
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 8) HOUR)
FROM projects p
WHERE p.status = 'open' AND p.title LIKE '%Automação%';

-- Adicionar alguns lances concorrentes
INSERT INTO bids (project_id, provider_id, amount, delivery_time_days, proposal, status, created_at)
SELECT 
    p.id,
    (SELECT id FROM users WHERE email = 'fernanda.lima@example.com'),
    p.max_budget * 0.90,
    25,
    'Posso desenvolver com arquitetura escalável e documentação completa. Experiência em projetos similares.',
    'pending',
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 12) HOUR)
FROM projects p
WHERE p.status = 'open' AND p.title LIKE '%Sistema%';

-- 7. Criar Transações de Carteira
INSERT INTO wallet_transactions (user_id, transaction_type, amount, balance_after, description, created_at)
SELECT 
    id,
    'deposit',
    wallet_balance,
    wallet_balance,
    'Depósito inicial',
    DATE_ADD(created_at, INTERVAL 1 DAY)
FROM users
WHERE id != 50;

-- 8. Criar Notificações
INSERT INTO notifications (user_id, notification_type, title, message, is_read, created_at)
SELECT 
    u.id,
    CASE 
        WHEN u.user_type = 'contractor' THEN 'auction_new_bid'
        WHEN u.user_type = 'provider' THEN 'project_created'
        ELSE 'account_warning'
    END,
    CASE 
        WHEN u.user_type = 'contractor' THEN 'Novo lance recebido!'
        WHEN u.user_type = 'provider' THEN 'Novo projeto disponível'
        ELSE 'Bem-vindo ao Kadesh'
    END,
    CASE 
        WHEN u.user_type = 'contractor' THEN 'Você recebeu um novo lance no seu projeto. Verifique os detalhes.'
        WHEN u.user_type = 'provider' THEN 'Um novo projeto na sua área foi publicado. Não perca tempo!'
        ELSE 'Sua conta foi criada com sucesso. Configure seu perfil agora.'
    END,
    0,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 48) HOUR)
FROM users u
WHERE u.id != 50
LIMIT 25;

-- Resumo Final
SELECT '=== RESUMO DOS DADOS CRIADOS ===' AS info;
SELECT 'Usuários (exceto admin)' AS tipo, COUNT(*) AS total FROM users WHERE id != 50
UNION ALL SELECT 'Contratantes', COUNT(*) FROM users WHERE user_type = 'contractor'
UNION ALL SELECT 'Prestadores', COUNT(*) FROM users WHERE user_type = 'provider'
UNION ALL SELECT 'Perfis de Prestadores', COUNT(*) FROM provider_profiles
UNION ALL SELECT 'Projetos em Leilão', COUNT(*) FROM projects WHERE status = 'open'
UNION ALL SELECT 'Total de Lances', COUNT(*) FROM bids
UNION ALL SELECT 'Transações de Carteira', COUNT(*) FROM wallet_transactions
UNION ALL SELECT 'Notificações', COUNT(*) FROM notifications;

SELECT '=== CREDENCIAIS DE ACESSO ===' AS info;
SELECT email, user_type, wallet_balance FROM users WHERE id != 50 ORDER BY user_type, created_at;
SELECT 'Senha padrão para todos: kadesh2025' AS nota;

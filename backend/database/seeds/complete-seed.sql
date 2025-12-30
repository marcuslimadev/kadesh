-- Complete Seed para Kadesh Platform (MySQL)
-- Data: 2025-12-29
-- Senha padrão para todos: kadesh2025

-- 1. Limpar dados existentes (exceto admin)
DELETE FROM wallet_transactions WHERE user_id != 50;
DELETE FROM reviews WHERE 1=1;
DELETE FROM messages WHERE 1=1;
DELETE FROM notifications WHERE 1=1;
DELETE FROM milestones WHERE 1=1;
DELETE FROM contracts WHERE 1=1;
DELETE FROM bids WHERE 1=1;
DELETE FROM projects WHERE 1=1;
DELETE FROM provider_profiles WHERE 1=1;
DELETE FROM users WHERE id != 50;

-- 2. Inserir Usuários Clientes (Contratantes)
INSERT INTO users (name, email, password, user_type, phone, bio, location, email_verified, created_at)
VALUES 
    ('Maria Silva - Startup Tech', 'maria.silva@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'contractor', 
     '+55 11 98765-4321', 'CEO de startup de tecnologia. Buscando desenvolvedores talentosos para projetos inovadores.', 
     'São Paulo, SP', 1, NOW() - INTERVAL 90 DAY),
    ('João Santos - E-commerce', 'joao.santos@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'contractor', 
     '+55 21 97654-3210', 'Dono de e-commerce em crescimento. Preciso de designers e desenvolvedores web.', 
     'Rio de Janeiro, RJ', 1, NOW() - INTERVAL 60 DAY),
    ('Ana Costa - Marketing Digital', 'ana.costa@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'contractor', 
     '+55 85 96543-2109', 'Agência de marketing digital. Contratamos freelancers para projetos criativos.', 
     'Fortaleza, CE', 1, NOW() - INTERVAL 45 DAY),
    ('Carlos Ferreira - Indústria', 'carlos.ferreira@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'contractor',
     '+55 19 95432-1098', 'Gerente de TI em indústria automobilística. Contrato desenvolvedores para automação.',
     'Campinas, SP', 1, NOW() - INTERVAL 30 DAY);

-- 3. Inserir Usuários Prestadores (Providers)
INSERT INTO users (name, email, password, user_type, phone, bio, location, email_verified, created_at)
VALUES 
    ('Pedro Oliveira - Dev Full Stack', 'pedro.oliveira@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'provider', 
     '+55 11 95432-1098', 'Desenvolvedor Full Stack com 8 anos de experiência. Especialista em React, Node.js e MySQL.', 
     'São Paulo, SP', 1, NOW() - INTERVAL 120 DAY),
    ('Carla Mendes - Designer UX/UI', 'carla.mendes@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'provider', 
     '+55 31 94321-0987', 'Designer UX/UI apaixonada por criar experiências incríveis. 5 anos de mercado.', 
     'Belo Horizonte, MG', 1, NOW() - INTERVAL 100 DAY),
    ('Ricardo Alves - Mobile Dev', 'ricardo.alves@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'provider', 
     '+55 41 93210-9876', 'Desenvolvedor mobile iOS e Android. Especialista em React Native e Flutter.', 
     'Curitiba, PR', 1, NOW() - INTERVAL 80 DAY),
    ('Juliana Pereira - Redatora', 'juliana.pereira@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'provider', 
     '+55 51 92109-8765', 'Redatora criativa e estrategista de conteúdo. Especialista em SEO e copywriting.', 
     'Porto Alegre, RS', 1, NOW() - INTERVAL 70 DAY),
    ('Lucas Martins - DevOps', 'lucas.martins@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'provider',
     '+55 47 91098-7654', 'Engenheiro DevOps especializado em AWS, Docker e Kubernetes. 6 anos de experiência.',
     'Florianópolis, SC', 1, NOW() - INTERVAL 65 DAY),
    ('Fernanda Lima - Data Scientist', 'fernanda.lima@example.com', '$2a$10$JJPAAGU6lUL2SCyjV1OFSuZL2cEPgwgRg7/oexZLyZ9FLmI.DPvp.', 'provider',
     '+55 61 90987-6543', 'Cientista de dados com foco em Machine Learning e análise preditiva.',
     'Brasília, DF', 1, NOW() - INTERVAL 55 DAY);

-- 4. Criar Perfis de Prestadores
INSERT INTO provider_profiles (user_id, title, hourly_rate, skills, experience_years, availability, rating, total_reviews, total_projects, created_at)
SELECT 
    id,
    CASE 
        WHEN email = 'pedro.oliveira@example.com' THEN 'Desenvolvedor Full Stack Sênior'
        WHEN email = 'carla.mendes@example.com' THEN 'Designer UX/UI'
        WHEN email = 'ricardo.alves@example.com' THEN 'Desenvolvedor Mobile'
        WHEN email = 'juliana.pereira@example.com' THEN 'Redatora e Estrategista de Conteúdo'
        WHEN email = 'lucas.martins@example.com' THEN 'Engenheiro DevOps'
        WHEN email = 'fernanda.lima@example.com' THEN 'Cientista de Dados'
    END,
    CASE 
        WHEN email = 'pedro.oliveira@example.com' THEN 150.00
        WHEN email = 'carla.mendes@example.com' THEN 120.00
        WHEN email = 'ricardo.alves@example.com' THEN 140.00
        WHEN email = 'juliana.pereira@example.com' THEN 90.00
        WHEN email = 'lucas.martins@example.com' THEN 160.00
        WHEN email = 'fernanda.lima@example.com' THEN 180.00
    END,
    CASE 
        WHEN email = 'pedro.oliveira@example.com' THEN 'React,Node.js,MySQL,JavaScript,TypeScript,Vue.js,Express,REST APIs'
        WHEN email = 'carla.mendes@example.com' THEN 'Figma,Adobe XD,Sketch,UX Research,Prototyping,Design System,User Testing'
        WHEN email = 'ricardo.alves@example.com' THEN 'React Native,Flutter,iOS,Android,Firebase,Mobile UI/UX,App Store'
        WHEN email = 'juliana.pereira@example.com' THEN 'SEO,Copywriting,Content Strategy,Blog Posts,Social Media,Marketing Content'
        WHEN email = 'lucas.martins@example.com' THEN 'AWS,Docker,Kubernetes,CI/CD,Terraform,Jenkins,Linux,Monitoring'
        WHEN email = 'fernanda.lima@example.com' THEN 'Python,Machine Learning,TensorFlow,Data Analysis,SQL,Pandas,Scikit-learn'
    END,
    CASE 
        WHEN email = 'pedro.oliveira@example.com' THEN 8
        WHEN email = 'carla.mendes@example.com' THEN 5
        WHEN email = 'ricardo.alves@example.com' THEN 6
        WHEN email = 'juliana.pereira@example.com' THEN 4
        WHEN email = 'lucas.martins@example.com' THEN 6
        WHEN email = 'fernanda.lima@example.com' THEN 7
    END,
    'available',
    CASE 
        WHEN email = 'pedro.oliveira@example.com' THEN 4.8
        WHEN email = 'carla.mendes@example.com' THEN 4.9
        WHEN email = 'ricardo.alves@example.com' THEN 4.7
        WHEN email = 'juliana.pereira@example.com' THEN 4.6
        WHEN email = 'lucas.martins@example.com' THEN 4.9
        WHEN email = 'fernanda.lima@example.com' THEN 5.0
    END,
    FLOOR(RAND() * 20) + 10,
    FLOOR(RAND() * 30) + 15,
    created_at
FROM users 
WHERE user_type = 'provider';

-- 5. Criar Projetos em Leilão (status = 'open')
INSERT INTO projects (client_id, title, description, category, budget, deadline, status, created_at)
SELECT 
    (SELECT id FROM users WHERE email = 'maria.silva@example.com'),
    'Desenvolvimento de Sistema de Gestão',
    'Preciso de um sistema web para gerenciar projetos internos da startup. Deve ter dashboard, kanban, relatórios e integração com Slack. Stack preferencial: Vue.js + Node.js + MySQL.',
    'Desenvolvimento Web',
    8500.00,
    DATE_ADD(NOW(), INTERVAL 5 DAY),
    'open',
    NOW() - INTERVAL 2 DAY
UNION ALL
SELECT 
    (SELECT id FROM users WHERE email = 'joao.santos@example.com'),
    'Redesign de Loja Virtual',
    'Meu e-commerce precisa de um redesign completo. Quero interface moderna, responsiva e otimizada para conversão. Deve manter integração com Mercado Pago.',
    'Design',
    5200.00,
    DATE_ADD(NOW(), INTERVAL 3 DAY),
    'open',
    NOW() - INTERVAL 1 DAY
UNION ALL
SELECT 
    (SELECT id FROM users WHERE email = 'ana.costa@example.com'),
    'App Mobile para Delivery',
    'Aplicativo de delivery para restaurantes locais. Precisa ter: cardápio, carrinho, pagamento, rastreamento de pedidos. React Native ou Flutter.',
    'Desenvolvimento Mobile',
    12000.00,
    DATE_ADD(NOW(), INTERVAL 7 DAY),
    'open',
    NOW() - INTERVAL 3 HOUR
UNION ALL
SELECT 
    (SELECT id FROM users WHERE email = 'carlos.ferreira@example.com'),
    'Automação de Processos Industriais',
    'Sistema para automação de linha de produção. Integração com sensores IoT, dashboard em tempo real e geração de relatórios. Python + Docker.',
    'Automação',
    15000.00,
    DATE_ADD(NOW(), INTERVAL 10 DAY),
    'open',
    NOW() - INTERVAL 6 HOUR;

-- 6. Criar Lances (Bids) nos Projetos Abertos
INSERT INTO bids (project_id, provider_id, amount, delivery_days, proposal, status, created_at)
SELECT 
    p.id,
    (SELECT id FROM users WHERE email = 'pedro.oliveira@example.com'),
    p.budget * 0.85,
    CASE 
        WHEN p.title LIKE '%Sistema de Gestão%' THEN 30
        WHEN p.title LIKE '%Automação%' THEN 45
        ELSE 20
    END,
    CASE 
        WHEN p.title LIKE '%Sistema de Gestão%' THEN 'Tenho experiência sólida em Vue.js e Node.js. Já desenvolvi 3 sistemas similares. Posso entregar em 30 dias com testes completos.'
        WHEN p.title LIKE '%Automação%' THEN 'Especialista em Python e Docker. Já trabalhei com IoT em projetos industriais. Posso implementar com arquitetura escalável.'
        ELSE 'Desenvolvo soluções robustas e otimizadas. Veja meu portfólio para referências.'
    END,
    'pending',
    NOW() - INTERVAL FLOOR(RAND() * 10) HOUR
FROM projects p
WHERE p.status = 'open' AND (p.title LIKE '%Sistema%' OR p.title LIKE '%Automação%');

INSERT INTO bids (project_id, provider_id, amount, delivery_days, proposal, status, created_at)
SELECT 
    p.id,
    (SELECT id FROM users WHERE email = 'carla.mendes@example.com'),
    p.budget * 0.78,
    15,
    'Designer com 5 anos de experiência em e-commerce. Crio interfaces que convertem! Incluo protótipo interativo e design system.',
    'pending',
    NOW() - INTERVAL FLOOR(RAND() * 8) HOUR
FROM projects p
WHERE p.status = 'open' AND p.title LIKE '%Redesign%';

INSERT INTO bids (project_id, provider_id, amount, delivery_days, proposal, status, created_at)
SELECT 
    p.id,
    (SELECT id FROM users WHERE email = 'ricardo.alves@example.com'),
    p.budget * 0.88,
    40,
    'Desenvolvedor mobile especializado em apps de delivery. Posso usar React Native para iOS e Android. Já publiquei 8 apps nas lojas.',
    'pending',
    NOW() - INTERVAL FLOOR(RAND() * 5) HOUR
FROM projects p
WHERE p.status = 'open' AND p.title LIKE '%App Mobile%';

INSERT INTO bids (project_id, provider_id, amount, delivery_days, proposal, status, created_at)
SELECT 
    p.id,
    (SELECT id FROM users WHERE email = 'lucas.martins@example.com'),
    p.budget * 0.92,
    35,
    'Engenheiro DevOps com experiência em automação industrial. Posso configurar infraestrutura completa em AWS com monitoramento 24/7.',
    'pending',
    NOW() - INTERVAL FLOOR(RAND() * 4) HOUR
FROM projects p
WHERE p.status = 'open' AND p.title LIKE '%Automação%';

-- 7. Criar Projetos Fechados com Contratos Ativos
INSERT INTO projects (client_id, title, description, category, budget, deadline, status, created_at)
SELECT 
    (SELECT id FROM users WHERE email = 'maria.silva@example.com'),
    'Landing Page Institucional',
    'Landing page responsiva para captação de leads. Precisa ter formulário integrado com RD Station e analytics.',
    'Desenvolvimento Web',
    2800.00,
    DATE_ADD(NOW(), INTERVAL 20 DAY),
    'closed',
    NOW() - INTERVAL 15 DAY;

-- Criar contrato para projeto fechado
INSERT INTO contracts (project_id, provider_id, client_id, amount, start_date, end_date, status, payment_status, created_at)
SELECT 
    p.id,
    (SELECT id FROM users WHERE email = 'pedro.oliveira@example.com'),
    p.client_id,
    2380.00,
    NOW() - INTERVAL 14 DAY,
    DATE_ADD(NOW(), INTERVAL 6 DAY),
    'active',
    'pending',
    NOW() - INTERVAL 14 DAY
FROM projects p
WHERE p.title = 'Landing Page Institucional';

-- Criar marcos para o contrato
INSERT INTO milestones (contract_id, title, description, amount, due_date, status, created_at)
SELECT 
    c.id,
    'Design e Protótipo',
    'Entrega do design aprovado e protótipo interativo',
    c.amount * 0.30,
    DATE_ADD(c.start_date, INTERVAL 5 DAY),
    'completed',
    c.created_at
FROM contracts c
WHERE c.status = 'active'
UNION ALL
SELECT 
    c.id,
    'Desenvolvimento Frontend',
    'Implementação do HTML/CSS/JS responsivo',
    c.amount * 0.40,
    DATE_ADD(c.start_date, INTERVAL 12 DAY),
    'in_progress',
    c.created_at
FROM contracts c
WHERE c.status = 'active'
UNION ALL
SELECT 
    c.id,
    'Integração e Deploy',
    'Integração com RD Station, testes e deploy em produção',
    c.amount * 0.30,
    c.end_date,
    'pending',
    c.created_at
FROM contracts c
WHERE c.status = 'active';

-- 8. Criar Transações de Carteira
INSERT INTO wallet_transactions (user_id, type, amount, balance_after, description, created_at)
SELECT 
    id,
    'deposit',
    CASE 
        WHEN user_type = 'contractor' THEN FLOOR(RAND() * 15000) + 5000
        ELSE FLOOR(RAND() * 5000) + 1000
    END,
    CASE 
        WHEN user_type = 'contractor' THEN FLOOR(RAND() * 15000) + 5000
        ELSE FLOOR(RAND() * 5000) + 1000
    END,
    'Depósito inicial',
    created_at + INTERVAL 1 DAY
FROM users
WHERE id != 50;

-- 9. Criar Avaliações
INSERT INTO reviews (contract_id, reviewer_id, reviewed_id, rating, comment, created_at)
SELECT 
    c.id,
    c.client_id,
    c.provider_id,
    5,
    'Excelente profissional! Entregou antes do prazo e com qualidade superior. Super recomendo!',
    NOW() - INTERVAL 5 DAY
FROM contracts c
WHERE c.status = 'active'
LIMIT 1;

-- 10. Criar Notificações
INSERT INTO notifications (user_id, type, title, message, created_at)
SELECT 
    u.id,
    CASE 
        WHEN u.user_type = 'contractor' THEN 'new_bid'
        WHEN u.user_type = 'provider' THEN 'new_project'
        ELSE 'system'
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
    NOW() - INTERVAL FLOOR(RAND() * 24) HOUR
FROM users u
WHERE u.id != 50
LIMIT 20;

-- Resumo dos dados criados
SELECT 
    'Usuários (exceto admin)' AS tipo,
    COUNT(*) AS total
FROM users 
WHERE id != 50
UNION ALL
SELECT 'Prestadores', COUNT(*) FROM provider_profiles
UNION ALL
SELECT 'Projetos Abertos', COUNT(*) FROM projects WHERE status = 'open'
UNION ALL
SELECT 'Projetos Fechados', COUNT(*) FROM projects WHERE status = 'closed'
UNION ALL
SELECT 'Lances', COUNT(*) FROM bids
UNION ALL
SELECT 'Contratos', COUNT(*) FROM contracts
UNION ALL
SELECT 'Marcos', COUNT(*) FROM milestones
UNION ALL
SELECT 'Transações', COUNT(*) FROM wallet_transactions
UNION ALL
SELECT 'Avaliações', COUNT(*) FROM reviews
UNION ALL
SELECT 'Notificações', COUNT(*) FROM notifications;

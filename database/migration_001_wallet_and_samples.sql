-- Migration: Add wallet_transactions table and sample data
-- Date: 2025-11-15

-- Add wallet_transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'deposit', 'withdrawal', 'payment_received', 'payment_sent', 'refund', 'fee'
    amount DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2) NOT NULL,
    description TEXT,
    reference_type VARCHAR(50), -- 'payment', 'contract', 'project', 'system'
    reference_id UUID,
    metadata JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for wallet_transactions
CREATE INDEX idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX idx_wallet_transactions_type ON wallet_transactions(type);
CREATE INDEX idx_wallet_transactions_created_at ON wallet_transactions(created_at DESC);
CREATE INDEX idx_wallet_transactions_reference ON wallet_transactions(reference_type, reference_id);

-- Sample Data for Production Examples
-- Note: Passwords are hashed with bcrypt (password: kadesh2025)

-- 1. Sample Contractors (Clients)
INSERT INTO users (name, email, password_hash, type, status, phone, bio, location, email_verified)
VALUES 
    ('Maria Silva - Startup Tech', 'maria.silva@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeJrlN4j3QhVl.8WO', 'client', 'active', 
     '+55 11 98765-4321', 'CEO de startup de tecnologia. Buscando desenvolvedores talentosos para projetos inovadores.', 
     'São Paulo, SP', true),
    ('João Santos - E-commerce', 'joao.santos@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeJrlN4j3QhVl.8WO', 'client', 'active', 
     '+55 21 97654-3210', 'Dono de e-commerce em crescimento. Preciso de designers e desenvolvedores web.', 
     'Rio de Janeiro, RJ', true),
    ('Ana Costa - Marketing Digital', 'ana.costa@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeJrlN4j3QhVl.8WO', 'client', 'active', 
     '+55 85 96543-2109', 'Agência de marketing digital. Contratamos freelancers para projetos criativos.', 
     'Fortaleza, CE', true);

-- 2. Sample Suppliers (Providers)
INSERT INTO users (name, email, password_hash, type, status, phone, bio, location, email_verified)
VALUES 
    ('Pedro Oliveira - Dev Full Stack', 'pedro.oliveira@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeJrlN4j3QhVl.8WO', 'provider', 'active', 
     '+55 11 95432-1098', 'Desenvolvedor Full Stack com 8 anos de experiência. Especialista em React, Node.js e PostgreSQL.', 
     'São Paulo, SP', true),
    ('Carla Mendes - Designer UX/UI', 'carla.mendes@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeJrlN4j3QhVl.8WO', 'provider', 'active', 
     '+55 31 94321-0987', 'Designer UX/UI apaixonada por criar experiências incríveis. 5 anos de mercado.', 
     'Belo Horizonte, MG', true),
    ('Ricardo Alves - Mobile Dev', 'ricardo.alves@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeJrlN4j3QhVl.8WO', 'provider', 'active', 
     '+55 41 93210-9876', 'Desenvolvedor mobile iOS e Android. Especialista em React Native e Flutter.', 
     'Curitiba, PR', true),
    ('Juliana Pereira - Redatora', 'juliana.pereira@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeJrlN4j3QhVl.8WO', 'provider', 'active', 
     '+55 51 92109-8765', 'Redatora criativa e estrategista de conteúdo. Especialista em SEO e copywriting.', 
     'Porto Alegre, RS', true);

-- 3. Create Provider Profiles for Suppliers
DO $$
DECLARE
    pedro_id UUID;
    carla_id UUID;
    ricardo_id UUID;
    juliana_id UUID;
BEGIN
    SELECT id INTO pedro_id FROM users WHERE email = 'pedro.oliveira@example.com';
    SELECT id INTO carla_id FROM users WHERE email = 'carla.mendes@example.com';
    SELECT id INTO ricardo_id FROM users WHERE email = 'ricardo.alves@example.com';
    SELECT id INTO juliana_id FROM users WHERE email = 'juliana.pereira@example.com';

    INSERT INTO provider_profiles (user_id, title, hourly_rate, skills, experience_years, availability, rating, total_reviews, total_projects)
    VALUES 
        (pedro_id, 'Desenvolvedor Full Stack Sênior', 150.00, 
         ARRAY['React', 'Node.js', 'PostgreSQL', 'JavaScript', 'TypeScript', 'Vue.js', 'Express', 'REST APIs'], 
         8, 'available', 4.8, 24, 45),
        (carla_id, 'Designer UX/UI', 120.00, 
         ARRAY['Figma', 'Adobe XD', 'Sketch', 'UX Research', 'Prototyping', 'Design System', 'User Testing'], 
         5, 'available', 4.9, 18, 32),
        (ricardo_id, 'Desenvolvedor Mobile', 140.00, 
         ARRAY['React Native', 'Flutter', 'iOS', 'Android', 'Firebase', 'Mobile UI/UX', 'App Store'], 
         6, 'available', 4.7, 15, 28),
        (juliana_id, 'Redatora e Estrategista de Conteúdo', 90.00, 
         ARRAY['SEO', 'Copywriting', 'Content Strategy', 'Blog Posts', 'Social Media', 'Marketing Content'], 
         4, 'available', 4.6, 22, 38);
END $$;

-- 4. Sample Projects
DO $$
DECLARE
    maria_id UUID;
    joao_id UUID;
    ana_id UUID;
    pedro_id UUID;
    carla_id UUID;
    ricardo_id UUID;
    juliana_id UUID;
    project1_id UUID;
    project2_id UUID;
    project3_id UUID;
    project4_id UUID;
BEGIN
    SELECT id INTO maria_id FROM users WHERE email = 'maria.silva@example.com';
    SELECT id INTO joao_id FROM users WHERE email = 'joao.santos@example.com';
    SELECT id INTO ana_id FROM users WHERE email = 'ana.costa@example.com';
    SELECT id INTO pedro_id FROM users WHERE email = 'pedro.oliveira@example.com';
    SELECT id INTO carla_id FROM users WHERE email = 'carla.mendes@example.com';
    SELECT id INTO ricardo_id FROM users WHERE email = 'ricardo.alves@example.com';
    SELECT id INTO juliana_id FROM users WHERE email = 'juliana.pereira@example.com';

    -- Project 1: Website Development
    INSERT INTO projects (client_id, title, description, category, budget, budget_type, deadline, requirements, skills_required, status)
    VALUES 
        (maria_id, 'Desenvolvimento de Website Institucional', 
         'Preciso de um website institucional moderno e responsivo para nossa startup. O site deve ter: home, sobre nós, serviços, blog e contato. Design clean e profissional com animações suaves.',
         'Desenvolvimento Web', 8000.00, 'fixed', CURRENT_DATE + INTERVAL '30 days',
         'Responsivo, SEO otimizado, CMS para blog, formulário de contato, integração com redes sociais',
         ARRAY['React', 'Node.js', 'HTML/CSS', 'JavaScript'], 'open')
    RETURNING id INTO project1_id;

    -- Project 2: Mobile App
    INSERT INTO projects (client_id, title, description, category, budget, budget_type, deadline, requirements, skills_required, status)
    VALUES 
        (joao_id, 'App Mobile para E-commerce', 
         'Desenvolvimento de aplicativo mobile (iOS e Android) para nosso e-commerce. Deve incluir: catálogo de produtos, carrinho, checkout, perfil do usuário, rastreamento de pedidos.',
         'Desenvolvimento Mobile', 15000.00, 'fixed', CURRENT_DATE + INTERVAL '60 days',
         'iOS e Android nativos ou React Native/Flutter, integração com API existente, notificações push, pagamento integrado',
         ARRAY['React Native', 'Flutter', 'Mobile Development', 'iOS', 'Android'], 'open')
    RETURNING id INTO project2_id;

    -- Project 3: UX/UI Design
    INSERT INTO projects (client_id, title, description, category, budget, budget_type, deadline, requirements, skills_required, status)
    VALUES 
        (ana_id, 'Design UX/UI para Plataforma SaaS', 
         'Precisamos de um redesign completo da interface de nossa plataforma SaaS. Foco em melhorar a experiência do usuário e tornar o sistema mais intuitivo e moderno.',
         'Design', 5000.00, 'fixed', CURRENT_DATE + INTERVAL '45 days',
         'Design system, wireframes, protótipos interativos, design responsivo, guia de estilo',
         ARRAY['Figma', 'UX Design', 'UI Design', 'Prototyping'], 'open')
    RETURNING id INTO project3_id;

    -- Project 4: Content Writing
    INSERT INTO projects (client_id, title, description, category, budget, budget_type, deadline, requirements, skills_required, status)
    VALUES 
        (maria_id, 'Criação de Conteúdo para Blog - 10 Artigos', 
         'Preciso de 10 artigos otimizados para SEO para nosso blog sobre tecnologia e inovação. Cada artigo deve ter entre 1500-2000 palavras.',
         'Marketing', 3000.00, 'fixed', CURRENT_DATE + INTERVAL '20 days',
         'Artigos originais, SEO otimizado, pesquisa de palavras-chave, formatação para web',
         ARRAY['SEO', 'Copywriting', 'Content Writing'], 'open')
    RETURNING id INTO project4_id;

    -- 5. Sample Bids for Projects
    -- Bids for Project 1 (Website)
    INSERT INTO bids (project_id, provider_id, amount, proposal, delivery_time, status)
    VALUES 
        (project1_id, pedro_id, 7500.00, 
         'Olá! Tenho 8 anos de experiência em desenvolvimento web e já criei diversos sites institucionais. Vou usar React + Next.js para garantir performance e SEO. Entregarei em etapas: design (1 semana), desenvolvimento (2 semanas), testes (3 dias). Portfolio disponível!',
         21, 'pending');

    -- Bids for Project 2 (Mobile App)
    INSERT INTO bids (project_id, provider_id, amount, proposal, delivery_time, status)
    VALUES 
        (project2_id, ricardo_id, 14000.00, 
         'Especialista em desenvolvimento mobile com React Native. Criarei um app híbrido de alta qualidade que funciona perfeitamente em iOS e Android. Já desenvolvi vários apps de e-commerce com integração de pagamento. Posso mostrar referências!',
         50, 'pending');

    -- Bids for Project 3 (Design)
    INSERT INTO bids (project_id, provider_id, amount, proposal, delivery_time, status)
    VALUES 
        (project3_id, carla_id, 4500.00, 
         'Designer UX/UI com foco em SaaS. Vou criar um design system completo no Figma, wireframes, protótipos interativos e guia de estilo. Trabalho com metodologia de Design Thinking e testes de usabilidade. Vamos criar uma experiência incrível!',
         35, 'pending');

    -- Bids for Project 4 (Content)
    INSERT INTO bids (project_id, provider_id, amount, proposal, delivery_time, status)
    VALUES 
        (project4_id, juliana_id, 2800.00, 
         'Redatora com expertise em tecnologia e SEO. Vou criar conteúdo original, bem pesquisado e otimizado. Cada artigo terá: pesquisa de keywords, estrutura SEO-friendly, imagens sugeridas e meta descriptions. Entrego 2 artigos por semana.',
         15, 'pending');

    -- Add some wallet transactions for providers (simulating past earnings)
    INSERT INTO wallet_transactions (user_id, type, amount, balance_after, description, reference_type, status)
    VALUES 
        (pedro_id, 'payment_received', 5000.00, 5000.00, 'Pagamento recebido - Projeto de API REST', 'payment', 'completed'),
        (pedro_id, 'payment_received', 3500.00, 8500.00, 'Pagamento recebido - Desenvolvimento de Dashboard', 'payment', 'completed'),
        (carla_id, 'payment_received', 4000.00, 4000.00, 'Pagamento recebido - Design de Landing Page', 'payment', 'completed'),
        (carla_id, 'payment_received', 2500.00, 6500.00, 'Pagamento recebido - Redesign de App', 'payment', 'completed'),
        (ricardo_id, 'payment_received', 12000.00, 12000.00, 'Pagamento recebido - App Mobile Completo', 'payment', 'completed'),
        (juliana_id, 'payment_received', 1800.00, 1800.00, 'Pagamento recebido - Artigos de Blog', 'payment', 'completed'),
        (juliana_id, 'payment_received', 2200.00, 4000.00, 'Pagamento recebido - Estratégia de Conteúdo', 'payment', 'completed');
END $$;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Sample users created:';
    RAISE NOTICE '  Contractors: maria.silva@example.com, joao.santos@example.com, ana.costa@example.com';
    RAISE NOTICE '  Suppliers: pedro.oliveira@example.com, carla.mendes@example.com, ricardo.alves@example.com, juliana.pereira@example.com';
    RAISE NOTICE '  Password for all users: kadesh2025';
    RAISE NOTICE '  Admin user: admin@kadesh.local (password: admin123)';
END $$;

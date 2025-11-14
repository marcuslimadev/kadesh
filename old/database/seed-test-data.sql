-- Script para criar dados de teste no Kadesh
-- Execute este script no phpMyAdmin ou MySQL Workbench

-- 1. Criar um usuário contratante de teste (se não existir)
INSERT INTO users (name, email, password, user_type, created_at, updated_at) 
VALUES (
  'João Contratante',
  'joao@teste.com',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- senha: password
  'contractor',
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE id=id;

-- 2. Pegar o ID do contratante
SET @contractor_id = (SELECT id FROM users WHERE email = 'joao@teste.com' LIMIT 1);

-- 3. Criar projetos de exemplo com leilões ativos
INSERT INTO projects (
  user_id,
  title,
  description,
  category,
  min_budget,
  max_budget,
  status,
  auction_duration_days,
  auction_ends_at,
  created_at,
  updated_at
) VALUES 
(
  @contractor_id,
  'Desenvolvimento de Site Institucional',
  'Preciso de um site institucional moderno e responsivo para minha empresa. Deve ter 5 páginas principais, formulário de contato e integração com redes sociais.',
  'Desenvolvimento Web',
  2000.00,
  5000.00,
  'active',
  7,
  DATE_ADD(NOW(), INTERVAL 5 DAY),
  NOW(),
  NOW()
),
(
  @contractor_id,
  'Logo e Identidade Visual',
  'Criação de logo profissional e manual de identidade visual completo para startup de tecnologia. Preciso de pelo menos 3 conceitos iniciais.',
  'Design',
  800.00,
  2000.00,
  'active',
  5,
  DATE_ADD(NOW(), INTERVAL 3 DAY),
  NOW(),
  NOW()
),
(
  @contractor_id,
  'Campanha de Marketing Digital',
  'Planejamento e execução de campanha de marketing digital nas redes sociais por 3 meses. Inclui criação de conteúdo, gestão de anúncios e relatórios.',
  'Marketing',
  3000.00,
  8000.00,
  'active',
  10,
  DATE_ADD(NOW(), INTERVAL 7 DAY),
  NOW(),
  NOW()
),
(
  @contractor_id,
  'Tradução de Documentos Técnicos',
  'Tradução de inglês para português de aproximadamente 50 páginas de documentação técnica de software.',
  'Tradução',
  500.00,
  1500.00,
  'active',
  3,
  DATE_ADD(NOW(), INTERVAL 2 DAY),
  NOW(),
  NOW()
),
(
  @contractor_id,
  'Consultoria em Cloud Computing',
  'Preciso de consultoria especializada para migração de infraestrutura local para AWS. Inclui planejamento, execução e treinamento da equipe.',
  'Consultoria',
  5000.00,
  15000.00,
  'active',
  14,
  DATE_ADD(NOW(), INTERVAL 10 DAY),
  NOW(),
  NOW()
);

-- 4. Verificar projetos criados
SELECT 
  p.id,
  p.title,
  p.category,
  p.min_budget,
  p.max_budget,
  p.status,
  p.auction_ends_at,
  u.name as contractor_name
FROM projects p
JOIN users u ON p.user_id = u.id
WHERE p.status = 'active'
ORDER BY p.created_at DESC;

-- Criar anúncios reais para a plataforma Kadesh
-- Data: 2025-12-29

-- Limpar anúncios antigos
DELETE FROM advertisements WHERE 1=1;

-- Anúncios para Home (Featured Banners)
INSERT INTO advertisements (title, description, link_url, position, slot_order, is_active, click_count, impression_count, created_at)
VALUES 
('Encontre os Melhores Profissionais', 'Publique seu projeto e receba propostas de prestadores qualificados em minutos. Sistema de leilão reverso garante o melhor preço.', '/auction-lobby', 'home_featured', 1, 1, 0, 0, NOW()),
('Seja um Prestador Kadesh', 'Cadastre-se gratuitamente, encontre projetos na sua área e aumente seus ganhos. Comece a receber propostas hoje mesmo.', '/provider-profile', 'home_featured', 2, 1, 0, 0, NOW()),
('Pagamentos 100% Seguros', 'Sistema de escrow integrado com Mercado Pago. Seu dinheiro fica protegido até a conclusão do projeto.', '/wallet', 'home_featured', 3, 1, 0, 0, NOW());

-- Anúncios Lateral Esquerda (Left Rail)
INSERT INTO advertisements (title, description, link_url, position, slot_order, is_active, click_count, impression_count, created_at)
VALUES 
('Destaque seu Projeto', 'Aumente a visibilidade do seu projeto e receba mais propostas de prestadores qualificados.', '/create-project', 'left', 1, 1, 0, 0, NOW()),
('Carteira Digital', 'Gerencie seus pagamentos com segurança. Deposite, saque e acompanhe todas as transações em tempo real.', '/wallet', 'left', 2, 1, 0, 0, NOW()),
('Tutorial da Plataforma', 'Aprenda a usar todas as funcionalidades da Kadesh e tire o máximo proveito da plataforma.', '/tutorial', 'left', 3, 1, 0, 0, NOW());

-- Anúncios Lateral Direita (Right Rail)
INSERT INTO advertisements (title, description, link_url, position, slot_order, is_active, click_count, impression_count, created_at)
VALUES 
('Suporte em Tempo Real', 'Nossa equipe está disponível para ajudar você a ter sucesso. Entre em contato sempre que precisar.', '#', 'right', 1, 1, 0, 0, NOW()),
('Dispute com Confiança', 'Sistema completo de resolução de disputas. Negocie com transparência e segurança total.', '/disputes', 'right', 2, 1, 0, 0, NOW()),
('Avaliações Verificadas', 'Sistema de reputação transparente. Veja avaliações reais de outros usuários antes de contratar.', '/auction-lobby', 'right', 3, 1, 0, 0, NOW());

-- Verificar resultados
SELECT 
    position,
    COUNT(*) as total,
    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as ativos
FROM advertisements
GROUP BY position
ORDER BY position;

SELECT '=== ANÚNCIOS CRIADOS ===' AS info;
SELECT id, title, position, slot_order, is_active FROM advertisements ORDER BY position, slot_order;

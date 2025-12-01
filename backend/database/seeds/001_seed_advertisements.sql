-- Seed inicial de anúncios para produção e desenvolvimento
-- Execute este arquivo para popular a tabela advertisements com anúncios de exemplo

-- Buscar o ID do admin para usar como created_by
DO $$
DECLARE
    admin_id UUID;
BEGIN
    -- Pegar ID do primeiro admin
    SELECT id INTO admin_id FROM admin_users LIMIT 1;
    
    -- Limpar anúncios existentes (opcional - remova esta linha se quiser manter os existentes)
    -- DELETE FROM advertisements;
    
    -- Anúncios do Rail Esquerdo
    INSERT INTO advertisements (title, description, link_url, position, slot, is_active, created_by)
    VALUES 
    (
        'Impulsione seu Projeto',
        'Destaque seu projeto e encontre os melhores profissionais em minutos. Aumente suas chances de sucesso!',
        '/auction-lobby',
        'left',
        1,
        TRUE,
        admin_id
    ),
    (
        'Seja um Prestador Premium',
        'Aumente sua visibilidade e conquiste mais clientes com nossos planos premium. Destaque-se no mercado!',
        '/provider-profile',
        'left',
        2,
        TRUE,
        admin_id
    );
    
    -- Anúncios do Rail Direito
    INSERT INTO advertisements (title, description, link_url, position, slot, is_active, created_by)
    VALUES 
    (
        'Suporte 24/7',
        'Nossa equipe está sempre disponível para ajudar você a ter sucesso na plataforma.',
        '/tutorial',
        'right',
        1,
        TRUE,
        admin_id
    ),
    (
        'Pagamentos 100% Seguros',
        'Transações protegidas com Mercado Pago. Sistema de escrow garante segurança total nos seus projetos.',
        '/wallet',
        'right',
        2,
        TRUE,
        admin_id
    );
    
    -- Banners da Home (Featured)
    INSERT INTO advertisements (title, description, link_url, position, slot, is_active, created_by)
    VALUES 
    (
        '🎯 Projetos Premium',
        'Encontre os melhores profissionais para projetos de alta qualidade com garantia de resultados.',
        '/auction-lobby',
        'home_featured',
        1,
        TRUE,
        admin_id
    ),
    (
        '💎 Seja um Prestador Elite',
        'Destaque-se no mercado, conquiste mais clientes e aumente seus ganhos como prestador premium.',
        '/provider-profile',
        'home_featured',
        2,
        TRUE,
        admin_id
    ),
    (
        '🔒 Pagamentos 100% Seguros',
        'Sistema de escrow com Mercado Pago. Seus pagamentos e projetos totalmente protegidos.',
        '/wallet',
        'home_featured',
        3,
        TRUE,
        admin_id
    );
    
    RAISE NOTICE 'Anúncios criados com sucesso! Total: 7 anúncios';
END $$;

-- Verificar anúncios criados
SELECT 
    position,
    slot,
    title,
    is_active,
    impression_count,
    click_count
FROM advertisements
ORDER BY position, slot;

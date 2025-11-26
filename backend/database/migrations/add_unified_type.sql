-- Migration: Add unified user type
-- Permite que todos os usuários usem ambos os perfis (Contratante e Prestador)
-- via switch "Ver como" no frontend

-- 1. Adicionar novo tipo 'unified' ao ENUM se ainda não existir
DO $$
BEGIN
    -- Alterar tipo da coluna para VARCHAR temporariamente
    ALTER TABLE users ALTER COLUMN type TYPE VARCHAR(20);
    
    -- Atualizar todos os usuários existentes para 'unified'
    UPDATE users SET type = 'unified';
    
    -- Opcional: Se quiser manter o ENUM, pode recriar com os 3 tipos
    -- ALTER TABLE users ALTER COLUMN type TYPE user_type USING type::user_type;
END $$;

-- 2. Adicionar comentário explicativo
COMMENT ON COLUMN users.type IS 'Tipo de usuário: unified (pode usar ambos perfis via switch Ver como)';

-- Verificação
SELECT type, COUNT(*) as total 
FROM users 
GROUP BY type;

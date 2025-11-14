<?php
/**
 * Script para popular banco com dados de teste
 */

try {
    $pdo = new PDO('mysql:host=localhost;dbname=kadesh', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "🔧 Conectado ao banco de dados\n\n";
    
    // 1. Criar usuário contratante
    $pdo->exec("
        INSERT INTO users (name, email, password, user_type, created_at, updated_at) 
        VALUES (
            'João Contratante',
            'joao@teste.com',
            '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
            'contractor',
            NOW(),
            NOW()
        ) ON DUPLICATE KEY UPDATE id=id
    ");
    
    $userId = $pdo->query("SELECT id FROM users WHERE email = 'joao@teste.com'")->fetchColumn();
    echo "✅ Usuário contratante criado/encontrado: ID {$userId}\n\n";
    
    // 2. Criar projetos
    $projects = [
        [
            'title' => 'Desenvolvimento de Site Institucional',
            'description' => 'Preciso de um site institucional moderno e responsivo para minha empresa. Deve ter 5 páginas principais, formulário de contato e integração com redes sociais.',
            'category' => 'Desenvolvimento Web',
            'min_budget' => 2000,
            'max_budget' => 5000,
            'days' => 5
        ],
        [
            'title' => 'Logo e Identidade Visual',
            'description' => 'Criação de logo profissional e manual de identidade visual completo para startup de tecnologia. Preciso de pelo menos 3 conceitos iniciais.',
            'category' => 'Design',
            'min_budget' => 800,
            'max_budget' => 2000,
            'days' => 3
        ],
        [
            'title' => 'Campanha de Marketing Digital',
            'description' => 'Planejamento e execução de campanha de marketing digital nas redes sociais por 3 meses. Inclui criação de conteúdo, gestão de anúncios e relatórios.',
            'category' => 'Marketing',
            'min_budget' => 3000,
            'max_budget' => 8000,
            'days' => 7
        ],
        [
            'title' => 'Tradução de Documentos Técnicos',
            'description' => 'Tradução de inglês para português de aproximadamente 50 páginas de documentação técnica de software.',
            'category' => 'Tradução',
            'min_budget' => 500,
            'max_budget' => 1500,
            'days' => 2
        ],
        [
            'title' => 'Consultoria em Cloud Computing',
            'description' => 'Preciso de consultoria especializada para migração de infraestrutura local para AWS. Inclui planejamento, execução e treinamento da equipe.',
            'category' => 'Consultoria',
            'min_budget' => 5000,
            'max_budget' => 15000,
            'days' => 10
        ]
    ];
    
    $stmt = $pdo->prepare("
        INSERT INTO projects (
            contractor_id, title, description, 
            max_budget, status, 
            bidding_ends_at, 
            created_at, updated_at
        ) VALUES (
            ?, ?, ?, ?, 'open', 
            DATE_ADD(NOW(), INTERVAL ? DAY), 
            NOW(), NOW()
        )
    ");
    
    foreach ($projects as $project) {
        $stmt->execute([
            $userId,
            $project['title'],
            $project['description'],
            $project['max_budget'],
            $project['days']
        ]);
        echo "✅ Projeto criado: {$project['title']}\n";
    }
    
    // 3. Verificar total
    $total = $pdo->query("SELECT COUNT(*) FROM projects WHERE status = 'open'")->fetchColumn();
    
    echo "\n";
    echo "═══════════════════════════════════════\n";
    echo "✨ SEED EXECUTADO COM SUCESSO! ✨\n";
    echo "═══════════════════════════════════════\n";
    echo "📊 Total de leilões ativos: {$total}\n";
    echo "👤 Usuário criado: joao@teste.com (senha: password)\n";
    echo "\n🔄 Recarregue a página de leilões!\n";
    
} catch (PDOException $e) {
    echo "❌ Erro: " . $e->getMessage() . "\n";
    exit(1);
}

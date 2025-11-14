<?php
/**
 * Script para popular banco de dados com dados de teste
 * Execute: php tests/seed-test-data.php
 */

// Conectar diretamente ao banco
$host = 'localhost';
$dbname = 'kadesh';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("❌ Erro ao conectar ao banco: " . $e->getMessage() . "\n");
}

echo "🌱 Populando banco de dados com dados de teste...\n\n";

try {
    // Limpar dados de teste anteriores
    echo "🧹 Limpando dados de teste anteriores...\n";
    
    // Buscar IDs dos usuários de teste
    $stmt = $pdo->query("SELECT id FROM users WHERE email LIKE 'test%@kadesh.com'");
    $testUserIds = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (!empty($testUserIds)) {
        $ids = implode(',', $testUserIds);
        $pdo->exec("DELETE FROM bids WHERE provider_id IN ($ids)");
        $pdo->exec("DELETE FROM bids WHERE project_id IN (SELECT id FROM projects WHERE contractor_id IN ($ids))");
        $pdo->exec("DELETE FROM projects WHERE contractor_id IN ($ids)");
        $pdo->exec("DELETE FROM users WHERE id IN ($ids)");
    }
    
    echo "✅ Dados limpos\n\n";

    // Criar usuários de teste
    echo "👥 Criando usuários de teste...\n";
    
    // Contratante
    $stmt = $pdo->prepare("
        INSERT INTO users (name, email, password, user_type, created_at) 
        VALUES (?, ?, ?, ?, NOW())
    ");
    $stmt->execute(['Test Contratante', 'test-contractor@kadesh.com', password_hash('Test@123', PASSWORD_DEFAULT), 'contractor']);
    $contractorId = $pdo->lastInsertId();
    echo "✅ Contratante criado: ID {$contractorId}\n";

    // Prestadores
    $providers = [];
    for ($i = 1; $i <= 5; $i++) {
        $stmt->execute([
            "Test Prestador {$i}", 
            "test-provider{$i}@kadesh.com", 
            password_hash('Test@123', PASSWORD_DEFAULT), 
            'provider'
        ]);
        $providers[] = $pdo->lastInsertId();
        echo "✅ Prestador {$i} criado: ID {$pdo->lastInsertId()}\n";
    }
    echo "\n";

    // Criar projetos de teste
    echo "📋 Criando projetos de teste...\n";
    
    $projects = [
        [
            'title' => 'Reforma Elétrica Predial - 3 Andares',
            'description' => 'Projeto completo de reforma elétrica incluindo troca de fiação, quadros de distribuição e instalação de disjuntores. Inclui certificação NR10 e projeto elétrico.',
            'category' => 'eletrica',
            'budget' => 25000.00,
            'bidding_ends_at' => date('Y-m-d H:i:s', strtotime('+2 hours')),
            'status' => 'open'
        ],
        [
            'title' => 'Instalação de Sistema Solar Fotovoltaico 10kW',
            'description' => 'Instalação completa de sistema fotovoltaico residencial com capacidade de 10kW. Inclui painéis, inversores, estrutura de fixação e homologação junto à concessionária.',
            'category' => 'solar',
            'budget' => 32000.00,
            'bidding_ends_at' => date('Y-m-d H:i:s', strtotime('+5 hours')),
            'status' => 'open'
        ],
        [
            'title' => 'Pintura Externa de Edifício Comercial',
            'description' => 'Pintura completa da fachada de prédio comercial com 5 andares. Inclui lavagem, tratamento de superfície, massa corrida e duas demãos de tinta acrílica.',
            'category' => 'pintura',
            'budget' => 18500.00,
            'bidding_ends_at' => date('Y-m-d H:i:s', strtotime('+1 day')),
            'status' => 'open'
        ],
        [
            'title' => 'Manutenção de Sistema HVAC - Shopping',
            'description' => 'Manutenção preventiva e corretiva de sistema de climatização de shopping center. Inclui limpeza de dutos, troca de filtros e revisão de equipamentos.',
            'category' => 'hvac',
            'budget' => 42000.00,
            'bidding_ends_at' => date('Y-m-d H:i:s', strtotime('+3 days')),
            'status' => 'open'
        ],
        [
            'title' => 'Impermeabilização de Laje - Residência',
            'description' => 'Impermeabilização de laje com área de 120m². Inclui remoção de piso antigo, regularização, aplicação de manta asfáltica e refazimento do piso.',
            'category' => 'impermeabilizacao',
            'budget' => 15000.00,
            'bidding_ends_at' => date('Y-m-d H:i:s', strtotime('+12 hours')),
            'status' => 'open'
        ],
        [
            'title' => 'Construção de Muro de Alvenaria - 50m',
            'description' => 'Construção de muro de alvenaria estrutural com 50 metros de extensão e 2,5m de altura. Inclui fundação, estrutura e acabamento.',
            'category' => 'alvenaria',
            'budget' => 28000.00,
            'bidding_ends_at' => date('Y-m-d H:i:s', strtotime('+2 days')),
            'status' => 'open'
        ],
        [
            'title' => 'Instalação de Rede Hidráulica - Apartamento',
            'description' => 'Instalação completa de rede hidráulica em apartamento de 80m². Inclui água fria, água quente, esgoto e ventilação.',
            'category' => 'hidraulica',
            'budget' => 12000.00,
            'bidding_ends_at' => date('Y-m-d H:i:s', strtotime('+6 hours')),
            'status' => 'open'
        ],
        [
            'title' => 'Reforma Geral de Obra Comercial',
            'description' => 'Reforma completa de loja comercial de 200m². Inclui demolição, alvenaria, instalações elétricas e hidráulicas, gesso, pintura e acabamentos.',
            'category' => 'obras',
            'budget' => 85000.00,
            'bidding_ends_at' => date('Y-m-d H:i:s', strtotime('+4 days')),
            'status' => 'open'
        ]
    ];

    $projectIds = [];
    $stmt = $pdo->prepare("
        INSERT INTO projects (
            contractor_id, title, description, max_budget, 
            bidding_ends_at, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW())
    ");

    foreach ($projects as $index => $project) {
        $stmt->execute([
            $contractorId,
            $project['title'],
            $project['description'],
            $project['budget'],
            $project['bidding_ends_at'],
            $project['status']
        ]);
        $projectIds[] = $pdo->lastInsertId();
        echo "✅ Projeto criado: {$project['title']} (ID: {$pdo->lastInsertId()})\n";
    }
    echo "\n";

    // Criar propostas de teste
    echo "💰 Criando propostas de teste...\n";
    
    $stmt = $pdo->prepare("
        INSERT INTO bids (
            project_id, provider_id, amount, proposal, 
            delivery_time_days, status, created_at
        ) VALUES (?, ?, ?, ?, ?, 'pending', NOW())
    ");

    $bidCount = 0;
    foreach ($projectIds as $projectIndex => $projectId) {
        // Cada projeto recebe entre 3 e 8 propostas
        $numBids = min(rand(3, 8), count($providers)); // Não mais que o número de prestadores
        
        // Embaralhar prestadores para garantir variedade
        $shuffledProviders = $providers;
        shuffle($shuffledProviders);
        
        for ($i = 0; $i < $numBids; $i++) {
            $providerId = $shuffledProviders[$i]; // Usar prestador único
            $baseAmount = $projects[$projectIndex]['budget'];
            
            // Propostas variam entre 70% e 95% do orçamento
            $amount = $baseAmount * (rand(70, 95) / 100);
            $delivery_days = rand(5, 30);
            
            $proposals = [
                "Tenho {$delivery_days} anos de experiência na área. Equipe qualificada e certificada.",
                "Garantia de 2 anos para todos os serviços executados. Portfolio disponível.",
                "Utilizo apenas materiais de primeira linha. Entrego no prazo combinado.",
                "Equipe própria com todos os EPIs necessários. Seguro de responsabilidade civil.",
                "Já executei mais de 50 projetos similares. Referências disponíveis."
            ];
            
            $stmt->execute([
                $projectId,
                $providerId,
                $amount,
                $proposals[array_rand($proposals)],
                $delivery_days
            ]);
            $bidCount++;
        }
    }
    echo "✅ {$bidCount} propostas criadas\n\n";

    echo "🎉 Dados de teste criados com sucesso!\n\n";
    echo "=== RESUMO ===\n";
    echo "✅ 1 Contratante (test-contractor@kadesh.com / Test@123)\n";
    echo "✅ 5 Prestadores (test-provider1-5@kadesh.com / Test@123)\n";
    echo "✅ 8 Projetos com leilões ativos\n";
    echo "✅ {$bidCount} Propostas de diferentes prestadores\n\n";
    echo "Você pode agora:\n";
    echo "1. Executar testes E2E: npx playwright test\n";
    echo "2. Fazer login com: test-contractor@kadesh.com / Test@123\n";
    echo "3. Acessar API: GET /api/auctions/active\n\n";

} catch (Exception $e) {
    echo "❌ Erro: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}

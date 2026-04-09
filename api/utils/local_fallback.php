<?php

require_once __DIR__ . '/helpers.php';

function fallbackStorePath() {
    return __DIR__ . '/../uploads/local_fallback_store.json';
}

function fallbackNumericId() {
    return (string) intval(round(microtime(true) * 1000) + random_int(10, 99));
}

function fallbackSeedData() {
    $now = date('Y-m-d H:i:s');
    $clientId = Helpers::generateUUID();
    $providerId = Helpers::generateUUID();
    $projectId = '1001';
    $contractId = '2001';
    $txId = '3001';

    return [
        'users' => [
            [
                'id' => $clientId,
                'name' => 'Contratante Teste',
                'email' => 'contratante@teste.com',
                'password' => password_hash('senha123', PASSWORD_BCRYPT, ['cost' => 12]),
                'type' => 'client',
                'status' => 'active',
                'created_at' => $now,
                'isAdmin' => false
            ],
            [
                'id' => Helpers::generateUUID(),
                'name' => 'Cliente Teste',
                'email' => 'cliente@teste.com',
                'password' => password_hash('senha123', PASSWORD_BCRYPT, ['cost' => 12]),
                'type' => 'client',
                'status' => 'active',
                'created_at' => $now,
                'isAdmin' => false
            ],
            [
                'id' => $providerId,
                'name' => 'Prestador Teste',
                'email' => 'prestador@teste.com',
                'password' => password_hash('senha123', PASSWORD_BCRYPT, ['cost' => 12]),
                'type' => 'provider',
                'status' => 'active',
                'created_at' => $now,
                'isAdmin' => false
            ]
        ],
        'projects' => [
            [
                'id' => $projectId,
                'client_id' => $clientId,
                'title' => 'Projeto Inicial de Teste',
                'description' => 'Projeto inicial para validar a listagem e os fluxos da aplicação durante os testes locais automatizados.',
                'category' => 'Desenvolvimento Web',
                'budget' => 2500,
                'deadline' => date('Y-m-d H:i:s', strtotime('+30 days')),
                'requirements' => null,
                'skills_required' => ['JavaScript', 'Vue'],
                'priority' => 3,
                'status' => 'open',
                'created_at' => $now,
                'updated_at' => $now,
                'views' => 0,
                'featured' => false
            ]
        ],
        'contracts' => [
            [
                'id' => $contractId,
                'project_id' => $projectId,
                'client_id' => $clientId,
                'provider_id' => $providerId,
                'total_amount' => 1800,
                'project_budget' => 2500,
                'project_title' => 'Projeto Inicial de Teste',
                'client_name' => 'Contratante Teste',
                'provider_name' => 'Prestador Teste',
                'other_party_name' => 'Prestador Teste',
                'status' => 'completed',
                'created_at' => $now,
                'completed_at' => $now
            ]
        ],
        'wallet_transactions' => [
            [
                'id' => $txId,
                'user_id' => $clientId,
                'type' => 'deposit',
                'amount' => 1800,
                'balance_after' => 1800,
                'description' => 'Deposito inicial de teste',
                'status' => 'completed',
                'created_at' => $now
            ]
        ]
    ];
}

function fallbackLoadStore() {
    $path = fallbackStorePath();
    if (!file_exists($path)) {
        $seed = fallbackSeedData();
        file_put_contents($path, json_encode($seed, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return $seed;
    }

    $raw = file_get_contents($path);
    $decoded = json_decode($raw ?: '', true);
    if (!is_array($decoded)) {
        $decoded = fallbackSeedData();
        file_put_contents($path, json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
    return $decoded;
}

function fallbackSaveStore($store) {
    file_put_contents(fallbackStorePath(), json_encode($store, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function fallbackFindUserByEmail($email) {
    $store = fallbackLoadStore();
    foreach ($store['users'] as $user) {
        if (($user['email'] ?? null) === $email) {
            return $user;
        }
    }
    return null;
}

function fallbackCreateUser($name, $email, $password, $type = 'both') {
    $store = fallbackLoadStore();
    foreach ($store['users'] as $user) {
        if (($user['email'] ?? null) === $email) {
            return null;
        }
    }

    $user = [
        'id' => Helpers::generateUUID(),
        'name' => $name,
        'email' => $email,
        'password' => password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]),
        'type' => $type,
        'status' => 'active',
        'created_at' => date('Y-m-d H:i:s'),
        'isAdmin' => false
    ];
    $store['users'][] = $user;
    fallbackSaveStore($store);
    return $user;
}

function fallbackCreateProject($userId, $payload) {
    $store = fallbackLoadStore();
    $project = [
        'id' => fallbackNumericId(),
        'client_id' => $userId,
        'title' => $payload['title'],
        'description' => $payload['description'],
        'category' => $payload['category'],
        'budget' => floatval($payload['budget']),
        'deadline' => $payload['deadline'] ?? null,
        'requirements' => $payload['requirements'] ?? null,
        'skills_required' => $payload['skills_required'] ?? [],
        'priority' => intval($payload['priority'] ?? 3),
        'status' => 'open',
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s'),
        'views' => 0,
        'featured' => false
    ];
    $store['projects'][] = $project;
    fallbackSaveStore($store);
    return $project;
}

function fallbackGetProject($projectId) {
    $store = fallbackLoadStore();
    foreach ($store['projects'] as $project) {
        if ((string) ($project['id'] ?? '') === (string) $projectId) {
            return $project;
        }
    }
    return null;
}

function fallbackListProjects() {
    $store = fallbackLoadStore();
    return array_values(array_filter($store['projects'], function ($project) {
        return ($project['status'] ?? 'open') !== 'deleted';
    }));
}

function fallbackListContracts($userId, $status = null) {
    $store = fallbackLoadStore();
    return array_values(array_filter($store['contracts'], function ($contract) use ($userId, $status) {
        $belongs = ($contract['client_id'] ?? null) === $userId || ($contract['provider_id'] ?? null) === $userId;
        if (!$belongs) {
            return false;
        }
        if ($status && ($contract['status'] ?? null) !== $status) {
            return false;
        }
        return true;
    }));
}

function fallbackListTransactions($userId) {
    $store = fallbackLoadStore();
    return array_values(array_filter($store['wallet_transactions'], function ($transaction) use ($userId) {
        return ($transaction['user_id'] ?? null) === $userId;
    }));
}

function fallbackWalletSummary($userId) {
    $transactions = fallbackListTransactions($userId);
    $balance = 0;
    foreach ($transactions as $transaction) {
        if (($transaction['status'] ?? 'completed') === 'completed') {
            $balance += floatval($transaction['amount'] ?? 0);
        }
    }
    return [
        'balance' => $balance,
        'available' => $balance,
        'escrow' => 0,
        'pending' => 0,
        'total' => $balance
    ];
}

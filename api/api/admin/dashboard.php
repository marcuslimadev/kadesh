<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/helpers.php';

$user = AuthMiddleware::authenticate();
AuthMiddleware::isAdmin($user);

$db = new Database();
$conn = $db->getConnection();
if (!$conn) {
    Helpers::jsonResponse(['success' => false, 'error' => 'Database connection error'], 500);
}

$startOfMonth = date('Y-m-01 00:00:00');

try {
    // Users
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM users");
    $stmt->execute();
    $usersTotal = intval($stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM users WHERE created_at >= ?");
    $stmt->execute([$startOfMonth]);
    $usersNew = intval($stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM users WHERE user_type IN ('client','both')");
    $stmt->execute();
    $usersClients = intval($stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM users WHERE user_type IN ('provider','both')");
    $stmt->execute();
    $usersProviders = intval($stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    // Projects
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM projects WHERE status != 'deleted'");
    $stmt->execute();
    $projectsTotal = intval($stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM projects WHERE created_at >= ?");
    $stmt->execute([$startOfMonth]);
    $projectsNew = intval($stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM projects WHERE status = 'open'");
    $stmt->execute();
    $projectsOpen = intval($stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM projects WHERE status = 'in_progress'");
    $stmt->execute();
    $projectsInProgress = intval($stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    // Bids
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM bids");
    $stmt->execute();
    $bidsTotal = intval($stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM bids WHERE created_at >= ?");
    $stmt->execute([$startOfMonth]);
    $bidsNew = intval($stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM bids WHERE status = 'pending'");
    $stmt->execute();
    $bidsPending = intval($stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM bids WHERE status = 'accepted'");
    $stmt->execute();
    $bidsAccepted = intval($stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    // Payments
    $stmt = $conn->prepare("SELECT COUNT(*) as total, COALESCE(SUM(amount), 0) as total_amount, COALESCE(SUM(platform_fee), 0) as total_fees FROM payments");
    $stmt->execute();
    $paymentsRow = $stmt->fetch(PDO::FETCH_ASSOC);

    // Recent users
    $stmt = $conn->prepare("
        SELECT name, email, user_type, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT 5
    ");
    $stmt->execute();
    $recentUsers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $recentUsers = array_map(function ($row) {
        return [
            'name' => $row['name'],
            'email' => $row['email'],
            'type' => $row['user_type'],
            'created_at' => $row['created_at']
        ];
    }, $recentUsers);

    // Recent projects
    $stmt = $conn->prepare("
        SELECT p.id, p.title, p.budget, p.created_at, u.name as client_name
        FROM projects p
        JOIN users u ON p.client_id = u.id
        WHERE p.status != 'deleted'
        ORDER BY p.created_at DESC
        LIMIT 5
    ");
    $stmt->execute();
    $recentProjects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    Helpers::jsonResponse([
        'success' => true,
        'data' => [
            'users' => [
                'total' => $usersTotal,
                'new_this_month' => $usersNew,
                'clients' => $usersClients,
                'providers' => $usersProviders
            ],
            'projects' => [
                'total' => $projectsTotal,
                'new_this_month' => $projectsNew,
                'open' => $projectsOpen,
                'in_progress' => $projectsInProgress
            ],
            'bids' => [
                'total' => $bidsTotal,
                'new_this_month' => $bidsNew,
                'pending' => $bidsPending,
                'accepted' => $bidsAccepted
            ],
            'payments' => [
                'total' => intval($paymentsRow['total'] ?? 0),
                'total_amount' => floatval($paymentsRow['total_amount'] ?? 0),
                'total_fees' => floatval($paymentsRow['total_fees'] ?? 0)
            ],
            'recentUsers' => $recentUsers,
            'recentProjects' => $recentProjects
        ]
    ]);
} catch (PDOException $e) {
    Helpers::jsonResponse(['success' => false, 'error' => 'Database error: ' . $e->getMessage()], 500);
}

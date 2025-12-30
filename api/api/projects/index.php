<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';

$db = new Database();
$conn = $db->getConnection();

try {
    $status = $_GET['status'] ?? 'open';
    $category = $_GET['category'] ?? null;

    $sql = "SELECT p.*, u.name as client_name 
            FROM projects p 
            JOIN users u ON p.client_id = u.id 
            WHERE p.status = ?";
    $params = [$status];

    if ($category) {
        $sql .= " AND p.category = ?";
        $params[] = $category;
    }

    $sql .= " ORDER BY p.created_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    Helpers::jsonResponse(['projects' => $projects]);

} catch (PDOException $e) {
    Helpers::jsonResponse(['error' => 'Erro ao buscar projetos: ' . $e->getMessage()], 500);
}

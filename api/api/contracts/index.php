<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/local_fallback.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
	Helpers::jsonResponse(['error' => 'Metodo nao permitido'], 405);
}

$user = AuthMiddleware::authenticate();
$status = $_GET['status'] ?? null;
$db = new Database();
$conn = $db->getConnection();

if (!$conn) {
	$contracts = fallbackListContracts($user['userId'], $status);
	foreach ($contracts as &$contract) {
		$contract['other_party_name'] = ($contract['client_id'] === $user['userId'])
			? $contract['provider_name']
			: $contract['client_name'];
	}
	unset($contract);

	Helpers::jsonResponse([
		'contracts' => $contracts,
		'data' => $contracts
	]);
}

$conditions = ['(c.client_id = ? OR c.provider_id = ?)'];
$params = [$user['userId'], $user['userId']];

if ($status) {
	$conditions[] = 'c.status = ?';
	$params[] = $status;
}

$whereSql = implode(' AND ', $conditions);

try {
	$stmt = $conn->prepare(" 
		SELECT
			c.id,
			c.project_id,
			c.client_id,
			c.provider_id,
			c.amount AS total_amount,
			c.status,
			c.created_at,
			c.actual_completion_date AS completed_at,
			p.title AS project_title,
			p.budget AS project_budget,
			client.name AS client_name,
			provider.name AS provider_name,
			CASE
				WHEN c.client_id = ? THEN provider.name
				ELSE client.name
			END AS other_party_name
		FROM contracts c
		INNER JOIN projects p ON p.id = c.project_id
		INNER JOIN users client ON client.id = c.client_id
		INNER JOIN users provider ON provider.id = c.provider_id
		WHERE $whereSql
		ORDER BY c.created_at DESC
	");
	$stmt->execute(array_merge([$user['userId']], $params));
	$contracts = $stmt->fetchAll(PDO::FETCH_ASSOC);

	foreach ($contracts as &$contract) {
		$contract['total_amount'] = floatval($contract['total_amount'] ?? 0);
		$contract['project_budget'] = floatval($contract['project_budget'] ?? 0);
	}
	unset($contract);

	Helpers::jsonResponse([
		'contracts' => $contracts,
		'data' => $contracts
	]);
} catch (PDOException $e) {
	Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}

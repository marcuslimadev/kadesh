<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/local_fallback.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
	Helpers::jsonResponse(['error' => 'Metodo nao permitido'], 405);
}

$user = AuthMiddleware::authenticate();
$receiptType = $_GET['receipt_type'] ?? null;
$id = $_GET['id'] ?? null;
$db = new Database();
$conn = $db->getConnection();

if (!$conn) {
	if ($receiptType === 'contract') {
		$contracts = fallbackListContracts($user['userId']);
		foreach ($contracts as $contract) {
			if ((string) $contract['id'] === (string) $id) {
				Helpers::jsonResponse(['receipt' => ['type' => 'contract', 'id' => $id]]);
			}
		}
		Helpers::jsonResponse(['error' => 'Contrato nao encontrado'], 404);
	}

	$transactions = fallbackListTransactions($user['userId']);
	foreach ($transactions as $transaction) {
		if ((string) $transaction['id'] === (string) $id) {
			Helpers::jsonResponse(['receipt' => ['type' => 'transaction', 'id' => $id]]);
		}
	}
	Helpers::jsonResponse(['error' => 'Transacao nao encontrada'], 404);
}

if (!$receiptType || !$id) {
	Helpers::jsonResponse(['error' => 'Parametros invalidos'], 400);
}

try {
	if ($receiptType === 'contract') {
		$stmt = $conn->prepare("SELECT id, client_id, provider_id FROM contracts WHERE id = ? LIMIT 1");
		$stmt->execute([$id]);
		$contract = $stmt->fetch(PDO::FETCH_ASSOC);

		if (!$contract) {
			Helpers::jsonResponse(['error' => 'Contrato nao encontrado'], 404);
		}

		if ($contract['client_id'] !== $user['userId'] && $contract['provider_id'] !== $user['userId']) {
			Helpers::jsonResponse(['error' => 'Acesso negado'], 403);
		}

		Helpers::jsonResponse([
			'receipt' => [
				'type' => 'contract',
				'id' => $contract['id']
			]
		]);
	}

	if ($receiptType === 'transaction') {
		$stmt = $conn->prepare("SELECT id, user_id FROM wallet_transactions WHERE id = ? LIMIT 1");
		$stmt->execute([$id]);
		$transaction = $stmt->fetch(PDO::FETCH_ASSOC);

		if (!$transaction) {
			Helpers::jsonResponse(['error' => 'Transacao nao encontrada'], 404);
		}

		if ($transaction['user_id'] !== $user['userId']) {
			Helpers::jsonResponse(['error' => 'Acesso negado'], 403);
		}

		Helpers::jsonResponse([
			'receipt' => [
				'type' => 'transaction',
				'id' => $transaction['id']
			]
		]);
	}

	Helpers::jsonResponse(['error' => 'Tipo de comprovante invalido'], 400);
} catch (PDOException $e) {
	Helpers::jsonResponse(['error' => 'Erro no banco de dados: ' . $e->getMessage()], 500);
}

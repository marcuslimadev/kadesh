<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';
require_once __DIR__ . '/../../middleware/auth.php';

// Implementação para payments/webhook.php
Helpers::jsonResponse(['message' => 'Endpoint payments/webhook.php em desenvolvimento']);

<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';
require_once __DIR__ . '/../../middleware/auth.php';

// Implementação para notifications/index.php
Helpers::jsonResponse(['message' => 'Endpoint notifications/index.php em desenvolvimento']);

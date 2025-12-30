<?php
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../utils/helpers.php';
require_once __DIR__ . '/../../middleware/auth.php';

// Implementação para admin/dashboard.php
Helpers::jsonResponse(['message' => 'Endpoint admin/dashboard.php em desenvolvimento']);

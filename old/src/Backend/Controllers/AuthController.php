<?php
namespace App\Backend\Controllers;

use App\Backend\Models\User;

class AuthController {
    public function register() {
        global $_POST_JSON;
        $input = $_POST_JSON;

        // Validar dados de entrada
        if (!$input || !isset($input['name']) || !isset($input['email']) || !isset($input['password'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Dados incompletos. Nome, email e senha são obrigatórios.']);
            return;
        }

        if (User::findByEmail($input['email'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Email já existe.']);
            return;
        }

        $userType = $input['user_type'] ?? $input['type'] ?? 'client';
        $userId = User::create($input['name'], $input['email'], $input['password'], $userType);
        $_SESSION['user_id'] = $userId;

        // Buscar usuário criado e retornar
        $user = User::findById($userId);
        echo json_encode([
            'message' => 'Registro bem-sucedido.',
            'user' => $user
        ]);
    }

    public function login() {
        global $_POST_JSON;
        $input = $_POST_JSON;

        // Validar dados de entrada
        if (!$input || !isset($input['email']) || !isset($input['password'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Email e senha são obrigatórios.']);
            return;
        }

        $user = User::findByEmail($input['email']);

        if (!$user || !password_verify($input['password'], $user['password'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Credenciais inválidas.']);
            return;
        }

        $_SESSION['user_id'] = $user['id'];
        
        // Remover senha antes de retornar
        unset($user['password']);
        
        echo json_encode([
            'message' => 'Login bem-sucedido.',
            'user' => $user
        ]);
    }

    public function logout() {
        session_destroy();
        echo json_encode(['message' => 'Logout bem-sucedido.']);
    }

    public function currentUser() {
        if (!isset($_SESSION['user_id'])) {
            // Retornar user: null em vez de erro para permitir que o frontend carregue
            echo json_encode(['user' => null]);
            return;
        }
        
        $user = User::findById($_SESSION['user_id']);
        echo json_encode(['user' => $user]);
    }
}

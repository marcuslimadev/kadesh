<?php
namespace App\Backend\Controllers;

use App\Backend\Models\User;

class AuthController {
    public function register() {
        $input = json_decode(file_get_contents('php://input'), true);

        if (User::findByEmail($input['email'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Email já existe.']);
            return;
        }

        $userId = User::create($input['name'], $input['email'], $input['password'], $input['type']);
        $_SESSION['user_id'] = $userId;

        echo json_encode(['message' => 'Registro bem-sucedido.']);
    }

    public function login() {
        $input = json_decode(file_get_contents('php://input'), true);
        $user = User::findByEmail($input['email']);

        if (!$user || !password_verify($input['password'], $user['password'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Credenciais inválidas.']);
            return;
        }

        $_SESSION['user_id'] = $user['id'];
        echo json_encode(['message' => 'Login bem-sucedido.']);
    }

    public function logout() {
        session_destroy();
        echo json_encode(['message' => 'Logout bem-sucedido.']);
    }

    public function currentUser() {
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado.']);
            return;
        }
        echo json_encode(User::findById($_SESSION['user_id']));
    }
}

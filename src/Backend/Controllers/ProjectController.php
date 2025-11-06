<?php
namespace App\Backend\Controllers;

use App\Backend\Models\Project;

class ProjectController {
    /**
     * GET /api/projects - Lista todos os projetos (com filtros opcionais)
     */
    public function index() {
        $projects = Project::findAll($_GET);
        echo json_encode($projects);
    }

    /**
     * GET /api/projects/:id - Detalhes de um projeto específico
     */
    public function show($id) {
        $project = Project::findById($id);
        if (!$project) {
            http_response_code(404);
            echo json_encode(['error' => 'Projeto não encontrado.']);
            return;
        }
        echo json_encode($project);
    }

    /**
     * GET /api/projects/my - Projetos do usuário autenticado
     */
    public function myProjects() {
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado.']);
            return;
        }

        $projects = Project::findByUserId($_SESSION['user_id']);
        echo json_encode($projects);
    }

    /**
     * POST /api/projects - Criar novo projeto
     */
    public function create() {
        global $_POST_JSON;
        
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado.']);
            return;
        }

        $input = $_POST_JSON;

        // Validação
        if (!isset($input['title']) || !isset($input['description']) || !isset($input['max_budget'])) {
            http_response_code(422);
            echo json_encode(['error' => 'Campos obrigatórios: title, description, max_budget']);
            return;
        }

        if (empty(trim($input['title']))) {
            http_response_code(422);
            echo json_encode(['error' => 'Título não pode estar vazio.']);
            return;
        }

        if ($input['max_budget'] <= 0) {
            http_response_code(422);
            echo json_encode(['error' => 'Orçamento deve ser maior que zero.']);
            return;
        }

        // Dados do projeto
        $data = [
            'user_id' => $_SESSION['user_id'],
            'title' => trim($input['title']),
            'description' => trim($input['description']),
            'max_budget' => floatval($input['max_budget']),
            'deadline' => $input['deadline'] ?? null,
            'status' => 'open',
            'end_date' => $input['end_date'] ?? null,
            'requirements' => $input['requirements'] ?? null,
            'attachments' => $input['attachments'] ?? null
        ];

        try {
            $projectId = Project::create($data);
            $project = Project::findById($projectId);
            
            http_response_code(201);
            echo json_encode([
                'message' => 'Projeto criado com sucesso!',
                'project' => $project
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao criar projeto: ' . $e->getMessage()]);
        }
    }

    /**
     * PUT /api/projects/:id - Atualizar projeto
     */
    public function update($id) {
        global $_POST_JSON;
        
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado.']);
            return;
        }

        $project = Project::findById($id);
        if (!$project) {
            http_response_code(404);
            echo json_encode(['error' => 'Projeto não encontrado.']);
            return;
        }

        // Verificar se é o dono do projeto
        if ($project['contractor_id'] != $_SESSION['user_id']) {
            http_response_code(403);
            echo json_encode(['error' => 'Você não tem permissão para editar este projeto.']);
            return;
        }

        // Não permitir edição de projetos já em andamento ou concluídos
        if ($project['status'] !== 'open') {
            http_response_code(422);
            echo json_encode(['error' => 'Apenas projetos abertos podem ser editados.']);
            return;
        }

        $input = $_POST_JSON;

        // Dados para atualizar
        $data = [];
        if (isset($input['title'])) $data['title'] = trim($input['title']);
        if (isset($input['description'])) $data['description'] = trim($input['description']);
        if (isset($input['max_budget'])) $data['max_budget'] = floatval($input['max_budget']);
        if (isset($input['deadline'])) $data['project_deadline'] = $input['deadline'];
        if (isset($input['end_date'])) $data['bidding_ends_at'] = $input['end_date'];
        if (isset($input['requirements'])) $data['required_skills'] = $input['requirements'];
        if (isset($input['attachments'])) $data['attachments'] = $input['attachments'];

        try {
            Project::update($id, $data);
            $updatedProject = Project::findById($id);
            
            echo json_encode([
                'message' => 'Projeto atualizado com sucesso!',
                'project' => $updatedProject
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao atualizar projeto: ' . $e->getMessage()]);
        }
    }

    /**
     * DELETE /api/projects/:id - Deletar projeto
     */
    public function delete($id) {
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado.']);
            return;
        }

        $project = Project::findById($id);
        if (!$project) {
            http_response_code(404);
            echo json_encode(['error' => 'Projeto não encontrado.']);
            return;
        }

        // Verificar se é o dono do projeto
        if ($project['contractor_id'] != $_SESSION['user_id']) {
            http_response_code(403);
            echo json_encode(['error' => 'Você não tem permissão para deletar este projeto.']);
            return;
        }

        // Não permitir deletar projetos em andamento ou concluídos
        if ($project['status'] !== 'open') {
            http_response_code(422);
            echo json_encode(['error' => 'Apenas projetos abertos podem ser deletados.']);
            return;
        }

        try {
            Project::delete($id);
            echo json_encode(['message' => 'Projeto deletado com sucesso!']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao deletar projeto: ' . $e->getMessage()]);
        }
    }

    /**
     * POST /api/projects/:id/close - Fechar projeto
     */
    public function close($id) {
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Não autenticado.']);
            return;
        }

        $project = Project::findById($id);
        if (!$project) {
            http_response_code(404);
            echo json_encode(['error' => 'Projeto não encontrado.']);
            return;
        }

        if ($project['contractor_id'] != $_SESSION['user_id']) {
            http_response_code(403);
            echo json_encode(['error' => 'Você não tem permissão para fechar este projeto.']);
            return;
        }

        try {
            Project::update($id, ['status' => 'completed']);
            $updatedProject = Project::findById($id);
            
            echo json_encode([
                'message' => 'Projeto fechado com sucesso!',
                'project' => $updatedProject
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao fechar projeto: ' . $e->getMessage()]);
        }
    }
}

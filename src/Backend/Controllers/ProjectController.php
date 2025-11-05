<?php
namespace App\Backend\Controllers;

use App\Backend\Models\Project;

class ProjectController {
    public function index() {
        $projects = Project::findAll($_GET);
        echo json_encode($projects);
    }

    public function show($id) {
        $project = Project::findById($id);
        if (!$project) {
            http_response_code(404);
            echo json_encode(['error' => 'Projeto não encontrado.']);
            return;
        }
        echo json_encode($project);
    }
}

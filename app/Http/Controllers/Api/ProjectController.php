<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Bid;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $query = Project::with(['contractor:id,name', 'bids'])
            ->withCount('bids')
            ->latest();

        // Filtros
        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->q) {
            $query->where(function($sub) use ($request) {
                $sub->where('title', 'like', "%{$request->q}%")
                    ->orWhere('description', 'like', "%{$request->q}%");
            });
        }

        // Adicionar menor lance para cada projeto
        $projects = $query->paginate(12);
        
        foreach ($projects as $project) {
            $project->lowest_bid = $project->bids()->min('amount');
        }

        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Project::class);

        $data = $request->validate([
            'title' => ['required','string','max:255'],
            'description' => ['required','string'],
            'max_budget' => ['required','numeric','min:1'],
            'bidding_ends_at' => ['required','date','after:now'],
            'project_deadline' => ['nullable','date','after:bidding_ends_at'],
            'required_skills' => ['nullable','array'],
            'required_skills.*' => ['string','max:50'],
            'attachments' => ['nullable','array'],
        ]);

        $project = Project::create([
            'contractor_id' => Auth::id(),
            'title' => $data['title'],
            'description' => $data['description'],
            'max_budget' => $data['max_budget'],
            'bidding_ends_at' => $data['bidding_ends_at'],
            'project_deadline' => $data['project_deadline'] ?? null,
            'required_skills' => $data['required_skills'] ?? [],
            'attachments' => $data['attachments'] ?? [],
            'status' => 'bidding'
        ]);

        return response()->json([
            'project' => $project->load('contractor'),
            'message' => 'Projeto criado com sucesso'
        ], 201);
    }

    public function show(Project $project)
    {
        $project->load(['contractor:id,name', 'bids.provider:id,name', 'winner:id,name']);
        $project->lowest_bid = $project->bids()->min('amount');
        
        return response()->json($project);
    }

    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $data = $request->validate([
            'title' => ['required','string','max:255'],
            'description' => ['required','string'],
            'max_budget' => ['required','numeric','min:1'],
            'bidding_ends_at' => ['required','date','after:now'],
            'project_deadline' => ['nullable','date','after:bidding_ends_at'],
            'required_skills' => ['nullable','array'],
            'required_skills.*' => ['string','max:50'],
        ]);

        $project->update($data);

        return response()->json([
            'project' => $project->fresh()->load('contractor'),
            'message' => 'Projeto atualizado com sucesso'
        ]);
    }

    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);
        
        $project->delete();

        return response()->json([
            'message' => 'Projeto removido com sucesso'
        ]);
    }

    public function confirmWinner(Project $project)
    {
        $this->authorize('confirmWinner', $project);
        
        $project->update(['status' => 'in_progress']);

        return response()->json([
            'project' => $project->fresh()->load(['contractor', 'winner']),
            'message' => 'Vencedor confirmado. Projeto em execução.'
        ]);
    }
}

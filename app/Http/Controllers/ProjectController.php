<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Bid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class ProjectController extends Controller
{
    use AuthorizesRequests;

    public function __construct()
    {
        // middleware auth já aplicado via rotas; removido aviso anterior
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Project::query()->withCount(['bids as lowest_bid' => function($q){
            $q->select(Bid::raw('MIN(amount)'));
        }])->latest();

        if (request('status')) {
            $query->where('status', request('status'));
        }

        if (request('search')) {
            $q = request('search');
            $query->where(function($sub) use ($q){
                $sub->where('title', 'like', "%$q%")
                    ->orWhere('description', 'like', "%$q%");
            });
        }

        if (request('category')) {
            $query->where('category', request('category'));
        }

        if (request('budget')) {
            $budget = request('budget');
            if ($budget === '0-1000') {
                $query->where('max_budget', '<=', 1000);
            } elseif ($budget === '1000-5000') {
                $query->whereBetween('max_budget', [1000, 5000]);
            } elseif ($budget === '5000-10000') {
                $query->whereBetween('max_budget', [5000, 10000]);
            } elseif ($budget === '10000+') {
                $query->where('max_budget', '>', 10000);
            }
        }

        $projects = $query->paginate(12)->withQueryString();
        
        return Inertia::render('Projects', [
            'projects' => $projects->items(),
            'pagination' => [
                'current_page' => $projects->currentPage(),
                'last_page' => $projects->lastPage(),
                'per_page' => $projects->perPage(),
                'total' => $projects->total(),
            ],
            'filters' => request()->only(['search', 'category', 'status', 'budget'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Project::class);
        return Inertia::render('Projects/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Project::class);

        // Verificar se o usuário não criou um projeto nos últimos 5 minutos
        $recentProject = Project::where('contractor_id', Auth::id())
            ->where('created_at', '>', now()->subMinutes(5))
            ->exists();

        if ($recentProject) {
            return back()->withErrors([
                'title' => 'Você deve aguardar pelo menos 5 minutos entre a criação de projetos.'
            ])->withInput();
        }

        $data = $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
                'unique:projects,title,NULL,id,contractor_id,' . Auth::id()
            ],
            'description' => ['required','string','min:50'],
            'category' => ['required','string','in:development,design,marketing,writing,other'],
            'max_budget' => ['required','numeric','min:100'],
            'bidding_ends_at' => ['required','date','after:now'],
            'project_deadline' => ['nullable','date','after:bidding_ends_at'],
            'required_skills' => ['nullable','array'],
            'required_skills.*' => ['string','max:50'],
        ], [
            'title.required' => 'O título do projeto é obrigatório.',
            'title.max' => 'O título não pode ter mais de 255 caracteres.',
            'title.unique' => 'Você já possui um projeto com este título. Escolha um título diferente.',
            'description.required' => 'A descrição do projeto é obrigatória.',
            'description.min' => 'A descrição deve ter pelo menos 50 caracteres.',
            'category.required' => 'Selecione uma categoria para o projeto.',
            'category.in' => 'Categoria inválida.',
            'max_budget.required' => 'O orçamento máximo é obrigatório.',
            'max_budget.numeric' => 'O orçamento deve ser um valor numérico.',
            'max_budget.min' => 'O orçamento mínimo é R$ 100,00.',
            'bidding_ends_at.required' => 'A data de fim das propostas é obrigatória.',
            'bidding_ends_at.after' => 'A data de fim das propostas deve ser futura.',
            'project_deadline.after' => 'O prazo de entrega deve ser posterior ao fim das propostas.',
        ]);

        $skills = $this->parseSkills($data['skills_input'] ?? null, $data['required_skills'] ?? []);

        $skills = $data['required_skills'] ?? [];

        $project = Project::create([
            'contractor_id' => Auth::id(),
            'title' => $data['title'],
            'description' => $data['description'],
            'category' => $data['category'],
            'max_budget' => $data['max_budget'],
            'bidding_ends_at' => $data['bidding_ends_at'],
            'project_deadline' => $data['project_deadline'] ?? null,
            'required_skills' => $skills,
            'status' => 'open'
        ]);

        return redirect()->route('projects.show', $project)->with('success','Projeto publicado com sucesso! Agora você pode receber propostas de fornecedores qualificados.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $project->load(['bids.provider','contractor']);
        $bids = $project->bids()->orderBy('amount','desc')->get(); // especificação: ordem decrescente
        $lowest = $project->bids()->min('amount');
        $winnerCandidate = null;
        if ($project->status === 'awarded' || $project->status === 'in_progress' || $project->status === 'completed') {
            $winnerCandidate = $project->winner_id ? $project->winner : $project->bids()->where('amount',$lowest)->orderBy('submitted_at')->first()?->provider;
        } elseif(now()->greaterThanOrEqualTo($project->bidding_ends_at) && $lowest !== null) {
            $winnerCandidate = $project->bids()->where('amount',$lowest)->orderBy('submitted_at')->first()?->provider;
        }
        
        return Inertia::render('Projects/Show', [
            'project' => $project,
            'bids' => $bids,
            'lowest' => $lowest,
            'winnerCandidate' => $winnerCandidate
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        $this->authorize('update', $project);
        return Inertia::render('Projects/Edit', [
            'project' => $project
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $data = $request->validate([
            'title' => ['required','string','max:255'],
            'category' => ['required','string','max:100'],
            'description' => ['required','string'],
            'requirements' => ['nullable','string'],
            'min_budget' => ['required','numeric','min:1'],
            'max_budget' => ['required','numeric','min:1'],
            'bidding_ends_at' => ['required','date'],
            'status' => ['required','string','in:open,closed,awarded,in_progress,completed,cancelled']
        ], [
            'title.required' => 'O título é obrigatório.',
            'title.max' => 'O título não pode ter mais de 255 caracteres.',
            'category.required' => 'A categoria é obrigatória.',
            'description.required' => 'A descrição é obrigatória.',
            'min_budget.required' => 'O orçamento mínimo é obrigatório.',
            'min_budget.min' => 'O orçamento mínimo deve ser maior que zero.',
            'max_budget.required' => 'O orçamento máximo é obrigatório.',
            'max_budget.min' => 'O orçamento máximo deve ser maior que zero.',
            'bidding_ends_at.required' => 'O prazo para propostas é obrigatório.',
            'bidding_ends_at.date' => 'O prazo para propostas deve ser uma data válida.',
            'status.required' => 'O status é obrigatório.',
            'status.in' => 'Status inválido.'
        ]);

        // Validar se max_budget é maior que min_budget
        if ($data['max_budget'] < $data['min_budget']) {
            return back()->withErrors([
                'max_budget' => 'O orçamento máximo deve ser maior que o mínimo.'
            ])->withInput();
        }

        $project->update($data);
        
        return redirect()->route('projects.show', $project)->with('success','Projeto atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);
        $project->delete();
        return redirect()->route('projects.index')->with('success','Projeto removido.');
    }

    /**
     * Confirm the winner of the project.
     */
    public function confirmWinner(Project $project)
    {
        $this->authorize('confirmWinner', $project);
        $project->update(['status' => 'in_progress']);
        return redirect()->route('projects.show',$project)->with('success','Vencedor confirmado. Projeto em execução.');
    }

    /**
     * Parse the skills from the input string and existing skills.
     */
    private function parseSkills(?string $skillsInput, array $existing): array
    {
        $skills = $existing;
        if ($skillsInput) {
            $parts = array_filter(array_map(fn($v)=> trim($v), preg_split('/[,;\n]/', $skillsInput)));
            $skills = array_values(array_unique(array_filter(array_map(function($s){
                return mb_strtolower($s);
            }, $parts))));
        }
        return $skills;
    }
}

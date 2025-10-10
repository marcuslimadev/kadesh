<?php

namespace App\Http\Controllers;

use App\Models\Bid;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class BidController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Bid::class);

        $data = $request->validate([
            'project_id' => ['required','exists:projects,id'],
            'amount' => ['required','numeric','min:0.01'],
            'delivery_time' => ['required','integer','min:1'],
            'proposal' => ['required','string','min:10'],
        ], [
            'project_id.required' => 'Projeto é obrigatório.',
            'project_id.exists' => 'Projeto não encontrado.',
            'amount.required' => 'O valor da proposta é obrigatório.',
            'amount.numeric' => 'O valor deve ser um número.',
            'amount.min' => 'O valor deve ser maior que zero.',
            'delivery_time.required' => 'O prazo de entrega é obrigatório.',
            'delivery_time.integer' => 'O prazo deve ser um número inteiro.',
            'delivery_time.min' => 'O prazo deve ser de pelo menos 1 dia.',
            'proposal.required' => 'A descrição da proposta é obrigatória.',
            'proposal.min' => 'A descrição deve ter pelo menos 10 caracteres.',
        ]);

        $project = Project::findOrFail($data['project_id']);
        
        // Verificar se o projeto ainda está aberto para propostas
        if ($project->status !== 'open') {
            return back()->withErrors(['general' => 'Este projeto não está mais aceitando propostas.'])->withInput();
        }
        
        // Verificar se o prazo não expirou
        if (now()->greaterThan($project->bidding_ends_at)) {
            return back()->withErrors(['general' => 'O prazo para envio de propostas já expirou.'])->withInput();
        }
        
        // Verificar se não é o próprio contratante
        if ($project->contractor_id === Auth::id()) {
            return back()->withErrors(['general' => 'Você não pode enviar proposta para o seu próprio projeto.'])->withInput();
        }
        
        // Verificar se já não enviou proposta para este projeto
        $existingBid = $project->bids()->where('provider_id', Auth::id())->first();
        if ($existingBid) {
            return back()->withErrors(['general' => 'Você já enviou uma proposta para este projeto. Use a opção de editar se desejar alterar.'])->withInput();
        }
        
        // Para marketplace, não é necessário ser menor que outras propostas
        // Validar apenas se está dentro do orçamento do projeto
        if ($data['amount'] < (float)$project->min_budget || $data['amount'] > (float)$project->max_budget) {
            return back()->withErrors([
                'amount' => "O valor deve estar entre R$ " . number_format((float)$project->min_budget,2,',','.') . 
                           " e R$ " . number_format((float)$project->max_budget,2,',','.')
            ])->withInput();
        }

        Bid::create([
            'project_id' => $project->id,
            'provider_id' => Auth::id(),
            'amount' => $data['amount'],
            'proposal' => $data['proposal'],
            'delivery_time' => $data['delivery_time'],
            'status' => 'pending',
            'submitted_at' => now(),
        ]);

        return redirect()->route('projects.show', $project)->with('success','Lance enviado com sucesso.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Bid $bid)
    {
        $this->authorize('update', $bid);

        $data = $request->validate([
            'amount' => ['required','numeric','min:0.01'],
            'delivery_time_days' => ['required','integer','min:1'],
            'proposal' => ['required','string','min:10'],
        ]);

        $project = $bid->project;

        $currentLowest = $project->bids()->where('id','<>',$bid->id)->min('amount');
        if ($currentLowest !== null && $data['amount'] >= $currentLowest) {
            return back()->withErrors(['amount' => 'O valor deve ser menor que o menor lance atual (R$ '.number_format($currentLowest,2,',','.').').']);
        }

        $bid->update($data);
        return back()->with('success','Lance atualizado.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bid $bid)
    {
        $this->authorize('delete', $bid);
        $project = $bid->project;
        $bid->delete();
        return redirect()->route('projects.show', $project)->with('success','Lance removido.');
    }
}

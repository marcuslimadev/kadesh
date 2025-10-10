<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bid;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class BidController extends Controller
{
    use AuthorizesRequests;

    public function projectBids(Project $project)
    {
        $bids = $project->bids()
            ->with('provider:id,name,rating')
            ->orderBy('amount', 'desc')
            ->get();

        return response()->json($bids);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'project_id' => ['required','exists:projects,id'],
            'amount' => ['required','numeric','min:0.01'],
            'delivery_time_days' => ['required','integer','min:1'],
            'proposal' => ['required','string','min:10'],
        ]);

        $user = Auth::user();
        $project = Project::findOrFail($data['project_id']);

        // Validações de negócio
        abort_if($project->status !== 'bidding', 400, 'Leilão encerrado para este projeto.');
        abort_if($project->contractor_id === $user->id, 400, 'Você não pode dar lance no próprio projeto.');

        // Validar se é menor que o menor lance atual
        $currentLowest = $project->bids()->min('amount');
        if ($currentLowest !== null && $data['amount'] >= $currentLowest) {
            return response()->json([
                'message' => 'O valor deve ser menor que o menor lance atual.',
                'current_lowest' => $currentLowest
            ], 422);
        }

        $bid = Bid::create([
            'project_id' => $project->id,
            'provider_id' => $user->id,
            'amount' => $data['amount'],
            'proposal' => $data['proposal'],
            'delivery_time_days' => $data['delivery_time_days'],
            'status' => 'pending',
            'submitted_at' => now(),
        ]);

        return response()->json([
            'bid' => $bid->load('provider:id,name'),
            'message' => 'Lance enviado com sucesso'
        ], 201);
    }

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
            return response()->json([
                'message' => 'O valor deve ser menor que o menor lance atual.',
                'current_lowest' => $currentLowest
            ], 422);
        }

        $bid->update($data);

        return response()->json([
            'bid' => $bid->fresh()->load('provider:id,name'),
            'message' => 'Lance atualizado com sucesso'
        ]);
    }

    public function destroy(Bid $bid)
    {
        $this->authorize('delete', $bid);
        
        $bid->delete();

        return response()->json([
            'message' => 'Lance removido com sucesso'
        ]);
    }
}

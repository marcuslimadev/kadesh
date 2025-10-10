<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\BidController;
use Illuminate\Support\Facades\Route;

// Rotas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/projects', [ProjectController::class, 'index']); // Lista pública de projetos

// Rotas protegidas
Route::middleware('auth:sanctum')->group(function () {
    // Autenticação
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Projetos
    Route::apiResource('projects', ProjectController::class);
    Route::post('projects/{project}/confirm-winner', [ProjectController::class, 'confirmWinner']);
    
    // Lances
    Route::apiResource('bids', BidController::class)->only(['store', 'update', 'destroy']);
    Route::get('projects/{project}/bids', [BidController::class, 'projectBids']);
    
    // Dashboard stats
    Route::get('/dashboard/stats', function () {
        $user = auth()->user();
        
        if ($user->isContractor()) {
            return response()->json([
                'projects_total' => $user->contractedProjects()->count(),
                'projects_open' => $user->contractedProjects()->whereIn('status', ['open','bidding'])->count(),
                'projects_in_progress' => $user->contractedProjects()->where('status', 'in_progress')->count(),
                'total_spent' => $user->transactions()->where('type','payment')->sum('amount'),
            ]);
        }
        
        if ($user->isProvider()) {
            return response()->json([
                'bids_total' => $user->bids()->count(),
                'bids_active' => $user->bids()->where('status','pending')->count(),
                'projects_won' => $user->wonProjects()->count(),
                'earnings' => $user->transactions()->where('type','payment')->where('status','completed')->sum('net_amount'),
            ]);
        }
        
        return response()->json([]);
    });
});
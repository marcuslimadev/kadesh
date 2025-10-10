<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Bid;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->user_type == 'contractor') {
            $stats = [
                'projects_total' => Project::where('contractor_id', $user->id)->count(),
                'projects_open' => Project::where('contractor_id', $user->id)->whereIn('status', ['open','bidding'])->count(),
                'projects_in_progress' => Project::where('contractor_id', $user->id)->where('status', 'in_progress')->count(),
                'total_spent' => 0, // Transaction::where('user_id', $user->id)->where('type','payment')->sum('amount'),
            ];
            return Inertia::render('Dashboard/Client', [
                'user' => $user,
                'stats' => $stats
            ]);
        }

        if ($user->user_type == 'provider') {
            $stats = [
                'bids_total' => Bid::where('provider_id', $user->id)->count(),
                'bids_active' => Bid::where('provider_id', $user->id)->where('status','pending')->count(),
                'projects_won' => Project::where('winner_id', $user->id)->count(),
                'earnings' => 0, // Transaction::where('user_id', $user->id)->where('type','payment')->where('status','completed')->sum('net_amount'),
            ];
            return Inertia::render('Dashboard/Provider', [
                'user' => $user,
                'stats' => $stats
            ]);
        }

        // fallback
        return Inertia::render('Dashboard/Generic', [
            'user' => $user
        ]);
    }
}

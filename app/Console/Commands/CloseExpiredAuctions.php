<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CloseExpiredAuctions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'kadesh:close-expired-auctions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Encerra leilões de projetos que atingiram o prazo final';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expiredProjects = \App\Models\Project::where('status', 'bidding')
            ->where('bidding_ends_at', '<=', now())
            ->get();

        $closedCount = 0;

        foreach ($expiredProjects as $project) {
            $lowestBid = $project->bids()->orderBy('amount')->orderBy('submitted_at')->first();
            
            if ($lowestBid) {
                $project->update([
                    'status' => 'awarded',
                    'winner_id' => $lowestBid->provider_id,
                    'winning_bid' => $lowestBid->amount
                ]);

                $lowestBid->update(['status' => 'accepted']);
                
                // Rejeitar outros lances
                $project->bids()->where('id', '!=', $lowestBid->id)->update(['status' => 'rejected']);
                
                $this->info("Projeto #{$project->id} '{$project->title}' encerrado. Vencedor: {$lowestBid->provider->name} (R$ {$lowestBid->amount})");
                $closedCount++;
            } else {
                // Sem lances, cancelar projeto
                $project->update(['status' => 'cancelled']);
                $this->info("Projeto #{$project->id} '{$project->title}' cancelado por falta de lances.");
                $closedCount++;
            }
        }

        $this->info("Total de leilões processados: {$closedCount}");
        return Command::SUCCESS;
    }
}

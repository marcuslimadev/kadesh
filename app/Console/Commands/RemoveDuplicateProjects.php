<?php

namespace App\Console\Commands;

use App\Models\Project;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class RemoveDuplicateProjects extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'projects:remove-duplicates {--dry-run : Show what would be deleted without actually deleting}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove duplicate projects with same title from same contractor';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Procurando por projetos duplicados...');

        // Encontrar projetos duplicados (mesmo título e mesmo contractor_id)
        $duplicates = DB::table('projects')
            ->select('title', 'contractor_id', DB::raw('COUNT(*) as count'), DB::raw('MIN(id) as keep_id'))
            ->groupBy('title', 'contractor_id')
            ->having('count', '>', 1)
            ->get();

        if ($duplicates->isEmpty()) {
            $this->info('Nenhum projeto duplicado encontrado.');
            return;
        }

        $this->info("Encontrados {$duplicates->count()} grupos de projetos duplicados:");

        $totalToDelete = 0;

        foreach ($duplicates as $duplicate) {
            $projects = Project::where('title', $duplicate->title)
                ->where('contractor_id', $duplicate->contractor_id)
                ->orderBy('id')
                ->get();

            $this->line("\nGrupo: \"{$duplicate->title}\" - Contractor ID: {$duplicate->contractor_id}");
            $this->line("Total de duplicatas: {$duplicate->count}");

            // Manter o primeiro projeto, remover os outros
            $toDelete = $projects->skip(1);
            $totalToDelete += $toDelete->count();

            $this->line("Manter: ID {$projects->first()->id} (criado em {$projects->first()->created_at})");
            
            foreach ($toDelete as $project) {
                $this->line("Remover: ID {$project->id} (criado em {$project->created_at})");
            }

            if (!$this->option('dry-run')) {
                $toDelete->each(function ($project) {
                    $project->delete();
                });
            }
        }

        if ($this->option('dry-run')) {
            $this->warn("\n🔍 Modo DRY-RUN: {$totalToDelete} projetos seriam removidos.");
            $this->warn("Execute sem --dry-run para realmente remover os duplicados.");
        } else {
            $this->info("\n✅ {$totalToDelete} projetos duplicados foram removidos com sucesso!");
        }
    }
}

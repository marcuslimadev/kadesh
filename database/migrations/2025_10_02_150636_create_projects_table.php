<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contractor_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->decimal('max_budget', 10, 2); // orçamento máximo
            $table->decimal('winning_bid', 10, 2)->nullable(); // lance vencedor
            $table->foreignId('winner_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('status', ['open', 'bidding', 'awarded', 'in_progress', 'completed', 'cancelled'])->default('open');
            $table->timestamp('bidding_ends_at'); // prazo para lances
            $table->timestamp('project_deadline')->nullable(); // prazo do projeto
            $table->json('required_skills')->nullable(); // habilidades necessárias
            $table->json('attachments')->nullable(); // arquivos anexos
            $table->boolean('is_featured')->default(false); // projeto em destaque
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};

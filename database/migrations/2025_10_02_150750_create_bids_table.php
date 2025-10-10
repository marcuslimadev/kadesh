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
        Schema::create('bids', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('provider_id')->constrained('users')->onDelete('cascade');
            $table->decimal('amount', 10, 2); // valor da proposta
            $table->text('proposal'); // descrição da proposta
            $table->integer('delivery_time_days'); // prazo de entrega em dias
            $table->enum('status', ['pending', 'accepted', 'rejected', 'withdrawn'])->default('pending');
            $table->json('attachments')->nullable(); // arquivos da proposta
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();
            
            // Índice único para evitar múltiplas propostas do mesmo prestador no mesmo projeto
            $table->unique(['project_id', 'provider_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bids');
    }
};

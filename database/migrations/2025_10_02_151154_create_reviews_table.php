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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade'); // quem avalia
            $table->foreignId('reviewed_id')->constrained('users')->onDelete('cascade'); // quem é avaliado
            $table->integer('rating'); // nota de 1 a 5
            $table->text('comment')->nullable();
            $table->enum('type', ['contractor_to_provider', 'provider_to_contractor']);
            $table->boolean('is_public')->default(true);
            $table->timestamps();
            
            // Evitar avaliações duplicadas
            $table->unique(['project_id', 'reviewer_id', 'reviewed_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};

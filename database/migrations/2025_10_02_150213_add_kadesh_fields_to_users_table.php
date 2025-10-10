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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('user_type', ['contractor', 'provider']); // contratante ou prestador
            $table->string('document')->nullable(); // CPF ou CNPJ
            $table->enum('person_type', ['individual', 'company'])->nullable(); // PF ou PJ
            $table->string('phone')->nullable();
            $table->text('bio')->nullable(); // descrição do perfil
            $table->json('skills')->nullable(); // habilidades (para prestadores)
            $table->decimal('rating', 3, 2)->default(0); // avaliação média
            $table->integer('total_ratings')->default(0); // total de avaliações
            $table->decimal('wallet_balance', 10, 2)->default(0); // saldo da carteira
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_activity')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'user_type', 'document', 'person_type', 'phone', 'bio', 
                'skills', 'rating', 'total_ratings', 'wallet_balance', 
                'is_active', 'last_activity'
            ]);
        });
    }
};

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KadeshSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Criar usuários de teste
        $contractor = \App\Models\User::create([
            'name' => 'João Contratante',
            'email' => 'contratante@kadesh.test',
            'password' => 'password',
            'user_type' => 'contractor',
            'phone' => '(11) 99999-1111',
        ]);

        $provider1 = \App\Models\User::create([
            'name' => 'Maria Prestadora',
            'email' => 'prestadora1@kadesh.test',
            'password' => 'password',
            'user_type' => 'provider',
            'phone' => '(11) 99999-2222',
            'bio' => 'Desenvolvedora full-stack com 5 anos de experiência',
            'skills' => ['php', 'laravel', 'javascript', 'vue.js'],
        ]);

        $provider2 = \App\Models\User::create([
            'name' => 'Carlos Desenvolvedor',
            'email' => 'prestador2@kadesh.test',
            'password' => 'password',
            'user_type' => 'provider',
            'phone' => '(11) 99999-3333',
            'bio' => 'Especialista em sistemas web e mobile',
            'skills' => ['php', 'react', 'node.js', 'mysql'],
        ]);

        // Criar projeto em lances
        $project1 = \App\Models\Project::create([
            'contractor_id' => $contractor->id,
            'title' => 'Sistema de E-commerce',
            'description' => 'Desenvolvimento de plataforma de e-commerce completa com painel administrativo, catálogo de produtos, carrinho de compras e integração de pagamento.',
            'max_budget' => 5000.00,
            'bidding_ends_at' => now()->addDays(3),
            'project_deadline' => now()->addDays(30),
            'required_skills' => ['php', 'laravel', 'mysql', 'javascript'],
            'status' => 'bidding',
        ]);

        // Criar projeto expirado para teste
        $project2 = \App\Models\Project::create([
            'contractor_id' => $contractor->id,
            'title' => 'App Mobile',
            'description' => 'Aplicativo mobile para delivery de comida',
            'max_budget' => 3000.00,
            'bidding_ends_at' => now()->subHour(), // Expirado
            'project_deadline' => now()->addDays(20),
            'required_skills' => ['react-native', 'firebase'],
            'status' => 'bidding',
        ]);

        // Criar lances
        \App\Models\Bid::create([
            'project_id' => $project1->id,
            'provider_id' => $provider1->id,
            'amount' => 4500.00,
            'proposal' => 'Proposta detalhada para desenvolvimento do e-commerce com todas as funcionalidades solicitadas.',
            'delivery_time_days' => 25,
            'status' => 'pending',
            'submitted_at' => now()->subHours(2),
        ]);

        \App\Models\Bid::create([
            'project_id' => $project1->id,
            'provider_id' => $provider2->id,
            'amount' => 4200.00, // Menor lance
            'proposal' => 'Desenvolvimento completo com foco em performance e usabilidade.',
            'delivery_time_days' => 30,
            'status' => 'pending',
            'submitted_at' => now()->subHour(),
        ]);

        \App\Models\Bid::create([
            'project_id' => $project2->id,
            'provider_id' => $provider1->id,
            'amount' => 2800.00,
            'proposal' => 'App mobile nativo com design moderno.',
            'delivery_time_days' => 18,
            'status' => 'pending',
            'submitted_at' => now()->subHours(3),
        ]);

        $this->command->info('Dados de teste criados com sucesso!');
        $this->command->info('Contratante: contratante@kadesh.test / password');
        $this->command->info('Prestador 1: prestadora1@kadesh.test / password');
        $this->command->info('Prestador 2: prestador2@kadesh.test / password');
    }
}

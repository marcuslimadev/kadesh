<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class FornecedorTestSeeder extends Seeder
{
    public function run(): void
    {
        // Verificar se o usuário já existe
        $existingUser = User::where('email', 'fornecedor@kadesh.com')->first();
        
        if (!$existingUser) {
            User::create([
                'name' => 'João Fornecedor',
                'email' => 'fornecedor@kadesh.com',
                'password' => Hash::make('123456'),
                'user_type' => 'provider',
                'email_verified_at' => now(),
            ]);
            
            echo "Usuário fornecedor criado com sucesso!\n";
            echo "Email: fornecedor@kadesh.com\n";
            echo "Senha: 123456\n";
        } else {
            echo "Usuário já existe!\n";
        }
    }
}
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cliente de teste
        User::firstOrCreate(
            ['email' => 'cliente@kadesh.com'],
            [
                'name' => 'João Cliente',
                'password' => Hash::make('password'),
                'user_type' => 'contractor',
                'email_verified_at' => now(),
            ]
        );

        // Fornecedor de teste
        User::firstOrCreate(
            ['email' => 'fornecedor@kadesh.com'],
            [
                'name' => 'Maria Fornecedora',
                'password' => Hash::make('password'),
                'user_type' => 'provider',
                'email_verified_at' => now(),
            ]
        );

        // Admin de teste
        User::firstOrCreate(
            ['email' => 'admin@kadesh.com'],
            [
                'name' => 'Admin Kadesh',
                'password' => Hash::make('password'),
                'user_type' => 'contractor',
                'email_verified_at' => now(),
            ]
        );
    }
}
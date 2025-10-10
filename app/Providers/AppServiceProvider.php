<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }

        // Compatibilidade com MySQL/MariaDB que possuem limite de índice de 1000 bytes
        // Evita erros "Specified key was too long" em colunas string não especificadas.
        Schema::defaultStringLength(191);

        // Garante que o domínio do cookie de sessão não venha corrompido por .env
        // (e.g., "domain=.mmbsites.com.brDB_CHARSET=utf8mb4").
        // Ao definir null, o Laravel emite cookie host-only (sem Domain), o que é seguro.
        config(['session.domain' => null]);
    }
}

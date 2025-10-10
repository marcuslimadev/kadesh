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
    }
}

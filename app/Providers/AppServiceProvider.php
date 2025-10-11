<?php

namespace App\Providers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

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

        Schema::defaultStringLength(191);

        // SOLUÇÃO DEFINITIVA: Força domain=null sem usar env() que pode estar corrompido
        config([
            'session.domain' => null,
            'session.secure' => true,
            'session.same_site' => 'lax',
            'session.http_only' => true,
            'sanctum.domain' => null,
        ]);
    }
}

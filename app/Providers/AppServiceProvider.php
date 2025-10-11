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

        // Compatibilidade com MySQL/MariaDB que possuem limite de índice de 1000 bytes
        // Evita erros "Specified key was too long" em colunas string não especificadas.
        Schema::defaultStringLength(191);

        static $loggedBeforeOverride = false;
        $envSessionDomain = env('SESSION_DOMAIN');
        $getenvSessionDomain = getenv('SESSION_DOMAIN') === false ? null : getenv('SESSION_DOMAIN');
        $superGlobalEnv = $_ENV['SESSION_DOMAIN'] ?? null;
        $superGlobalServer = $_SERVER['SESSION_DOMAIN'] ?? null;
        $configSessionDomainBefore = config('session.domain');

        if (! $loggedBeforeOverride) {
            $loggedBeforeOverride = true;
            Log::debug('Session domain diagnostics (before overrides)', [
                'env' => $envSessionDomain,
                'getenv' => $getenvSessionDomain,
                '_ENV' => $superGlobalEnv,
                '_SERVER' => $superGlobalServer,
                'config_before' => $configSessionDomainBefore,
            ]);
        }

        // Garante que o domínio do cookie de sessão não venha corrompido por .env
        // (e.g., "domain=.mmbsites.com.brDB_CHARSET=utf8mb4").
        // Ao definir null, o Laravel emite cookie host-only (sem Domain), o que é seguro.
        config(['session.domain' => null]);

        // CORREÇÃO RADICAL: Força configurações de sessão corretas MUITO CEDO
        // Isso previne que cookies sejam gerados com domains malformados
        
        // Força as configurações corretas diretamente
        config([
            'session.domain' => null,  // Host-only (sem domain attribute)
            'session.secure' => true,  // HTTPS apenas
            'session.same_site' => 'lax',
            'session.http_only' => true,
            'session.driver' => 'cookie',
        ]);
        
        // Força também para Sanctum
        config([
            'sanctum.domain' => null,
        ]);

        static $loggedAfterOverride = false;
        if (! $loggedAfterOverride) {
            $loggedAfterOverride = true;
            Log::debug('Session domain diagnostics (after overrides)', [
                'config_after' => config('session.domain'),
                'session_driver' => config('session.driver'),
                'sanctum_domain' => config('sanctum.domain'),
            ]);
        }
    }
}

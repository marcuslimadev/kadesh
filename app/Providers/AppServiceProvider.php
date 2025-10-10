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

        // INTERCEPTADOR GLOBAL DE RESPOSTA para corrigir cookies malformados
        // Aplica-se automaticamente a TODAS as requisições
        $this->app->terminating(function ($request, $response) {
            if (method_exists($response, 'headers')) {
                $headers = $response->headers;
                $cookies = $headers->get('set-cookie', [], false);
                
                if (!empty($cookies)) {
                    $fixedCookies = [];
                    foreach ($cookies as $cookie) {
                        // Remove domínios malformados (ex: ".mmbsites.com.brDB_CHARSET=utf8mb4")
                        $fixed = preg_replace('/;\s*domain=[^;]*DB_[^;]*/', '', $cookie);
                        // Remove QUALQUER domain para forçar host-only sempre
                        $fixed = preg_replace('/;\s*domain=[^;]*/', '', $fixed);
                        $fixedCookies[] = $fixed;
                    }
                    
                    // Substitui todos os Set-Cookie pelos corrigidos
                    $headers->remove('set-cookie');
                    foreach ($fixedCookies as $fixedCookie) {
                        $headers->set('set-cookie', $fixedCookie, false);
                    }
                }
            }
        });
    }
}

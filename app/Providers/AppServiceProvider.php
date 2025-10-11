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
        
        // INTERCEPTA HEADERS ANTES DE ENVIAR - última linha de defesa
        if (PHP_SAPI !== 'cli') {
            header_register_callback(function () {
                $headers = headers_list();
                foreach ($headers as $header) {
                    if (stripos($header, 'Set-Cookie:') === 0 && strpos($header, 'DB_CHARSET') !== false) {
                        // Remove o header malformado
                        header_remove('Set-Cookie');
                        
                        // Corrige: remove tudo após .com.br até o próximo ;
                        $fixed = preg_replace('/\.com\.br[^;]*DB_CHARSET[^;]*/', '.com.br', $header);
                        // Remove completamente o domain
                        $fixed = preg_replace('/;\s*domain=[^;]+/', '', $fixed);
                        
                        // Reenvia o header corrigido
                        header($fixed, false);
                    }
                }
            });
        }
    }
}

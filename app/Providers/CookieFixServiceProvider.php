<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;

class CookieFixServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Hook global que executa APÓS cada resposta ser preparada
        $this->app->resolving('response', function ($response) {
            $this->fixMalformedCookies($response);
        });
        
        // Também para JsonResponse
        $this->app->resolving(JsonResponse::class, function ($response) {
            $this->fixMalformedCookies($response);
        });
    }
    
    private function fixMalformedCookies($response): void
    {
        if (!method_exists($response, 'headers')) {
            return;
        }
        
        $headers = $response->headers;
        $setCookieHeaders = [];
        
        // Pega todos os headers Set-Cookie
        foreach ($headers->allPreserveCase() as $name => $values) {
            if (strtolower($name) === 'set-cookie') {
                $setCookieHeaders = is_array($values) ? $values : [$values];
                break;
            }
        }
        
        if (empty($setCookieHeaders)) {
            return;
        }
        
        $fixedCookies = [];
        foreach ($setCookieHeaders as $cookie) {
            // Remove domínios malformados (ex: ".mmbsites.com.brDB_CHARSET=utf8mb4")
            $fixed = preg_replace('/;\s*domain=[^;]*DB_[^;]*/', '', $cookie);
            // Remove QUALQUER domain para forçar host-only sempre
            $fixed = preg_replace('/;\s*domain=[^;]*/', '', $fixed);
            $fixedCookies[] = $fixed;
        }
        
        // Remove os headers Set-Cookie antigos
        $headers->remove('Set-Cookie');
        
        // Adiciona os cookies corrigidos
        foreach ($fixedCookies as $fixedCookie) {
            $headers->set('Set-Cookie', $fixedCookie, false);
        }
    }
    
    public function register(): void
    {
        //
    }
}
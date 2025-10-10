<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class FixSessionCookies
{
    /**
     * Middleware global que corrige TODOS os cookies de sessão/CSRF
     * independente de configuração do .env corrompido.
     * 
     * Aplica-se a TODOS os endpoints automaticamente.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Log para debug
        Log::info('FixSessionCookies middleware executado para: ' . $request->url());
        
        $response = $next($request);

        // Force configuração de sessão segura em runtime (ignora .env)
        config([
            'session.domain' => null,  // Host-only sempre
            'session.secure' => app()->environment('production'),
            'session.same_site' => 'lax',
            'session.http_only' => true,
        ]);

        // Se a resposta tem Set-Cookie, limpa domínios inválidos
        $headers = $response->headers;
        $cookies = $headers->get('set-cookie', [], false);
        
        Log::info('Cookies originais encontrados: ' . count($cookies), $cookies);
        
        if (!empty($cookies)) {
            $fixedCookies = [];
            foreach ($cookies as $cookie) {
                // Remove domínios malformados (ex: ".mmbsites.com.brDB_CHARSET=utf8mb4")
                $fixed = preg_replace('/;\s*domain=[^;]*DB_[^;]*/', '', $cookie);
                // Remove QUALQUER domain para forçar host-only sempre
                $fixed = preg_replace('/;\s*domain=[^;]*/', '', $fixed);
                // Garante que tem os atributos de segurança corretos
                if (app()->environment('production')) {
                    if (!str_contains($fixed, 'secure')) {
                        $fixed .= '; secure';
                    }
                }
                if (!str_contains($fixed, 'samesite=')) {
                    $fixed .= '; samesite=lax';
                }
                $fixedCookies[] = $fixed;
            }
            
            // Substitui todos os Set-Cookie pelos corrigidos
            $headers->remove('set-cookie');
            foreach ($fixedCookies as $fixedCookie) {
                $headers->set('set-cookie', $fixedCookie, false);
            }
            
            Log::info('Cookies corrigidos aplicados: ' . count($fixedCookies), $fixedCookies);
        }

        return $response;
    }
}
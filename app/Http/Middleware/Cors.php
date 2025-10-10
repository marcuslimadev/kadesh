<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Handle preflight OPTIONS requests
        if ($request->getMethod() === 'OPTIONS') {
            $response = response('', 200);
        } else {
            $response = $next($request);
        }

        // Pegar as origens permitidas do .env
        $allowedOriginsString = env('CORS_ALLOWED_ORIGINS', '');
        $allowedOrigins = array_filter(array_map('trim', explode(',', $allowedOriginsString)));
        
        // Pegar o Origin da requisição
        $origin = $request->headers->get('Origin');

        // Se há um Origin e ele está na lista de permitidos, usa ele
        if ($origin && in_array($origin, $allowedOrigins, true)) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        } 
        // Se não há Origin ou não está permitido, usa o primeiro da lista como fallback
        elseif (!empty($allowedOrigins)) {
            $response->headers->set('Access-Control-Allow-Origin', $allowedOrigins[0]);
        }
        
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, X-XSRF-TOKEN');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }
}

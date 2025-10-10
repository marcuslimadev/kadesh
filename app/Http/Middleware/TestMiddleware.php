<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class TestMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        Log::info('===== TESTE MIDDLEWARE EXECUTADO =====');
        Log::info('URL: ' . $request->url());
        Log::info('Método: ' . $request->method());
        
        $response = $next($request);
        
        Log::info('===== TESTE MIDDLEWARE FINALIZOU =====');
        
        return $response;
    }
}
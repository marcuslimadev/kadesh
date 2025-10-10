<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Remover HandleCors global do Laravel (causa conflito)
        $middleware->remove(\Illuminate\Http\Middleware\HandleCors::class);
        
        // MIDDLEWARE customizado de CORS aplicado PRIMEIRO em todas as requisições
        $middleware->prepend(\App\Http\Middleware\Cors::class);

        $middleware->web(append: [
            \App\Http\Middleware\TestMiddleware::class,
            \App\Http\Middleware\FixSessionCookies::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->api(append: [
            \App\Http\Middleware\TestMiddleware::class,
            \App\Http\Middleware\FixSessionCookies::class,
        ]);
    })
    ->withProviders([
        App\Providers\CookieFixServiceProvider::class,
    ])
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

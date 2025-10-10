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
        // MIDDLEWARE GLOBAL: corrige TODOS os cookies automaticamente
        $middleware->use([
            \App\Http\Middleware\TestMiddleware::class,
            \App\Http\Middleware\FixSessionCookies::class,
        ]);
        
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        // CORS aplicado ao grupo API; Sanctum stateful continua ativo
        $middleware->api(prepend: [
            \App\Http\Middleware\Cors::class,
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

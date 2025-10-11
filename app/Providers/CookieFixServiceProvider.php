<?php

namespace App\Providers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

class CookieFixServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // ABORDAGEM RADICAL: Intercepta a CRIAÇÃO de cookies via output buffering
        if (!defined('COOKIE_FIX_ENABLED')) {
            define('COOKIE_FIX_ENABLED', true);
            
            // Inicia output buffering para capturar headers
            ob_start(function ($buffer) {
                // Pega todos os headers que foram definidos
                $headers = headers_list();
                $cookieHeaders = [];
                
                foreach ($headers as $header) {
                    if (stripos($header, 'Set-Cookie:') === 0) {
                        $cookieHeaders[] = $header;
                    }
                }

                if (! empty($cookieHeaders)) {
                    Log::info('CookieFixServiceProvider captured cookie headers', $cookieHeaders);
                }
                
                // Remove headers malformados e redefine
                foreach ($cookieHeaders as $cookieHeader) {
                    if (strpos($cookieHeader, 'DB_CHARSET') !== false) {
                        // Remove o header malformado
                        header_remove('Set-Cookie');
                        
                        // Corrige e readiciona
                        $fixed = preg_replace('/;\s*domain=[^;]*DB_[^;]*/', '', $cookieHeader);
                        $fixed = preg_replace('/;\s*domain=[^;]*/', '', $fixed);
                        $fixed = str_replace('Set-Cookie: ', '', $fixed);
                        
                        // Readiciona o cookie corrigido
                        header('Set-Cookie: ' . $fixed, false);
                        
                        Log::info('CookieFixServiceProvider rewrote malformed cookie', ['original' => $cookieHeader, 'fixed' => $fixed]);
                    }
                }
                
                return $buffer;
            });
        }
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
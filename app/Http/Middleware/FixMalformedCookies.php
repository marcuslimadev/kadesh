<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class FixMalformedCookies
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Captura todos os headers Set-Cookie
        $cookies = $response->headers->getCookies();
        
        if (empty($cookies)) {
            return $response;
        }

        // Remove todos os Set-Cookie headers existentes
        $response->headers->remove('Set-Cookie');

        // Reescreve cada cookie sem o domínio corrompido
        foreach ($cookies as $cookie) {
            $cookieString = $cookie->getName() . '=' . $cookie->getValue();
            
            if ($cookie->getExpiresTime() !== 0) {
                $cookieString .= '; expires=' . gmdate('D, d M Y H:i:s T', $cookie->getExpiresTime());
                $cookieString .= '; Max-Age=' . $cookie->getMaxAge();
            }
            
            if ($cookie->getPath()) {
                $cookieString .= '; path=' . $cookie->getPath();
            }
            
            // NUNCA adiciona domain - força host-only cookie
            // if ($cookie->getDomain()) {
            //     $cookieString .= '; domain=' . $cookie->getDomain();
            // }
            
            if ($cookie->isSecure()) {
                $cookieString .= '; secure';
            }
            
            if ($cookie->isHttpOnly()) {
                $cookieString .= '; httponly';
            }
            
            if ($cookie->getSameSite()) {
                $cookieString .= '; samesite=' . $cookie->getSameSite();
            }
            
            $response->headers->set('Set-Cookie', $cookieString, false);
        }

        return $response;
    }
}

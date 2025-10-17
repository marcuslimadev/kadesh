<?php
/**
 * Mercado Pago Helper
 * SDK simplificado para integração com Mercado Pago API
 */

class MercadoPago {
    private $accessToken;
    private $environment; // 'test' ou 'prod'
    
    public function __construct() {
        // Carregar configurações do .env.mp
        $this->loadEnv();
        
        $this->environment = $_ENV['MP_ENVIRONMENT'] ?? 'test';
        $this->accessToken = $this->environment === 'prod' 
            ? ($_ENV['MP_ACCESS_TOKEN_PROD'] ?? '')
            : ($_ENV['MP_ACCESS_TOKEN_TEST'] ?? '');
    }
    
    private function loadEnv() {
        $envFile = __DIR__ . '/.env.mp';
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue;
                list($key, $value) = explode('=', $line, 2);
                $_ENV[trim($key)] = trim($value);
            }
        }
    }
    
    /**
     * Criar preferência de pagamento
     */
    public function createPreference($data) {
        $url = 'https://api.mercadopago.com/checkout/preferences';
        
        $preference = [
            'items' => [[
                'title' => $data['title'],
                'quantity' => 1,
                'unit_price' => (float)$data['amount'],
                'currency_id' => 'BRL'
            ]],
            'payer' => [
                'name' => $data['payer_name'] ?? '',
                'email' => $data['payer_email'] ?? '',
            ],
            'back_urls' => [
                'success' => $_ENV['MP_SUCCESS_URL'] ?? '',
                'failure' => $_ENV['MP_FAILURE_URL'] ?? '',
                'pending' => $_ENV['MP_PENDING_URL'] ?? ''
            ],
            'auto_return' => 'approved',
            'external_reference' => $data['external_reference'] ?? '',
            'notification_url' => $data['notification_url'] ?? '',
            'statement_descriptor' => 'KADESH MARKETPLACE',
        ];
        
        return $this->makeRequest('POST', $url, $preference);
    }
    
    /**
     * Obter informações de um pagamento
     */
    public function getPayment($paymentId) {
        $url = "https://api.mercadopago.com/v1/payments/{$paymentId}";
        return $this->makeRequest('GET', $url);
    }
    
    /**
     * Processar notificação de webhook
     */
    public function processWebhook($data) {
        if (isset($data['type']) && $data['type'] === 'payment') {
            $paymentId = $data['data']['id'] ?? null;
            if ($paymentId) {
                return $this->getPayment($paymentId);
            }
        }
        return null;
    }
    
    /**
     * Criar split payment (divisão de pagamento)
     * Útil para enviar parte para o fornecedor e parte para plataforma
     */
    public function createSplitPayment($data) {
        // Calcular taxa da plataforma
        $feePercentage = (float)($_ENV['PLATFORM_FEE_PERCENTAGE'] ?? 10);
        $amount = (float)$data['amount'];
        $platformFee = $amount * ($feePercentage / 100);
        $providerAmount = $amount - $platformFee;
        
        $preference = [
            'items' => [[
                'title' => $data['title'],
                'quantity' => 1,
                'unit_price' => $amount,
                'currency_id' => 'BRL'
            ]],
            'marketplace_fee' => $platformFee,
            'external_reference' => $data['external_reference'] ?? '',
        ];
        
        $url = 'https://api.mercadopago.com/checkout/preferences';
        return $this->makeRequest('POST', $url, $preference);
    }
    
    /**
     * Fazer requisição HTTP para API do Mercado Pago
     */
    private function makeRequest($method, $url, $data = null) {
        $ch = curl_init();
        
        $headers = [
            'Authorization: Bearer ' . $this->accessToken,
            'Content-Type: application/json',
            'X-Idempotency-Key: ' . uniqid('mp_', true)
        ];
        
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        
        if ($data && in_array($method, ['POST', 'PUT', 'PATCH'])) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        $result = json_decode($response, true);
        
        if ($httpCode >= 400) {
            error_log("MercadoPago API Error: " . $response);
            return [
                'error' => true,
                'message' => $result['message'] ?? 'Erro na API do Mercado Pago',
                'status' => $httpCode
            ];
        }
        
        return $result;
    }
    
    /**
     * Obter chave pública para frontend
     */
    public function getPublicKey() {
        return $this->environment === 'prod'
            ? ($_ENV['MP_PUBLIC_KEY_PROD'] ?? '')
            : ($_ENV['MP_PUBLIC_KEY_TEST'] ?? '');
    }
}

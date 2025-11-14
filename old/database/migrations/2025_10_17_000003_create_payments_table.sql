-- Migration: Payments (Mercado Pago)
-- Controle de pagamentos integrados com Mercado Pago

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT UNSIGNED NOT NULL,
    bid_id BIGINT UNSIGNED NULL COMMENT 'Lance vencedor',
    
    -- Partes envolvidas
    payer_id BIGINT UNSIGNED NOT NULL COMMENT 'Quem paga (contratante)',
    receiver_id BIGINT UNSIGNED NOT NULL COMMENT 'Quem recebe (fornecedor)',
    
    -- Valores
    amount DECIMAL(10,2) NOT NULL COMMENT 'Valor total',
    fee DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Taxa da plataforma',
    net_amount DECIMAL(10,2) NOT NULL COMMENT 'Valor líquido para fornecedor',
    
    -- Mercado Pago IDs
    mp_preference_id VARCHAR(255) NULL COMMENT 'ID da preferência MP',
    mp_payment_id VARCHAR(255) NULL COMMENT 'ID do pagamento MP',
    mp_merchant_order_id VARCHAR(255) NULL COMMENT 'ID da ordem MP',
    
    -- Status
    status ENUM('pending', 'approved', 'in_process', 'rejected', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(100) NULL COMMENT 'Método usado (pix, credit_card, etc)',
    
    -- Datas importantes
    paid_at TIMESTAMP NULL COMMENT 'Quando foi pago',
    approved_at TIMESTAMP NULL COMMENT 'Quando foi aprovado',
    
    -- Dados adicionais do MP (JSON)
    mp_response JSON NULL COMMENT 'Resposta completa do Mercado Pago',
    
    -- Metadados
    description TEXT NULL,
    external_reference VARCHAR(255) NULL COMMENT 'Referência externa',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (bid_id) REFERENCES bids(id) ON DELETE SET NULL,
    FOREIGN KEY (payer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_project (project_id),
    INDEX idx_payer (payer_id),
    INDEX idx_receiver (receiver_id),
    INDEX idx_status (status),
    INDEX idx_mp_payment (mp_payment_id),
    INDEX idx_mp_preference (mp_preference_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

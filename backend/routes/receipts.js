const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route   GET /api/receipts/contract/:id
 * @desc    Gera PDF de comprovante RPA para contrato finalizado
 * @access  Private
 */
router.get('/contract/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Buscar contrato com informações completas
    const query = `
      SELECT 
        c.*,
        p.title as project_title,
        p.description as project_description,
        client.name as client_name,
        client.email as client_email,
        client.cpf as client_cpf,
        provider.name as provider_name,
        provider.email as provider_email,
        provider.cpf as provider_cpf
      FROM contracts c
      JOIN projects p ON c.project_id = p.id
      JOIN users client ON p.client_id = client.id
      JOIN users provider ON c.provider_id = provider.id
      WHERE c.id = $1 AND (client.id = $2 OR provider.id = $2)
    `;

    const result = await db.query(query, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contrato não encontrado' });
    }

    const contract = result.rows[0];

    // Verificar se contrato está finalizado
    if (contract.status !== 'completed') {
      return res.status(400).json({ 
        error: 'Somente contratos finalizados podem gerar comprovantes' 
      });
    }

    // Criar PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Configurar headers para download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Comprovante-RPA-${contract.id}.pdf`
    );

    // Pipe do PDF para a resposta
    doc.pipe(res);

    // Header
    doc.fontSize(20)
       .fillColor('#2563eb')
       .text('KADDESH', 50, 50)
       .fontSize(10)
       .fillColor('#666')
       .text('Plataforma de Freelance e Leilões Reversos', 50, 75);

    // Título do documento
    doc.fontSize(16)
       .fillColor('#000')
       .text('RECIBO DE PAGAMENTO AUTÔNOMO (RPA)', 50, 120, { align: 'center' });

    // Linha separadora
    doc.moveTo(50, 150)
       .lineTo(545, 150)
       .strokeColor('#2563eb')
       .stroke();

    // Informações do contrato
    let yPos = 170;

    doc.fontSize(12)
       .fillColor('#333')
       .text('Número do Comprovante:', 50, yPos)
       .fillColor('#000')
       .text(`#${contract.id}`, 200, yPos);

    yPos += 25;
    doc.fillColor('#333')
       .text('Data de Emissão:', 50, yPos)
       .fillColor('#000')
       .text(new Date().toLocaleDateString('pt-BR'), 200, yPos);

    yPos += 25;
    doc.fillColor('#333')
       .text('Data de Conclusão:', 50, yPos)
       .fillColor('#000')
       .text(new Date(contract.completed_at || contract.updated_at).toLocaleDateString('pt-BR'), 200, yPos);

    // Dados do Contratante
    yPos += 40;
    doc.fontSize(14)
       .fillColor('#2563eb')
       .text('CONTRATANTE', 50, yPos);

    yPos += 25;
    doc.fontSize(11)
       .fillColor('#333')
       .text('Nome:', 50, yPos)
       .fillColor('#000')
       .text(contract.client_name, 200, yPos);

    yPos += 20;
    doc.fillColor('#333')
       .text('E-mail:', 50, yPos)
       .fillColor('#000')
       .text(contract.client_email, 200, yPos);

    if (contract.client_cpf) {
      yPos += 20;
      doc.fillColor('#333')
         .text('CPF:', 50, yPos)
         .fillColor('#000')
         .text(contract.client_cpf, 200, yPos);
    }

    // Dados do Prestador
    yPos += 40;
    doc.fontSize(14)
       .fillColor('#2563eb')
       .text('PRESTADOR DE SERVIÇO', 50, yPos);

    yPos += 25;
    doc.fontSize(11)
       .fillColor('#333')
       .text('Nome:', 50, yPos)
       .fillColor('#000')
       .text(contract.provider_name, 200, yPos);

    yPos += 20;
    doc.fillColor('#333')
       .text('E-mail:', 50, yPos)
       .fillColor('#000')
       .text(contract.provider_email, 200, yPos);

    if (contract.provider_cpf) {
      yPos += 20;
      doc.fillColor('#333')
         .text('CPF:', 50, yPos)
         .fillColor('#000')
         .text(contract.provider_cpf, 200, yPos);
    }

    // Descrição do Serviço
    yPos += 40;
    doc.fontSize(14)
       .fillColor('#2563eb')
       .text('DESCRIÇÃO DO SERVIÇO', 50, yPos);

    yPos += 25;
    doc.fontSize(11)
       .fillColor('#333')
       .text('Projeto:', 50, yPos)
       .fillColor('#000')
       .text(contract.project_title, 200, yPos, { width: 345 });

    yPos += 40;
    doc.fillColor('#333')
       .text('Detalhes:', 50, yPos);
    
    yPos += 20;
    doc.fillColor('#000')
       .fontSize(10)
       .text(contract.project_description || 'Serviço prestado conforme especificado no contrato.', 50, yPos, { 
         width: 495,
         align: 'justify'
       });

    // Valor
    yPos += 80;
    doc.fontSize(14)
       .fillColor('#2563eb')
       .text('VALOR DO SERVIÇO', 50, yPos);

    yPos += 25;
    doc.fontSize(18)
       .fillColor('#059669')
       .text(`R$ ${parseFloat(contract.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 50, yPos);

    // Observações
    yPos += 50;
    doc.fontSize(10)
       .fillColor('#666')
       .text('OBSERVAÇÕES:', 50, yPos)
       .text('• Este comprovante não substitui a Nota Fiscal eletrônica (NF-e).', 50, yPos + 20)
       .text('• Para emissão de NF-e, entre em contato com o Contratante/Prestador via chat.', 50, yPos + 35)
       .text('• Este documento serve como comprovante de recebimento do serviço prestado.', 50, yPos + 50);

    // Footer
    doc.fontSize(8)
       .fillColor('#999')
       .text(
         'Documento gerado eletronicamente pela plataforma Kaddesh em ' + new Date().toLocaleString('pt-BR'),
         50,
         750,
         { align: 'center', width: 495 }
       );

    // Finalizar PDF
    doc.end();

  } catch (error) {
    console.error('Erro ao gerar comprovante de contrato:', error);
    res.status(500).json({ error: 'Erro ao gerar comprovante' });
  }
});

/**
 * @route   GET /api/receipts/transaction/:id
 * @desc    Gera PDF de comprovante RPA para transação de carteira
 * @access  Private
 */
router.get('/transaction/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Buscar transação
    const query = `
      SELECT 
        t.*,
        u.name as user_name,
        u.email as user_email,
        u.cpf as user_cpf
      FROM wallet_transactions t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = $1 AND u.id = $2
    `;

    const result = await db.query(query, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    const transaction = result.rows[0];

    // Criar PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Configurar headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Comprovante-Transacao-${transaction.id}.pdf`
    );

    doc.pipe(res);

    // Header
    doc.fontSize(20)
       .fillColor('#2563eb')
       .text('KADDESH', 50, 50)
       .fontSize(10)
       .fillColor('#666')
       .text('Plataforma de Freelance e Leilões Reversos', 50, 75);

    // Título
    doc.fontSize(16)
       .fillColor('#000')
       .text('COMPROVANTE DE TRANSAÇÃO', 50, 120, { align: 'center' });

    // Linha separadora
    doc.moveTo(50, 150)
       .lineTo(545, 150)
       .strokeColor('#2563eb')
       .stroke();

    // Informações da transação
    let yPos = 170;

    doc.fontSize(12)
       .fillColor('#333')
       .text('Número do Comprovante:', 50, yPos)
       .fillColor('#000')
       .text(`#${transaction.id}`, 250, yPos);

    yPos += 25;
    doc.fillColor('#333')
       .text('Data da Transação:', 50, yPos)
       .fillColor('#000')
       .text(new Date(transaction.created_at).toLocaleString('pt-BR'), 250, yPos);

    yPos += 25;
    doc.fillColor('#333')
       .text('Tipo:', 50, yPos)
       .fillColor('#000')
       .text(transaction.type === 'credit' ? 'CRÉDITO' : 'DÉBITO', 250, yPos);

    yPos += 25;
    doc.fillColor('#333')
       .text('Status:', 50, yPos)
       .fillColor(transaction.status === 'completed' ? '#059669' : '#dc2626')
       .text(transaction.status.toUpperCase(), 250, yPos);

    // Dados do Usuário
    yPos += 40;
    doc.fontSize(14)
       .fillColor('#2563eb')
       .text('DADOS DO TITULAR', 50, yPos);

    yPos += 25;
    doc.fontSize(11)
       .fillColor('#333')
       .text('Nome:', 50, yPos)
       .fillColor('#000')
       .text(transaction.user_name, 250, yPos);

    yPos += 20;
    doc.fillColor('#333')
       .text('E-mail:', 50, yPos)
       .fillColor('#000')
       .text(transaction.user_email, 250, yPos);

    if (transaction.user_cpf) {
      yPos += 20;
      doc.fillColor('#333')
         .text('CPF:', 50, yPos)
         .fillColor('#000')
         .text(transaction.user_cpf, 250, yPos);
    }

    // Descrição
    yPos += 40;
    doc.fontSize(14)
       .fillColor('#2563eb')
       .text('DESCRIÇÃO', 50, yPos);

    yPos += 25;
    doc.fontSize(11)
       .fillColor('#000')
       .text(transaction.description || 'Transação de carteira', 50, yPos, { width: 495 });

    // Valor
    yPos += 60;
    doc.fontSize(14)
       .fillColor('#2563eb')
       .text('VALOR', 50, yPos);

    yPos += 25;
    const valueColor = transaction.type === 'credit' ? '#059669' : '#dc2626';
    const valuePrefix = transaction.type === 'credit' ? '+' : '-';
    
    doc.fontSize(18)
       .fillColor(valueColor)
       .text(
         `${valuePrefix} R$ ${parseFloat(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
         50,
         yPos
       );

    // Observações
    yPos += 80;
    doc.fontSize(10)
       .fillColor('#666')
       .text('OBSERVAÇÕES:', 50, yPos)
       .text('• Este comprovante é válido para fins de controle interno.', 50, yPos + 20)
       .text('• Guarde este comprovante para suas referências financeiras.', 50, yPos + 35);

    // Footer
    doc.fontSize(8)
       .fillColor('#999')
       .text(
         'Documento gerado eletronicamente pela plataforma Kaddesh em ' + new Date().toLocaleString('pt-BR'),
         50,
         750,
         { align: 'center', width: 495 }
       );

    doc.end();

  } catch (error) {
    console.error('Erro ao gerar comprovante de transação:', error);
    res.status(500).json({ error: 'Erro ao gerar comprovante' });
  }
});

module.exports = router;

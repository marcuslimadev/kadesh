const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');
const { getIO } = require('../utils/socket');

// GET /api/messages/contract/:contractId?limit=50&before=<iso>
router.get('/contract/:contractId', auth, async (req, res) => {
  try {
    const { contractId } = req.params;
    const { before, limit } = req.query;
    const userId = req.user.userId;

    // Check membership
    const c = await db.query(
      'SELECT client_id, provider_id FROM contracts WHERE id = $1 AND (client_id = $2 OR provider_id = $2) LIMIT 1',
      [contractId, userId]
    );
    if (c.rows.length === 0) return res.status(403).json({ error: 'Acesso negado' });

    const pageSize = Math.min(parseInt(limit) || 50, 100);

    let query = `SELECT id, contract_id, sender_id, receiver_id, content, attachment_url, is_read, is_system_message, created_at
                 FROM messages
                 WHERE contract_id = $1`;
    const params = [contractId];

    if (before) {
      query += ' AND created_at < $2';
      params.push(new Date(before));
    }

    query += ' ORDER BY created_at DESC LIMIT ' + pageSize;

    const result = await db.query(query, params);

    // Return ascending to render naturally
    const items = result.rows.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));

    res.json({ success: true, messages: items });
  } catch (error) {
    console.error('Error listing messages:', error);
    res.status(500).json({ error: 'Erro ao carregar mensagens' });
  }
});

// POST /api/messages
router.post('/', auth, async (req, res) => {
  try {
    const { contract_id, content } = req.body;
    const senderId = req.user.userId;

    if (!contract_id || !content || !content.trim()) {
      return res.status(400).json({ error: 'contract_id e content são obrigatórios' });
    }

    // Validate membership and resolve receiver
    const ctr = await db.query('SELECT client_id, provider_id FROM contracts WHERE id = $1', [contract_id]);
    if (ctr.rows.length === 0) return res.status(404).json({ error: 'Contrato não encontrado' });
    const { client_id, provider_id } = ctr.rows[0];
    if (![client_id, provider_id].includes(senderId)) return res.status(403).json({ error: 'Acesso negado' });

    const receiverId = senderId === client_id ? provider_id : client_id;

    const ins = await db.query(
      `INSERT INTO messages (contract_id, sender_id, receiver_id, content, is_system_message)
       VALUES ($1, $2, $3, $4, FALSE)
       RETURNING id, contract_id, sender_id, receiver_id, content, attachment_url, is_read, is_system_message, created_at`,
      [contract_id, senderId, receiverId, content.trim()]
    );

    // Emit via socket.io
    const io = getIO();
    if (io) {
      io.to(`contract:${contract_id}`).emit('message:new', ins.rows[0]);
    }

    res.status(201).json({ success: true, message: ins.rows[0] });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const adminAuth = require('../middleware/adminAuth');

// GET /api/advertisements - Lista anúncios públicos (ativos)
router.get('/', async (req, res) => {
  try {
    const { position } = req.query;
    
    let query = `
      SELECT id, title, description, link_url, image_url, position, slot, 
             impression_count, click_count
      FROM advertisements 
      WHERE is_active = TRUE 
        AND (start_date IS NULL OR start_date <= NOW())
        AND (end_date IS NULL OR end_date >= NOW())
    `;
    
    const params = [];
    if (position) {
      query += ' AND position = $1';
      params.push(position);
    }
    
    query += ' ORDER BY slot ASC, created_at DESC';
    
    const result = await pool.query(query, params);
    
    // Incrementar impressões
    if (result.rows.length > 0) {
      const ids = result.rows.map(ad => ad.id);
      await pool.query(
        'UPDATE advertisements SET impression_count = impression_count + 1 WHERE id = ANY($1)',
        [ids]
      );
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar anúncios:', error);
    res.status(500).json({ error: 'Erro ao buscar anúncios' });
  }
});

// POST /api/advertisements/:id/click - Registrar clique
router.post('/:id/click', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query(
      'UPDATE advertisements SET click_count = click_count + 1 WHERE id = $1',
      [id]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao registrar clique:', error);
    res.status(500).json({ error: 'Erro ao registrar clique' });
  }
});

// GET /api/advertisements/admin - Lista todos os anúncios (admin)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, ad.username as created_by_username
      FROM advertisements a
      LEFT JOIN admin_users ad ON a.created_by = ad.id
      ORDER BY a.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar anúncios (admin):', error);
    res.status(500).json({ error: 'Erro ao buscar anúncios' });
  }
});

// GET /api/advertisements/admin/:id - Busca anúncio específico (admin)
router.get('/admin/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM advertisements WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Anúncio não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar anúncio:', error);
    res.status(500).json({ error: 'Erro ao buscar anúncio' });
  }
});

// POST /api/advertisements/admin - Criar novo anúncio (admin)
router.post('/admin', adminAuth, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      link_url, 
      image_url, 
      position, 
      slot, 
      is_active,
      start_date,
      end_date
    } = req.body;
    
    // Validações
    if (!title || !description) {
      return res.status(400).json({ error: 'Título e descrição são obrigatórios' });
    }
    
    if (position && !['left', 'right'].includes(position)) {
      return res.status(400).json({ error: 'Posição deve ser "left" ou "right"' });
    }
    
    if (slot && (slot < 1 || slot > 10)) {
      return res.status(400).json({ error: 'Slot deve ser entre 1 e 10' });
    }
    
    const result = await pool.query(`
      INSERT INTO advertisements (
        title, description, link_url, image_url, position, slot, 
        is_active, start_date, end_date, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      title,
      description,
      link_url || null,
      image_url || null,
      position || 'left',
      slot || 1,
      is_active !== false,
      start_date || null,
      end_date || null,
      req.admin.id
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar anúncio:', error);
    res.status(500).json({ error: 'Erro ao criar anúncio' });
  }
});

// PUT /api/advertisements/admin/:id - Atualizar anúncio (admin)
router.put('/admin/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      link_url, 
      image_url, 
      position, 
      slot, 
      is_active,
      start_date,
      end_date
    } = req.body;
    
    // Validações
    if (!title || !description) {
      return res.status(400).json({ error: 'Título e descrição são obrigatórios' });
    }
    
    if (position && !['left', 'right'].includes(position)) {
      return res.status(400).json({ error: 'Posição deve ser "left" ou "right"' });
    }
    
    if (slot && (slot < 1 || slot > 10)) {
      return res.status(400).json({ error: 'Slot deve ser entre 1 e 10' });
    }
    
    const result = await pool.query(`
      UPDATE advertisements 
      SET 
        title = $1,
        description = $2,
        link_url = $3,
        image_url = $4,
        position = $5,
        slot = $6,
        is_active = $7,
        start_date = $8,
        end_date = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `, [
      title,
      description,
      link_url || null,
      image_url || null,
      position || 'left',
      slot || 1,
      is_active !== false,
      start_date || null,
      end_date || null,
      id
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Anúncio não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar anúncio:', error);
    res.status(500).json({ error: 'Erro ao atualizar anúncio' });
  }
});

// DELETE /api/advertisements/admin/:id - Deletar anúncio (admin)
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM advertisements WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Anúncio não encontrado' });
    }
    
    res.json({ success: true, message: 'Anúncio deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar anúncio:', error);
    res.status(500).json({ error: 'Erro ao deletar anúncio' });
  }
});

// PATCH /api/advertisements/admin/:id/toggle - Ativar/Desativar anúncio (admin)
router.patch('/admin/:id/toggle', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      UPDATE advertisements 
      SET is_active = NOT is_active, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Anúncio não encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao alternar status do anúncio:', error);
    res.status(500).json({ error: 'Erro ao alternar status do anúncio' });
  }
});

module.exports = router;

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const auth = require('../middleware/auth');
const { validateProjectData } = require('../utils/validators');

const router = express.Router();

// Encerrar automaticamente projetos cujo prazo já venceu
const closeExpiredProjects = async () => {
  try {
    const result = await db.query(`
      SELECT id
      FROM projects
      WHERE status = 'open'
        AND deadline IS NOT NULL
        AND deadline <= NOW()
    `);

    if (result.rows.length === 0) return;

    for (const row of result.rows) {
      const projectId = row.id;

      // Seleciona o menor lance pendente para o projeto
      const bidsResult = await db.query(`
        SELECT id
        FROM bids
        WHERE project_id = $1
          AND status = 'pending'
        ORDER BY amount ASC
        LIMIT 1
      `, [projectId]);

      // Se não há lances pendentes, apenas fecha o projeto
      if (bidsResult.rows.length === 0) {
        await db.query(
          'UPDATE projects SET status = $2, updated_at = NOW() WHERE id = $1',
          [projectId, 'closed']
        );
        continue;
      }

      const winningBidId = bidsResult.rows[0].id;

      // Reaproveita a lógica de aceitar proposta via transação
      try {
        await db.transaction(async (client) => {
          const bidData = await client.query(`
            SELECT 
              b.*,
              p.client_id
            FROM bids b
            JOIN projects p ON b.project_id = p.id
            WHERE b.id = $1
          `, [winningBidId]);

          if (bidData.rows.length === 0) {
            await client.query(
              'UPDATE projects SET status = $2, updated_at = NOW() WHERE id = $1',
              [projectId, 'closed']
            );
            return;
          }

          const bid = bidData.rows[0];

          // Aceita o lance vencedor
          await client.query(
            'UPDATE bids SET status = $2, updated_at = NOW() WHERE id = $1',
            [winningBidId, 'accepted']
          );

          // Rejeita os demais lances do projeto
          await client.query(
            'UPDATE bids SET status = $2, updated_at = NOW() WHERE project_id = $3 AND id != $1',
            [winningBidId, 'rejected', projectId]
          );

          // Atualiza status do projeto para in_progress
          await client.query(
            'UPDATE projects SET status = $2, updated_at = NOW() WHERE id = $1',
            [projectId, 'in_progress']
          );

          // Cria contrato para o vencedor
          await client.query(`
            INSERT INTO contracts (
              project_id, client_id, provider_id, bid_id, amount,
              status, start_date, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, 'in_progress', NOW(), NOW(), NOW())
          `, [
            bid.project_id,
            bid.client_id,
            bid.provider_id,
            winningBidId,
            bid.amount
          ]);
        });
      } catch (innerError) {
        console.error('Erro ao encerrar leilão automaticamente para projeto', projectId, innerError);
      }
    }
  } catch (error) {
    console.error('Erro ao buscar projetos expirados:', error);
  }
};

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_UPLOAD_SIZE, 10) || (5 * 1024 * 1024);
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
  'video/webm'
];

const attachmentsDir = path.join(__dirname, '..', 'uploads', 'project-attachments');
fs.mkdirSync(attachmentsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, attachmentsDir),
  filename: (_, file, cb) => {
    const timestamp = Date.now();
    const randomPart = Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname) || '';
    cb(null, `${timestamp}-${randomPart}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('Formato de arquivo não suportado. Envie imagens ou PDFs.'));
    }
    cb(null, true);
  }
});

const removeLocalFile = async (filePath) => {
  if (!filePath) return;
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('Não foi possível remover arquivo temporário:', error.message);
    }
  }
};

// Get all projects (with filters)
router.get('/', async (req, res) => {
  try {
    await closeExpiredProjects();
    const { 
      category, 
      budget_min, 
      budget_max, 
      status = 'open',
      limit = 20, 
      offset = 0,
      search,
      page,
      per_page
    } = req.query;

    const effectiveLimit = per_page ? parseInt(per_page) : parseInt(limit);
    const effectiveOffset = page ? (parseInt(page) - 1) * effectiveLimit : parseInt(offset);

    const categoryMap = {
      'desenvolvimento-web': 'Desenvolvimento Web',
      'design': 'Design',
      'marketing': 'Marketing',
      'redacao': 'Redação',
      'mobile': 'Mobile',
      'consultoria': 'Consultoria',
      'outros': 'Outros'
    };
    const normalizedCategory = categoryMap[category] || category;

    let query = `
      SELECT 
        p.*,
        u.name as client_name,
        u.email as client_email,
        COALESCE(b_data.bid_count, 0) as bid_count,
        b_data.lowest_bid_amount,
        COALESCE(attachment_data.attachments, '[]'::json) as attachments
      FROM projects p
      JOIN users u ON p.client_id = u.id
        LEFT JOIN LATERAL (
          SELECT 
            COUNT(*)::int as bid_count,
            MIN(b.amount) as lowest_bid_amount
          FROM bids b
          WHERE b.project_id = p.id
        ) b_data ON true
      LEFT JOIN LATERAL (
        SELECT json_agg(
          json_build_object(
            'id', pa.id,
            'file_url', pa.file_url,
            'original_name', pa.original_name,
            'mime_type', pa.mime_type,
            'file_size', pa.file_size,
            'created_at', pa.created_at
          ) ORDER BY pa.created_at ASC
        ) as attachments
        FROM project_attachments pa
        WHERE pa.project_id = p.id
      ) attachment_data ON true
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 0;

    if (status) {
      query += ` AND p.status = $${++paramCount}`;
      params.push(status);
    }

    if (normalizedCategory) {
      query += ` AND p.category = $${++paramCount}`;
      params.push(normalizedCategory);
    }

    if (budget_min) {
      query += ` AND p.budget >= $${++paramCount}`;
      params.push(parseFloat(budget_min));
    }

    if (budget_max) {
      query += ` AND p.budget <= $${++paramCount}`;
      params.push(parseFloat(budget_max));
    }

    if (search) {
      query += ` AND (p.title ILIKE $${++paramCount} OR p.description ILIKE $${++paramCount})`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += `
      ORDER BY p.created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;
    params.push(effectiveLimit, effectiveOffset);

    const result = await db.query(
      `SELECT *, COUNT(*) OVER() AS total_count FROM (${query}) sub`,
      params
    );

    const total = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;

    res.json({
      projects: result.rows,
      total,
      limit: effectiveLimit,
      offset: effectiveOffset,
      total_pages: effectiveLimit ? Math.ceil(total / effectiveLimit) : 1
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Handler para "meus projetos" - DEVE vir ANTES de /:id
const getMyProjectsHandler = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, limit = 20, offset = 0 } = req.query;

    let query = `
      SELECT 
        p.*,
        u.name as client_name,
        u.email as client_email,
          COALESCE(b_data.bid_count, 0) as bid_count,
          b_data.lowest_bid_amount,
        COALESCE(attachment_data.attachments, '[]'::json) as attachments
      FROM projects p
      JOIN users u ON p.client_id = u.id
        LEFT JOIN LATERAL (
          SELECT 
            COUNT(*)::int as bid_count,
            MIN(b.amount) as lowest_bid_amount
          FROM bids b
          WHERE b.project_id = p.id
        ) b_data ON true
      LEFT JOIN LATERAL (
        SELECT json_agg(
          json_build_object(
            'id', pa.id,
            'file_url', pa.file_url,
            'original_name', pa.original_name,
            'mime_type', pa.mime_type,
            'file_size', pa.file_size,
            'created_at', pa.created_at
          ) ORDER BY pa.created_at ASC
        ) as attachments
        FROM project_attachments pa
        WHERE pa.project_id = p.id
      ) attachment_data ON true
      WHERE p.client_id = $1
    `;
    
    const params = [userId];
    let paramCount = 1;

    if (status) {
      query += ` AND p.status = $${++paramCount}`;
      params.push(status);
    }

    query += `
      ORDER BY p.created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    res.json({
      projects: result.rows,
      total: result.rowCount,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('❌ [My Projects] Error:', error.message);
    res.status(500).json({
      error: 'Erro ao carregar projetos',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Rotas específicas ANTES da rota genérica /:id
router.get('/my-projects', auth, getMyProjectsHandler);
router.get('/user/my-projects', auth, getMyProjectsHandler);

router.get('/:id/attachments', async (req, res) => {
  try {
    const { id } = req.params;
    const attachmentsResult = await db.query(
      `SELECT id, filename, original_name, file_url, file_size, mime_type, uploaded_by, created_at
       FROM project_attachments
       WHERE project_id = $1
       ORDER BY created_at ASC`,
      [id]
    );

    res.json({
      attachments: attachmentsResult.rows || []
    });
  } catch (error) {
    console.error('Erro ao listar anexos:', error);
    res.status(500).json({ error: 'Erro ao carregar anexos' });
  }
});

router.post('/:id/attachments', auth, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      const message = err instanceof multer.MulterError
        ? (err.code === 'LIMIT_FILE_SIZE'
          ? 'Arquivo excede o tamanho máximo permitido'
          : 'Erro ao processar upload')
        : err.message || 'Erro ao enviar arquivo';
      return res.status(400).json({ error: message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { id } = req.params;

    try {
      const projectResult = await db.query(
        'SELECT client_id FROM projects WHERE id = $1',
        [id]
      );

      if (projectResult.rows.length === 0) {
        await removeLocalFile(req.file.path);
        return res.status(404).json({ error: 'Projeto não encontrado' });
      }

      if (projectResult.rows[0].client_id !== req.user.userId) {
        await removeLocalFile(req.file.path);
        return res.status(403).json({ error: 'Você não tem permissão para adicionar anexos neste projeto' });
      }

      const relativeUrl = `/uploads/project-attachments/${req.file.filename}`;

      const insertResult = await db.query(
        `INSERT INTO project_attachments (project_id, filename, original_name, file_url, file_size, mime_type, uploaded_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, filename, original_name, file_url, file_size, mime_type, uploaded_by, created_at`,
        [
          id,
          req.file.filename,
          req.file.originalname,
          relativeUrl,
          req.file.size,
          req.file.mimetype,
          req.user.userId
        ]
      );

      res.status(201).json({
        message: 'Anexo enviado com sucesso',
        attachment: insertResult.rows[0]
      });
    } catch (error) {
      await removeLocalFile(req.file.path);
      console.error('Erro ao salvar anexo:', error);
      res.status(500).json({ error: 'Erro ao salvar anexo' });
    }
  });
});

router.delete('/:id/attachments/:attachmentId', auth, async (req, res) => {
  try {
    const { id, attachmentId } = req.params;

    const projectResult = await db.query(
      'SELECT client_id FROM projects WHERE id = $1',
      [id]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    if (projectResult.rows[0].client_id !== req.user.userId) {
      return res.status(403).json({ error: 'Você não tem permissão para remover anexos deste projeto' });
    }

    const attachmentResult = await db.query(
      `SELECT id, filename FROM project_attachments WHERE id = $1 AND project_id = $2`,
      [attachmentId, id]
    );

    if (attachmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Anexo não encontrado' });
    }

    await db.query('DELETE FROM project_attachments WHERE id = $1', [attachmentId]);

    const filePath = path.join(attachmentsDir, attachmentResult.rows[0].filename);
    await removeLocalFile(filePath);

    res.json({ message: 'Anexo removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover anexo:', error);
    res.status(500).json({ error: 'Erro ao remover anexo' });
  }
});

// Get project by ID - DEVE vir DEPOIS das rotas específicas
router.get('/:id', async (req, res) => {
  try {
    await closeExpiredProjects();
    const { id } = req.params;

    const result = await db.query(`
      SELECT 
        p.*,
        u.name as client_name,
        u.email as client_email,
          COALESCE(b_data.bid_count, 0) as bid_count,
          b_data.lowest_bid_amount,
        COALESCE(attachment_data.attachments, '[]'::json) as attachments
      FROM projects p
      JOIN users u ON p.client_id = u.id
        LEFT JOIN LATERAL (
          SELECT 
            COUNT(*)::int as bid_count,
            MIN(b.amount) as lowest_bid_amount
          FROM bids b
          WHERE b.project_id = p.id
        ) b_data ON true
      LEFT JOIN LATERAL (
        SELECT json_agg(
          json_build_object(
            'id', pa.id,
            'file_url', pa.file_url,
            'original_name', pa.original_name,
            'mime_type', pa.mime_type,
            'file_size', pa.file_size,
            'created_at', pa.created_at
          ) ORDER BY pa.created_at ASC
        ) as attachments
        FROM project_attachments pa
        WHERE pa.project_id = p.id
      ) attachment_data ON true
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Projeto não encontrado'
      });
    }

    res.json({
      project: result.rows[0]
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Create project
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      budget,
      estimated_hours,
      deadline,
      requirements,
      skills_required
    } = req.body;

    // Validate project data
    const validation = validateProjectData({
      title,
      description,
      category,
      budget,
      deadline
    });

    if (!validation.isValid) {
      return res.status(400).json({
        error: validation.errors.join(', ')
      });
    }

    // Create project
    const result = await db.query(`
      INSERT INTO projects (
        client_id, title, description, category, budget, estimated_hours, deadline,
        requirements, skills_required, status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'open', NOW(), NOW())
      RETURNING *
    `, [
      req.user.userId,
      title,
      description,
      category,
      parseFloat(budget),
      estimated_hours ? parseInt(estimated_hours) : null,
      deadline,
      requirements || null,
      skills_required || null
    ]);

    res.status(201).json({
      message: 'Projeto criado com sucesso',
      project: result.rows[0]
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      budget,
      deadline,
      requirements,
      skills_required,
      status
    } = req.body;

    // Check if project exists and user owns it
    const projectCheck = await db.query(
      'SELECT client_id FROM projects WHERE id = $1',
      [id]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Projeto não encontrado'
      });
    }

    if (projectCheck.rows[0].client_id !== req.user.userId) {
      return res.status(403).json({
        error: 'Você não tem permissão para editar este projeto'
      });
    }

    // Update project
    const result = await db.query(`
      UPDATE projects SET
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        category = COALESCE($4, category),
        budget = COALESCE($5, budget),
        deadline = COALESCE($6, deadline),
        requirements = COALESCE($7, requirements),
        skills_required = COALESCE($8, skills_required),
        status = COALESCE($9, status),
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [
      id,
      title,
      description,
      category,
      budget ? parseFloat(budget) : null,
      deadline,
      requirements,
      skills_required,
      status
    ]);

    res.json({
      message: 'Projeto atualizado com sucesso',
      project: result.rows[0]
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if project exists and user owns it
    const projectCheck = await db.query(
      'SELECT client_id, status FROM projects WHERE id = $1',
      [id]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Projeto não encontrado'
      });
    }

    const project = projectCheck.rows[0];

    if (project.client_id !== req.user.userId) {
      return res.status(403).json({
        error: 'Você não tem permissão para deletar este projeto'
      });
    }

    // Only allow deletion if project is not in progress or completed
    if (['in_progress', 'completed', 'paid'].includes(project.status)) {
      return res.status(400).json({
        error: 'Não é possível deletar projetos em andamento ou finalizados'
      });
    }

    // Soft delete (update status instead of actually deleting)
    await db.query(
      'UPDATE projects SET status = $2, updated_at = NOW() WHERE id = $1',
      [id, 'deleted']
    );

    res.json({
      message: 'Projeto deletado com sucesso'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Close auction manually
router.post('/:id/close-auction', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { manuallyCloseAuction } = require('../services/auctionScheduler');
    
    const result = await manuallyCloseAuction(id, req.user.userId);
    
    res.json(result);
  } catch (error) {
    console.error('Close auction error:', error);
    
    // Handle specific errors
    if (error.message === 'Projeto não encontrado') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Você não tem permissão para encerrar este leilão') {
      return res.status(403).json({ error: error.message });
    }
    if (error.message === 'Este projeto não está mais em leilão') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({
      error: 'Erro ao encerrar leilão'
    });
  }
});

// Get auctions expiring soon
router.get('/auctions/expiring', auth, async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const { getExpiringAuctions } = require('../services/auctionScheduler');
    
    const auctions = await getExpiringAuctions(parseInt(hours));
    
    res.json({
      auctions,
      total: auctions.length,
      hoursAhead: parseInt(hours)
    });
  } catch (error) {
    console.error('Get expiring auctions error:', error);
    res.status(500).json({
      error: 'Erro ao buscar leilões expirando'
    });
  }
});

module.exports = router;

/**
 * Auction Scheduler Service
 * 
 * Handles automatic auction closure and winner selection
 * when project deadlines expire.
 */

const db = require('../config/database');
const { getIO } = require('../utils/socket');

// Configuration constants
const DEFAULT_CHECK_INTERVAL_MS = 60000; // 1 minute
const MAX_HOURS_AHEAD = 7 * 24; // 7 days in hours

// Interval for checking expired auctions (in milliseconds)
const CHECK_INTERVAL = parseInt(process.env.AUCTION_CHECK_INTERVAL) || DEFAULT_CHECK_INTERVAL_MS;

let intervalId = null;

/**
 * Sanitize string for safe display in notifications
 * @param {string} str - Input string
 * @param {number} maxLength - Maximum length
 * @returns {string} - Sanitized string
 */
function sanitizeForDisplay(str, maxLength = 100) {
  if (!str || typeof str !== 'string') return '';
  
  let result = str;
  
  // Remove complete HTML tags
  let previousResult;
  do {
    previousResult = result;
    result = result.replace(/<[^>]*>/g, '');
  } while (result !== previousResult);
  
  // Remove any remaining angle brackets and quotes
  result = result.replace(/[<>'"]/g, '');
  
  return result.trim().substring(0, maxLength);
}

/**
 * Check for expired auctions and process them
 */
async function processExpiredAuctions() {
  try {
    // Find all open projects with passed deadlines that haven't been processed
    const expiredProjectsResult = await db.query(`
      SELECT 
        p.id,
        p.title,
        p.client_id,
        p.deadline,
        p.budget,
        p.category,
        (SELECT COUNT(*) FROM bids b WHERE b.project_id = p.id AND b.status = 'pending') as bid_count
      FROM projects p
      WHERE p.status = 'open'
        AND p.deadline IS NOT NULL
        AND p.deadline < NOW()
      ORDER BY p.deadline ASC
      LIMIT 50
    `);

    const expiredProjects = expiredProjectsResult.rows;

    if (expiredProjects.length === 0) {
      return { processed: 0 };
    }

    console.log(`🔄 Found ${expiredProjects.length} expired auction(s) to process`);

    let processedCount = 0;
    let errorCount = 0;

    for (const project of expiredProjects) {
      try {
        await closeAuction(project);
        processedCount++;
      } catch (error) {
        console.error(`❌ Error processing auction for project ${project.id}:`, error.message);
        errorCount++;
      }
    }

    console.log(`✅ Processed ${processedCount} auction(s), ${errorCount} error(s)`);
    
    return { processed: processedCount, errors: errorCount };
  } catch (error) {
    console.error('❌ Error in processExpiredAuctions:', error.message);
    throw error;
  }
}

/**
 * Close an auction and select the winner
 * @param {Object} project - The project object
 */
async function closeAuction(project) {
  console.log(`🏁 Closing auction for project: ${project.id} - ${project.title}`);

  await db.transaction(async (client) => {
    // Get all pending bids for this project, sorted by amount (lowest first)
    const bidsResult = await client.query(`
      SELECT 
        b.id,
        b.provider_id,
        b.amount,
        b.proposal,
        b.delivery_time,
        b.created_at,
        u.name as provider_name,
        u.email as provider_email,
        pp.rating,
        pp.total_reviews,
        pp.total_projects
      FROM bids b
      JOIN users u ON b.provider_id = u.id
      LEFT JOIN provider_profiles pp ON u.id = pp.user_id
      WHERE b.project_id = $1 AND b.status = 'pending'
      ORDER BY b.amount ASC, pp.rating DESC NULLS LAST, b.created_at ASC
    `, [project.id]);

    const bids = bidsResult.rows;

    if (bids.length === 0) {
      // No bids received - close auction without winner
      await client.query(
        `UPDATE projects SET status = 'cancelled', updated_at = NOW() WHERE id = $1`,
        [project.id]
      );

      // Notify the client
      const safeTitle = sanitizeForDisplay(project.title);
      await createNotification(client, {
        userId: project.client_id,
        type: 'project',
        title: 'Leilão encerrado sem propostas',
        content: `O leilão do projeto "${safeTitle}" foi encerrado sem propostas recebidas.`,
        actionUrl: `/projects/${project.id}`,
        data: { projectId: project.id, reason: 'no_bids' }
      });

      console.log(`⚠️ Auction closed without bids for project: ${project.id}`);
      return;
    }

    // Select the winner (lowest bid)
    const winnerBid = bids[0];

    // Accept the winning bid
    await client.query(
      `UPDATE bids SET status = 'accepted', updated_at = NOW() WHERE id = $1`,
      [winnerBid.id]
    );

    // Reject all other bids
    await client.query(
      `UPDATE bids SET status = 'rejected', updated_at = NOW() 
       WHERE project_id = $1 AND id != $2 AND status = 'pending'`,
      [project.id, winnerBid.id]
    );

    // Update project status to in_progress
    await client.query(
      `UPDATE projects SET status = 'in_progress', updated_at = NOW() WHERE id = $1`,
      [project.id]
    );

    // Create contract
    await client.query(`
      INSERT INTO contracts (
        project_id, client_id, provider_id, bid_id, amount,
        status, start_date, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, 'in_progress', NOW(), NOW(), NOW())
    `, [
      project.id,
      project.client_id,
      winnerBid.provider_id,
      winnerBid.id,
      winnerBid.amount
    ]);

    // Sanitize user-generated content for notifications
    const safeTitle = sanitizeForDisplay(project.title);
    const safeProviderName = sanitizeForDisplay(winnerBid.provider_name);

    // Notify the winner
    await createNotification(client, {
      userId: winnerBid.provider_id,
      type: 'bid',
      title: '🎉 Parabéns! Você venceu o leilão!',
      content: `Sua proposta de R$ ${formatCurrency(winnerBid.amount)} para o projeto "${safeTitle}" foi aceita automaticamente como vencedora do leilão!`,
      actionUrl: `/projects/${project.id}`,
      data: { projectId: project.id, bidId: winnerBid.id, amount: winnerBid.amount }
    });

    // Notify the client about the winner
    await createNotification(client, {
      userId: project.client_id,
      type: 'project',
      title: 'Leilão encerrado - Vencedor selecionado',
      content: `O leilão do projeto "${safeTitle}" foi encerrado. ${safeProviderName} foi selecionado(a) como vencedor(a) com a proposta de R$ ${formatCurrency(winnerBid.amount)}.`,
      actionUrl: `/projects/${project.id}`,
      data: { projectId: project.id, winnerId: winnerBid.provider_id, bidId: winnerBid.id }
    });

    // Notify rejected bidders
    const rejectedBids = bids.slice(1);
    for (const bid of rejectedBids) {
      await createNotification(client, {
        userId: bid.provider_id,
        type: 'bid',
        title: 'Leilão encerrado',
        content: `O leilão do projeto "${safeTitle}" foi encerrado. Infelizmente, outra proposta foi selecionada.`,
        actionUrl: `/projects/${project.id}`,
        data: { projectId: project.id, bidId: bid.id, status: 'rejected' }
      });
    }

    console.log(`✅ Auction closed for project ${project.id}. Winner: ${safeProviderName} (${winnerBid.id})`);

    // Emit socket event for real-time updates
    emitAuctionClosed(project.id, {
      winnerId: winnerBid.provider_id,
      winnerName: safeProviderName,
      winningAmount: winnerBid.amount,
      totalBids: bids.length
    });
  });
}

/**
 * Create a notification in the database
 */
async function createNotification(client, { userId, type, title, content, actionUrl, data }) {
  await client.query(`
    INSERT INTO notifications (user_id, type, title, content, action_url, data)
    VALUES ($1, $2, $3, $4, $5, $6)
  `, [userId, type, title, content, actionUrl, data ? JSON.stringify(data) : null]);
}

/**
 * Emit socket event when auction is closed
 */
function emitAuctionClosed(projectId, data) {
  try {
    const io = getIO();
    if (io) {
      io.emit('auction:closed', {
        projectId,
        ...data,
        closedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.warn('Socket emit failed:', error.message);
  }
}

/**
 * Format currency for display
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value || 0);
}

/**
 * Start the auction scheduler
 */
function startScheduler() {
  if (intervalId) {
    console.log('⚠️ Auction scheduler is already running');
    return;
  }

  console.log(`🚀 Starting auction scheduler (check interval: ${CHECK_INTERVAL}ms)`);
  
  // Run immediately on start
  processExpiredAuctions().catch(err => {
    console.error('Initial auction check failed:', err.message);
  });

  // Then run at regular intervals
  intervalId = setInterval(() => {
    processExpiredAuctions().catch(err => {
      console.error('Scheduled auction check failed:', err.message);
    });
  }, CHECK_INTERVAL);
}

/**
 * Stop the auction scheduler
 */
function stopScheduler() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('🛑 Auction scheduler stopped');
  }
}

/**
 * Manually close an auction (for API endpoint use)
 * @param {string} projectId - The project ID
 * @param {string} clientId - The client ID (for authorization)
 */
async function manuallyCloseAuction(projectId, clientId) {
  // Verify the project exists and belongs to the client
  const projectResult = await db.query(`
    SELECT 
      p.id,
      p.title,
      p.client_id,
      p.deadline,
      p.budget,
      p.category,
      p.status,
      (SELECT COUNT(*) FROM bids b WHERE b.project_id = p.id AND b.status = 'pending') as bid_count
    FROM projects p
    WHERE p.id = $1
  `, [projectId]);

  if (projectResult.rows.length === 0) {
    throw new Error('Projeto não encontrado');
  }

  const project = projectResult.rows[0];

  if (project.client_id !== clientId) {
    throw new Error('Você não tem permissão para encerrar este leilão');
  }

  if (project.status !== 'open') {
    throw new Error('Este projeto não está mais em leilão');
  }

  await closeAuction(project);
  
  return {
    success: true,
    message: 'Leilão encerrado com sucesso'
  };
}

/**
 * Get auctions that will expire soon
 * @param {number} hoursAhead - How many hours ahead to check
 */
async function getExpiringAuctions(hoursAhead = 24) {
  // Ensure hoursAhead is a valid positive number
  const hours = Math.max(1, Math.min(parseInt(hoursAhead) || 24, MAX_HOURS_AHEAD));
  
  const result = await db.query(`
    SELECT 
      p.id,
      p.title,
      p.client_id,
      p.deadline,
      p.budget,
      p.category,
      u.name as client_name,
      u.email as client_email,
      (SELECT COUNT(*) FROM bids b WHERE b.project_id = p.id AND b.status = 'pending') as bid_count,
      EXTRACT(EPOCH FROM (p.deadline - NOW()))/3600 as hours_remaining
    FROM projects p
    JOIN users u ON p.client_id = u.id
    WHERE p.status = 'open'
      AND p.deadline IS NOT NULL
      AND p.deadline > NOW()
      AND p.deadline <= NOW() + ($1 || ' hours')::interval
    ORDER BY p.deadline ASC
  `, [hours]);

  return result.rows;
}

module.exports = {
  startScheduler,
  stopScheduler,
  processExpiredAuctions,
  manuallyCloseAuction,
  getExpiringAuctions,
  closeAuction
};

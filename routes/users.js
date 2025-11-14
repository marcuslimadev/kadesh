const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');
const { sanitizeInput } = require('../utils/validators');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        u.id, u.name, u.email, u.type, u.status, u.avatar_url, u.phone,
        u.bio, u.website, u.location, u.timezone, u.language, u.created_at,
        pp.title, pp.hourly_rate, pp.skills, pp.experience_years,
        pp.portfolio_url, pp.github_url, pp.linkedin_url, pp.availability,
        pp.rating, pp.total_reviews, pp.total_projects, pp.total_earnings,
        pp.response_time_hours
      FROM users u
      LEFT JOIN provider_profiles pp ON u.id = pp.user_id
      WHERE u.id = $1
    `, [req.user.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        status: user.status,
        avatar_url: user.avatar_url,
        phone: user.phone,
        bio: user.bio,
        website: user.website,
        location: user.location,
        timezone: user.timezone,
        language: user.language,
        created_at: user.created_at,
        provider_profile: user.type === 'provider' ? {
          title: user.title,
          hourly_rate: user.hourly_rate,
          skills: user.skills,
          experience_years: user.experience_years,
          portfolio_url: user.portfolio_url,
          github_url: user.github_url,
          linkedin_url: user.linkedin_url,
          availability: user.availability,
          rating: user.rating,
          total_reviews: user.total_reviews,
          total_projects: user.total_projects,
          total_earnings: user.total_earnings,
          response_time_hours: user.response_time_hours
        } : null
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      name,
      phone,
      bio,
      website,
      location,
      timezone,
      language,
      // Provider profile fields
      title,
      hourly_rate,
      skills,
      experience_years,
      portfolio_url,
      github_url,
      linkedin_url,
      availability
    } = req.body;

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      phone: sanitizeInput(phone),
      bio: sanitizeInput(bio),
      website: sanitizeInput(website),
      location: sanitizeInput(location),
      timezone: sanitizeInput(timezone),
      language: sanitizeInput(language)
    };

    // Update user table
    const userResult = await db.query(`
      UPDATE users SET
        name = COALESCE($2, name),
        phone = COALESCE($3, phone),
        bio = COALESCE($4, bio),
        website = COALESCE($5, website),
        location = COALESCE($6, location),
        timezone = COALESCE($7, timezone),
        language = COALESCE($8, language),
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [
      req.user.userId,
      sanitizedData.name,
      sanitizedData.phone,
      sanitizedData.bio,
      sanitizedData.website,
      sanitizedData.location,
      sanitizedData.timezone,
      sanitizedData.language
    ]);

    const user = userResult.rows[0];
    let providerProfile = null;

    // Update provider profile if user is a provider
    if (user.type === 'provider') {
      // Check if provider profile exists
      const existingProfile = await db.query(
        'SELECT id FROM provider_profiles WHERE user_id = $1',
        [req.user.userId]
      );

      if (existingProfile.rows.length === 0) {
        // Create provider profile
        const profileResult = await db.query(`
          INSERT INTO provider_profiles (
            user_id, title, hourly_rate, skills, experience_years,
            portfolio_url, github_url, linkedin_url, availability,
            created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
          RETURNING *
        `, [
          req.user.userId,
          sanitizeInput(title),
          hourly_rate ? parseFloat(hourly_rate) : null,
          skills || null,
          experience_years ? parseInt(experience_years) : null,
          sanitizeInput(portfolio_url),
          sanitizeInput(github_url),
          sanitizeInput(linkedin_url),
          availability || 'available'
        ]);
        providerProfile = profileResult.rows[0];
      } else {
        // Update existing provider profile
        const profileResult = await db.query(`
          UPDATE provider_profiles SET
            title = COALESCE($2, title),
            hourly_rate = COALESCE($3, hourly_rate),
            skills = COALESCE($4, skills),
            experience_years = COALESCE($5, experience_years),
            portfolio_url = COALESCE($6, portfolio_url),
            github_url = COALESCE($7, github_url),
            linkedin_url = COALESCE($8, linkedin_url),
            availability = COALESCE($9, availability),
            updated_at = NOW()
          WHERE user_id = $1
          RETURNING *
        `, [
          req.user.userId,
          sanitizeInput(title),
          hourly_rate ? parseFloat(hourly_rate) : null,
          skills || null,
          experience_years ? parseInt(experience_years) : null,
          sanitizeInput(portfolio_url),
          sanitizeInput(github_url),
          sanitizeInput(linkedin_url),
          availability
        ]);
        providerProfile = profileResult.rows[0];
      }
    }

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        phone: user.phone,
        bio: user.bio,
        website: user.website,
        location: user.location,
        timezone: user.timezone,
        language: user.language,
        provider_profile: providerProfile
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Get public profile by ID
router.get('/:id/public', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT 
        u.id, u.name, u.type, u.avatar_url, u.bio, u.website, u.location,
        u.created_at,
        pp.title, pp.skills, pp.experience_years, pp.portfolio_url,
        pp.github_url, pp.linkedin_url, pp.rating, pp.total_reviews,
        pp.total_projects, pp.response_time_hours
      FROM users u
      LEFT JOIN provider_profiles pp ON u.id = pp.user_id
      WHERE u.id = $1 AND u.status = 'active'
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        name: user.name,
        type: user.type,
        avatar_url: user.avatar_url,
        bio: user.bio,
        website: user.website,
        location: user.location,
        created_at: user.created_at,
        provider_profile: user.type === 'provider' ? {
          title: user.title,
          skills: user.skills,
          experience_years: user.experience_years,
          portfolio_url: user.portfolio_url,
          github_url: user.github_url,
          linkedin_url: user.linkedin_url,
          rating: user.rating,
          total_reviews: user.total_reviews,
          total_projects: user.total_projects,
          response_time_hours: user.response_time_hours
        } : null
      }
    });

  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Search providers
router.get('/providers/search', async (req, res) => {
  try {
    const {
      skills,
      rating_min = 0,
      hourly_rate_min,
      hourly_rate_max,
      availability = 'available',
      search,
      limit = 20,
      offset = 0
    } = req.query;

    let query = `
      SELECT 
        u.id, u.name, u.avatar_url, u.bio, u.location,
        pp.title, pp.hourly_rate, pp.skills, pp.experience_years,
        pp.rating, pp.total_reviews, pp.total_projects,
        pp.response_time_hours
      FROM users u
      JOIN provider_profiles pp ON u.id = pp.user_id
      WHERE u.type = 'provider' AND u.status = 'active'
    `;

    const params = [];
    let paramCount = 0;

    if (availability) {
      query += ` AND pp.availability = $${++paramCount}`;
      params.push(availability);
    }

    if (rating_min) {
      query += ` AND pp.rating >= $${++paramCount}`;
      params.push(parseFloat(rating_min));
    }

    if (hourly_rate_min) {
      query += ` AND pp.hourly_rate >= $${++paramCount}`;
      params.push(parseFloat(hourly_rate_min));
    }

    if (hourly_rate_max) {
      query += ` AND pp.hourly_rate <= $${++paramCount}`;
      params.push(parseFloat(hourly_rate_max));
    }

    if (skills) {
      query += ` AND pp.skills && $${++paramCount}`;
      params.push(Array.isArray(skills) ? skills : [skills]);
    }

    if (search) {
      query += ` AND (u.name ILIKE $${++paramCount} OR pp.title ILIKE $${++paramCount} OR u.bio ILIKE $${++paramCount})`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      paramCount += 2;
    }

    query += `
      ORDER BY pp.rating DESC, pp.total_reviews DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    res.json({
      providers: result.rows,
      total: result.rowCount,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Search providers error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Get user's dashboard stats
router.get('/dashboard/stats', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.type;

    let stats = {};

    if (userType === 'client') {
      // Client stats
      const projectsResult = await db.query(`
        SELECT 
          COUNT(*) as total_projects,
          COUNT(*) FILTER (WHERE status = 'open') as open_projects,
          COUNT(*) FILTER (WHERE status = 'in_progress') as active_projects,
          COUNT(*) FILTER (WHERE status = 'completed') as completed_projects
        FROM projects WHERE client_id = $1 AND status != 'deleted'
      `, [userId]);

      const bidsResult = await db.query(`
        SELECT COUNT(*) as total_bids
        FROM bids b
        JOIN projects p ON b.project_id = p.id
        WHERE p.client_id = $1 AND b.status = 'pending'
      `, [userId]);

      stats = {
        ...projectsResult.rows[0],
        pending_bids: parseInt(bidsResult.rows[0].total_bids)
      };
    } else if (userType === 'provider') {
      // Provider stats
      const bidsResult = await db.query(`
        SELECT 
          COUNT(*) as total_bids,
          COUNT(*) FILTER (WHERE status = 'pending') as pending_bids,
          COUNT(*) FILTER (WHERE status = 'accepted') as accepted_bids
        FROM bids WHERE provider_id = $1 AND status != 'withdrawn'
      `, [userId]);

      const contractsResult = await db.query(`
        SELECT 
          COUNT(*) as total_contracts,
          COUNT(*) FILTER (WHERE status = 'in_progress') as active_contracts,
          COUNT(*) FILTER (WHERE status = 'completed') as completed_contracts,
          COALESCE(SUM(amount) FILTER (WHERE status = 'completed'), 0) as total_earnings
        FROM contracts WHERE provider_id = $1
      `, [userId]);

      stats = {
        ...bidsResult.rows[0],
        ...contractsResult.rows[0]
      };
    }

    res.json({ stats });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
const jwt = require('jsonwebtoken');

// Admin authentication middleware
const adminAuth = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if it's an admin token (has adminId instead of userId)
    if (!decoded.adminId) {
      return res.status(403).json({ error: 'Acesso negado: credenciais de administrador necessárias' });
    }

    // Attach admin info to request
    req.admin = {
      adminId: decoded.adminId,
      role: decoded.role,
      permissions: decoded.permissions || {}
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    
    console.error('Admin auth middleware error:', error);
    return res.status(500).json({ error: 'Erro ao validar autenticação' });
  }
};

// Middleware to check for specific permissions
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    // Super admins have all permissions
    if (req.admin.role === 'super_admin') {
      return next();
    }

    // Check if admin has the required permission
    if (!req.admin.permissions[permission]) {
      return res.status(403).json({ error: 'Permissão negada' });
    }

    next();
  };
};

// Middleware to check for super admin role
const requireSuperAdmin = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  if (req.admin.role !== 'super_admin') {
    return res.status(403).json({ error: 'Acesso negado: apenas super administradores' });
  }

  next();
};

module.exports = adminAuth;
module.exports.requirePermission = requirePermission;
module.exports.requireSuperAdmin = requireSuperAdmin;

const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Token de acceso requerido',
      message: 'Debe proporcionar un token de autenticación válido'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'eame_secret_key_2024', (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Token inválido',
        message: 'El token proporcionado no es válido o ha expirado'
      });
    }

    // Verificar que el usuario aún existe y está activo
    const currentUser = db.findUserById(user.id);
    if (!currentUser || !currentUser.activo) {
      return res.status(403).json({ 
        error: 'Usuario inactivo',
        message: 'El usuario asociado al token no está activo'
      });
    }

    req.user = user;
    next();
  });
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'No autenticado',
        message: 'Debe estar autenticado para acceder a este recurso'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        message: `Requiere uno de los siguientes roles: ${roles.join(', ')}`
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};
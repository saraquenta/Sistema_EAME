const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login - Iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar datos de entrada
    if (!email || !password) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario por email
    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Verificar que el usuario esté activo
    if (!user.activo) {
      return res.status(403).json({
        error: 'Usuario inactivo',
        message: 'Su cuenta ha sido desactivada. Contacte al administrador'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        nombre_completo: user.nombre_completo
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Respuesta exitosa (sin incluir la contraseña)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al procesar el inicio de sesión'
    });
  }
});

// GET /api/auth/me - Obtener información del usuario actual
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'El usuario no existe en el sistema'
      });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener información del usuario'
    });
  }
});

// POST /api/auth/logout - Cerrar sesión (opcional, para invalidar token en el cliente)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    message: 'Sesión cerrada exitosamente'
  });
});

// POST /api/auth/refresh - Renovar token
router.post('/refresh', authenticateToken, (req, res) => {
  try {
    const user = db.getUserById(req.user.id);
    if (!user || !user.activo) {
      return res.status(403).json({
        error: 'Usuario inactivo',
        message: 'No se puede renovar el token para un usuario inactivo'
      });
    }

    // Generar nuevo token
    const newToken = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        nombre_completo: user.nombre_completo
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Token renovado exitosamente',
      token: newToken
    });

  } catch (error) {
    console.error('Error al renovar token:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al renovar el token'
    });
  }
});

module.exports = router;
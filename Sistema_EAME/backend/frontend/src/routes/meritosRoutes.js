const express = require('express');
const db = require('../config/database');
const { authenticateToken, requireAdminOrJefe } = require('../middleware/auth');

const router = express.Router();

// GET /api/meritos - Obtener todos los méritos
router.get('/', authenticateToken, (req, res) => {
  try {
    const meritos = db.getMeritos();
    res.json({
      message: 'Méritos obtenidos exitosamente',
      data: meritos,
      total: meritos.length
    });
  } catch (error) {
    console.error('Error al obtener méritos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener la lista de méritos'
    });
  }
});

// POST /api/meritos - Crear nuevo mérito
router.post('/', authenticateToken, requireAdminOrJefe, (req, res) => {
  try {
    const {
      cursante_id,
      tipo,
      gestion,
      justificacion
    } = req.body;

    // Validaciones
    if (!cursante_id || !tipo || !gestion || !justificacion) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Todos los campos obligatorios deben ser proporcionados'
      });
    }

    // Verificar que el cursante existe
    const cursante = db.getCursanteById(cursante_id);
    if (!cursante) {
      return res.status(404).json({
        error: 'Cursante no encontrado',
        message: `No se encontró un cursante con ID: ${cursante_id}`
      });
    }

    const newMerito = {
      id: db.generateId(),
      cursante_id,
      tipo,
      gestion,
      justificacion,
      usuario_id: req.user.id
    };

    db.meritos.push(newMerito);

    res.status(201).json({
      message: 'Mérito creado exitosamente',
      data: newMerito
    });
  } catch (error) {
    console.error('Error al crear mérito:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al crear el mérito'
    });
  }
});

// PUT /api/meritos/:id - Actualizar mérito
router.put('/:id', authenticateToken, requireAdminOrJefe, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const index = db.meritos.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({
        error: 'Mérito no encontrado',
        message: `No se encontró un mérito con ID: ${id}`
      });
    }

    db.meritos[index] = { ...db.meritos[index], ...updates };

    res.json({
      message: 'Mérito actualizado exitosamente',
      data: db.meritos[index]
    });
  } catch (error) {
    console.error('Error al actualizar mérito:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al actualizar el mérito'
    });
  }
});

// DELETE /api/meritos/:id - Eliminar mérito
router.delete('/:id', authenticateToken, requireAdminOrJefe, (req, res) => {
  try {
    const { id } = req.params;

    const index = db.meritos.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({
        error: 'Mérito no encontrado',
        message: `No se encontró un mérito con ID: ${id}`
      });
    }

    const deletedMerito = db.meritos.splice(index, 1)[0];

    res.json({
      message: 'Mérito eliminado exitosamente',
      data: deletedMerito
    });
  } catch (error) {
    console.error('Error al eliminar mérito:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al eliminar el mérito'
    });
  }
});

module.exports = router;
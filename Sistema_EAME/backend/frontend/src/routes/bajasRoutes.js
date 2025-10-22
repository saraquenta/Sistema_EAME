const express = require('express');
const db = require('../config/database');
const { authenticateToken, requireAdminOrJefe } = require('../middleware/auth');

const router = express.Router();

// GET /api/bajas - Obtener todas las bajas
router.get('/', authenticateToken, (req, res) => {
  try {
    const bajas = db.getBajas();
    res.json({
      message: 'Bajas obtenidas exitosamente',
      data: bajas,
      total: bajas.length
    });
  } catch (error) {
    console.error('Error al obtener bajas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener la lista de bajas'
    });
  }
});

// POST /api/bajas - Crear nueva baja
router.post('/', authenticateToken, requireAdminOrJefe, (req, res) => {
  try {
    const {
      cursante_id,
      motivo,
      fecha,
      observaciones
    } = req.body;

    // Validaciones
    if (!cursante_id || !motivo || !fecha || !observaciones) {
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

    const newBaja = {
      id: db.generateId(),
      cursante_id,
      motivo,
      fecha,
      observaciones,
      usuario_id: req.user.id
    };

    db.bajas.push(newBaja);

    // Actualizar el estado del cursante a 'baja'
    db.updateCursante(cursante_id, { estado: 'baja' });

    res.status(201).json({
      message: 'Baja creada exitosamente',
      data: newBaja
    });
  } catch (error) {
    console.error('Error al crear baja:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al crear la baja'
    });
  }
});

// PUT /api/bajas/:id - Actualizar baja
router.put('/:id', authenticateToken, requireAdminOrJefe, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const index = db.bajas.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({
        error: 'Baja no encontrada',
        message: `No se encontró una baja con ID: ${id}`
      });
    }

    db.bajas[index] = { ...db.bajas[index], ...updates };

    res.json({
      message: 'Baja actualizada exitosamente',
      data: db.bajas[index]
    });
  } catch (error) {
    console.error('Error al actualizar baja:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al actualizar la baja'
    });
  }
});

// DELETE /api/bajas/:id - Eliminar baja
router.delete('/:id', authenticateToken, requireAdminOrJefe, (req, res) => {
  try {
    const { id } = req.params;

    const index = db.bajas.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({
        error: 'Baja no encontrada',
        message: `No se encontró una baja con ID: ${id}`
      });
    }

    const deletedBaja = db.bajas.splice(index, 1)[0];

    res.json({
      message: 'Baja eliminada exitosamente',
      data: deletedBaja
    });
  } catch (error) {
    console.error('Error al eliminar baja:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al eliminar la baja'
    });
  }
});

module.exports = router;
const express = require('express');
const db = require('../config/database');
const { authenticateToken, requireAdminOrJefe } = require('../middleware/auth');

const router = express.Router();

// GET /api/actividades - Obtener todas las actividades
router.get('/', authenticateToken, (req, res) => {
  try {
    const actividades = db.getActividades();
    res.json({
      message: 'Actividades obtenidas exitosamente',
      data: actividades,
      total: actividades.length
    });
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener la lista de actividades'
    });
  }
});

// POST /api/actividades - Crear nueva actividad
router.post('/', authenticateToken, requireAdminOrJefe, (req, res) => {
  try {
    const {
      cursante_id,
      tipo_actividad,
      disciplina,
      fecha,
      duracion,
      observaciones,
      periodo_id
    } = req.body;

    // Validaciones
    if (!cursante_id || !tipo_actividad || !disciplina || !fecha || !duracion || !observaciones || !periodo_id) {
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

    const newActividad = {
      id: db.generateId(),
      cursante_id,
      tipo_actividad,
      disciplina,
      fecha,
      duracion,
      observaciones,
      usuario_id: req.user.id,
      periodo_id
    };

    db.actividades.push(newActividad);

    res.status(201).json({
      message: 'Actividad creada exitosamente',
      data: newActividad
    });
  } catch (error) {
    console.error('Error al crear actividad:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al crear la actividad'
    });
  }
});

// PUT /api/actividades/:id - Actualizar actividad
router.put('/:id', authenticateToken, requireAdminOrJefe, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const index = db.actividades.findIndex(a => a.id === id);
    if (index === -1) {
      return res.status(404).json({
        error: 'Actividad no encontrada',
        message: `No se encontró una actividad con ID: ${id}`
      });
    }

    db.actividades[index] = { ...db.actividades[index], ...updates };

    res.json({
      message: 'Actividad actualizada exitosamente',
      data: db.actividades[index]
    });
  } catch (error) {
    console.error('Error al actualizar actividad:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al actualizar la actividad'
    });
  }
});

// DELETE /api/actividades/:id - Eliminar actividad
router.delete('/:id', authenticateToken, requireAdminOrJefe, (req, res) => {
  try {
    const { id } = req.params;

    const index = db.actividades.findIndex(a => a.id === id);
    if (index === -1) {
      return res.status(404).json({
        error: 'Actividad no encontrada',
        message: `No se encontró una actividad con ID: ${id}`
      });
    }

    const deletedActividad = db.actividades.splice(index, 1)[0];

    res.json({
      message: 'Actividad eliminada exitosamente',
      data: deletedActividad
    });
  } catch (error) {
    console.error('Error al eliminar actividad:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al eliminar la actividad'
    });
  }
});

module.exports = router;
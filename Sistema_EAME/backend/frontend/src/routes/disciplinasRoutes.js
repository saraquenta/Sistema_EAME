const express = require('express');
const db = require('../config/database');
const { authenticateToken, requireAdminOrJefe } = require('../middleware/auth');

const router = express.Router();

// GET /api/disciplinas - Obtener todas las disciplinas
router.get('/', authenticateToken, (req, res) => {
  try {
    const disciplinas = db.getDisciplinas();
    res.json({
      message: 'Disciplinas obtenidas exitosamente',
      data: disciplinas,
      total: disciplinas.length
    });
  } catch (error) {
    console.error('Error al obtener disciplinas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener la lista de disciplinas'
    });
  }
});

// POST /api/disciplinas - Crear nueva disciplina
router.post('/', authenticateToken, requireAdminOrJefe, (req, res) => {
  try {
    const {
      nombre,
      tipo,
      porcentaje_teoria,
      porcentaje_practica,
      porcentaje_otros,
      activo = true
    } = req.body;

    // Validaciones
    if (!nombre || !tipo || porcentaje_teoria === undefined || porcentaje_practica === undefined || porcentaje_otros === undefined) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Todos los campos obligatorios deben ser proporcionados'
      });
    }

    // Verificar que los porcentajes sumen 100
    const totalPorcentaje = porcentaje_teoria + porcentaje_practica + porcentaje_otros;
    if (totalPorcentaje !== 100) {
      return res.status(400).json({
        error: 'Porcentajes inválidos',
        message: 'Los porcentajes deben sumar exactamente 100%'
      });
    }

    const newDisciplina = {
      id: db.generateId(),
      nombre,
      tipo,
      porcentaje_teoria,
      porcentaje_practica,
      porcentaje_otros,
      activo,
      creado_en: new Date().toISOString()
    };

    db.disciplinas.push(newDisciplina);

    res.status(201).json({
      message: 'Disciplina creada exitosamente',
      data: newDisciplina
    });
  } catch (error) {
    console.error('Error al crear disciplina:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al crear la disciplina'
    });
  }
});

// PUT /api/disciplinas/:id - Actualizar disciplina
router.put('/:id', authenticateToken, requireAdminOrJefe, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const index = db.disciplinas.findIndex(d => d.id === id);
    if (index === -1) {
      return res.status(404).json({
        error: 'Disciplina no encontrada',
        message: `No se encontró una disciplina con ID: ${id}`
      });
    }

    // Si se están actualizando porcentajes, verificar que sumen 100
    const disciplina = db.disciplinas[index];
    const newTeoria = updates.porcentaje_teoria !== undefined ? updates.porcentaje_teoria : disciplina.porcentaje_teoria;
    const newPractica = updates.porcentaje_practica !== undefined ? updates.porcentaje_practica : disciplina.porcentaje_practica;
    const newOtros = updates.porcentaje_otros !== undefined ? updates.porcentaje_otros : disciplina.porcentaje_otros;
    
    const totalPorcentaje = newTeoria + newPractica + newOtros;
    if (totalPorcentaje !== 100) {
      return res.status(400).json({
        error: 'Porcentajes inválidos',
        message: 'Los porcentajes deben sumar exactamente 100%'
      });
    }

    db.disciplinas[index] = { ...disciplina, ...updates };

    res.json({
      message: 'Disciplina actualizada exitosamente',
      data: db.disciplinas[index]
    });
  } catch (error) {
    console.error('Error al actualizar disciplina:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al actualizar la disciplina'
    });
  }
});

// DELETE /api/disciplinas/:id - Eliminar disciplina
router.delete('/:id', authenticateToken, requireAdminOrJefe, (req, res) => {
  try {
    const { id } = req.params;

    const index = db.disciplinas.findIndex(d => d.id === id);
    if (index === -1) {
      return res.status(404).json({
        error: 'Disciplina no encontrada',
        message: `No se encontró una disciplina con ID: ${id}`
      });
    }

    const deletedDisciplina = db.disciplinas.splice(index, 1)[0];

    res.json({
      message: 'Disciplina eliminada exitosamente',
      data: deletedDisciplina
    });
  } catch (error) {
    console.error('Error al eliminar disciplina:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al eliminar la disciplina'
    });
  }
});

module.exports = router;
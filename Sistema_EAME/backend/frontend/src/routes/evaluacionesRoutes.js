const express = require('express');
const db = require('../config/database');
const { authenticateToken, requireAdminOrJefe } = require('../middleware/auth');

const router = express.Router();

// GET /api/evaluaciones - Obtener todas las evaluaciones
router.get('/', authenticateToken, (req, res) => {
  try {
    const evaluaciones = db.getEvaluaciones();
    res.json({
      message: 'Evaluaciones obtenidas exitosamente',
      data: evaluaciones,
      total: evaluaciones.length
    });
  } catch (error) {
    console.error('Error al obtener evaluaciones:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener la lista de evaluaciones'
    });
  }
});

// POST /api/evaluaciones - Crear nueva evaluación
router.post('/', authenticateToken, requireAdminOrJefe, (req, res) => {
  try {
    const {
      cursante_id,
      disciplina_id,
      periodo_id,
      teoria,
      practica,
      asistencia,
      cuaderno,
      fecha_eval,
      observaciones = ''
    } = req.body;

    // Validaciones
    if (!cursante_id || !disciplina_id || !periodo_id || teoria === undefined || practica === undefined || asistencia === undefined || cuaderno === undefined || !fecha_eval) {
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

    // Verificar que la disciplina existe
    const disciplina = db.getDisciplinas().find(d => d.id === disciplina_id);
    if (!disciplina) {
      return res.status(404).json({
        error: 'Disciplina no encontrada',
        message: `No se encontró una disciplina con ID: ${disciplina_id}`
      });
    }

    // Calcular nota final basada en los porcentajes de la disciplina
    const notaTeoria = (teoria * disciplina.porcentaje_teoria) / 100;
    const notaPractica = (practica * disciplina.porcentaje_practica) / 100;
    const notaOtros = ((asistencia + cuaderno) / 2 * disciplina.porcentaje_otros) / 100;
    const nota_final = notaTeoria + notaPractica + notaOtros;

    const newEvaluacion = {
      id: db.generateId(),
      cursante_id,
      disciplina_id,
      periodo_id,
      teoria,
      practica,
      asistencia,
      cuaderno,
      nota_final: Math.round(nota_final * 100) / 100, // Redondear a 2 decimales
      fecha_eval,
      observaciones
    };

    db.evaluaciones.push(newEvaluacion);

    res.status(201).json({
      message: 'Evaluación creada exitosamente',
      data: newEvaluacion
    });
  } catch (error) {
    console.error('Error al crear evaluación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al crear la evaluación'
    });
  }
});

// PUT /api/evaluaciones/:id - Actualizar evaluación
router.put('/:id', authenticateToken, requireAdminOrJefe, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const index = db.evaluaciones.findIndex(e => e.id === id);
    if (index === -1) {
      return res.status(404).json({
        error: 'Evaluación no encontrada',
        message: `No se encontró una evaluación con ID: ${id}`
      });
    }

    const evaluacion = db.evaluaciones[index];

    // Si se actualizan las notas, recalcular la nota final
    if (updates.teoria !== undefined || updates.practica !== undefined || updates.asistencia !== undefined || updates.cuaderno !== undefined) {
      const disciplina = db.getDisciplinas().find(d => d.id === evaluacion.disciplina_id);
      if (disciplina) {
        const teoria = updates.teoria !== undefined ? updates.teoria : evaluacion.teoria;
        const practica = updates.practica !== undefined ? updates.practica : evaluacion.practica;
        const asistencia = updates.asistencia !== undefined ? updates.asistencia : evaluacion.asistencia;
        const cuaderno = updates.cuaderno !== undefined ? updates.cuaderno : evaluacion.cuaderno;

        const notaTeoria = (teoria * disciplina.porcentaje_teoria) / 100;
        const notaPractica = (practica * disciplina.porcentaje_practica) / 100;
        const notaOtros = ((asistencia + cuaderno) / 2 * disciplina.porcentaje_otros) / 100;
        updates.nota_final = Math.round((notaTeoria + notaPractica + notaOtros) * 100) / 100;
      }
    }

    db.evaluaciones[index] = { ...evaluacion, ...updates };

    res.json({
      message: 'Evaluación actualizada exitosamente',
      data: db.evaluaciones[index]
    });
  } catch (error) {
    console.error('Error al actualizar evaluación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al actualizar la evaluación'
    });
  }
});

// DELETE /api/evaluaciones/:id - Eliminar evaluación
router.delete('/:id', authenticateToken, requireAdminOrJefe, (req, res) => {
  try {
    const { id } = req.params;

    const index = db.evaluaciones.findIndex(e => e.id === id);
    if (index === -1) {
      return res.status(404).json({
        error: 'Evaluación no encontrada',
        message: `No se encontró una evaluación con ID: ${id}`
      });
    }

    const deletedEvaluacion = db.evaluaciones.splice(index, 1)[0];

    res.json({
      message: 'Evaluación eliminada exitosamente',
      data: deletedEvaluacion
    });
  } catch (error) {
    console.error('Error al eliminar evaluación:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al eliminar la evaluación'
    });
  }
});

module.exports = router;
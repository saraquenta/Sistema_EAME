const express = require('express');
const db = require('../config/database');
const { authenticateToken, requireAdminOrJefe } = require('../middleware/auth');

const router = express.Router();

// GET /api/cursantes - Obtener todos los cursantes
router.get('/', authenticateToken, (req, res) => {
  try {
    const cursantes = db.getCursantes();
    res.json({
      message: 'Cursantes obtenidos exitosamente',
      data: cursantes,
      total: cursantes.length
    });
  } catch (error) {
    console.error('Error al obtener cursantes:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener la lista de cursantes'
    });
  }
});

// GET /api/cursantes/:id - Obtener un cursante por ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const cursante = db.getCursanteById(id);
    
    if (!cursante) {
      return res.status(404).json({
        error: 'Cursante no encontrado',
        message: `No se encontró un cursante con ID: ${id}`
      });
    }

    res.json({
      message: 'Cursante obtenido exitosamente',
      data: cursante
    });
  } catch (error) {
    console.error('Error al obtener cursante:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener el cursante'
    });
  }
});

// POST /api/cursantes - Crear nuevo cursante
router.post('/', authenticateToken, requireAdminOrJefe, (req, res) => {
  try {
    const {
      nombre_completo,
      ci,
      fecha_nacimiento,
      grado_militar,
      estado = 'activo',
      fecha_ingreso,
      curso_anual,
      observaciones = ''
    } = req.body;

    // Validaciones
    if (!nombre_completo || !ci || !fecha_nacimiento || !grado_militar || !fecha_ingreso || !curso_anual) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Todos los campos obligatorios deben ser proporcionados'
      });
    }

    // Verificar que el CI no esté duplicado
    const existingCursante = db.getCursantes().find(c => c.ci === ci);
    if (existingCursante) {
      return res.status(409).json({
        error: 'CI duplicado',
        message: `Ya existe un cursante con CI: ${ci}`
      });
    }

    const newCursante = db.addCursante({
      nombre_completo,
      ci,
      fecha_nacimiento,
      grado_militar,
      estado,
      fecha_ingreso,
      curso_anual,
      observaciones
    });

    res.status(201).json({
      message: 'Cursante creado exitosamente',
      data: newCursante
    });
  } catch (error) {
    console.error('Error al crear cursante:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al crear el cursante'
    });
  }
});

// PUT /api/cursantes/:id - Actualizar cursante
router.put('/:id', authenticateToken, requireAdminOrJefe, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Verificar que el cursante existe
    const existingCursante = db.getCursanteById(id);
    if (!existingCursante) {
      return res.status(404).json({
        error: 'Cursante no encontrado',
        message: `No se encontró un cursante con ID: ${id}`
      });
    }

    // Si se está actualizando el CI, verificar que no esté duplicado
    if (updates.ci && updates.ci !== existingCursante.ci) {
      const duplicateCursante = db.getCursantes().find(c => c.ci === updates.ci && c.id !== id);
      if (duplicateCursante) {
        return res.status(409).json({
          error: 'CI duplicado',
          message: `Ya existe otro cursante con CI: ${updates.ci}`
        });
      }
    }

    const updatedCursante = db.updateCursante(id, updates);

    res.json({
      message: 'Cursante actualizado exitosamente',
      data: updatedCursante
    });
  } catch (error) {
    console.error('Error al actualizar cursante:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al actualizar el cursante'
    });
  }
});

// DELETE /api/cursantes/:id - Eliminar cursante
router.delete('/:id', authenticateToken, requireAdminOrJefe, (req, res) => {
  try {
    const { id } = req.params;

    const deletedCursante = db.deleteCursante(id);
    if (!deletedCursante) {
      return res.status(404).json({
        error: 'Cursante no encontrado',
        message: `No se encontró un cursante con ID: ${id}`
      });
    }

    res.json({
      message: 'Cursante eliminado exitosamente',
      data: deletedCursante
    });
  } catch (error) {
    console.error('Error al eliminar cursante:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al eliminar el cursante'
    });
  }
});

module.exports = router;
const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/reportes/estadisticas - Obtener estadísticas generales
router.get('/estadisticas', authenticateToken, (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const cursantes = db.getCursantes();
    const disciplinas = db.getDisciplinas();
    const evaluaciones = db.getEvaluaciones();
    const meritos = db.getMeritos();
    const bajas = db.getBajas();

    // Filtrar por año si se especifica
    const cursantesDelAno = cursantes.filter(c => c.curso_anual === year.toString());
    const evaluacionesDelAno = evaluaciones.filter(e => {
      const cursante = cursantes.find(c => c.id === e.cursante_id);
      return cursante?.curso_anual === year.toString();
    });

    // Estadísticas generales
    const estadisticas = {
      periodo: year,
      fecha_generacion: new Date().toISOString(),
      cursantes_activos: cursantesDelAno.filter(c => c.estado === 'activo').length,
      total_cursantes: cursantesDelAno.length,
      total_bajas: bajas.length,
      total_meritos: meritos.length,
      disciplinas_activas: disciplinas.filter(d => d.activo).length,
      promedio_general: evaluacionesDelAno.length > 0 
        ? evaluacionesDelAno.reduce((sum, e) => sum + e.nota_final, 0) / evaluacionesDelAno.length 
        : 0
    };

    // Estadísticas de méritos por tipo
    const meritosPorTipo = meritos.reduce((acc, merito) => {
      acc[merito.tipo] = (acc[merito.tipo] || 0) + 1;
      return acc;
    }, {});

    // Estadísticas de bajas por motivo
    const bajasPorMotivo = bajas.reduce((acc, baja) => {
      acc[baja.motivo] = (acc[baja.motivo] || 0) + 1;
      return acc;
    }, {});

    // Evaluaciones por disciplina
    const evaluacionesPorDisciplina = disciplinas.map(disciplina => {
      const evaluacionesDisciplina = evaluacionesDelAno.filter(e => e.disciplina_id === disciplina.id);
      const promedio = evaluacionesDisciplina.length > 0 
        ? evaluacionesDisciplina.reduce((sum, e) => sum + e.nota_final, 0) / evaluacionesDisciplina.length 
        : 0;
      
      return {
        id: disciplina.id,
        nombre: disciplina.nombre,
        tipo: disciplina.tipo,
        evaluaciones: evaluacionesDisciplina.length,
        promedio: promedio
      };
    });

    // Ranking de cursantes
    const rankingCursantes = cursantesDelAno.map(cursante => {
      const evaluacionesCursante = evaluacionesDelAno.filter(e => e.cursante_id === cursante.id);
      const promedio = evaluacionesCursante.length > 0 
        ? evaluacionesCursante.reduce((sum, e) => sum + e.nota_final, 0) / evaluacionesCursante.length 
        : 0;
      
      return {
        ...cursante,
        promedio,
        evaluaciones: evaluacionesCursante.length
      };
    }).sort((a, b) => b.promedio - a.promedio);

    res.json({
      message: 'Estadísticas obtenidas exitosamente',
      data: {
        estadisticas,
        meritosPorTipo,
        bajasPorMotivo,
        evaluacionesPorDisciplina,
        rankingCursantes
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener las estadísticas'
    });
  }
});

// GET /api/reportes/bajas-detalladas - Obtener listado detallado de bajas
router.get('/bajas-detalladas', authenticateToken, (req, res) => {
  try {
    const bajas = db.getBajas();
    const cursantes = db.getCursantes();

    const bajasDetalladas = bajas.map(baja => {
      const cursante = cursantes.find(c => c.id === baja.cursante_id);
      return {
        ...baja,
        cursante_nombre: cursante?.nombre_completo || 'N/A',
        cursante_ci: cursante?.ci || 'N/A',
        cursante_grado: cursante?.grado_militar || 'N/A'
      };
    }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    res.json({
      message: 'Bajas detalladas obtenidas exitosamente',
      data: bajasDetalladas,
      total: bajasDetalladas.length
    });
  } catch (error) {
    console.error('Error al obtener bajas detalladas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener las bajas detalladas'
    });
  }
});

// GET /api/reportes/meritos-detallados - Obtener listado detallado de méritos
router.get('/meritos-detallados', authenticateToken, (req, res) => {
  try {
    const meritos = db.getMeritos();
    const cursantes = db.getCursantes();

    const meritosDetallados = meritos.map(merito => {
      const cursante = cursantes.find(c => c.id === merito.cursante_id);
      return {
        ...merito,
        cursante_nombre: cursante?.nombre_completo || 'N/A',
        cursante_ci: cursante?.ci || 'N/A',
        cursante_grado: cursante?.grado_militar || 'N/A'
      };
    }).sort((a, b) => a.cursante_nombre.localeCompare(b.cursante_nombre));

    res.json({
      message: 'Méritos detallados obtenidos exitosamente',
      data: meritosDetallados,
      total: meritosDetallados.length
    });
  } catch (error) {
    console.error('Error al obtener méritos detallados:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener los méritos detallados'
    });
  }
});

// GET /api/reportes/ranking/:year - Obtener ranking de cursantes por año
router.get('/ranking/:year', authenticateToken, (req, res) => {
  try {
    const { year } = req.params;
    
    const cursantes = db.getCursantes();
    const evaluaciones = db.getEvaluaciones();

    const cursantesDelAno = cursantes.filter(c => c.curso_anual === year);
    const evaluacionesDelAno = evaluaciones.filter(e => {
      const cursante = cursantes.find(c => c.id === e.cursante_id);
      return cursante?.curso_anual === year;
    });

    const rankingCursantes = cursantesDelAno.map(cursante => {
      const evaluacionesCursante = evaluacionesDelAno.filter(e => e.cursante_id === cursante.id);
      const promedio = evaluacionesCursante.length > 0 
        ? evaluacionesCursante.reduce((sum, e) => sum + e.nota_final, 0) / evaluacionesCursante.length 
        : 0;
      
      return {
        ...cursante,
        promedio: Math.round(promedio * 100) / 100,
        evaluaciones: evaluacionesCursante.length
      };
    }).sort((a, b) => b.promedio - a.promedio);

    res.json({
      message: 'Ranking obtenido exitosamente',
      data: rankingCursantes,
      total: rankingCursantes.length,
      year: year
    });
  } catch (error) {
    console.error('Error al obtener ranking:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener el ranking'
    });
  }
});

module.exports = router;
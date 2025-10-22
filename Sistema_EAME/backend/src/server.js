const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const cursantesRoutes = require('./routes/cursantesRoutes');
const disciplinasRoutes = require('./routes/disciplinasRoutes');
const evaluacionesRoutes = require('./routes/evaluacionesRoutes');
const meritosRoutes = require('./routes/meritosRoutes');
const bajasRoutes = require('./routes/bajasRoutes');
const actividadesRoutes = require('./routes/actividadesRoutes');
const reportesRoutes = require('./routes/reportesRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por ventana de tiempo
});
app.use(limiter);

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/cursantes', cursantesRoutes);
app.use('/api/disciplinas', disciplinasRoutes);
app.use('/api/evaluaciones', evaluacionesRoutes);
app.use('/api/meritos', meritosRoutes);
app.use('/api/bajas', bajasRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/reportes', reportesRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Sistema EAME API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe en esta API`
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor EAME ejecutándose en puerto ${PORT}`);
  console.log(`📡 API disponible en: http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});
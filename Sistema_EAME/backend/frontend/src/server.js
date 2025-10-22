const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Importar rutas
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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana de tiempo
  message: 'Demasiadas solicitudes desde esta IP, intente de nuevo más tarde.'
});
app.use(limiter);

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/cursantes', cursantesRoutes);
app.use('/api/disciplinas', disciplinasRoutes);
app.use('/api/evaluaciones', evaluacionesRoutes);
app.use('/api/meritos', meritosRoutes);
app.use('/api/bajas', bajasRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/reportes', reportesRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Servidor EAME funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe en este servidor`
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error del servidor:', err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: 'Algo salió mal en el servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor EAME ejecutándose en puerto ${PORT}`);
  console.log(`📡 API disponible en: http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
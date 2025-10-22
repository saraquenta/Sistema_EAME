# Backend - Sistema de Evaluación EAME

Backend del Sistema de Evaluación de la Escuela de Artes Marciales del Ejército (EAME) desarrollado en Node.js con Express.

## 🚀 Características

- **API RESTful** completa para el sistema EAME
- **Autenticación JWT** con roles de usuario
- **Middleware de seguridad** con Helmet y CORS
- **Rate limiting** para prevenir abuso
- **Validación de datos** en todas las rutas
- **Base de datos en memoria** para desarrollo
- **Logging** con Morgan
- **Manejo de errores** centralizado

## 📋 Requisitos

- Node.js 16+ 
- npm 8+

## 🛠️ Instalación

1. **Instalar dependencias:**
```bash
cd backend
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

4. **Iniciar servidor de producción:**
```bash
npm start
```

## 📡 API Endpoints

### 🔐 Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/refresh` - Renovar token

### 👥 Cursantes
- `GET /api/cursantes` - Listar cursantes
- `GET /api/cursantes/:id` - Obtener cursante
- `POST /api/cursantes` - Crear cursante
- `PUT /api/cursantes/:id` - Actualizar cursante
- `DELETE /api/cursantes/:id` - Eliminar cursante

### 📚 Disciplinas
- `GET /api/disciplinas` - Listar disciplinas
- `POST /api/disciplinas` - Crear disciplina
- `PUT /api/disciplinas/:id` - Actualizar disciplina
- `DELETE /api/disciplinas/:id` - Eliminar disciplina

### 📝 Evaluaciones
- `GET /api/evaluaciones` - Listar evaluaciones
- `POST /api/evaluaciones` - Crear evaluación
- `PUT /api/evaluaciones/:id` - Actualizar evaluación
- `DELETE /api/evaluaciones/:id` - Eliminar evaluación

### 🏆 Méritos
- `GET /api/meritos` - Listar méritos
- `POST /api/meritos` - Crear mérito
- `PUT /api/meritos/:id` - Actualizar mérito
- `DELETE /api/meritos/:id` - Eliminar mérito

### ❌ Bajas
- `GET /api/bajas` - Listar bajas
- `POST /api/bajas` - Crear baja
- `PUT /api/bajas/:id` - Actualizar baja
- `DELETE /api/bajas/:id` - Eliminar baja

### 🎯 Actividades
- `GET /api/actividades` - Listar actividades
- `POST /api/actividades` - Crear actividad
- `PUT /api/actividades/:id` - Actualizar actividad
- `DELETE /api/actividades/:id` - Eliminar actividad

### 📊 Reportes
- `GET /api/reportes/estadisticas` - Estadísticas generales
- `GET /api/reportes/bajas-detalladas` - Bajas detalladas
- `GET /api/reportes/meritos-detallados` - Méritos detallados
- `GET /api/reportes/ranking/:year` - Ranking por año

## 🔑 Usuarios de Prueba

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@eame.mil.bo | 123456 | Administrador |
| jefe.evaluaciones@eame.mil.bo | 123456 | Jefe de Evaluaciones |
| comandante@eame.mil.bo | 123456 | Comandante |

## 🛡️ Seguridad

- **JWT Tokens** para autenticación
- **Bcrypt** para hash de contraseñas
- **Helmet** para headers de seguridad
- **CORS** configurado
- **Rate Limiting** implementado
- **Validación** de entrada en todas las rutas

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js      # Configuración de BD
│   ├── controllers/         # Controladores (futuro)
│   ├── middleware/
│   │   └── auth.js          # Middleware de autenticación
│   ├── models/              # Modelos (futuro)
│   ├── routes/
│   │   ├── authRoutes.js    # Rutas de autenticación
│   │   ├── cursantesRoutes.js
│   │   ├── disciplinasRoutes.js
│   │   ├── evaluacionesRoutes.js
│   │   ├── meritosRoutes.js
│   │   ├── bajasRoutes.js
│   │   ├── actividadesRoutes.js
│   │   └── reportesRoutes.js
│   └── server.js            # Servidor principal
├── .env.example             # Variables de entorno
├── package.json
└── README.md
```

## 🚀 Scripts Disponibles

- `npm start` - Iniciar servidor de producción
- `npm run dev` - Iniciar servidor de desarrollo con nodemon
- `npm test` - Ejecutar pruebas (por implementar)

## 🔧 Configuración

### Variables de Entorno

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=tu_jwt_secret_super_seguro
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### CORS

El servidor está configurado para aceptar requests desde:
- `http://localhost:3000` (Create React App)
- `http://localhost:5173` (Vite)

## 📝 Notas de Desarrollo

- La base de datos actual es **en memoria** para desarrollo
- Los datos se reinician cada vez que se reinicia el servidor
- Para producción se recomienda implementar una base de datos persistente
- Todos los endpoints requieren autenticación excepto `/api/auth/login`
- Los roles determinan qué operaciones puede realizar cada usuario

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es propiedad de la Escuela de Artes Marciales del Ejército (EAME) - Bolivia.
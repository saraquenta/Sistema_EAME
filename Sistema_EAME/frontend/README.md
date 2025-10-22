# Frontend - Sistema de Evaluación EAME

Frontend del Sistema de Evaluación de la Escuela de Artes Marciales del Ejército (EAME) desarrollado en React con TypeScript.

## 🚀 Características

- **React 18** con TypeScript
- **Vite** como bundler para desarrollo rápido
- **Bootstrap 5** para el diseño UI/UX
- **Axios** para comunicación con API
- **React Router** para navegación
- **Context API** para manejo de estado
- **Lucide React** para iconografía
- **jsPDF** para generación de reportes PDF
- **Responsive Design** adaptable a todos los dispositivos

## 📋 Requisitos

- Node.js 16+
- npm 8+
- Backend EAME ejecutándose en puerto 5000

## 🛠️ Instalación

1. **Instalar dependencias:**
```bash
cd frontend
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
# Editar .env con la URL de tu backend
```

3. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

4. **Construir para producción:**
```bash
npm run build
```

5. **Previsualizar build de producción:**
```bash
npm run preview
```

## 🌐 Variables de Entorno

```env
# URL del backend API
VITE_API_URL=http://localhost:5000/api

# Configuración de desarrollo
VITE_NODE_ENV=development

# Configuración de la aplicación
VITE_APP_NAME=Sistema EAME
VITE_APP_VERSION=1.0.0
```

## 🔑 Usuarios de Prueba

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@eame.mil.bo | 123456 | Administrador |
| jefe.evaluaciones@eame.mil.bo | 123456 | Jefe de Evaluaciones |
| comandante@eame.mil.bo | 123456 | Comandante |

## 📱 Funcionalidades

### 🔐 Autenticación
- Login seguro con JWT
- Manejo de sesiones
- Roles de usuario
- Logout automático en token expirado

### 👥 Gestión de Cursantes
- Lista completa con paginación
- Crear, editar y eliminar cursantes
- Filtros por estado y búsqueda
- Validación de datos

### 📚 Gestión de Disciplinas
- Administración de disciplinas de artes marciales
- Configuración de porcentajes de evaluación
- Estados activo/inactivo

### 📝 Gestión de Evaluaciones
- Registro de evaluaciones por disciplina
- Cálculo automático de notas finales
- Seguimiento por período académico

### 🏆 Gestión de Méritos
- Otorgamiento de reconocimientos
- Categorización por tipos
- Justificaciones detalladas

### ❌ Gestión de Bajas
- Registro de bajas con motivos
- Actualización automática de estados
- Observaciones detalladas

### 🎯 Gestión de Actividades
- Registro de actividades académicas
- Seguimiento por disciplina
- Control de duración y resultados

### 📊 Reportes y Estadísticas
- Dashboard con métricas clave
- Ranking de cursantes por promedio
- Estadísticas por disciplina
- Listados detallados de méritos y bajas
- Exportación a PDF profesional

## 🎨 Diseño y UX

### 🎨 Paleta de Colores
- **Rojo EAME:** `#dc2626` (Color principal)
- **Negro:** `#000000` (Color secundario)
- **Blanco:** `#ffffff` (Fondo y texto)
- **Grises:** Para elementos secundarios

### 📱 Responsive Design
- **Mobile First:** Optimizado para dispositivos móviles
- **Breakpoints:** Adaptable a tablets y desktop
- **Touch Friendly:** Botones y elementos táctiles

### 🎯 Componentes UI
- **Cards:** Diseño moderno con sombras suaves
- **Tables:** Tablas responsivas con paginación
- **Forms:** Validación en tiempo real
- **Modals:** Formularios en ventanas modales
- **Alerts:** Notificaciones de estado

## 📁 Estructura del Proyecto

```
frontend/
├── public/
│   ├── image.png           # Logo EAME
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Actividades/
│   │   ├── Bajas/
│   │   ├── Cursantes/
│   │   ├── Dashboard/
│   │   ├── Disciplinas/
│   │   ├── Evaluaciones/
│   │   ├── Layout/
│   │   ├── Meritos/
│   │   ├── Reportes/
│   │   └── Login.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── DataContext.tsx
│   ├── services/
│   │   └── api.ts          # Servicios de API
│   ├── types/
│   │   └── index.ts        # Tipos TypeScript
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── package.json
├── vite.config.ts
└── README.md
```

## 🔧 Configuración de Desarrollo

### Vite Configuration
```typescript
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
```

### TypeScript Configuration
- Strict mode habilitado
- Path mapping configurado
- Tipos para todas las entidades

## 🚀 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Previsualizar build
- `npm run lint` - Linter ESLint

## 🔒 Seguridad

- **JWT Tokens** para autenticación
- **Interceptors** para manejo automático de tokens
- **Validación** de entrada en formularios
- **Sanitización** de datos
- **HTTPS** recomendado en producción

## 📈 Performance

- **Code Splitting** automático con Vite
- **Lazy Loading** de componentes
- **Optimización** de imágenes
- **Caching** de requests API
- **Bundle Size** optimizado

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es propiedad de la Escuela de Artes Marciales del Ejército (EAME) - Bolivia.

## 🆘 Soporte

Para soporte técnico o consultas sobre el sistema, contactar al equipo de desarrollo de la EAME.
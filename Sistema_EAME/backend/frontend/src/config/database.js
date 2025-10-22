const { v4: uuidv4 } = require('uuid');

// Simulación de base de datos en memoria
class Database {
  constructor() {
    this.cursantes = [];
    this.disciplinas = [];
    this.evaluaciones = [];
    this.meritos = [];
    this.bajas = [];
    this.actividades = [];
    this.users = [];
    
    this.initializeData();
  }

  initializeData() {
    // Usuarios del sistema
    this.users = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@eame.mil.bo',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: 123456
        role: 'administrador',
        nombre_completo: 'Administrador del Sistema',
        activo: true,
        creado_en: new Date().toISOString()
      },
      {
        id: '2',
        username: 'jefe_eval',
        email: 'jefe.evaluaciones@eame.mil.bo',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: 123456
        role: 'jefe_evaluaciones',
        nombre_completo: 'Jefe de Evaluaciones',
        activo: true,
        creado_en: new Date().toISOString()
      },
      {
        id: '3',
        username: 'comandante',
        email: 'comandante@eame.mil.bo',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: 123456
        role: 'comandante',
        nombre_completo: 'Comandante EAME',
        activo: true,
        creado_en: new Date().toISOString()
      }
    ];

    // Datos iniciales de cursantes (50 registros)
    this.cursantes = [
      {
        id: '1',
        nombre_completo: 'Juan Carlos Pérez López',
        ci: '12345678',
        fecha_nacimiento: '1995-03-15',
        grado_militar: 'Soldado',
        estado: 'activo',
        fecha_ingreso: '2024-01-15',
        curso_anual: '2024',
        observaciones: 'Excelente desempeño',
        creado_en: new Date().toISOString()
      },
      {
        id: '2',
        nombre_completo: 'María Elena Quispe Mamani',
        ci: '87654321',
        fecha_nacimiento: '1993-07-22',
        grado_militar: 'Cabo',
        estado: 'activo',
        fecha_ingreso: '2024-01-15',
        curso_anual: '2024',
        observaciones: 'Muy dedicada',
        creado_en: new Date().toISOString()
      },
      {
        id: '3',
        nombre_completo: 'Carlos Alberto Mamani Condori',
        ci: '11223344',
        fecha_nacimiento: '1994-11-08',
        grado_militar: 'Sargento Segundo',
        estado: 'activo',
        fecha_ingreso: '2024-01-15',
        curso_anual: '2024',
        observaciones: 'Buen liderazgo',
        creado_en: new Date().toISOString()
      },
      // Agregando más cursantes para llegar a 50
      ...Array.from({ length: 47 }, (_, i) => ({
        id: (i + 4).toString(),
        nombre_completo: `Cursante ${i + 4} Apellido${i + 4}`,
        ci: (10000000 + i + 4).toString(),
        fecha_nacimiento: `199${Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        grado_militar: ['Soldado', 'Cabo', 'Sargento Segundo', 'Sargento Primero', 'Teniente'][Math.floor(Math.random() * 5)],
        estado: Math.random() > 0.1 ? 'activo' : 'baja',
        fecha_ingreso: '2024-01-15',
        curso_anual: '2024',
        observaciones: `Observaciones del cursante ${i + 4}`,
        creado_en: new Date().toISOString()
      }))
    ];

    // Datos iniciales de disciplinas (20 registros)
    this.disciplinas = [
      {
        id: '1',
        nombre: 'Karate',
        tipo: 'Arte Marcial',
        porcentaje_teoria: 30,
        porcentaje_practica: 60,
        porcentaje_otros: 10,
        activo: true,
        creado_en: new Date().toISOString()
      },
      {
        id: '2',
        nombre: 'Judo',
        tipo: 'Arte Marcial',
        porcentaje_teoria: 25,
        porcentaje_practica: 65,
        porcentaje_otros: 10,
        activo: true,
        creado_en: new Date().toISOString()
      },
      {
        id: '3',
        nombre: 'Taekwondo',
        tipo: 'Arte Marcial',
        porcentaje_teoria: 20,
        porcentaje_practica: 70,
        porcentaje_otros: 10,
        activo: true,
        creado_en: new Date().toISOString()
      },
      {
        id: '4',
        nombre: 'Defensa Personal',
        tipo: 'Defensa Personal',
        porcentaje_teoria: 15,
        porcentaje_practica: 75,
        porcentaje_otros: 10,
        activo: true,
        creado_en: new Date().toISOString()
      },
      // Agregando más disciplinas
      ...Array.from({ length: 16 }, (_, i) => ({
        id: (i + 5).toString(),
        nombre: `Disciplina ${i + 5}`,
        tipo: ['Arte Marcial', 'Defensa Personal', 'Combate', 'Acondicionamiento Físico'][Math.floor(Math.random() * 4)],
        porcentaje_teoria: Math.floor(Math.random() * 30) + 10,
        porcentaje_practica: Math.floor(Math.random() * 40) + 50,
        porcentaje_otros: 10,
        activo: Math.random() > 0.2,
        creado_en: new Date().toISOString()
      }))
    ];

    // Datos iniciales de evaluaciones (50 registros)
    this.evaluaciones = [
      {
        id: '1',
        cursante_id: '1',
        disciplina_id: '1',
        periodo_id: '2024',
        teoria: 85,
        practica: 90,
        asistencia: 95,
        cuaderno: 88,
        nota_final: 87.5,
        fecha_eval: '2024-03-15',
        observaciones: 'Excelente desempeño en todas las áreas'
      },
      {
        id: '2',
        cursante_id: '2',
        disciplina_id: '2',
        periodo_id: '2024',
        teoria: 78,
        practica: 85,
        asistencia: 92,
        cuaderno: 80,
        nota_final: 82.1,
        fecha_eval: '2024-03-16',
        observaciones: 'Muy buena técnica en judo'
      },
      {
        id: '3',
        cursante_id: '3',
        disciplina_id: '3',
        periodo_id: '2024',
        teoria: 82,
        practica: 88,
        asistencia: 90,
        cuaderno: 85,
        nota_final: 86.4,
        fecha_eval: '2024-03-17',
        observaciones: 'Destacado en patadas de taekwondo'
      },
      // Agregando más evaluaciones
      ...Array.from({ length: 47 }, (_, i) => ({
        id: (i + 4).toString(),
        cursante_id: Math.floor(Math.random() * 50 + 1).toString(),
        disciplina_id: Math.floor(Math.random() * 4 + 1).toString(),
        periodo_id: '2024',
        teoria: Math.floor(Math.random() * 40) + 60,
        practica: Math.floor(Math.random() * 40) + 60,
        asistencia: Math.floor(Math.random() * 30) + 70,
        cuaderno: Math.floor(Math.random() * 40) + 60,
        nota_final: Math.floor(Math.random() * 40) + 60,
        fecha_eval: `2024-0${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        observaciones: `Observaciones de evaluación ${i + 4}`
      }))
    ];

    // Datos iniciales de méritos (30 registros)
    this.meritos = Array.from({ length: 30 }, (_, i) => ({
      id: (i + 1).toString(),
      cursante_id: Math.floor(Math.random() * 50 + 1).toString(),
      tipo: ['Excelencia Académica', 'Liderazgo', 'Disciplina', 'Compañerismo', 'Mejora Continua', 'Dedicación'][Math.floor(Math.random() * 6)],
      gestion: '2024',
      justificacion: `Justificación del mérito ${i + 1}: Demostró excelente desempeño y dedicación en sus actividades.`,
      usuario_id: '1'
    }));

    // Datos iniciales de bajas (20 registros)
    this.bajas = Array.from({ length: 20 }, (_, i) => ({
      id: (i + 1).toString(),
      cursante_id: Math.floor(Math.random() * 50 + 1).toString(),
      motivo: ['Bajo Rendimiento', 'Problemas Disciplinarios', 'Motivos Personales', 'Problemas de Salud', 'Traslado', 'Otros'][Math.floor(Math.random() * 6)],
      fecha: `2024-0${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      observaciones: `Observaciones de baja ${i + 1}: Detalles específicos del motivo de la baja.`,
      usuario_id: '1'
    }));

    // Datos iniciales de actividades (40 registros)
    this.actividades = Array.from({ length: 40 }, (_, i) => ({
      id: (i + 1).toString(),
      cursante_id: Math.floor(Math.random() * 50 + 1).toString(),
      tipo_actividad: ['Entrenamiento', 'Competencia', 'Examen', 'Seminario', 'Práctica', 'Demostración'][Math.floor(Math.random() * 6)],
      disciplina: ['Karate', 'Judo', 'Taekwondo', 'Defensa Personal'][Math.floor(Math.random() * 4)],
      fecha: `2024-0${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      duracion: `${Math.floor(Math.random() * 3) + 1} horas`,
      observaciones: `Observaciones de actividad ${i + 1}: Detalles de la actividad realizada y resultados obtenidos.`,
      usuario_id: '1',
      periodo_id: '2024'
    }));
  }

  // Métodos helper
  generateId() {
    return uuidv4();
  }

  // Métodos para cursantes
  getCursantes() {
    return this.cursantes;
  }

  getCursanteById(id) {
    return this.cursantes.find(c => c.id === id);
  }

  addCursante(cursante) {
    const newCursante = {
      ...cursante,
      id: this.generateId(),
      creado_en: new Date().toISOString()
    };
    this.cursantes.push(newCursante);
    return newCursante;
  }

  updateCursante(id, updates) {
    const index = this.cursantes.findIndex(c => c.id === id);
    if (index !== -1) {
      this.cursantes[index] = { ...this.cursantes[index], ...updates };
      return this.cursantes[index];
    }
    return null;
  }

  deleteCursante(id) {
    const index = this.cursantes.findIndex(c => c.id === id);
    if (index !== -1) {
      return this.cursantes.splice(index, 1)[0];
    }
    return null;
  }

  // Métodos similares para otras entidades...
  getDisciplinas() { return this.disciplinas; }
  getEvaluaciones() { return this.evaluaciones; }
  getMeritos() { return this.meritos; }
  getBajas() { return this.bajas; }
  getActividades() { return this.actividades; }
  getUsers() { return this.users; }
  getUserByEmail(email) { return this.users.find(u => u.email === email); }
  getUserById(id) { return this.users.find(u => u.id === id); }
}

// Instancia singleton de la base de datos
const db = new Database();

module.exports = db;
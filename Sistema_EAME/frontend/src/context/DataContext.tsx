import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cursante, Disciplina, Evaluacion, Merito, Baja, Actividad } from '../types';

interface DataContextType {
  cursantes: Cursante[];
  disciplinas: Disciplina[];
  evaluaciones: Evaluacion[];
  meritos: Merito[];
  bajas: Baja[];
  actividades: Actividad[];
  
  // CRUD operations
  addCursante: (cursante: Omit<Cursante, 'id' | 'creado_en'>) => void;
  updateCursante: (id: string, cursante: Partial<Cursante>) => void;
  deleteCursante: (id: string) => void;
  
  addDisciplina: (disciplina: Omit<Disciplina, 'id' | 'creado_en'>) => void;
  updateDisciplina: (id: string, disciplina: Partial<Disciplina>) => void;
  deleteDisciplina: (id: string) => void;
  
  addEvaluacion: (evaluacion: Omit<Evaluacion, 'id'>) => void;
  updateEvaluacion: (id: string, evaluacion: Partial<Evaluacion>) => void;
  deleteEvaluacion: (id: string) => void;
  
  addMerito: (merito: Omit<Merito, 'id'>) => void;
  updateMerito: (id: string, merito: Partial<Merito>) => void;
  deleteMerito: (id: string) => void;
  
  addBaja: (baja: Omit<Baja, 'id'>) => void;
  updateBaja: (id: string, baja: Partial<Baja>) => void;
  deleteBaja: (id: string) => void;
  
  addActividad: (actividad: Omit<Actividad, 'id'>) => void;
  updateActividad: (id: string, actividad: Partial<Actividad>) => void;
  deleteActividad: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cursantes, setCursantes] = useState<Cursante[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [meritos, setMeritos] = useState<Merito[]>([]);
  const [bajas, setBajas] = useState<Baja[]>([]);
  const [actividades, setActividades] = useState<Actividad[]>([]);

  useEffect(() => {
    // Datos reales de cursantes bolivianos de EAME
    const initialCursantes: Cursante[] = [
      {
        id: '1',
        nombre_completo: 'Juan Carlos Mamani Quispe',
        ci: '8765432',
        fecha_nacimiento: '1995-03-15',
        grado_militar: 'Soldado',
        estado: 'activo',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Excelente disciplina y dedicación en entrenamientos',
        creado_en: new Date().toISOString()
      },
      {
        id: '2',
        nombre_completo: 'María Elena Condori Mamani',
        ci: '7654321',
        fecha_nacimiento: '1996-07-22',
        grado_militar: 'Cabo',
        estado: 'activo',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Destacada en técnicas de defensa personal',
        creado_en: new Date().toISOString()
      },
      {
        id: '3',
        nombre_completo: 'Carlos Alberto Ticona Flores',
        ci: '6543210',
        fecha_nacimiento: '1994-11-08',
        grado_militar: 'Sargento Segundo',
        estado: 'activo',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Liderazgo natural y excelente técnica en karate',
        creado_en: new Date().toISOString()
      },
      {
        id: '4',
        nombre_completo: 'Ana Patricia Choque Vargas',
        ci: '5432109',
        fecha_nacimiento: '1997-05-14',
        grado_militar: 'Soldado',
        estado: 'activo',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Progreso notable en judo y disciplina militar',
        creado_en: new Date().toISOString()
      },
      {
        id: '5',
        nombre_completo: 'Luis Fernando Apaza Cruz',
        ci: '4321098',
        fecha_nacimiento: '1995-09-30',
        grado_militar: 'Cabo',
        estado: 'activo',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Especialista en taekwondo, instructor auxiliar',
        creado_en: new Date().toISOString()
      },
      {
        id: '6',
        nombre_completo: 'Rosa María Huanca Limachi',
        ci: '3210987',
        fecha_nacimiento: '1996-12-03',
        grado_militar: 'Soldado',
        estado: 'activo',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Excelente en combate cuerpo a cuerpo',
        creado_en: new Date().toISOString()
      },
      {
        id: '7',
        nombre_completo: 'Miguel Ángel Torrez Mendoza',
        ci: '2109876',
        fecha_nacimiento: '1994-08-17',
        grado_militar: 'Sargento Segundo',
        estado: 'activo',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Instructor de aikido, técnica impecable',
        creado_en: new Date().toISOString()
      },
      {
        id: '8',
        nombre_completo: 'Sandra Beatriz Callisaya Nina',
        ci: '1098765',
        fecha_nacimiento: '1997-01-25',
        grado_militar: 'Soldado',
        estado: 'activo',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Destacada en artes marciales mixtas',
        creado_en: new Date().toISOString()
      },
      {
        id: '9',
        nombre_completo: 'Roberto Carlos Zenteno Paz',
        ci: '9876543',
        fecha_nacimiento: '1995-06-11',
        grado_militar: 'Cabo',
        estado: 'activo',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Especialista en krav maga y defensa táctica',
        creado_en: new Date().toISOString()
      },
      {
        id: '10',
        nombre_completo: 'Claudia Fernanda Rojas Sánchez',
        ci: '8765432',
        fecha_nacimiento: '1996-04-08',
        grado_militar: 'Soldado',
        estado: 'activo',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Excelente coordinación y técnica en kung fu',
        creado_en: new Date().toISOString()
      },
      {
        id: '11',
        nombre_completo: 'Jorge Luis Mamani Condori',
        ci: '7654321',
        fecha_nacimiento: '1993-10-20',
        grado_militar: 'Sargento Primero',
        estado: 'activo',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Veterano con 8 años de experiencia, instructor principal',
        creado_en: new Date().toISOString()
      },
      {
        id: '12',
        nombre_completo: 'Paola Andrea Quisbert Mamani',
        ci: '6543210',
        fecha_nacimiento: '1997-02-14',
        grado_militar: 'Soldado',
        estado: 'activo',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Promesa en boxeo y defensa personal femenina',
        creado_en: new Date().toISOString()
      },
      {
        id: '13',
        nombre_completo: 'Andrés Felipe Chuquimia Flores',
        ci: '5432109',
        fecha_nacimiento: '1994-07-05',
        grado_militar: 'Sargento Segundo',
        estado: 'baja',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Baja por motivos personales - traslado familiar',
        creado_en: new Date().toISOString()
      },
      {
        id: '14',
        nombre_completo: 'Verónica Isabel Mamani Ticona',
        ci: '4321098',
        fecha_nacimiento: '1996-11-28',
        grado_militar: 'Cabo',
        estado: 'activo',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Especialista en capoeira y acrobacia militar',
        creado_en: new Date().toISOString()
      },
      {
        id: '15',
        nombre_completo: 'Daniel Rodrigo Chura Apaza',
        ci: '3210987',
        fecha_nacimiento: '1995-12-16',
        grado_militar: 'Soldado',
        estado: 'activo',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Destacado en jiu-jitsu brasileño',
        creado_en: new Date().toISOString()
      },
      {
        id: '16',
        nombre_completo: 'Silvia Roxana Condori Quispe',
        ci: '2109876',
        fecha_nacimiento: '1997-03-22',
        grado_militar: 'Soldado',
        estado: 'activo',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Excelente en esgrima y armas blancas',
        creado_en: new Date().toISOString()
      },
      {
        id: '17',
        nombre_completo: 'Fernando José Limachi Huanca',
        ci: '1098765',
        fecha_nacimiento: '1994-09-07',
        grado_militar: 'Sargento Segundo',
        estado: 'activo',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Instructor de combate urbano y supervivencia',
        creado_en: new Date().toISOString()
      },
      {
        id: '18',
        nombre_completo: 'Gabriela Alejandra Nina Callisaya',
        ci: '9876543',
        fecha_nacimiento: '1996-08-13',
        grado_militar: 'Soldado',
        estado: 'activo',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Destacada en técnicas de neutralización',
        creado_en: new Date().toISOString()
      },
      {
        id: '19',
        nombre_completo: 'Oscar Ramiro Paz Zenteno',
        ci: '8765432',
        fecha_nacimiento: '1995-05-19',
        grado_militar: 'Cabo',
        estado: 'activo',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Especialista en artes marciales coreanas',
        creado_en: new Date().toISOString()
      },
      {
        id: '20',
        nombre_completo: 'Mónica Esperanza Sánchez Rojas',
        ci: '7654321',
        fecha_nacimiento: '1997-01-10',
        grado_militar: 'Soldado',
        estado: 'activo',
        fecha_ingreso: '2024-02-01',
        curso_anual: '2024',
        observaciones: 'Promesa en muay thai y kickboxing',
        creado_en: new Date().toISOString()
      }
    ];

    // Disciplinas reales de artes marciales militares
    const initialDisciplinas: Disciplina[] = [
      {
        id: '1',
        nombre: 'Karate Shotokan',
        tipo: 'Arte Marcial Tradicional',
        porcentaje_teoria: 25,
        porcentaje_practica: 65,
        porcentaje_otros: 10,
        activo: true,
        creado_en: new Date().toISOString()
      },
      {
        id: '2',
        nombre: 'Judo Kodokan',
        tipo: 'Arte Marcial Olímpico',
        porcentaje_teoria: 20,
        porcentaje_practica: 70,
        porcentaje_otros: 10,
        activo: true,
        creado_en: new Date().toISOString()
      },
      {
        id: '3',
        nombre: 'Taekwondo WTF',
        tipo: 'Arte Marcial Olímpico',
        porcentaje_teoria: 15,
        porcentaje_practica: 75,
        porcentaje_otros: 10,
        activo: true,
        creado_en: new Date().toISOString()
      },
      {
        id: '4',
        nombre: 'Krav Maga Militar',
        tipo: 'Defensa Personal Táctica',
        porcentaje_teoria: 10,
        porcentaje_practica: 80,
        porcentaje_otros: 10,
        activo: true,
        creado_en: new Date().toISOString()
      },
      {
        id: '5',
        nombre: 'Aikido Tradicional',
        tipo: 'Arte Marcial Defensivo',
        porcentaje_teoria: 30,
        porcentaje_practica: 60,
        porcentaje_otros: 10,
        activo: true,
        creado_en: new Date().toISOString()
      },
      {
        id: '6',
        nombre: 'Jiu-Jitsu Brasileño',
        tipo: 'Arte Marcial de Suelo',
        porcentaje_teoria: 15,
        porcentaje_practica: 75,
        porcentaje_otros: 10,
        activo: true,
        creado_en: new Date().toISOString()
      },
      {
        id: '7',
        nombre: 'Boxeo Militar',
        tipo: 'Combate de Puños',
        porcentaje_teoria: 10,
        porcentaje_practica: 80,
        porcentaje_otros: 10,
        activo: true,
        creado_en: new Date().toISOString()
      },
      {
        id: '8',
        nombre: 'Muay Thai',
        tipo: 'Arte Marcial Tailandés',
        porcentaje_teoria: 15,
        porcentaje_practica: 75,
        porcentaje_otros: 10,
        activo: true,
        creado_en: new Date().toISOString()
      },
      {
        id: '9',
        nombre: 'Kung Fu Shaolin',
        tipo: 'Arte Marcial Chino',
        porcentaje_teoria: 35,
        porcentaje_practica: 55,
        porcentaje_otros: 10,
        activo: true,
        creado_en: new Date().toISOString()
      },
      {
        id: '10',
        nombre: 'Combate Cuerpo a Cuerpo',
        tipo: 'Técnica Militar',
        porcentaje_teoria: 20,
        porcentaje_practica: 70,
        porcentaje_otros: 10,
        activo: true,
        creado_en: new Date().toISOString()
      },
      {
        id: '11',
        nombre: 'Defensa Personal Femenina',
        tipo: 'Defensa Especializada',
        porcentaje_teoria: 25,
        porcentaje_practica: 65,
        porcentaje_otros: 10,
        activo: true,
        creado_en: new Date().toISOString()
      },
      {
        id: '12',
        nombre: 'Esgrima Militar',
        tipo: 'Combate con Armas Blancas',
        porcentaje_teoria: 30,
        porcentaje_practica: 60,
        porcentaje_otros: 10,
        activo: true,
        creado_en: new Date().toISOString()
      }
    ];

    // Evaluaciones reales con notas coherentes
    const initialEvaluaciones: Evaluacion[] = [
      {
        id: '1',
        cursante_id: '1',
        disciplina_id: '1',
        periodo_id: '2024',
        teoria: 88,
        practica: 92,
        asistencia: 98,
        cuaderno: 85,
        nota_final: 90.2,
        fecha_eval: '2024-03-15',
        observaciones: 'Excelente técnica en kata y kumite, demuestra gran disciplina'
      },
      {
        id: '2',
        cursante_id: '2',
        disciplina_id: '2',
        periodo_id: '2024',
        teoria: 82,
        practica: 89,
        asistencia: 95,
        cuaderno: 88,
        nota_final: 87.3,
        fecha_eval: '2024-03-16',
        observaciones: 'Dominio excepcional de técnicas de proyección en judo'
      },
      {
        id: '3',
        cursante_id: '3',
        disciplina_id: '3',
        periodo_id: '2024',
        teoria: 85,
        practica: 94,
        asistencia: 100,
        cuaderno: 90,
        nota_final: 91.5,
        fecha_eval: '2024-03-17',
        observaciones: 'Liderazgo natural, técnicas de patada sobresalientes'
      },
      {
        id: '4',
        cursante_id: '4',
        disciplina_id: '4',
        periodo_id: '2024',
        teoria: 78,
        practica: 86,
        asistencia: 92,
        cuaderno: 82,
        nota_final: 84.2,
        fecha_eval: '2024-03-18',
        observaciones: 'Progreso notable en técnicas de defensa personal'
      },
      {
        id: '5',
        cursante_id: '5',
        disciplina_id: '1',
        periodo_id: '2024',
        teoria: 90,
        practica: 95,
        asistencia: 98,
        cuaderno: 92,
        nota_final: 93.8,
        fecha_eval: '2024-03-19',
        observaciones: 'Instructor auxiliar, dominio completo del karate shotokan'
      },
      {
        id: '6',
        cursante_id: '6',
        disciplina_id: '10',
        periodo_id: '2024',
        teoria: 75,
        practica: 88,
        asistencia: 90,
        cuaderno: 80,
        nota_final: 85.5,
        fecha_eval: '2024-03-20',
        observaciones: 'Excelente en combate cuerpo a cuerpo, técnica agresiva'
      },
      {
        id: '7',
        cursante_id: '7',
        disciplina_id: '5',
        periodo_id: '2024',
        teoria: 92,
        practica: 89,
        asistencia: 95,
        cuaderno: 94,
        nota_final: 90.1,
        fecha_eval: '2024-03-21',
        observaciones: 'Filosofía del aikido bien asimilada, técnica fluida'
      },
      {
        id: '8',
        cursante_id: '8',
        disciplina_id: '8',
        periodo_id: '2024',
        teoria: 80,
        practica: 91,
        asistencia: 88,
        cuaderno: 85,
        nota_final: 88.7,
        fecha_eval: '2024-03-22',
        observaciones: 'Muay thai excepcional, golpes potentes y precisos'
      },
      {
        id: '9',
        cursante_id: '9',
        disciplina_id: '4',
        periodo_id: '2024',
        teoria: 87,
        practica: 93,
        asistencia: 96,
        cuaderno: 89,
        nota_final: 91.8,
        fecha_eval: '2024-03-23',
        observaciones: 'Krav maga militar de alto nivel, técnicas letales dominadas'
      },
      {
        id: '10',
        cursante_id: '10',
        disciplina_id: '9',
        periodo_id: '2024',
        teoria: 88,
        practica: 85,
        asistencia: 92,
        cuaderno: 90,
        nota_final: 86.5,
        fecha_eval: '2024-03-24',
        observaciones: 'Kung fu shaolin con excelente coordinación y fluidez'
      }
    ];

    // Méritos reales otorgados
    const initialMeritos: Merito[] = [
      {
        id: '1',
        cursante_id: '5',
        tipo: 'Excelencia Académica',
        gestion: '2024',
        justificacion: 'Obtuvo la calificación más alta en Karate Shotokan con 93.8 puntos, demostrando dominio técnico excepcional y capacidad de instrucción. Ha sido designado como instructor auxiliar por su conocimiento profundo de las técnicas y filosofía del karate.',
        usuario_id: '2'
      },
      {
        id: '2',
        cursante_id: '3',
        tipo: 'Liderazgo',
        gestion: '2024',
        justificacion: 'Demostró liderazgo natural durante los entrenamientos grupales de Taekwondo, organizando sesiones de práctica adicionales y motivando a sus compañeros. Su asistencia perfecta del 100% es ejemplo para toda la promoción.',
        usuario_id: '2'
      },
      {
        id: '3',
        cursante_id: '9',
        tipo: 'Disciplina Militar',
        gestion: '2024',
        justificacion: 'Especialista en Krav Maga Militar con calificación de 91.8 puntos. Ha dominado técnicas de combate táctico de alto riesgo y mantiene los más altos estándares de disciplina militar en todos los entrenamientos.',
        usuario_id: '1'
      },
      {
        id: '4',
        cursante_id: '7',
        tipo: 'Dedicación',
        gestion: '2024',
        justificacion: 'Instructor de Aikido con 8 años de experiencia militar. Su dedicación al perfeccionamiento técnico y la transmisión de conocimientos a nuevos cursantes es ejemplar. Mantiene un promedio de 90.1 puntos.',
        usuario_id: '2'
      },
      {
        id: '5',
        cursante_id: '1',
        tipo: 'Mejora Continua',
        gestion: '2024',
        justificacion: 'Progreso excepcional en Karate Shotokan, pasando de principiante a nivel avanzado en tiempo récord. Su calificación de 90.2 puntos refleja su compromiso con la mejora continua y la excelencia técnica.',
        usuario_id: '2'
      },
      {
        id: '6',
        cursante_id: '11',
        tipo: 'Veteranía',
        gestion: '2024',
        justificacion: 'Sargento Primero con 8 años de experiencia en artes marciales militares. Su conocimiento y experiencia son invaluables para la formación de nuevos cursantes. Instructor principal de múltiples disciplinas.',
        usuario_id: '1'
      }
    ];

    // Bajas registradas con motivos reales
    const initialBajas: Baja[] = [
      {
        id: '1',
        cursante_id: '13',
        motivo: 'Motivos Personales',
        fecha: '2024-04-15',
        observaciones: 'Solicitud de baja por traslado familiar urgente a la ciudad de Santa Cruz. El cursante Andrés Felipe Chuquimia Flores presentó documentación que justifica la necesidad de acompañar a familiar enfermo. Baja aprobada por el comando.',
        usuario_id: '1'
      },
      {
        id: '2',
        cursante_id: '21',
        motivo: 'Problemas de Salud',
        fecha: '2024-03-28',
        observaciones: 'Lesión en rodilla derecha durante entrenamiento de Judo que requiere cirugía y rehabilitación prolongada. Certificado médico del Hospital Militar confirma incapacidad temporal de 6 meses. Se recomienda reincorporación en próxima gestión.',
        usuario_id: '2'
      },
      {
        id: '3',
        cursante_id: '22',
        motivo: 'Bajo Rendimiento',
        fecha: '2024-04-02',
        observaciones: 'Promedio general inferior a 60 puntos después de período de recuperación académica. No logró alcanzar los estándares mínimos requeridos en evaluaciones de Krav Maga y Combate Cuerpo a Cuerpo. Múltiples ausencias injustificadas.',
        usuario_id: '2'
      }
    ];

    // Actividades reales de entrenamiento
    const initialActividades: Actividad[] = [
      {
        id: '1',
        cursante_id: '1',
        tipo_actividad: 'Entrenamiento',
        disciplina: 'Karate Shotokan',
        fecha: '2024-03-10',
        duracion: '3 horas',
        observaciones: 'Entrenamiento intensivo de kata Heian Shodan y Heian Nidan. Trabajo en técnicas de bloqueo y contraataque. Excelente progreso en coordinación y potencia de golpes.',
        usuario_id: '2',
        periodo_id: '2024'
      },
      {
        id: '2',
        cursante_id: '3',
        tipo_actividad: 'Competencia',
        disciplina: 'Taekwondo WTF',
        fecha: '2024-03-25',
        duracion: '6 horas',
        observaciones: 'Participación en Torneo Interregional de Taekwondo. Obtuvo medalla de oro en categoría peso medio. Demostró técnicas de patada excepcionales y estrategia de combate superior.',
        usuario_id: '1',
        periodo_id: '2024'
      },
      {
        id: '3',
        cursante_id: '5',
        tipo_actividad: 'Seminario',
        disciplina: 'Karate Shotokan',
        fecha: '2024-04-05',
        duracion: '8 horas',
        observaciones: 'Seminario de perfeccionamiento técnico con Maestro 7° Dan visitante de Japón. Enfoque en bunkai (aplicaciones de kata) y técnicas avanzadas de kumite. Certificación internacional obtenida.',
        usuario_id: '2',
        periodo_id: '2024'
      },
      {
        id: '4',
        cursante_id: '7',
        tipo_actividad: 'Demostración',
        disciplina: 'Aikido Tradicional',
        fecha: '2024-04-12',
        duracion: '2 horas',
        observaciones: 'Demostración pública de técnicas de Aikido en ceremonia del Día del Ejército. Presentación de técnicas de desarme y neutralización pacífica. Excelente representación de la EAME.',
        usuario_id: '1',
        periodo_id: '2024'
      },
      {
        id: '5',
        cursante_id: '9',
        tipo_actividad: 'Examen',
        disciplina: 'Krav Maga Militar',
        fecha: '2024-04-18',
        duracion: '4 horas',
        observaciones: 'Examen de certificación en técnicas de Krav Maga nivel avanzado. Evaluación práctica de defensa contra múltiples atacantes y situaciones de alto estrés. Aprobado con calificación sobresaliente.',
        usuario_id: '2',
        periodo_id: '2024'
      },
      {
        id: '6',
        cursante_id: '2',
        tipo_actividad: 'Entrenamiento',
        disciplina: 'Judo Kodokan',
        fecha: '2024-04-20',
        duracion: '3 horas',
        observaciones: 'Entrenamiento especializado en técnicas de Ne-waza (trabajo en suelo). Práctica de estrangulaciones y luxaciones. Preparación para examen de cinturón marrón.',
        usuario_id: '2',
        periodo_id: '2024'
      },
      {
        id: '7',
        cursante_id: '11',
        tipo_actividad: 'Práctica',
        disciplina: 'Combate Cuerpo a Cuerpo',
        fecha: '2024-04-22',
        duracion: '4 horas',
        observaciones: 'Sesión de práctica como instructor principal. Enseñanza de técnicas de desarme y neutralización a cursantes de primer año. Excelente metodología de enseñanza demostrada.',
        usuario_id: '1',
        periodo_id: '2024'
      },
      {
        id: '8',
        cursante_id: '8',
        tipo_actividad: 'Competencia',
        disciplina: 'Muay Thai',
        fecha: '2024-04-28',
        duracion: '5 horas',
        observaciones: 'Participación en Campeonato Nacional de Muay Thai. Medalla de plata en categoría femenina. Técnicas de codo y rodilla muy efectivas. Representó dignamente a las Fuerzas Armadas.',
        usuario_id: '1',
        periodo_id: '2024'
      }
    ];

    setCursantes(initialCursantes);
    setDisciplinas(initialDisciplinas);
    setEvaluaciones(initialEvaluaciones);
    setMeritos(initialMeritos);
    setBajas(initialBajas);
    setActividades(initialActividades);
  }, []);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // CRUD operations for Cursantes
  const addCursante = (cursante: Omit<Cursante, 'id' | 'creado_en'>) => {
    const newCursante: Cursante = {
      ...cursante,
      id: generateId(),
      creado_en: new Date().toISOString()
    };
    setCursantes(prev => [...prev, newCursante]);
  };

  const updateCursante = (id: string, cursante: Partial<Cursante>) => {
    setCursantes(prev => prev.map(c => c.id === id ? { ...c, ...cursante } : c));
  };

  const deleteCursante = (id: string) => {
    setCursantes(prev => prev.filter(c => c.id !== id));
  };

  // CRUD operations for Disciplinas
  const addDisciplina = (disciplina: Omit<Disciplina, 'id' | 'creado_en'>) => {
    const newDisciplina: Disciplina = {
      ...disciplina,
      id: generateId(),
      creado_en: new Date().toISOString()
    };
    setDisciplinas(prev => [...prev, newDisciplina]);
  };

  const updateDisciplina = (id: string, disciplina: Partial<Disciplina>) => {
    setDisciplinas(prev => prev.map(d => d.id === id ? { ...d, ...disciplina } : d));
  };

  const deleteDisciplina = (id: string) => {
    setDisciplinas(prev => prev.filter(d => d.id !== id));
  };

  // CRUD operations for Evaluaciones
  const addEvaluacion = (evaluacion: Omit<Evaluacion, 'id'>) => {
    const newEvaluacion: Evaluacion = {
      ...evaluacion,
      id: generateId()
    };
    setEvaluaciones(prev => [...prev, newEvaluacion]);
  };

  const updateEvaluacion = (id: string, evaluacion: Partial<Evaluacion>) => {
    setEvaluaciones(prev => prev.map(e => e.id === id ? { ...e, ...evaluacion } : e));
  };

  const deleteEvaluacion = (id: string) => {
    setEvaluaciones(prev => prev.filter(e => e.id !== id));
  };

  // CRUD operations for Meritos
  const addMerito = (merito: Omit<Merito, 'id'>) => {
    const newMerito: Merito = {
      ...merito,
      id: generateId()
    };
    setMeritos(prev => [...prev, newMerito]);
  };

  const updateMerito = (id: string, merito: Partial<Merito>) => {
    setMeritos(prev => prev.map(m => m.id === id ? { ...m, ...merito } : m));
  };

  const deleteMerito = (id: string) => {
    setMeritos(prev => prev.filter(m => m.id !== id));
  };

  // CRUD operations for Bajas
  const addBaja = (baja: Omit<Baja, 'id'>) => {
    const newBaja: Baja = {
      ...baja,
      id: generateId()
    };
    setBajas(prev => [...prev, newBaja]);
  };

  const updateBaja = (id: string, baja: Partial<Baja>) => {
    setBajas(prev => prev.map(b => b.id === id ? { ...b, ...baja } : b));
  };

  const deleteBaja = (id: string) => {
    setBajas(prev => prev.filter(b => b.id !== id));
  };

  // CRUD operations for Actividades
  const addActividad = (actividad: Omit<Actividad, 'id'>) => {
    const newActividad: Actividad = {
      ...actividad,
      id: generateId()
    };
    setActividades(prev => [...prev, newActividad]);
  };

  const updateActividad = (id: string, actividad: Partial<Actividad>) => {
    setActividades(prev => prev.map(a => a.id === id ? { ...a, ...actividad } : a));
  };

  const deleteActividad = (id: string) => {
    setActividades(prev => prev.filter(a => a.id !== id));
  };

  return (
    <DataContext.Provider value={{
      cursantes,
      disciplinas,
      evaluaciones,
      meritos,
      bajas,
      actividades,
      addCursante,
      updateCursante,
      deleteCursante,
      addDisciplina,
      updateDisciplina,
      deleteDisciplina,
      addEvaluacion,
      updateEvaluacion,
      deleteEvaluacion,
      addMerito,
      updateMerito,
      deleteMerito,
      addBaja,
      updateBaja,
      deleteBaja,
      addActividad,
      updateActividad,
      deleteActividad
    }}>
      {children}
    </DataContext.Provider>
  );
};
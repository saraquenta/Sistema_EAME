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
    // Datos iniciales de cursantes (50 registros)
    const initialCursantes: Cursante[] = [
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
    const initialDisciplinas: Disciplina[] = [
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
    const initialEvaluaciones: Evaluacion[] = [
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
    const initialMeritos: Merito[] = Array.from({ length: 30 }, (_, i) => ({
      id: (i + 1).toString(),
      cursante_id: Math.floor(Math.random() * 50 + 1).toString(),
      tipo: ['Excelencia Académica', 'Liderazgo', 'Disciplina', 'Compañerismo', 'Mejora Continua', 'Dedicación'][Math.floor(Math.random() * 6)],
      gestion: '2024',
      justificacion: `Justificación del mérito ${i + 1}: Demostró excelente desempeño y dedicación en sus actividades.`,
      usuario_id: '1'
    }));

    // Datos iniciales de bajas (20 registros)
    const initialBajas: Baja[] = Array.from({ length: 20 }, (_, i) => ({
      id: (i + 1).toString(),
      cursante_id: Math.floor(Math.random() * 50 + 1).toString(),
      motivo: ['Bajo Rendimiento', 'Problemas Disciplinarios', 'Motivos Personales', 'Problemas de Salud', 'Traslado', 'Otros'][Math.floor(Math.random() * 6)],
      fecha: `2024-0${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      observaciones: `Observaciones de baja ${i + 1}: Detalles específicos del motivo de la baja.`,
      usuario_id: '1'
    }));

    // Datos iniciales de actividades (40 registros)
    const initialActividades: Actividad[] = Array.from({ length: 40 }, (_, i) => ({
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
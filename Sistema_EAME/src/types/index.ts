export interface User {
  id: string;
  username: string;
  email: string;
  role: 'administrador' | 'jefe_evaluaciones' | 'comandante';
  nombre_completo: string;
  activo: boolean;
  creado_en: string;
}

export interface Cursante {
  id: string;
  nombre_completo: string;
  ci: string;
  fecha_nacimiento: string;
  grado_militar: string;
  estado: 'activo' | 'baja' | 'suspendido';
  fecha_ingreso: string;
  curso_anual: string;
  observaciones: string;
  creado_en: string;
}

export interface Disciplina {
  id: string;
  nombre: string;
  tipo: string;
  porcentaje_teoria: number;
  porcentaje_practica: number;
  porcentaje_otros: number;
  activo: boolean;
  creado_en: string;
}

export interface Evaluacion {
  id: string;
  cursante_id: string;
  disciplina_id: string;
  periodo_id: string;
  teoria: number;
  practica: number;
  asistencia: number;
  cuaderno: number;
  nota_final: number;
  fecha_eval: string;
  observaciones: string;
}

export interface Merito {
  id: string;
  cursante_id: string;
  tipo: string;
  gestion: string;
  justificacion: string;
  usuario_id: string;
}

export interface Baja {
  id: string;
  cursante_id: string;
  motivo: string;
  fecha: string;
  observaciones: string;
  usuario_id: string;
}

export interface Actividad {
  id: string;
  cursante_id: string;
  tipo_actividad: string;
  disciplina: string;
  fecha: string;
  duracion: string;
  observaciones: string;
  usuario_id: string;
  periodo_id: string;
}
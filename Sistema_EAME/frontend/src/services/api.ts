import axios from 'axios';

// Configuración base de Axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  refresh: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  }
};

// Servicios de cursantes
export const cursantesService = {
  getAll: async () => {
    const response = await api.get('/cursantes');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/cursantes/${id}`);
    return response.data;
  },
  
  create: async (cursante: any) => {
    const response = await api.post('/cursantes', cursante);
    return response.data;
  },
  
  update: async (id: string, cursante: any) => {
    const response = await api.put(`/cursantes/${id}`, cursante);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/cursantes/${id}`);
    return response.data;
  }
};

// Servicios de disciplinas
export const disciplinasService = {
  getAll: async () => {
    const response = await api.get('/disciplinas');
    return response.data;
  },
  
  create: async (disciplina: any) => {
    const response = await api.post('/disciplinas', disciplina);
    return response.data;
  },
  
  update: async (id: string, disciplina: any) => {
    const response = await api.put(`/disciplinas/${id}`, disciplina);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/disciplinas/${id}`);
    return response.data;
  }
};

// Servicios de evaluaciones
export const evaluacionesService = {
  getAll: async () => {
    const response = await api.get('/evaluaciones');
    return response.data;
  },
  
  create: async (evaluacion: any) => {
    const response = await api.post('/evaluaciones', evaluacion);
    return response.data;
  },
  
  update: async (id: string, evaluacion: any) => {
    const response = await api.put(`/evaluaciones/${id}`, evaluacion);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/evaluaciones/${id}`);
    return response.data;
  }
};

// Servicios de méritos
export const meritosService = {
  getAll: async () => {
    const response = await api.get('/meritos');
    return response.data;
  },
  
  create: async (merito: any) => {
    const response = await api.post('/meritos', merito);
    return response.data;
  },
  
  update: async (id: string, merito: any) => {
    const response = await api.put(`/meritos/${id}`, merito);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/meritos/${id}`);
    return response.data;
  }
};

// Servicios de bajas
export const bajasService = {
  getAll: async () => {
    const response = await api.get('/bajas');
    return response.data;
  },
  
  create: async (baja: any) => {
    const response = await api.post('/bajas', baja);
    return response.data;
  },
  
  update: async (id: string, baja: any) => {
    const response = await api.put(`/bajas/${id}`, baja);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/bajas/${id}`);
    return response.data;
  }
};

// Servicios de actividades
export const actividadesService = {
  getAll: async () => {
    const response = await api.get('/actividades');
    return response.data;
  },
  
  create: async (actividad: any) => {
    const response = await api.post('/actividades', actividad);
    return response.data;
  },
  
  update: async (id: string, actividad: any) => {
    const response = await api.put(`/actividades/${id}`, actividad);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/actividades/${id}`);
    return response.data;
  }
};

// Servicios de reportes
export const reportesService = {
  getEstadisticas: async (year?: number) => {
    const response = await api.get('/reportes/estadisticas', {
      params: year ? { year } : {}
    });
    return response.data;
  },
  
  getBajasDetalladas: async () => {
    const response = await api.get('/reportes/bajas-detalladas');
    return response.data;
  },
  
  getMeritosDetallados: async () => {
    const response = await api.get('/reportes/meritos-detallados');
    return response.data;
  },
  
  getRanking: async (year: string) => {
    const response = await api.get(`/reportes/ranking/${year}`);
    return response.data;
  }
};

export default api;
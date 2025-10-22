import React, { useState, useEffect } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Actividad } from '../../types';

interface ActividadFormProps {
  actividad?: Actividad | null;
  onClose: () => void;
}

const ActividadForm: React.FC<ActividadFormProps> = ({ actividad, onClose }) => {
  const { addActividad, updateActividad, cursantes, disciplinas } = useData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    cursante_id: '',
    tipo_actividad: '',
    disciplina: '',
    fecha: new Date().toISOString().split('T')[0],
    duracion: '',
    observaciones: '',
    usuario_id: user?.id || '',
    periodo_id: new Date().getFullYear().toString()
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (actividad) {
      setFormData({
        cursante_id: actividad.cursante_id,
        tipo_actividad: actividad.tipo_actividad,
        disciplina: actividad.disciplina,
        fecha: actividad.fecha,
        duracion: actividad.duracion,
        observaciones: actividad.observaciones,
        usuario_id: actividad.usuario_id,
        periodo_id: actividad.periodo_id
      });
    }
  }, [actividad]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cursante_id) {
      newErrors.cursante_id = 'Debe seleccionar un cursante';
    }

    if (!formData.tipo_actividad.trim()) {
      newErrors.tipo_actividad = 'El tipo de actividad es requerido';
    }

    if (!formData.disciplina.trim()) {
      newErrors.disciplina = 'La disciplina es requerida';
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    }

    if (!formData.duracion.trim()) {
      newErrors.duracion = 'La duración es requerida';
    }

    if (!formData.observaciones.trim()) {
      newErrors.observaciones = 'Las observaciones son requeridas';
    } else if (formData.observaciones.length < 10) {
      newErrors.observaciones = 'Las observaciones deben tener al menos 10 caracteres';
    }

    if (!formData.periodo_id.trim()) {
      newErrors.periodo_id = 'El período es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (actividad) {
      updateActividad(actividad.id, formData);
    } else {
      addActividad(formData);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const tiposActividad = [
    'Entrenamiento',
    'Competencia',
    'Examen',
    'Seminario',
    'Práctica',
    'Demostración'
  ];

  const cursantesActivos = cursantes.filter(c => c.estado === 'activo');
  const disciplinasActivas = disciplinas.filter(d => d.activo);

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {actividad ? 'Editar Actividad' : 'Nueva Actividad'}
            </h2>
            <p className="text-gray-600">
              {actividad ? 'Modificar actividad existente' : 'Registrar nueva actividad de cursante'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="cursante_id" className="block text-sm font-medium text-gray-700 mb-2">
                Cursante *
              </label>
              <select
                id="cursante_id"
                name="cursante_id"
                value={formData.cursante_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.cursante_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar cursante</option>
                {cursantesActivos.map(cursante => (
                  <option key={cursante.id} value={cursante.id}>
                    {cursante.nombre_completo} - {cursante.grado_militar}
                  </option>
                ))}
              </select>
              {errors.cursante_id && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.cursante_id}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="tipo_actividad" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Actividad *
              </label>
              <select
                id="tipo_actividad"
                name="tipo_actividad"
                value={formData.tipo_actividad}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.tipo_actividad ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar tipo</option>
                {tiposActividad.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              {errors.tipo_actividad && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.tipo_actividad}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="disciplina" className="block text-sm font-medium text-gray-700 mb-2">
                Disciplina *
              </label>
              <select
                id="disciplina"
                name="disciplina"
                value={formData.disciplina}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.disciplina ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar disciplina</option>
                {disciplinasActivas.map(disciplina => (
                  <option key={disciplina.id} value={disciplina.nombre}>{disciplina.nombre}</option>
                ))}
              </select>
              {errors.disciplina && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.disciplina}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.fecha ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fecha && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fecha}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="duracion" className="block text-sm font-medium text-gray-700 mb-2">
                Duración *
              </label>
              <input
                type="text"
                id="duracion"
                name="duracion"
                value={formData.duracion}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.duracion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: 2 horas, 90 minutos"
              />
              {errors.duracion && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.duracion}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="periodo_id" className="block text-sm font-medium text-gray-700 mb-2">
                Período *
              </label>
              <input
                type="text"
                id="periodo_id"
                name="periodo_id"
                value={formData.periodo_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.periodo_id ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="2024"
              />
              {errors.periodo_id && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.periodo_id}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones *
              </label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.observaciones ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describa los detalles de la actividad, resultados obtenidos, etc..."
              />
              {errors.observaciones && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.observaciones}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {actividad ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActividadForm;
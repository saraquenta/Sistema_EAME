import React, { useState, useEffect } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Merito } from '../../types';

interface MeritoFormProps {
  merito?: Merito | null;
  onClose: () => void;
}

const MeritoForm: React.FC<MeritoFormProps> = ({ merito, onClose }) => {
  const { addMerito, updateMerito, cursantes } = useData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    cursante_id: '',
    tipo: '',
    gestion: new Date().getFullYear().toString(),
    justificacion: '',
    usuario_id: user?.id || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (merito) {
      setFormData({
        cursante_id: merito.cursante_id,
        tipo: merito.tipo,
        gestion: merito.gestion,
        justificacion: merito.justificacion,
        usuario_id: merito.usuario_id
      });
    }
  }, [merito]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cursante_id) {
      newErrors.cursante_id = 'Debe seleccionar un cursante';
    }

    if (!formData.tipo.trim()) {
      newErrors.tipo = 'El tipo de mérito es requerido';
    }

    if (!formData.gestion.trim()) {
      newErrors.gestion = 'La gestión es requerida';
    } else if (!/^\d{4}$/.test(formData.gestion)) {
      newErrors.gestion = 'La gestión debe ser un año válido (4 dígitos)';
    }

    if (!formData.justificacion.trim()) {
      newErrors.justificacion = 'La justificación es requerida';
    } else if (formData.justificacion.length < 10) {
      newErrors.justificacion = 'La justificación debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (merito) {
      updateMerito(merito.id, formData);
    } else {
      addMerito(formData);
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

  const tiposMerito = [
    'Excelencia Académica',
    'Liderazgo',
    'Disciplina',
    'Compañerismo',
    'Mejora Continua',
    'Dedicación'
  ];

  const cursantesActivos = cursantes.filter(c => c.estado === 'activo');

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {merito ? 'Editar Mérito' : 'Nuevo Mérito'}
            </h2>
            <p className="text-gray-600">
              {merito ? 'Modificar mérito existente' : 'Otorgar nuevo mérito a cursante'}
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
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Mérito *
              </label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.tipo ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar tipo</option>
                {tiposMerito.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              {errors.tipo && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.tipo}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="gestion" className="block text-sm font-medium text-gray-700 mb-2">
                Gestión *
              </label>
              <input
                type="text"
                id="gestion"
                name="gestion"
                value={formData.gestion}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.gestion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="2024"
              />
              {errors.gestion && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.gestion}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="justificacion" className="block text-sm font-medium text-gray-700 mb-2">
                Justificación *
              </label>
              <textarea
                id="justificacion"
                name="justificacion"
                value={formData.justificacion}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.justificacion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describa detalladamente los motivos del mérito..."
              />
              {errors.justificacion && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.justificacion}
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
              {merito ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeritoForm;
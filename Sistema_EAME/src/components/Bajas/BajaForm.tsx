import React, { useState, useEffect } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Baja } from '../../types';

interface BajaFormProps {
  baja?: Baja | null;
  onClose: () => void;
}

const BajaForm: React.FC<BajaFormProps> = ({ baja, onClose }) => {
  const { addBaja, updateBaja, cursantes } = useData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    cursante_id: '',
    motivo: '',
    fecha: new Date().toISOString().split('T')[0],
    observaciones: '',
    usuario_id: user?.id || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (baja) {
      setFormData({
        cursante_id: baja.cursante_id,
        motivo: baja.motivo,
        fecha: baja.fecha,
        observaciones: baja.observaciones,
        usuario_id: baja.usuario_id
      });
    }
  }, [baja]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cursante_id) {
      newErrors.cursante_id = 'Debe seleccionar un cursante';
    }

    if (!formData.motivo.trim()) {
      newErrors.motivo = 'El motivo es requerido';
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    }

    if (!formData.observaciones.trim()) {
      newErrors.observaciones = 'Las observaciones son requeridas';
    } else if (formData.observaciones.length < 10) {
      newErrors.observaciones = 'Las observaciones deben tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (baja) {
      updateBaja(baja.id, formData);
    } else {
      addBaja(formData);
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

  const motivosBaja = [
    'Bajo Rendimiento',
    'Problemas Disciplinarios',
    'Motivos Personales',
    'Problemas de Salud',
    'Traslado',
    'Otros'
  ];

  const cursantesActivos = cursantes.filter(c => c.estado === 'activo');

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {baja ? 'Editar Baja' : 'Nueva Baja'}
            </h2>
            <p className="text-gray-600">
              {baja ? 'Modificar registro de baja' : 'Registrar nueva baja de cursante'}
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
              <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de Baja *
              </label>
              <select
                id="motivo"
                name="motivo"
                value={formData.motivo}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.motivo ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar motivo</option>
                {motivosBaja.map(motivo => (
                  <option key={motivo} value={motivo}>{motivo}</option>
                ))}
              </select>
              {errors.motivo && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.motivo}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Baja *
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
                placeholder="Describa detalladamente los motivos y circunstancias de la baja..."
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
              {baja ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BajaForm;
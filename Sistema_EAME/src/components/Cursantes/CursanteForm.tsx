import React, { useState, useEffect } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Cursante } from '../../types';

interface CursanteFormProps {
  cursante?: Cursante | null;
  onClose: () => void;
}

const CursanteForm: React.FC<CursanteFormProps> = ({ cursante, onClose }) => {
  const { addCursante, updateCursante } = useData();
  const [formData, setFormData] = useState({
    nombre_completo: '',
    ci: '',
    fecha_nacimiento: '',
    grado_militar: '',
    estado: 'activo' as const,
    fecha_ingreso: '',
    curso_anual: new Date().getFullYear().toString(),
    observaciones: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cursante) {
      setFormData({
        nombre_completo: cursante.nombre_completo,
        ci: cursante.ci,
        fecha_nacimiento: cursante.fecha_nacimiento,
        grado_militar: cursante.grado_militar,
        estado: cursante.estado,
        fecha_ingreso: cursante.fecha_ingreso,
        curso_anual: cursante.curso_anual,
        observaciones: cursante.observaciones
      });
    }
  }, [cursante]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre_completo.trim()) {
      newErrors.nombre_completo = 'El nombre completo es requerido';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre_completo)) {
      newErrors.nombre_completo = 'El nombre solo debe contener letras';
    }

    if (!formData.ci.trim()) {
      newErrors.ci = 'El CI es requerido';
    } else if (!/^\d+$/.test(formData.ci)) {
      newErrors.ci = 'El CI solo debe contener números';
    }

    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = 'La fecha de nacimiento es requerida';
    }

    if (!formData.grado_militar.trim()) {
      newErrors.grado_militar = 'El grado militar es requerido';
    }

    if (!formData.fecha_ingreso) {
      newErrors.fecha_ingreso = 'La fecha de ingreso es requerida';
    }

    if (!formData.curso_anual.trim()) {
      newErrors.curso_anual = 'El curso anual es requerido';
    } else if (!/^\d{4}$/.test(formData.curso_anual)) {
      newErrors.curso_anual = 'El curso debe ser un año válido (4 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (cursante) {
      updateCursante(cursante.id, formData);
    } else {
      addCursante(formData);
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

  const gradosMilitares = [
    'Soldado',
    'Cabo',
    'Sargento Segundo',
    'Sargento Primero',
    'Sargento Inicial',
    'Sargento Mayor',
    'Subteniente',
    'Teniente',
    'Capitán',
    'Mayor',
    'Teniente Coronel',
    'Coronel'
  ];

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {cursante ? 'Editar Cursante' : 'Nuevo Cursante'}
            </h2>
            <p className="text-gray-600">
              {cursante ? 'Modificar información del cursante' : 'Registrar nuevo cursante en el sistema'}
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
            <div className="md:col-span-2">
              <label htmlFor="nombre_completo" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="nombre_completo"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.nombre_completo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ingrese el nombre completo"
              />
              {errors.nombre_completo && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.nombre_completo}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="ci" className="block text-sm font-medium text-gray-700 mb-2">
                Cédula de Identidad *
              </label>
              <input
                type="text"
                id="ci"
                name="ci"
                value={formData.ci}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.ci ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Número de CI"
              />
              {errors.ci && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.ci}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.fecha_nacimiento ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fecha_nacimiento && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fecha_nacimiento}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="grado_militar" className="block text-sm font-medium text-gray-700 mb-2">
                Grado Militar *
              </label>
              <select
                id="grado_militar"
                name="grado_militar"
                value={formData.grado_militar}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.grado_militar ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar grado</option>
                {gradosMilitares.map(grado => (
                  <option key={grado} value={grado}>{grado}</option>
                ))}
              </select>
              {errors.grado_militar && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.grado_militar}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="activo">Activo</option>
                <option value="suspendido">Suspendido</option>
                <option value="baja">Baja</option>
              </select>
            </div>

            <div>
              <label htmlFor="fecha_ingreso" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Ingreso *
              </label>
              <input
                type="date"
                id="fecha_ingreso"
                name="fecha_ingreso"
                value={formData.fecha_ingreso}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.fecha_ingreso ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fecha_ingreso && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fecha_ingreso}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="curso_anual" className="block text-sm font-medium text-gray-700 mb-2">
                Curso Anual *
              </label>
              <input
                type="text"
                id="curso_anual"
                name="curso_anual"
                value={formData.curso_anual}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.curso_anual ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="2024"
              />
              {errors.curso_anual && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.curso_anual}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Observaciones adicionales..."
              />
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
              {cursante ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CursanteForm;
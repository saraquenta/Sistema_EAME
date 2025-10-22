import React, { useState, useEffect } from 'react';
import { Save, X, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Disciplina } from '../../types';

interface DisciplinaFormProps {
  disciplina?: Disciplina | null;
  onClose: () => void;
}

const DisciplinaForm: React.FC<DisciplinaFormProps> = ({ disciplina, onClose }) => {
  const { addDisciplina, updateDisciplina } = useData();
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    porcentaje_teoria: 30,
    porcentaje_practica: 60,
    porcentaje_otros: 10,
    activo: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (disciplina) {
      setFormData({
        nombre: disciplina.nombre,
        tipo: disciplina.tipo,
        porcentaje_teoria: disciplina.porcentaje_teoria,
        porcentaje_practica: disciplina.porcentaje_practica,
        porcentaje_otros: disciplina.porcentaje_otros,
        activo: disciplina.activo
      });
    }
  }, [disciplina]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.tipo.trim()) {
      newErrors.tipo = 'El tipo es requerido';
    }

    const totalPorcentaje = formData.porcentaje_teoria + formData.porcentaje_practica + formData.porcentaje_otros;
    if (totalPorcentaje !== 100) {
      newErrors.porcentajes = 'Los porcentajes deben sumar exactamente 100%';
    }

    if (formData.porcentaje_teoria < 0 || formData.porcentaje_teoria > 100) {
      newErrors.porcentaje_teoria = 'El porcentaje debe estar entre 0 y 100';
    }

    if (formData.porcentaje_practica < 0 || formData.porcentaje_practica > 100) {
      newErrors.porcentaje_practica = 'El porcentaje debe estar entre 0 y 100';
    }

    if (formData.porcentaje_otros < 0 || formData.porcentaje_otros > 100) {
      newErrors.porcentaje_otros = 'El porcentaje debe estar entre 0 y 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (disciplina) {
      updateDisciplina(disciplina.id, formData);
    } else {
      addDisciplina(formData);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name.includes('porcentaje')) {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const tiposDisciplina = [
    'Arte Marcial',
    'Defensa Personal',
    'Combate',
    'Acondicionamiento Físico',
    'Técnicas Especiales'
  ];

  const totalPorcentaje = formData.porcentaje_teoria + formData.porcentaje_practica + formData.porcentaje_otros;

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {disciplina ? 'Editar Disciplina' : 'Nueva Disciplina'}
            </h2>
            <p className="text-gray-600">
              {disciplina ? 'Modificar información de la disciplina' : 'Registrar nueva disciplina en el sistema'}
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
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Disciplina *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Karate, Judo, Taekwondo"
              />
              {errors.nombre && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.nombre}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Disciplina *
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
                {tiposDisciplina.map(tipo => (
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
          </div>

          {/* Porcentajes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Distribución de Evaluación</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                totalPorcentaje === 100 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                Total: {totalPorcentaje}%
              </div>
            </div>

            {errors.porcentajes && (
              <div className="flex items-center gap-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.porcentajes}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="porcentaje_teoria" className="block text-sm font-medium text-gray-700 mb-2">
                  Teoría (%)
                </label>
                <input
                  type="number"
                  id="porcentaje_teoria"
                  name="porcentaje_teoria"
                  value={formData.porcentaje_teoria}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.porcentaje_teoria ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all" 
                    style={{ width: `${formData.porcentaje_teoria}%` }}
                  ></div>
                </div>
                {errors.porcentaje_teoria && (
                  <div className="mt-1 text-red-600 text-xs">{errors.porcentaje_teoria}</div>
                )}
              </div>

              <div>
                <label htmlFor="porcentaje_practica" className="block text-sm font-medium text-gray-700 mb-2">
                  Práctica (%)
                </label>
                <input
                  type="number"
                  id="porcentaje_practica"
                  name="porcentaje_practica"
                  value={formData.porcentaje_practica}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.porcentaje_practica ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all" 
                    style={{ width: `${formData.porcentaje_practica}%` }}
                  ></div>
                </div>
                {errors.porcentaje_practica && (
                  <div className="mt-1 text-red-600 text-xs">{errors.porcentaje_practica}</div>
                )}
              </div>

              <div>
                <label htmlFor="porcentaje_otros" className="block text-sm font-medium text-gray-700 mb-2">
                  Otros (%)
                </label>
                <input
                  type="number"
                  id="porcentaje_otros"
                  name="porcentaje_otros"
                  value={formData.porcentaje_otros}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.porcentaje_otros ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full transition-all" 
                    style={{ width: `${formData.porcentaje_otros}%` }}
                  ></div>
                </div>
                {errors.porcentaje_otros && (
                  <div className="mt-1 text-red-600 text-xs">{errors.porcentaje_otros}</div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="activo"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
            />
            <label htmlFor="activo" className="ml-2 text-sm font-medium text-gray-700">
              Disciplina activa
            </label>
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
              {disciplina ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DisciplinaForm;
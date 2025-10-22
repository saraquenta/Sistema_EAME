import React, { useState, useEffect } from 'react';
import { Save, X, AlertCircle, Calculator } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Evaluacion } from '../../types';

interface EvaluacionFormProps {
  evaluacion?: Evaluacion | null;
  onClose: () => void;
}

const EvaluacionForm: React.FC<EvaluacionFormProps> = ({ evaluacion, onClose }) => {
  const { addEvaluacion, updateEvaluacion, cursantes, disciplinas } = useData();
  const [formData, setFormData] = useState({
    cursante_id: '',
    disciplina_id: '',
    periodo_id: new Date().getFullYear().toString(),
    teoria: 0,
    practica: 0,
    asistencia: 0,
    cuaderno: 0,
    nota_final: 0,
    fecha_eval: new Date().toISOString().split('T')[0],
    observaciones: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (evaluacion) {
      setFormData({
        cursante_id: evaluacion.cursante_id,
        disciplina_id: evaluacion.disciplina_id,
        periodo_id: evaluacion.periodo_id,
        teoria: evaluacion.teoria,
        practica: evaluacion.practica,
        asistencia: evaluacion.asistencia,
        cuaderno: evaluacion.cuaderno,
        nota_final: evaluacion.nota_final,
        fecha_eval: evaluacion.fecha_eval,
        observaciones: evaluacion.observaciones
      });
    }
  }, [evaluacion]);

  const calculateNotaFinal = () => {
    const disciplina = disciplinas.find(d => d.id === formData.disciplina_id);
    if (!disciplina) return 0;

    const notaTeoria = (formData.teoria * disciplina.porcentaje_teoria) / 100;
    const notaPractica = (formData.practica * disciplina.porcentaje_practica) / 100;
    const notaOtros = ((formData.asistencia + formData.cuaderno) / 2 * disciplina.porcentaje_otros) / 100;
    
    return notaTeoria + notaPractica + notaOtros;
  };

  useEffect(() => {
    const notaCalculada = calculateNotaFinal();
    setFormData(prev => ({ ...prev, nota_final: notaCalculada }));
  }, [formData.teoria, formData.practica, formData.asistencia, formData.cuaderno, formData.disciplina_id]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cursante_id) {
      newErrors.cursante_id = 'Debe seleccionar un cursante';
    }

    if (!formData.disciplina_id) {
      newErrors.disciplina_id = 'Debe seleccionar una disciplina';
    }

    if (!formData.periodo_id.trim()) {
      newErrors.periodo_id = 'El período es requerido';
    }

    if (formData.teoria < 0 || formData.teoria > 100) {
      newErrors.teoria = 'La nota de teoría debe estar entre 0 y 100';
    }

    if (formData.practica < 0 || formData.practica > 100) {
      newErrors.practica = 'La nota de práctica debe estar entre 0 y 100';
    }

    if (formData.asistencia < 0 || formData.asistencia > 100) {
      newErrors.asistencia = 'La nota de asistencia debe estar entre 0 y 100';
    }

    if (formData.cuaderno < 0 || formData.cuaderno > 100) {
      newErrors.cuaderno = 'La nota de cuaderno debe estar entre 0 y 100';
    }

    if (!formData.fecha_eval) {
      newErrors.fecha_eval = 'La fecha de evaluación es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (evaluacion) {
      updateEvaluacion(evaluacion.id, formData);
    } else {
      addEvaluacion(formData);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'teoria' || name === 'practica' || name === 'asistencia' || name === 'cuaderno') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const cursantesActivos = cursantes.filter(c => c.estado === 'activo');
  const disciplinasActivas = disciplinas.filter(d => d.activo);
  const disciplinaSeleccionada = disciplinas.find(d => d.id === formData.disciplina_id);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {evaluacion ? 'Editar Evaluación' : 'Nueva Evaluación'}
            </h2>
            <p className="text-gray-600">
              {evaluacion ? 'Modificar evaluación existente' : 'Registrar nueva evaluación de cursante'}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <label htmlFor="disciplina_id" className="block text-sm font-medium text-gray-700 mb-2">
                Disciplina *
              </label>
              <select
                id="disciplina_id"
                name="disciplina_id"
                value={formData.disciplina_id}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.disciplina_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar disciplina</option>
                {disciplinasActivas.map(disciplina => (
                  <option key={disciplina.id} value={disciplina.id}>
                    {disciplina.nombre} - {disciplina.tipo}
                  </option>
                ))}
              </select>
              {errors.disciplina_id && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.disciplina_id}
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
          </div>

          {/* Distribución de notas */}
          {disciplinaSeleccionada && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Distribución de Evaluación - {disciplinaSeleccionada.nombre}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="teoria" className="block text-sm font-medium text-gray-700 mb-2">
                    Teoría ({disciplinaSeleccionada.porcentaje_teoria}%)
                  </label>
                  <input
                    type="number"
                    id="teoria"
                    name="teoria"
                    value={formData.teoria}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.teoria ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.teoria && (
                    <div className="mt-1 text-red-600 text-xs">{errors.teoria}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="practica" className="block text-sm font-medium text-gray-700 mb-2">
                    Práctica ({disciplinaSeleccionada.porcentaje_practica}%)
                  </label>
                  <input
                    type="number"
                    id="practica"
                    name="practica"
                    value={formData.practica}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.practica ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.practica && (
                    <div className="mt-1 text-red-600 text-xs">{errors.practica}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="asistencia" className="block text-sm font-medium text-gray-700 mb-2">
                    Asistencia ({disciplinaSeleccionada.porcentaje_otros/2}%)
                  </label>
                  <input
                    type="number"
                    id="asistencia"
                    name="asistencia"
                    value={formData.asistencia}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.asistencia ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.asistencia && (
                    <div className="mt-1 text-red-600 text-xs">{errors.asistencia}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="cuaderno" className="block text-sm font-medium text-gray-700 mb-2">
                    Cuaderno ({disciplinaSeleccionada.porcentaje_otros/2}%)
                  </label>
                  <input
                    type="number"
                    id="cuaderno"
                    name="cuaderno"
                    value={formData.cuaderno}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      errors.cuaderno ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.cuaderno && (
                    <div className="mt-1 text-red-600 text-xs">{errors.cuaderno}</div>
                  )}
                </div>
              </div>

              <div className="mt-4 p-4 bg-white rounded-lg border-2 border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-900">Nota Final Calculada:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formData.nota_final.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fecha_eval" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Evaluación *
              </label>
              <input
                type="date"
                id="fecha_eval"
                name="fecha_eval"
                value={formData.fecha_eval}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.fecha_eval ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fecha_eval && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.fecha_eval}
                </div>
              )}
            </div>

            <div>
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
                placeholder="Observaciones adicionales sobre la evaluación..."
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
              {evaluacion ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluacionForm;
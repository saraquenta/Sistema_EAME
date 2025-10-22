import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Activity, MoreVertical } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Actividad } from '../../types';
import ActividadForm from './ActividadForm';

const ActividadesList: React.FC = () => {
  const { actividades, cursantes, deleteActividad } = useData();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingActividad, setEditingActividad] = useState<Actividad | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const canEdit = user?.role === 'administrador' || user?.role === 'jefe_evaluaciones';

  const filteredActividades = actividades.filter(actividad => {
    const cursante = cursantes.find(c => c.id === actividad.cursante_id);
    
    const matchesSearch = cursante?.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         actividad.tipo_actividad.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         actividad.disciplina.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         actividad.observaciones.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterTipo === 'todos' || actividad.tipo_actividad === filterTipo;
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredActividades.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActividades = filteredActividades.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (actividad: Actividad) => {
    setEditingActividad(actividad);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta actividad?')) {
      deleteActividad(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingActividad(null);
  };

  const getTipoColor = (tipo: string) => {
    const colors: Record<string, string> = {
      'Entrenamiento': 'bg-primary text-white',
      'Competencia': 'bg-success text-white',
      'Examen': 'bg-danger text-white',
      'Seminario': 'bg-info text-white',
      'Práctica': 'bg-warning text-dark',
      'Demostración': 'bg-secondary text-white'
    };
    return colors[tipo] || 'bg-dark text-white';
  };

  if (showForm) {
    return (
      <ActividadForm
        actividad={editingActividad}
        onClose={handleCloseForm}
      />
    );
  }

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-dark mb-1">Gestión de Actividades</h2>
              <p className="text-muted mb-0">Registro de actividades de cursantes</p>
            </div>
            {canEdit && (
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-danger d-flex align-items-center"
                style={{ borderRadius: '10px', padding: '10px 20px' }}
              >
                <Plus size={16} className="me-2" />
                <span className="fw-semibold">Nueva Actividad</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
        {/* Filters Header */}
        <div className="card-header bg-white border-0 p-4" style={{ borderRadius: '15px 15px 0 0' }}>
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <div className="position-relative">
                <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  type="text"
                  placeholder="Buscar actividades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control ps-5"
                  style={{ borderRadius: '10px', border: '1px solid #e9ecef' }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="form-select"
                style={{ borderRadius: '10px' }}
              >
                <option value="todos">Todos los tipos</option>
                <option value="Entrenamiento">Entrenamiento</option>
                <option value="Competencia">Competencia</option>
                <option value="Examen">Examen</option>
                <option value="Seminario">Seminario</option>
                <option value="Práctica">Práctica</option>
                <option value="Demostración">Demostración</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="form-select"
                style={{ borderRadius: '10px' }}
              >
                <option value={10}>10 registros</option>
                <option value={25}>25 registros</option>
                <option value={50}>50 registros</option>
              </select>
            </div>
            <div className="col-md-3 text-end">
              <span className="text-muted small">
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredActividades.length)} de {filteredActividades.length} registros
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th className="border-0 px-4 py-3 text-muted fw-semibold small">ID</th>
                  <th className="border-0 px-4 py-3 text-muted fw-semibold small">CURSANTE</th>
                  <th className="border-0 px-4 py-3 text-muted fw-semibold small">TIPO</th>
                  <th className="border-0 px-4 py-3 text-muted fw-semibold small">DISCIPLINA</th>
                  <th className="border-0 px-4 py-3 text-muted fw-semibold small">FECHA</th>
                  <th className="border-0 px-4 py-3 text-muted fw-semibold small">DURACIÓN</th>
                  {canEdit && (
                    <th className="border-0 px-4 py-3 text-muted fw-semibold small text-center">ACCIONES</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedActividades.map((actividad, index) => {
                  const cursante = cursantes.find(c => c.id === actividad.cursante_id);
                  
                  return (
                    <tr key={actividad.id} style={{ borderBottom: '1px solid #f1f3f4' }}>
                      <td className="px-4 py-3">
                        <span className="fw-semibold text-dark">{startIndex + index + 1}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                            style={{ 
                              width: '40px', 
                              height: '40px', 
                              backgroundColor: '#dc2626',
                              color: 'white'
                            }}
                          >
                            <Activity size={20} />
                          </div>
                          <div>
                            <div className="fw-semibold text-dark">{cursante?.nombre_completo || 'N/A'}</div>
                            <div className="text-muted small">{cursante?.grado_militar || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge px-2 py-1 ${getTipoColor(actividad.tipo_actividad)}`} style={{ borderRadius: '6px' }}>
                          {actividad.tipo_actividad}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-dark">{actividad.disciplina}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-dark">{new Date(actividad.fecha).toLocaleDateString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-dark">{actividad.duracion}</span>
                      </td>
                      {canEdit && (
                        <td className="px-4 py-3 text-center">
                          <div className="dropdown">
                            <button 
                              className="btn btn-sm btn-outline-secondary border-0" 
                              type="button" 
                              data-bs-toggle="dropdown"
                              style={{ borderRadius: '8px' }}
                            >
                              <MoreVertical size={16} />
                            </button>
                            <ul className="dropdown-menu shadow-sm" style={{ borderRadius: '10px' }}>
                              <li>
                                <button
                                  className="dropdown-item d-flex align-items-center"
                                  onClick={() => handleEdit(actividad)}
                                >
                                  <Edit size={14} className="me-2 text-primary" />
                                  Editar
                                </button>
                              </li>
                              <li><hr className="dropdown-divider" /></li>
                              <li>
                                <button
                                  className="dropdown-item d-flex align-items-center text-danger"
                                  onClick={() => handleDelete(actividad.id)}
                                >
                                  <Trash2 size={14} className="me-2" />
                                  Eliminar
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="card-footer bg-white border-0 p-4" style={{ borderRadius: '0 0 15px 15px' }}>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted small">
              Mostrando registros del {startIndex + 1} al {Math.min(startIndex + itemsPerPage, filteredActividades.length)} de un total de {filteredActividades.length} registros
            </span>
            
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    style={{ borderRadius: '6px 0 0 6px' }}
                  >
                    Anterior
                  </button>
                </li>
                
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => setCurrentPage(pageNumber)}
                        style={{ 
                          backgroundColor: currentPage === pageNumber ? '#dc2626' : 'white',
                          borderColor: currentPage === pageNumber ? '#dc2626' : '#dee2e6',
                          color: currentPage === pageNumber ? 'white' : '#6c757d'
                        }}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  );
                })}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    style={{ borderRadius: '0 6px 6px 0' }}
                  >
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {filteredActividades.length === 0 && (
        <div className="text-center py-5">
          <div className="text-muted">
            <Activity size={48} className="mb-3 opacity-50" />
            <p>No se encontraron actividades</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActividadesList;
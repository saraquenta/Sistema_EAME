import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, UserX, MoreVertical } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Baja } from '../../types';
import BajaForm from './BajaForm';

const BajasList: React.FC = () => {
  const { bajas, cursantes, deleteBaja } = useData();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingBaja, setEditingBaja] = useState<Baja | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMotivo, setFilterMotivo] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const canEdit = user?.role === 'administrador' || user?.role === 'jefe_evaluaciones';

  const filteredBajas = bajas.filter(baja => {
    const cursante = cursantes.find(c => c.id === baja.cursante_id);
    
    const matchesSearch = cursante?.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         baja.motivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         baja.observaciones.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterMotivo === 'todos' || baja.motivo === filterMotivo;
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBajas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBajas = filteredBajas.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (baja: Baja) => {
    setEditingBaja(baja);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este registro de baja?')) {
      deleteBaja(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBaja(null);
  };

  const getMotivoColor = (motivo: string) => {
    const colors: Record<string, string> = {
      'Bajo Rendimiento': 'bg-danger text-white',
      'Problemas Disciplinarios': 'bg-warning text-dark',
      'Motivos Personales': 'bg-info text-white',
      'Problemas de Salud': 'bg-secondary text-white',
      'Traslado': 'bg-success text-white',
      'Otros': 'bg-dark text-white'
    };
    return colors[motivo] || 'bg-dark text-white';
  };

  if (showForm) {
    return (
      <BajaForm
        baja={editingBaja}
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
              <h2 className="fw-bold text-dark mb-1">Gestión de Bajas</h2>
              <p className="text-muted mb-0">Registro de bajas de cursantes</p>
            </div>
            {canEdit && (
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-danger d-flex align-items-center"
                style={{ borderRadius: '10px', padding: '10px 20px' }}
              >
                <Plus size={16} className="me-2" />
                <span className="fw-semibold">Nueva Baja</span>
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
                  placeholder="Buscar bajas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control ps-5"
                  style={{ borderRadius: '10px', border: '1px solid #e9ecef' }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                value={filterMotivo}
                onChange={(e) => setFilterMotivo(e.target.value)}
                className="form-select"
                style={{ borderRadius: '10px' }}
              >
                <option value="todos">Todos los motivos</option>
                <option value="Bajo Rendimiento">Bajo Rendimiento</option>
                <option value="Problemas Disciplinarios">Problemas Disciplinarios</option>
                <option value="Motivos Personales">Motivos Personales</option>
                <option value="Problemas de Salud">Problemas de Salud</option>
                <option value="Traslado">Traslado</option>
                <option value="Otros">Otros</option>
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
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredBajas.length)} de {filteredBajas.length} registros
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
                  <th className="border-0 px-4 py-3 text-muted fw-semibold small">MOTIVO</th>
                  <th className="border-0 px-4 py-3 text-muted fw-semibold small">FECHA</th>
                  <th className="border-0 px-4 py-3 text-muted fw-semibold small">OBSERVACIONES</th>
                  {canEdit && (
                    <th className="border-0 px-4 py-3 text-muted fw-semibold small text-center">ACCIONES</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedBajas.map((baja, index) => {
                  const cursante = cursantes.find(c => c.id === baja.cursante_id);
                  
                  return (
                    <tr key={baja.id} style={{ borderBottom: '1px solid #f1f3f4' }}>
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
                            <UserX size={20} />
                          </div>
                          <div>
                            <div className="fw-semibold text-dark">{cursante?.nombre_completo || 'N/A'}</div>
                            <div className="text-muted small">
                              {cursante?.grado_militar || 'N/A'} - CI: {cursante?.ci || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge px-2 py-1 ${getMotivoColor(baja.motivo)}`} style={{ borderRadius: '6px' }}>
                          {baja.motivo}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-dark">{new Date(baja.fecha).toLocaleDateString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-dark" style={{ maxWidth: '300px' }}>
                          <span className="d-inline-block text-truncate" style={{ maxWidth: '100%' }}>
                            {baja.observaciones}
                          </span>
                        </div>
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
                                  onClick={() => handleEdit(baja)}
                                >
                                  <Edit size={14} className="me-2 text-primary" />
                                  Editar
                                </button>
                              </li>
                              <li><hr className="dropdown-divider" /></li>
                              <li>
                                <button
                                  className="dropdown-item d-flex align-items-center text-danger"
                                  onClick={() => handleDelete(baja.id)}
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
              Mostrando registros del {startIndex + 1} al {Math.min(startIndex + itemsPerPage, filteredBajas.length)} de un total de {filteredBajas.length} registros
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

      {filteredBajas.length === 0 && (
        <div className="text-center py-5">
          <div className="text-muted">
            <UserX size={48} className="mb-3 opacity-50" />
            <p>No se encontraron registros de bajas</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BajasList;
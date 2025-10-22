import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, BookOpen, MoreVertical } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Disciplina } from '../../types';
import DisciplinaForm from './DisciplinaForm';

const DisciplinasList: React.FC = () => {
  const { disciplinas, deleteDisciplina } = useData();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingDisciplina, setEditingDisciplina] = useState<Disciplina | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const canEdit = user?.role === 'administrador' || user?.role === 'jefe_evaluaciones';

  const filteredDisciplinas = disciplinas.filter(disciplina => {
    const matchesSearch = disciplina.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disciplina.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'todos' || 
                         (filterStatus === 'activo' && disciplina.activo) ||
                         (filterStatus === 'inactivo' && !disciplina.activo);
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDisciplinas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDisciplinas = filteredDisciplinas.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (disciplina: Disciplina) => {
    setEditingDisciplina(disciplina);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta disciplina?')) {
      deleteDisciplina(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDisciplina(null);
  };

  const getStatusBadge = (activo: boolean) => {
    return (
      <span className={`badge ${activo ? 'bg-success' : 'bg-danger'} text-white px-2 py-1`} style={{ borderRadius: '6px' }}>
        {activo ? 'Activa' : 'Inactiva'}
      </span>
    );
  };

  if (showForm) {
    return (
      <DisciplinaForm
        disciplina={editingDisciplina}
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
              <h2 className="fw-bold text-dark mb-1">Gestión de Disciplinas</h2>
              <p className="text-muted mb-0">Administrar disciplinas de artes marciales</p>
            </div>
            {canEdit && (
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-danger d-flex align-items-center"
                style={{ borderRadius: '10px', padding: '10px 20px' }}
              >
                <Plus size={16} className="me-2" />
                <span className="fw-semibold">Nueva Disciplina</span>
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
                  placeholder="Buscar disciplinas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control ps-5"
                  style={{ borderRadius: '10px', border: '1px solid #e9ecef' }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-select"
                style={{ borderRadius: '10px' }}
              >
                <option value="todos">Todos los estados</option>
                <option value="activo">Activas</option>
                <option value="inactivo">Inactivas</option>
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
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredDisciplinas.length)} de {filteredDisciplinas.length} registros
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
                  <th className="border-0 px-4 py-3 text-muted fw-semibold small">DISCIPLINA</th>
                  <th className="border-0 px-4 py-3 text-muted fw-semibold small">TIPO</th>
                  <th className="border-0 px-4 py-3 text-muted fw-semibold small">TEORÍA</th>
                  <th className="border-0 px-4 py-3 text-muted fw-semibold small">PRÁCTICA</th>
                  <th className="border-0 px-4 py-3 text-muted fw-semibold small">OTROS</th>
                  <th className="border-0 px-4 py-3 text-muted fw-semibold small">ESTADO</th>
                  {canEdit && (
                    <th className="border-0 px-4 py-3 text-muted fw-semibold small text-center">ACCIONES</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedDisciplinas.map((disciplina, index) => (
                  <tr key={disciplina.id} style={{ borderBottom: '1px solid #f1f3f4' }}>
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
                          <BookOpen size={20} />
                        </div>
                        <div>
                          <div className="fw-semibold text-dark">{disciplina.nombre}</div>
                          <div className="text-muted small">
                            Creado: {new Date(disciplina.creado_en).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-secondary text-white px-2 py-1" style={{ borderRadius: '6px' }}>
                        {disciplina.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="progress me-2" style={{ width: '60px', height: '6px' }}>
                          <div 
                            className="progress-bar bg-primary" 
                            style={{ width: `${disciplina.porcentaje_teoria}%` }}
                          ></div>
                        </div>
                        <span className="text-dark small fw-semibold">{disciplina.porcentaje_teoria}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="progress me-2" style={{ width: '60px', height: '6px' }}>
                          <div 
                            className="progress-bar bg-success" 
                            style={{ width: `${disciplina.porcentaje_practica}%` }}
                          ></div>
                        </div>
                        <span className="text-dark small fw-semibold">{disciplina.porcentaje_practica}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="progress me-2" style={{ width: '60px', height: '6px' }}>
                          <div 
                            className="progress-bar bg-warning" 
                            style={{ width: `${disciplina.porcentaje_otros}%` }}
                          ></div>
                        </div>
                        <span className="text-dark small fw-semibold">{disciplina.porcentaje_otros}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(disciplina.activo)}
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
                                onClick={() => handleEdit(disciplina)}
                              >
                                <Edit size={14} className="me-2 text-primary" />
                                Editar
                              </button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button
                                className="dropdown-item d-flex align-items-center text-danger"
                                onClick={() => handleDelete(disciplina.id)}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="card-footer bg-white border-0 p-4" style={{ borderRadius: '0 0 15px 15px' }}>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted small">
              Mostrando registros del {startIndex + 1} al {Math.min(startIndex + itemsPerPage, filteredDisciplinas.length)} de un total de {filteredDisciplinas.length} registros
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

      {filteredDisciplinas.length === 0 && (
        <div className="text-center py-5">
          <div className="text-muted">
            <BookOpen size={48} className="mb-3 opacity-50" />
            <p>No se encontraron disciplinas</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisciplinasList;
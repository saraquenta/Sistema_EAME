import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-bottom border-3" 
            style={{ borderBottomColor: '#dc2626 !important' }}>
      <div className="container-fluid px-4 py-3">
        <div className="row align-items-center">
          <div className="col">
            <h1 className="h3 fw-bold text-dark mb-1">{title}</h1>
            <p className="text-muted small mb-0">
              Escuela de Artes Marciales del Ejército - Bolivia
            </p>
          </div>
          
          <div className="col-auto">
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-3 px-3 py-2 bg-light rounded-pill">
                <div className="me-3">
                  <div className="d-flex align-items-center justify-content-center rounded-circle" 
                       style={{ 
                         width: '40px', 
                         height: '40px', 
                         backgroundColor: '#dc2626' 
                       }}>
                    <User className="text-white" size={20} />
                  </div>
                </div>
                <div>
                  <p className="fw-semibold text-dark mb-0 small">{user?.nombre_completo}</p>
                  <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                    {user?.role?.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="btn btn-outline-danger d-flex align-items-center"
                style={{ 
                  borderRadius: '25px',
                  padding: '8px 16px',
                  transition: 'all 0.3s ease'
                }}
              >
                <LogOut size={16} className="me-2" />
                <span className="small fw-semibold">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
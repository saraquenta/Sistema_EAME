import React from 'react';
import { 
  Users, 
  BookOpen, 
  ClipboardList, 
  Award, 
  UserX, 
  Activity, 
  FileText,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'cursantes', label: 'Cursantes', icon: Users },
    { id: 'disciplinas', label: 'Disciplinas', icon: BookOpen },
    { id: 'evaluaciones', label: 'Evaluaciones', icon: ClipboardList },
    { id: 'meritos', label: 'Méritos', icon: Award },
    { id: 'bajas', label: 'Bajas', icon: UserX },
    { id: 'actividades', label: 'Actividades', icon: Activity },
    { id: 'reportes', label: 'Reportes', icon: FileText },
  ];

  return (
    <div className="bg-dark text-white d-flex flex-column" 
         style={{ 
           width: '280px', 
           minHeight: '100vh',
           borderRight: '4px solid #dc2626'
         }}>
      
      {/* Header */}
      <div className="p-4 border-bottom" style={{ borderBottomColor: '#dc2626 !important' }}>
        <div className="d-flex align-items-center">
          <div className="me-3 d-flex align-items-center justify-content-center rounded-circle" 
               style={{ 
                 width: '50px', 
                 height: '50px', 
                 backgroundColor: '#dc2626' 
               }}>
            <img 
              src="/image.png" 
              alt="EAME Logo" 
              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling!.style.display = 'block';
              }}
            />
            <Users className="text-white" size={24} style={{ display: 'none' }} />
          </div>
          <div>
            <h4 className="fw-bold mb-0">EAME</h4>
            <small className="text-danger">Sistema de Evaluación</small>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow-1 p-3">
        <ul className="list-unstyled">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id} className="mb-2">
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`btn w-100 d-flex align-items-center text-start p-3 rounded-3 transition-all ${
                    isActive
                      ? 'btn-danger text-white shadow'
                      : 'btn-outline-light text-light border-0'
                  }`}
                  style={{ 
                    transition: 'all 0.3s ease',
                    backgroundColor: isActive ? '#dc2626' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = '#dc2626';
                      e.target.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#f8f9fa';
                    }
                  }}
                >
                  <Icon size={20} className="me-3" />
                  <span className="fw-semibold">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-top" style={{ borderTopColor: '#dc2626 !important' }}>
        <div className="p-3 rounded-3" style={{ backgroundColor: '#dc2626' }}>
          <p className="fw-semibold mb-1 small">{user?.nombre_completo}</p>
          <p className="mb-0 text-light small opacity-75">
            {user?.role?.replace('_', ' ').toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
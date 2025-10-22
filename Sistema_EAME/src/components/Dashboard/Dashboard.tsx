import React from 'react';
import { Users, BookOpen, ClipboardList, TrendingUp, Award, UserX, Activity, Plus } from 'lucide-react';
import { useData } from '../../context/DataContext';

const Dashboard: React.FC = () => {
  const { cursantes, disciplinas, evaluaciones, meritos, bajas } = useData();

  const stats = [
    {
      title: 'Cursantes Activos',
      value: cursantes.filter(c => c.estado === 'activo').length,
      total: cursantes.length,
      icon: Users,
      color: '#dc2626',
      bgColor: '#fef2f2',
      change: '+12%'
    },
    {
      title: 'Disciplinas',
      value: disciplinas.filter(d => d.activo).length,
      total: disciplinas.length,
      icon: BookOpen,
      color: '#059669',
      bgColor: '#f0fdf4',
      change: '+5%'
    },
    {
      title: 'Evaluaciones',
      value: evaluaciones.length,
      total: evaluaciones.length,
      icon: ClipboardList,
      color: '#7c3aed',
      bgColor: '#faf5ff',
      change: '+18%'
    },
    {
      title: 'Méritos',
      value: meritos.length,
      total: meritos.length,
      icon: Award,
      color: '#d97706',
      bgColor: '#fffbeb',
      change: '+8%'
    }
  ];

  const recentActivities = [
    { action: 'Nuevo cursante registrado', user: 'Juan Pérez', time: '2 horas', type: 'success' },
    { action: 'Evaluación completada', user: 'María Quispe', time: '4 horas', type: 'info' },
    { action: 'Mérito otorgado', user: 'Carlos López', time: '1 día', type: 'warning' },
    { action: 'Disciplina actualizada', user: 'Sistema', time: '2 días', type: 'secondary' }
  ];

  const topCursantes = cursantes
    .filter(c => c.estado === 'activo')
    .slice(0, 6)
    .map((cursante, index) => ({
      ...cursante,
      promedio: Math.floor(Math.random() * 30) + 70,
      position: index + 1
    }))
    .sort((a, b) => b.promedio - a.promedio);

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="h3 fw-bold text-dark mb-1">Dashboard</h1>
          <p className="text-muted mb-0">Bienvenido al sistema de evaluación EAME</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="col-xl-3 col-md-6 mb-3">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h6 className="text-muted fw-semibold mb-0 small">{stat.title}</h6>
                        <span className="badge bg-success-subtle text-success small">{stat.change}</span>
                      </div>
                      <h2 className="fw-bold text-dark mb-1">{stat.value}</h2>
                      <p className="text-muted small mb-0">de {stat.total} total</p>
                    </div>
                    <div 
                      className="p-3 rounded-circle ms-3"
                      style={{ backgroundColor: stat.bgColor }}
                    >
                      <Icon size={24} style={{ color: stat.color }} />
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="progress" style={{ height: '4px', borderRadius: '2px' }}>
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${(stat.value / stat.total) * 100}%`,
                          backgroundColor: stat.color,
                          borderRadius: '2px'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row">
        {/* Performance Chart */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <div className="card-header bg-white border-0 pb-0" style={{ borderRadius: '15px 15px 0 0' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-dark mb-0">Rendimiento por Disciplina</h5>
                <div className="dropdown">
                  <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    Este mes
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Esta semana</a></li>
                    <li><a className="dropdown-item" href="#">Este mes</a></li>
                    <li><a className="dropdown-item" href="#">Este año</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body">
              {/* Chart simulation */}
              <div className="row">
                {disciplinas.slice(0, 6).map((disciplina, index) => {
                  const percentage = Math.floor(Math.random() * 40) + 60;
                  const colors = ['#dc2626', '#059669', '#7c3aed', '#d97706', '#0891b2', '#be185d'];
                  return (
                    <div key={disciplina.id} className="col-md-6 mb-4">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fw-semibold text-dark small">{disciplina.nombre}</span>
                        <span className="text-muted small">{percentage}%</span>
                      </div>
                      <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: colors[index % colors.length],
                            borderRadius: '4px'
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Top Cursantes */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <div className="card-header bg-white border-0 pb-0" style={{ borderRadius: '15px 15px 0 0' }}>
              <h5 className="fw-bold text-dark mb-0">Top Cursantes</h5>
            </div>
            <div className="card-body">
              {topCursantes.map((cursante, index) => (
                <div key={cursante.id} className="d-flex align-items-center mb-3">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle me-3"
                    style={{ 
                      width: '40px', 
                      height: '40px',
                      backgroundColor: index < 3 ? '#dc2626' : '#6c757d',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="fw-semibold text-dark mb-0 small">{cursante.nombre_completo}</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>{cursante.grado_militar}</p>
                  </div>
                  <div className="text-end">
                    <span className="fw-bold text-dark">{cursante.promedio}</span>
                    <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>pts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Recent Activities */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <div className="card-header bg-white border-0 pb-0" style={{ borderRadius: '15px 15px 0 0' }}>
              <h5 className="fw-bold text-dark mb-0">Actividad Reciente</h5>
            </div>
            <div className="card-body">
              {recentActivities.map((activity, index) => (
                <div key={index} className="d-flex align-items-start mb-3">
                  <div 
                    className="rounded-circle me-3 mt-1"
                    style={{ 
                      width: '8px', 
                      height: '8px',
                      backgroundColor: activity.type === 'success' ? '#059669' : 
                                     activity.type === 'info' ? '#0891b2' :
                                     activity.type === 'warning' ? '#d97706' : '#6c757d'
                    }}
                  ></div>
                  <div className="flex-grow-1">
                    <p className="fw-semibold text-dark mb-1 small">{activity.action}</p>
                    <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <div className="card-header bg-white border-0 pb-0" style={{ borderRadius: '15px 15px 0 0' }}>
              <h5 className="fw-bold text-dark mb-0">Acciones Rápidas</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {[
                  { title: 'Nuevo Cursante', icon: Users, color: '#dc2626', bgColor: '#fef2f2' },
                  { title: 'Nueva Evaluación', icon: ClipboardList, color: '#0891b2', bgColor: '#f0f9ff' },
                  { title: 'Otorgar Mérito', icon: Award, color: '#059669', bgColor: '#f0fdf4' },
                  { title: 'Ver Reportes', icon: TrendingUp, color: '#7c3aed', bgColor: '#faf5ff' }
                ].map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <div key={index} className="col-6">
                      <button 
                        className="btn w-100 p-3 border-0 text-start"
                        style={{ 
                          backgroundColor: action.bgColor,
                          borderRadius: '12px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        <Icon size={20} style={{ color: action.color }} className="mb-2" />
                        <h6 className="fw-semibold text-dark mb-0 small">{action.title}</h6>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
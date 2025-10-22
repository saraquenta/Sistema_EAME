import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './components/Login';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import CursantesList from './components/Cursantes/CursantesList';
import DisciplinasList from './components/Disciplinas/DisciplinasList';
import EvaluacionesList from './components/Evaluaciones/EvaluacionesList';
import MeritosList from './components/Meritos/MeritosList';
import BajasList from './components/Bajas/BajasList';
import ActividadesList from './components/Actividades/ActividadesList';
import Reportes from './components/Reportes/Reportes';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-danger mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Cargando sistema...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const getSectionTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      cursantes: 'Gestión de Cursantes',
      disciplinas: 'Gestión de Disciplinas',
      evaluaciones: 'Gestión de Evaluaciones',
      meritos: 'Gestión de Méritos',
      bajas: 'Gestión de Bajas',
      actividades: 'Gestión de Actividades',
      reportes: 'Reportes del Sistema'
    };
    return titles[activeSection] || 'Sistema EAME';
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'cursantes':
        return <CursantesList />;
      case 'disciplinas':
        return <DisciplinasList />;
      case 'evaluaciones':
        return <EvaluacionesList />;
      case 'meritos':
        return <MeritosList />;
      case 'bajas':
        return <BajasList />;
      case 'actividades':
        return <ActividadesList />;
      case 'reportes':
        return <Reportes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-grow-1 d-flex flex-column">
        <Header title={getSectionTitle()} />
        <main className="flex-grow-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
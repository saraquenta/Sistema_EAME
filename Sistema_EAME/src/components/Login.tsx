import React, { useState } from 'react';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Por favor ingrese un email');
      return;
    }

    if (!password.trim()) {
      setError('Por favor ingrese una contraseña');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (!success) {
        setError('Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" 
         style={{ 
           background: 'linear-gradient(135deg, #dc2626 0%, #000000 50%, #dc2626 100%)',
           padding: '20px'
         }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="mx-auto mb-4 d-flex align-items-center justify-content-center" 
                       style={{ 
                         width: '100px', 
                         height: '100px', 
                         backgroundColor: '#dc2626', 
                         borderRadius: '50%',
                         boxShadow: '0 8px 25px rgba(220, 38, 38, 0.3)'
                       }}>
                    <img 
                      src="/image.png" 
                      alt="EAME Logo" 
                      style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling!.style.display = 'block';
                      }}
                    />
                    <Shield className="text-white" size={48} style={{ display: 'none' }} />
                  </div>
                  <h2 className="fw-bold text-dark mb-2">Sistema EAME</h2>
                  <p className="text-muted mb-1">Escuela de Artes Marciales del Ejército</p>
                  <p className="text-muted small">Bolivia</p>
                </div>

                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                      <AlertCircle size={16} className="me-2" />
                      <small>{error}</small>
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold text-dark">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@eame.mil.bo"
                      style={{ 
                        borderRadius: '12px',
                        border: '2px solid #e9ecef',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold text-dark">
                      Contraseña
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control form-control-lg pe-5"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{ 
                          borderRadius: '12px',
                          border: '2px solid #e9ecef',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        required
                      />
                      <button
                        type="button"
                        className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ zIndex: 10 }}
                      >
                        {showPassword ? <EyeOff size={20} className="text-muted" /> : <Eye size={20} className="text-muted" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-lg w-100 text-white fw-semibold"
                    style={{ 
                      backgroundColor: '#dc2626',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
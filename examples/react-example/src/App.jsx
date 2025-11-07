import React, { useState } from 'react';
import HappyAccessAuth from './components/HappyAccessAuth';
import './App.css';

function App() {
  const [mode, setMode] = useState('home');
  const [user, setUser] = useState(null);

  const handleSuccess = (data) => {
    console.log('Autenticación exitosa:', data);
    setUser(data);

    if (data.mode === 'register') {
      alert(`¡Usuario "${data.username}" registrado exitosamente! 🎉\n\nAhora puedes hacer login.`);
      setMode('login');
    } else {
      setMode('dashboard');
    }
  };

  const handleError = (error) => {
    console.error('Error:', error);

    let message = 'Ocurrió un error';

    switch (error.error) {
      case 'MODEL_LOAD_ERROR':
        message = 'Error al cargar los modelos de IA. Verifica tu conexión.';
        break;
      case 'CAMERA_ACCESS_ERROR':
        message = 'No se pudo acceder a la cámara. Verifica los permisos.';
        break;
      case 'REGISTRATION_ERROR':
        message = error.details?.error || 'Error al registrar usuario';
        break;
      case 'FACE_NOT_RECOGNIZED':
        message = 'Rostro no reconocido. Intenta de nuevo o regístrate.';
        break;
      case 'NETWORK_ERROR':
        message = 'Error de red. Verifica que el servidor esté corriendo en http://localhost:3000';
        break;
    }

    alert('❌ ' + message);
  };

  const logout = () => {
    setUser(null);
    setMode('home');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔐 Happy Access</h1>
        <p className="subtitle">Autenticación Facial con Sonrisa - React Example</p>
      </header>

      <main className="app-main">
        {mode === 'home' && (
          <div className="welcome-screen">
            <div className="card">
              <h2>Bienvenido</h2>
              <p>Sistema de autenticación facial con detección de sonrisa</p>

              <div className="info-box">
                <h3>✨ Características</h3>
                <ul>
                  <li>😊 Detección de sonrisa en tiempo real</li>
                  <li>🚫 Prevención de rostros duplicados</li>
                  <li>🔒 Autenticación segura</li>
                  <li>📹 Feedback visual instantáneo</li>
                </ul>
              </div>

              <div className="button-group">
                <button
                  className="btn btn-primary"
                  onClick={() => setMode('login')}
                >
                  🔓 Iniciar Sesión
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setMode('register')}
                >
                  📝 Registrarse
                </button>
              </div>

              <div className="server-notice">
                <strong>⚠️ Importante:</strong> Asegúrate de que el servidor esté corriendo:
                <code>npm start</code> en http://localhost:3000
              </div>
            </div>
          </div>
        )}

        {mode === 'register' && (
          <div className="auth-screen">
            <button
              className="btn-back"
              onClick={() => setMode('home')}
            >
              ← Volver
            </button>

            <h2>Registro de Usuario</h2>
            <p className="info-text">
              Ingresa tu nombre y sonríe para registrarte. El sistema capturará
              automáticamente tu rostro cuando detecte una sonrisa.
            </p>

            <HappyAccessAuth
              apiEndpoint="http://localhost:3000/api"
              mode="register"
              onSuccess={handleSuccess}
              onError={handleError}
              smileThreshold={0.7}
              matchThreshold={0.6}
            />
          </div>
        )}

        {mode === 'login' && (
          <div className="auth-screen">
            <button
              className="btn-back"
              onClick={() => setMode('home')}
            >
              ← Volver
            </button>

            <h2>Iniciar Sesión</h2>
            <p className="info-text">
              Sonríe para la cámara y el sistema te reconocerá automáticamente.
            </p>

            <HappyAccessAuth
              apiEndpoint="http://localhost:3000/api"
              mode="login"
              onSuccess={handleSuccess}
              onError={handleError}
              smileThreshold={0.7}
              matchThreshold={0.6}
            />
          </div>
        )}

        {mode === 'dashboard' && user && (
          <div className="dashboard-screen">
            <div className="card">
              <h2>✅ Acceso Concedido</h2>

              <div className="user-info">
                <div className="avatar">
                  <span className="avatar-icon">👤</span>
                </div>
                <h3>{user.username}</h3>
                {user.confidence && (
                  <p className="confidence">
                    Confianza: {(user.confidence * 100).toFixed(1)}%
                  </p>
                )}
              </div>

              <div className="stats">
                <div className="stat-card">
                  <span className="stat-icon">🕐</span>
                  <span className="stat-label">Hora de acceso</span>
                  <span className="stat-value">
                    {new Date().toLocaleTimeString('es-ES')}
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">📅</span>
                  <span className="stat-label">Fecha</span>
                  <span className="stat-value">
                    {new Date().toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>

              <div className="success-message">
                <p>Has iniciado sesión exitosamente usando reconocimiento facial con sonrisa 😊</p>
              </div>

              <button
                className="btn btn-secondary"
                onClick={logout}
              >
                🚪 Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Ejemplo de implementación con React 18+ •
          <a href="https://github.com/eyrockscript/happy-access" target="_blank" rel="noopener noreferrer">
            Ver código fuente
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;

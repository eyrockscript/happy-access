<template>
  <div class="app">
    <header class="app-header">
      <h1>🔐 Happy Access</h1>
      <p class="subtitle">Autenticación Facial con Sonrisa - Vue Example</p>
    </header>

    <main class="app-main">
      <!-- Home Screen -->
      <div v-if="mode === 'home'" class="welcome-screen">
        <div class="card">
          <h2>Bienvenido</h2>
          <p>Sistema de autenticación facial con detección de sonrisa</p>

          <div class="info-box">
            <h3>✨ Características</h3>
            <ul>
              <li>😊 Detección de sonrisa en tiempo real</li>
              <li>🚫 Prevención de rostros duplicados</li>
              <li>🔒 Autenticación segura</li>
              <li>📹 Feedback visual instantáneo</li>
            </ul>
          </div>

          <div class="button-group">
            <button class="btn btn-primary" @click="mode = 'login'">
              🔓 Iniciar Sesión
            </button>
            <button class="btn btn-secondary" @click="mode = 'register'">
              📝 Registrarse
            </button>
          </div>

          <div class="server-notice">
            <strong>⚠️ Importante:</strong> Asegúrate de que el servidor esté corriendo:
            <code>npm start</code> en http://localhost:3000
          </div>
        </div>
      </div>

      <!-- Register Screen -->
      <div v-if="mode === 'register'" class="auth-screen">
        <button class="btn-back" @click="mode = 'home'">← Volver</button>

        <h2>Registro de Usuario</h2>
        <p class="info-text">
          Ingresa tu nombre y sonríe para registrarte. El sistema capturará
          automáticamente tu rostro cuando detecte una sonrisa.
        </p>

        <HappyAccessAuth
          api-endpoint="http://localhost:3000/api"
          mode="register"
          :smile-threshold="0.7"
          :match-threshold="0.6"
          @success="handleSuccess"
          @error="handleError"
        />
      </div>

      <!-- Login Screen -->
      <div v-if="mode === 'login'" class="auth-screen">
        <button class="btn-back" @click="mode = 'home'">← Volver</button>

        <h2>Iniciar Sesión</h2>
        <p class="info-text">
          Sonríe para la cámara y el sistema te reconocerá automáticamente.
        </p>

        <HappyAccessAuth
          api-endpoint="http://localhost:3000/api"
          mode="login"
          :smile-threshold="0.7"
          :match-threshold="0.6"
          @success="handleSuccess"
          @error="handleError"
        />
      </div>

      <!-- Dashboard Screen -->
      <div v-if="mode === 'dashboard' && user" class="dashboard-screen">
        <div class="card">
          <h2>✅ Acceso Concedido</h2>

          <div class="user-info">
            <div class="avatar">
              <span class="avatar-icon">👤</span>
            </div>
            <h3>{{ user.username }}</h3>
            <p v-if="user.confidence" class="confidence">
              Confianza: {{ (user.confidence * 100).toFixed(1) }}%
            </p>
          </div>

          <div class="stats">
            <div class="stat-card">
              <span class="stat-icon">🕐</span>
              <span class="stat-label">Hora de acceso</span>
              <span class="stat-value">{{ currentTime }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-icon">📅</span>
              <span class="stat-label">Fecha</span>
              <span class="stat-value">{{ currentDate }}</span>
            </div>
          </div>

          <div class="success-message">
            <p>Has iniciado sesión exitosamente usando reconocimiento facial con sonrisa 😊</p>
          </div>

          <button class="btn btn-secondary" @click="logout">
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    </main>

    <footer class="app-footer">
      <p>
        Ejemplo de implementación con Vue 3+ •
        <a href="https://github.com/eyrockscript/happy-access" target="_blank" rel="noopener noreferrer">
          Ver código fuente
        </a>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import HappyAccessAuth from './components/HappyAccessAuth.vue';

const mode = ref('home');
const user = ref(null);

const currentTime = computed(() => {
  return new Date().toLocaleTimeString('es-ES');
});

const currentDate = computed(() => {
  return new Date().toLocaleDateString('es-ES');
});

const handleSuccess = (data) => {
  console.log('Autenticación exitosa:', data);
  user.value = data;

  if (data.mode === 'register') {
    alert(`¡Usuario "${data.username}" registrado exitosamente! 🎉\n\nAhora puedes hacer login.`);
    mode.value = 'login';
  } else {
    mode.value = 'dashboard';
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
  user.value = null;
  mode.value = 'home';
};
</script>

<style scoped>
/* Los estilos se importan desde style.css */
</style>

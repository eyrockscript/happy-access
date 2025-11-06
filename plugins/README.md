# Happy Access - Plugins para Frameworks

Componentes de autenticación facial con detección de sonrisa para React, Vue.js y Svelte.

## 📦 Componentes Disponibles

- **React 18+** - `./react/HappyAccessAuth.jsx`
- **Vue.js 3+** - `./vue/HappyAccessAuth.vue`
- **Svelte 4+** - `./svelte/HappyAccessAuth.svelte`

## 🚀 Características

- ✅ Detección de sonrisa en tiempo real
- ✅ Registro de usuarios con validación facial
- ✅ Login mediante reconocimiento facial
- ✅ Prevención de rostros duplicados
- ✅ Indicador visual de nivel de sonrisa
- ✅ Manejo de errores robusto
- ✅ Totalmente personalizable
- ✅ TypeScript friendly

## 📋 Requisitos

### Backend

El backend debe estar corriendo y proporcionar los siguientes endpoints:

```
POST /api/register  - Registrar nuevo usuario
GET  /api/users     - Obtener usuarios registrados
```

Puedes usar el servidor incluido en este repositorio:

```bash
cd ..
npm install
npm start
```

### Frontend

Todos los componentes requieren:

- `face-api.js` - Librería de reconocimiento facial
- WebRTC support - Para acceso a cámara
- Modern browser - Chrome, Firefox, Safari, Edge

## 🎯 Instalación Rápida

### React

```bash
npm install face-api.js
cp plugins/react/HappyAccessAuth.jsx src/components/
```

```jsx
import HappyAccessAuth from './components/HappyAccessAuth';

function App() {
  return (
    <HappyAccessAuth
      apiEndpoint="http://localhost:3000/api"
      mode="login"
      onSuccess={(data) => console.log('Success:', data)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}
```

### Vue.js

```bash
npm install face-api.js
cp plugins/vue/HappyAccessAuth.vue src/components/
```

```vue
<template>
  <HappyAccessAuth
    api-endpoint="http://localhost:3000/api"
    mode="login"
    @success="handleSuccess"
    @error="handleError"
  />
</template>

<script setup>
import HappyAccessAuth from './components/HappyAccessAuth.vue';

const handleSuccess = (data) => console.log('Success:', data);
const handleError = (error) => console.error('Error:', error);
</script>
```

### Svelte

```bash
npm install face-api.js
cp plugins/svelte/HappyAccessAuth.svelte src/lib/
```

```svelte
<script>
  import HappyAccessAuth from '$lib/HappyAccessAuth.svelte';

  function handleSuccess(event) {
    console.log('Success:', event.detail);
  }

  function handleError(event) {
    console.error('Error:', event.detail);
  }
</script>

<HappyAccessAuth
  apiEndpoint="http://localhost:3000/api"
  mode="login"
  on:success={handleSuccess}
  on:error={handleError}
/>
```

## ⚙️ Configuración

### Props Comunes

Todos los componentes aceptan las siguientes props:

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `apiEndpoint` | string | *requerido* | URL base del API backend |
| `mode` | string | `'login'` | `'login'` o `'register'` |
| `smileThreshold` | number | `0.7` | Umbral de sonrisa (0-1). Mayor = más estricto |
| `matchThreshold` | number | `0.6` | Umbral de coincidencia facial (0-1). Menor = más estricto |
| `modelsPath` | string | CDN | Ruta personalizada para modelos de face-api.js |
| `className` | string | `''` | Clase CSS adicional para personalización |

### Eventos

Todos los componentes emiten:

#### `success`
Se dispara cuando la autenticación/registro es exitoso.

```javascript
{
  username: string,
  mode: 'login' | 'register',
  confidence?: number  // Solo en modo login (0-1)
}
```

#### `error`
Se dispara cuando ocurre un error.

```javascript
{
  error: 'MODEL_LOAD_ERROR' | 'CAMERA_ACCESS_ERROR' | 'REGISTRATION_ERROR' |
         'NETWORK_ERROR' | 'FACE_NOT_RECOGNIZED',
  details?: any
}
```

## 🎨 Personalización

### Estilos CSS

Todos los componentes usan las siguientes clases CSS que puedes sobrescribir:

```css
.happy-access-container { }
.happy-access-loading { }
.video-container { }
.status-message { }
.status-message.success { }
.status-message.error { }
.status-message.warning { }
.status-message.info { }
.smile-indicator { }
.smile-bar { }
.smile-fill { }
.btn-primary { }
.btn-secondary { }
.input-field { }
```

### Ajustar Sensibilidad

```jsx
// Sonrisa más exigente
<HappyAccessAuth smileThreshold={0.85} />

// Reconocimiento facial más permisivo
<HappyAccessAuth matchThreshold={0.7} />

// Muy estricto (seguridad alta)
<HappyAccessAuth
  smileThreshold={0.9}
  matchThreshold={0.4}
/>
```

## 🔒 Seguridad

### Recomendaciones para Producción

1. **HTTPS**: Usa siempre HTTPS en producción
2. **Backend**: Implementa rate limiting y validación
3. **Tokens**: Agrega autenticación JWT/tokens
4. **Encriptación**: Encripta descriptores faciales en DB
5. **CORS**: Configura CORS apropiadamente
6. **Privacidad**: Cumple con GDPR/regulaciones locales

### Ejemplo con Autenticación Adicional

```jsx
<HappyAccessAuth
  apiEndpoint="http://localhost:3000/api"
  mode="login"
  onSuccess={async (data) => {
    // Solicitar token JWT del backend
    const token = await fetch('/api/token', {
      method: 'POST',
      body: JSON.stringify({ username: data.username })
    });

    // Guardar token y redirigir
    localStorage.setItem('token', token);
    window.location.href = '/dashboard';
  }}
/>
```

## 🧪 Testing

### Probar Localmente

1. Inicia el backend:
```bash
cd ..
npm start
```

2. Abre tu aplicación en:
```
http://localhost:YOUR_PORT
```

3. Permite acceso a la cámara cuando se solicite

4. Prueba el flujo:
   - Registra un usuario con una sonrisa
   - Intenta registrar el mismo rostro con otro nombre (debería fallar)
   - Haz login sonriendo
   - Prueba sin sonreír (debería fallar)

## 📱 Soporte de Navegadores

| Navegador | Versión Mínima | Notas |
|-----------|----------------|-------|
| Chrome | 60+ | ✅ Completamente soportado |
| Firefox | 60+ | ✅ Completamente soportado |
| Safari | 11+ | ✅ Requiere HTTPS o localhost |
| Edge | 79+ | ✅ Completamente soportado |
| Mobile Chrome | 60+ | ✅ Android/iOS |
| Mobile Safari | 11+ | ✅ Requiere HTTPS |

## 🤝 Contribuciones

Para contribuir:

1. Haz fork del proyecto
2. Crea un branch para tu feature
3. Implementa tus cambios
4. Asegúrate de que funcione en los 3 frameworks
5. Crea un Pull Request

## 📄 Licencia

ISC - Ver LICENSE en la raíz del proyecto

## 👤 Autor

**eyrockscript**

## 📚 Documentación Adicional

- [React Component Docs](./react/README.md)
- [Vue Component Docs](./vue/README.md)
- [Svelte Component Docs](./svelte/README.md)
- [face-api.js Docs](https://github.com/justadudewhohacks/face-api.js)

## 🐛 Problemas Comunes

### La cámara no funciona

- Verifica que estés usando HTTPS o localhost
- Comprueba permisos de cámara en el navegador
- Asegúrate de que no haya otra app usando la cámara

### No detecta mi rostro

- Mejora la iluminación
- Acércate más a la cámara
- Mira directamente a la cámara

### No reconoce mi sonrisa

- Sonríe de forma más amplia
- Ajusta el `smileThreshold` a un valor menor (ej: 0.6)
- Espera a que carguen los modelos completamente

### Error al cargar modelos

- Verifica tu conexión a internet
- Comprueba que face-api.js esté instalado
- Intenta usar un `modelsPath` personalizado local

## 💡 Ejemplos de Uso

### Portal de Empleados
```jsx
<HappyAccessAuth
  apiEndpoint="https://api.company.com"
  mode="login"
  matchThreshold={0.5}  // Alta seguridad
  onSuccess={(data) => {
    logAudit(data.username, 'LOGIN');
    redirectToDashboard();
  }}
/>
```

### Registro de Asistencia
```jsx
<HappyAccessAuth
  apiEndpoint="https://attendance.company.com/api"
  mode="login"
  smileThreshold={0.6}  // Más permisivo
  onSuccess={(data) => {
    recordAttendance(data.username, new Date());
  }}
/>
```

### Sistema de Acceso
```jsx
<HappyAccessAuth
  apiEndpoint="https://access.building.com/api"
  mode="login"
  matchThreshold={0.4}  // Muy estricto
  onSuccess={(data) => {
    unlockDoor(data.username);
    notifySecurity(data.username);
  }}
/>
```

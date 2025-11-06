# Happy Access - Vue Component

Componente Vue.js 3+ para autenticación facial con detección de sonrisa.

## Instalación

```bash
npm install face-api.js
```

## Uso

```vue
<template>
  <div>
    <h1>Login</h1>
    <HappyAccessAuth
      api-endpoint="http://localhost:3000/api"
      mode="login"
      @success="handleSuccess"
      @error="handleError"
      :smile-threshold="0.7"
      :match-threshold="0.6"
    />
  </div>
</template>

<script setup>
import HappyAccessAuth from './HappyAccessAuth.vue';

const handleSuccess = (data) => {
  console.log('Autenticación exitosa:', data);
  // data: { username, mode, confidence? }
};

const handleError = (error) => {
  console.error('Error:', error);
};
</script>
```

## Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `apiEndpoint` | String | ✅ | - | URL base del API |
| `mode` | String | ❌ | 'login' | Modo: 'login' o 'register' |
| `smileThreshold` | Number | ❌ | 0.7 | Umbral de sonrisa (0-1) |
| `matchThreshold` | Number | ❌ | 0.6 | Umbral de coincidencia facial (0-1) |
| `modelsPath` | String | ❌ | CDN | Ruta de los modelos de face-api.js |
| `className` | String | ❌ | '' | Clase CSS adicional |

## Eventos

### @success
Se emite cuando la autenticación es exitosa.

```javascript
{
  username: string,
  mode: 'login' | 'register',
  confidence?: number  // Solo en login
}
```

### @error
Se emite cuando ocurre un error.

```javascript
{
  error: string,
  details?: any
}
```

## Ejemplo de Registro

```vue
<template>
  <HappyAccessAuth
    api-endpoint="http://localhost:3000/api"
    mode="register"
    @success="onRegister"
    @error="onError"
  />
</template>

<script setup>
const onRegister = (data) => {
  console.log('Usuario registrado:', data.username);
  // Redirigir o mostrar mensaje
};

const onError = (error) => {
  console.error('Error:', error);
};
</script>
```

## Estilos

El componente incluye estilos con scoped. Puedes sobrescribirlos usando clases globales o la prop `className`.

## Composition API

El componente está construido con Composition API (script setup) y es compatible con Vue 3+.

## Requisitos

- Vue 3.0+
- face-api.js
- Navegador con soporte para WebRTC
- Cámara web

## API Backend

El componente espera los siguientes endpoints:

### POST /api/register
```json
{
  "username": "string",
  "descriptor": "number[]"
}
```

### GET /api/users
```json
[
  {
    "username": "string",
    "descriptor": "number[]",
    "registeredAt": "string"
  }
]
```

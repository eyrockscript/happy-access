# Happy Access - Svelte Component

Componente Svelte 4+ para autenticación facial con detección de sonrisa.

## Instalación

```bash
npm install face-api.js
```

## Uso

```svelte
<script>
  import HappyAccessAuth from './HappyAccessAuth.svelte';

  function handleSuccess(event) {
    console.log('Autenticación exitosa:', event.detail);
    // event.detail: { username, mode, confidence? }
  }

  function handleError(event) {
    console.error('Error:', event.detail);
  }
</script>

<div>
  <h1>Login</h1>
  <HappyAccessAuth
    apiEndpoint="http://localhost:3000/api"
    mode="login"
    smileThreshold={0.7}
    matchThreshold={0.6}
    on:success={handleSuccess}
    on:error={handleError}
  />
</div>
```

## Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `apiEndpoint` | string | ✅ | - | URL base del API |
| `mode` | string | ❌ | 'login' | Modo: 'login' o 'register' |
| `smileThreshold` | number | ❌ | 0.7 | Umbral de sonrisa (0-1) |
| `matchThreshold` | number | ❌ | 0.6 | Umbral de coincidencia facial (0-1) |
| `modelsPath` | string | ❌ | CDN | Ruta de los modelos de face-api.js |
| `className` | string | ❌ | '' | Clase CSS adicional |

## Eventos

### on:success
Se dispara cuando la autenticación es exitosa.

```javascript
event.detail = {
  username: string,
  mode: 'login' | 'register',
  confidence?: number  // Solo en login
}
```

### on:error
Se dispara cuando ocurre un error.

```javascript
event.detail = {
  error: string,
  details?: any
}
```

## Ejemplo de Registro

```svelte
<script>
  import HappyAccessAuth from './HappyAccessAuth.svelte';

  function onRegister(event) {
    const { username } = event.detail;
    console.log('Usuario registrado:', username);
    // Redirigir o mostrar mensaje
  }

  function onError(event) {
    console.error('Error:', event.detail);
  }
</script>

<HappyAccessAuth
  apiEndpoint="http://localhost:3000/api"
  mode="register"
  on:success={onRegister}
  on:error={onError}
/>
```

## Uso con TypeScript

```svelte
<script lang="ts">
  import HappyAccessAuth from './HappyAccessAuth.svelte';

  interface SuccessEvent {
    username: string;
    mode: 'login' | 'register';
    confidence?: number;
  }

  function handleSuccess(event: CustomEvent<SuccessEvent>) {
    console.log('Autenticación exitosa:', event.detail.username);
  }
</script>

<HappyAccessAuth
  apiEndpoint="http://localhost:3000/api"
  on:success={handleSuccess}
/>
```

## Estilos

El componente incluye estilos CSS. Puedes sobrescribirlos definiendo estilos globales o usando la prop `className`.

```svelte
<HappyAccessAuth
  apiEndpoint="http://localhost:3000/api"
  className="custom-auth"
/>

<style>
  :global(.custom-auth .btn-primary) {
    background: #ff3e00;
  }
</style>
```

## Requisitos

- Svelte 4.0+
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

## Reactividad

El componente utiliza las características de reactividad de Svelte para actualizar la UI en tiempo real durante el proceso de detección facial y de sonrisa.

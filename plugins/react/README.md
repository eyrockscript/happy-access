# Happy Access - React Component

Componente React para autenticación facial con detección de sonrisa.

## Instalación

```bash
npm install face-api.js
```

## Uso

```jsx
import React from 'react';
import HappyAccessAuth from './HappyAccessAuth';

function App() {
  const handleSuccess = (data) => {
    console.log('Autenticación exitosa:', data);
    // data: { username, mode, confidence? }
  };

  const handleError = (error) => {
    console.error('Error:', error);
  };

  return (
    <div>
      <h1>Login</h1>
      <HappyAccessAuth
        apiEndpoint="http://localhost:3000/api"
        mode="login"
        onSuccess={handleSuccess}
        onError={handleError}
        smileThreshold={0.7}
        matchThreshold={0.6}
      />
    </div>
  );
}

export default App;
```

## Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `apiEndpoint` | string | ✅ | - | URL base del API |
| `mode` | string | ❌ | 'login' | Modo: 'login' o 'register' |
| `onSuccess` | function | ❌ | - | Callback cuando la autenticación es exitosa |
| `onError` | function | ❌ | - | Callback cuando ocurre un error |
| `smileThreshold` | number | ❌ | 0.7 | Umbral de sonrisa (0-1) |
| `matchThreshold` | number | ❌ | 0.6 | Umbral de coincidencia facial (0-1) |
| `modelsPath` | string | ❌ | CDN | Ruta de los modelos de face-api.js |
| `className` | string | ❌ | '' | Clase CSS adicional |

## Ejemplo de Registro

```jsx
<HappyAccessAuth
  apiEndpoint="http://localhost:3000/api"
  mode="register"
  onSuccess={(data) => {
    console.log('Usuario registrado:', data.username);
  }}
  onError={(error) => {
    console.error('Error al registrar:', error);
  }}
/>
```

## Estilos

El componente incluye estilos básicos. Puedes sobrescribirlos usando la prop `className` o definiendo tus propios estilos CSS.

## Requisitos

- React 18+
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

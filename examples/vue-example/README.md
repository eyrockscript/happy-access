# Happy Access - Vue Example

Ejemplo completo de implementación de Happy Access con Vue 3+ y Vite.

## 🚀 Inicio Rápido

### 1. Inicia el servidor backend

Desde la raíz del proyecto:

```bash
cd ../..
npm install
npm start
```

El servidor debe estar corriendo en `http://localhost:3000`

### 2. Instala dependencias del ejemplo

```bash
npm install
```

### 3. Inicia la aplicación Vue

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5174`

## 📦 ¿Qué incluye este ejemplo?

- ✅ Implementación completa con Vue 3+
- ✅ Composition API (script setup)
- ✅ Componente HappyAccessAuth integrado
- ✅ Navegación reactiva entre pantallas
- ✅ Refs y computed properties
- ✅ Manejo de eventos con emit
- ✅ UI moderna y responsive
- ✅ Configuración con Vite

## 📁 Estructura

```
vue-example/
├── src/
│   ├── components/
│   │   └── HappyAccessAuth.vue    # Componente de autenticación
│   ├── App.vue                     # Aplicación principal
│   ├── main.js                     # Entry point
│   └── style.css                   # Estilos
├── index.html                      # HTML template
├── vite.config.js                  # Configuración de Vite
└── package.json                    # Dependencias
```

## 🎯 Características Demostradas

### Registro de Usuario
```vue
<template>
  <HappyAccessAuth
    api-endpoint="http://localhost:3000/api"
    mode="register"
    :smile-threshold="0.7"
    @success="handleSuccess"
    @error="handleError"
  />
</template>
```

### Login
```vue
<template>
  <HappyAccessAuth
    api-endpoint="http://localhost:3000/api"
    mode="login"
    :match-threshold="0.6"
    @success="handleSuccess"
    @error="handleError"
  />
</template>
```

### Manejo de Eventos con Composition API

```vue
<script setup>
import { ref } from 'vue';
import HappyAccessAuth from './components/HappyAccessAuth.vue';

const user = ref(null);

const handleSuccess = (data) => {
  console.log('Usuario:', data.username);
  console.log('Modo:', data.mode);
  console.log('Confianza:', data.confidence); // Solo en login

  user.value = data;
  // Actualizar estado, redirigir, etc.
};

const handleError = (error) => {
  console.error('Error:', error.error);
  console.error('Detalles:', error.details);

  // Mostrar mensaje de error
};
</script>
```

## ⚙️ Configuración

### Ajustar Umbrales

```vue
<HappyAccessAuth
  :smile-threshold="0.85"    <!-- Sonrisa más exigente -->
  :match-threshold="0.4"     <!-- Reconocimiento más estricto -->
/>
```

### Props Booleanos

```vue
<!-- Vue convierte automáticamente a boolean -->
<HappyAccessAuth
  :smile-threshold="0.7"
  mode="login"
/>
```

### Estilos Personalizados

```vue
<HappyAccessAuth class-name="mi-clase" />

<style>
.mi-clase :deep(.btn-primary) {
  background: #42b883;
}
</style>
```

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Crea build de producción
- `npm run preview` - Preview del build de producción

## 💡 Características de Vue Demostradas

### Reactividad
```vue
<script setup>
import { ref, computed } from 'vue';

const mode = ref('home');
const user = ref(null);

const currentTime = computed(() => {
  return new Date().toLocaleTimeString('es-ES');
});
</script>
```

### Eventos Personalizados
```vue
<!-- Hijo emite -->
emit('success', { username: 'Juan', mode: 'login' });

<!-- Padre escucha -->
<HappyAccessAuth @success="handleSuccess" />
```

### Directivas
```vue
<div v-if="mode === 'dashboard'">Dashboard</div>
<div v-else-if="mode === 'login'">Login</div>
<div v-else>Home</div>
```

## 🐛 Solución de Problemas

### El servidor no responde

```bash
cd ../..
npm start
```

### Error "Failed to fetch"

Verifica que el backend esté en `http://localhost:3000` y acepte CORS.

### La cámara no funciona

- Verifica permisos en el navegador
- Usa `http://localhost` (no IP)
- En producción usa HTTPS

## 🚀 Deployment

### Build para Producción

```bash
npm run build
```

Los archivos estarán en `dist/`

### Variables de Entorno

Crea `.env`:

```env
VITE_API_ENDPOINT=https://tu-api.com/api
```

Úsalo:

```vue
<HappyAccessAuth
  :api-endpoint="import.meta.env.VITE_API_ENDPOINT"
/>
```

## 📚 Más Información

- [Documentación del Plugin Vue](../../plugins/vue/README.md)
- [Documentación Principal](../../README.md)
- [Vue 3 Docs](https://vuejs.org)
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vite Docs](https://vitejs.dev)

## 👤 Autor

eyrockscript

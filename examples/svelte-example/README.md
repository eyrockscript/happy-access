# Happy Access - Svelte Example

Ejemplo completo de implementación de Happy Access con Svelte 4+ y Vite.

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

### 3. Inicia la aplicación Svelte

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5175`

## 📦 ¿Qué incluye este ejemplo?

- ✅ Implementación completa con Svelte 4+
- ✅ Componente HappyAccessAuth integrado
- ✅ Reactividad nativa de Svelte
- ✅ Stores y estados reactivos
- ✅ Custom events
- ✅ UI moderna y responsive
- ✅ Configuración con Vite

## 📁 Estructura

```
svelte-example/
├── src/
│   ├── lib/
│   │   └── HappyAccessAuth.svelte    # Componente de autenticación
│   ├── App.svelte                     # Aplicación principal
│   ├── main.js                        # Entry point
│   └── app.css                        # Estilos
├── index.html                         # HTML template
├── vite.config.js                     # Configuración de Vite
├── svelte.config.js                   # Configuración de Svelte
└── package.json                       # Dependencias
```

## 🎯 Características Demostradas

### Registro de Usuario
```svelte
<HappyAccessAuth
  apiEndpoint="http://localhost:3000/api"
  mode="register"
  smileThreshold={0.7}
  on:success={handleSuccess}
  on:error={handleError}
/>
```

### Login
```svelte
<HappyAccessAuth
  apiEndpoint="http://localhost:3000/api"
  mode="login"
  matchThreshold={0.6}
  on:success={handleSuccess}
  on:error={handleError}
/>
```

### Manejo de Eventos

```svelte
<script>
  function handleSuccess(event) {
    const data = event.detail;
    console.log('Usuario:', data.username);
    console.log('Modo:', data.mode);
    console.log('Confianza:', data.confidence); // Solo en login

    // Actualizar estado
  }

  function handleError(event) {
    const error = event.detail;
    console.error('Error:', error.error);

    // Mostrar mensaje
  }
</script>
```

## ⚙️ Configuración

### Ajustar Umbrales

```svelte
<HappyAccessAuth
  smileThreshold={0.85}    <!-- Sonrisa más exigente -->
  matchThreshold={0.4}     <!-- Reconocimiento más estricto -->
/>
```

### Reactividad de Svelte

```svelte
<script>
  let mode = 'home';
  let user = null;

  // Reactive statement
  $: currentTime = new Date().toLocaleTimeString('es-ES');

  // Reactive block
  $: if (user) {
    console.log('Usuario cambió:', user.username);
  }
</script>
```

### Estilos Personalizados

```svelte
<HappyAccessAuth className="custom" />

<style>
  :global(.custom .btn-primary) {
    background: #ff3e00;
  }
</style>
```

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Crea build de producción
- `npm run preview` - Preview del build

## 💡 Características de Svelte Demostradas

### Reactividad
```svelte
<script>
  let count = 0;

  // Se actualiza automáticamente cuando count cambia
  $: doubled = count * 2;

  // Ejecuta código cuando cambia una variable
  $: console.log(`Count es ahora ${count}`);
</script>
```

### Bloques de Control
```svelte
{#if mode === 'dashboard'}
  <Dashboard />
{:else if mode === 'login'}
  <Login />
{:else}
  <Home />
{/if}
```

### Event Forwarding
```svelte
<!-- El componente dispara eventos nativos -->
<button on:click>Hacer click</button>

<!-- Eventos personalizados -->
<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function onClick() {
    dispatch('success', { data: 'valor' });
  }
</script>
```

### Stores (Opcional)
```svelte
<script>
  import { writable } from 'svelte/store';

  const user = writable(null);

  // Usar con $
  $user = { username: 'Juan' };
</script>

<p>Usuario: {$user?.username}</p>
```

## 🐛 Solución de Problemas

### El servidor no responde

```bash
cd ../..
npm start
```

### Error de compilación Svelte

Asegúrate de tener `svelte.config.js` con el preprocessor correcto.

### La cámara no funciona

- Verifica permisos
- Usa `http://localhost`
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

```svelte
<HappyAccessAuth
  apiEndpoint={import.meta.env.VITE_API_ENDPOINT}
/>
```

## 📚 Más Información

- [Documentación del Plugin Svelte](../../plugins/svelte/README.md)
- [Documentación Principal](../../README.md)
- [Svelte Docs](https://svelte.dev)
- [Svelte Tutorial](https://svelte.dev/tutorial)
- [Vite Docs](https://vitejs.dev)

## 🎓 Por qué Svelte es Diferente

Svelte no usa Virtual DOM. En lugar de eso:

1. **Compila tu código** en JavaScript vanilla super eficiente
2. **No hay runtime overhead** - código más pequeño y rápido
3. **Reactividad sin complicaciones** - solo usa `=`
4. **Menos boilerplate** - código más conciso

```svelte
<!-- Vue/React necesitan useState o ref -->
<!-- Svelte es más simple -->
<script>
  let count = 0;
</script>

<button on:click={() => count++}>
  Clicks: {count}
</button>
```

## 👤 Autor

eyrockscript

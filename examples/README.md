# Happy Access - Ejemplos de Implementación

Proyectos de ejemplo completos que demuestran cómo integrar Happy Access en diferentes frameworks frontend.

## 📦 Ejemplos Disponibles

### [React 18+ Example](./react-example)
```bash
cd react-example
npm install
npm run dev
# → http://localhost:5173
```

**Tecnologías:**
- React 18.2+
- Vite 5
- Hooks (useState, useRef, useEffect)

### [Vue 3+ Example](./vue-example)
```bash
cd vue-example
npm install
npm run dev
# → http://localhost:5174
```

**Tecnologías:**
- Vue 3.3+
- Vite 5
- Composition API (script setup)

### [Svelte 4+ Example](./svelte-example)
```bash
cd svelte-example
npm install
npm run dev
# → http://localhost:5175
```

**Tecnologías:**
- Svelte 4.2+
- Vite 5
- Reactividad nativa

## 🚀 Inicio Rápido Global

### Requisito Previo: Servidor Backend

Todos los ejemplos requieren que el servidor backend esté corriendo. Desde la raíz del proyecto:

```bash
cd ..
npm install
npm start
```

El servidor estará disponible en `http://localhost:3000`

### Probar un Ejemplo

```bash
# 1. Desde la carpeta examples, elige un framework
cd react-example   # o vue-example, o svelte-example

# 2. Instala dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev

# 4. Abre en el navegador la URL indicada
```

## 📊 Comparación de Implementaciones

| Característica | React | Vue | Svelte |
|---------------|-------|-----|--------|
| **Tamaño Bundle** | ~45 KB | ~35 KB | ~15 KB |
| **Sintaxis** | JSX | Template/JSX | Template |
| **Reactividad** | Hooks | Composition API | Nativa |
| **Learning Curve** | Media | Media-Baja | Baja |
| **Performance** | Excelente | Excelente | Excepcional |
| **Ecosistema** | Enorme | Grande | Creciente |

## 🎯 ¿Qué incluyen todos los ejemplos?

Cada ejemplo es una aplicación completa e independiente con:

- ✅ **Navegación completa**: Home → Register/Login → Dashboard
- ✅ **Manejo de estado**: Gestión del usuario actual y modo de pantalla
- ✅ **Manejo de errores**: Alertas informativas para diferentes tipos de error
- ✅ **UI responsive**: Funciona en desktop y móvil
- ✅ **Feedback visual**: Indicadores de carga, estados, y resultados
- ✅ **Documentación**: README específico con ejemplos de código
- ✅ **Configuración lista**: Vite configurado y listo para usar

## 🔄 Flujo de Usuario

Todos los ejemplos implementan el mismo flujo:

```
┌─────────────┐
│    Home     │
│  (inicio)   │
└──────┬──────┘
       │
    ┌──┴────┐
    │       │
┌───▼──┐ ┌──▼────┐
│Login │ │Register│
└───┬──┘ └──┬────┘
    │       │
    │   ┌───▼──────────────┐
    │   │  Registro OK     │
    │   │  → Ir a Login    │
    │   └──────────────────┘
    │
┌───▼──────────┐
│  Dashboard   │
│ (autenticado)│
└──────────────┘
```

## 💻 Comparación de Código

### Manejo de Estado

**React:**
```jsx
const [mode, setMode] = useState('home');
const [user, setUser] = useState(null);

setMode('login');
setUser(data);
```

**Vue:**
```vue
<script setup>
const mode = ref('home');
const user = ref(null);

mode.value = 'login';
user.value = data;
</script>
```

**Svelte:**
```svelte
<script>
let mode = 'home';
let user = null;

mode = 'login';
user = data;
</script>
```

### Uso del Componente

**React:**
```jsx
<HappyAccessAuth
  apiEndpoint="http://localhost:3000/api"
  mode="login"
  onSuccess={(data) => console.log(data)}
  onError={(error) => console.error(error)}
/>
```

**Vue:**
```vue
<HappyAccessAuth
  api-endpoint="http://localhost:3000/api"
  mode="login"
  @success="handleSuccess"
  @error="handleError"
/>
```

**Svelte:**
```svelte
<HappyAccessAuth
  apiEndpoint="http://localhost:3000/api"
  mode="login"
  on:success={handleSuccess}
  on:error={handleError}
/>
```

## 🎨 Características de UI

Todos los ejemplos incluyen:

### Pantalla de Bienvenida
- Descripción del sistema
- Lista de características
- Botones para Login y Registro
- Aviso sobre servidor backend

### Pantalla de Autenticación
- Video en tiempo real de la cámara
- Canvas overlay para detección facial
- Indicador de nivel de sonrisa
- Mensajes de estado (info, success, error, warning)
- Botón para iniciar captura
- Botón para volver

### Dashboard Post-Login
- Avatar del usuario
- Nombre de usuario
- Nivel de confianza (solo login)
- Hora y fecha de acceso
- Botón de cerrar sesión
- Mensaje de bienvenida

## 🔧 Personalización

Cada ejemplo puede ser personalizado:

### Cambiar Colores
Edita el archivo CSS (`App.css` / `style.css` / `app.css`):

```css
:root {
  --primary-color: #ff3e00;  /* Tu color principal */
  --success-color: #00ff00;  /* Tu color de éxito */
}
```

### Ajustar Umbrales
En el componente:

```jsx
<HappyAccessAuth
  smileThreshold={0.85}    // Más estricto
  matchThreshold={0.4}     // Más seguro
/>
```

### Cambiar API Endpoint
```jsx
<HappyAccessAuth
  apiEndpoint="https://tu-servidor.com/api"
/>
```

## 📱 Soporte de Navegadores

Todos los ejemplos funcionan en:

- ✅ Chrome 90+ (Desktop y Mobile)
- ✅ Firefox 88+ (Desktop y Mobile)
- ✅ Safari 14+ (Desktop y Mobile)
- ✅ Edge 90+

**Requisitos:**
- WebRTC support (getUserMedia)
- ES6+ support
- Canvas API

## 🐛 Troubleshooting Común

### El ejemplo no inicia

```bash
# Borra node_modules e instala de nuevo
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Error "Cannot find module"

```bash
# Asegúrate de estar en la carpeta correcta
cd react-example  # o vue-example, svelte-example
npm install
```

### Puerto ya en uso

Cada ejemplo usa un puerto diferente:
- React: 5173
- Vue: 5174
- Svelte: 5175

Si necesitas cambiar el puerto, edita `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    port: 3001  // Tu puerto preferido
  }
})
```

### Backend no responde

```bash
# Verifica que el backend esté corriendo
cd ..
npm start

# Debe mostrar:
# 🚀 Servidor corriendo en http://localhost:3000
```

## 🚀 Deployment

### Build de Producción

Para cualquier ejemplo:

```bash
npm run build
```

Los archivos optimizados estarán en `dist/`

### Deploy a Servicios

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy
```

**GitHub Pages:**
```bash
npm run build
# Sube la carpeta dist/
```

## 📚 Recursos Adicionales

- [Documentación de Plugins](../plugins/README.md)
- [Documentación Principal](../README.md)
- [React Docs](https://react.dev)
- [Vue Docs](https://vuejs.org)
- [Svelte Docs](https://svelte.dev)
- [Vite Docs](https://vitejs.dev)

## 🤝 Contribuir

¿Tienes ideas para mejorar los ejemplos?

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/MejorEjemplo`)
3. Haz tus cambios
4. Commit (`git commit -m 'Mejorar ejemplo de React'`)
5. Push (`git push origin feature/MejorEjemplo`)
6. Abre un Pull Request

## 💡 Ideas para Extender los Ejemplos

- 🌐 Agregar internacionalización (i18n)
- 🎨 Themes claro/oscuro
- 📊 Analytics de uso
- 🔐 Integración con Auth0/Firebase
- 💾 LocalStorage para sesiones
- 🎭 Animaciones con Framer Motion/Vue Transition
- 📝 TypeScript
- ✅ Testing con Vitest
- 🎯 Progressive Web App (PWA)

## 👤 Autor

**eyrockscript**
- GitHub: [@eyrockscript](https://github.com/eyrockscript)
- Email: dev.eliud.trejo@gmail.com

## 📄 Licencia

ISC - Ver LICENSE en la raíz del proyecto

---

¿Preguntas? Abre un [issue](https://github.com/eyrockscript/happy-access/issues) en GitHub.

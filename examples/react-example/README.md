# Happy Access - React Example

Ejemplo completo de implementación de Happy Access con React 18+ y Vite.

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

### 3. Inicia la aplicación React

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 ¿Qué incluye este ejemplo?

- ✅ Implementación completa con React 18+
- ✅ Componente HappyAccessAuth integrado
- ✅ Navegación entre pantallas (Home, Registro, Login, Dashboard)
- ✅ Manejo de estados con useState
- ✅ Manejo de errores con alertas informativas
- ✅ UI moderna y responsive
- ✅ Configuración con Vite (build tool rápido)

## 📁 Estructura

```
react-example/
├── src/
│   ├── components/
│   │   └── HappyAccessAuth.jsx   # Componente de autenticación
│   ├── App.jsx                    # Aplicación principal
│   ├── App.css                    # Estilos de la app
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Estilos globales
├── index.html                     # HTML template
├── vite.config.js                 # Configuración de Vite
└── package.json                   # Dependencias
```

## 🎯 Características Demostradas

### Registro de Usuario
```jsx
<HappyAccessAuth
  apiEndpoint="http://localhost:3000/api"
  mode="register"
  onSuccess={handleSuccess}
  onError={handleError}
  smileThreshold={0.7}
/>
```

### Login
```jsx
<HappyAccessAuth
  apiEndpoint="http://localhost:3000/api"
  mode="login"
  onSuccess={handleSuccess}
  onError={handleError}
  matchThreshold={0.6}
/>
```

### Manejo de Eventos

El componente emite dos eventos principales:

#### onSuccess
```javascript
const handleSuccess = (data) => {
  console.log('Usuario:', data.username);
  console.log('Modo:', data.mode); // 'register' o 'login'
  console.log('Confianza:', data.confidence); // Solo en login

  // Redirigir al dashboard, guardar en estado, etc.
};
```

#### onError
```javascript
const handleError = (error) => {
  console.error('Error:', error.error);
  console.error('Detalles:', error.details);

  // Mostrar mensaje de error al usuario
};
```

## ⚙️ Configuración

### Ajustar Umbrales

```jsx
<HappyAccessAuth
  smileThreshold={0.85}    // Sonrisa más exigente
  matchThreshold={0.4}     // Reconocimiento más estricto
/>
```

### API Personalizada

```jsx
<HappyAccessAuth
  apiEndpoint="https://tu-api.com/api"
  mode="login"
/>
```

### Estilos Personalizados

```jsx
<HappyAccessAuth
  className="mi-clase-personalizada"
/>
```

```css
.mi-clase-personalizada .btn-primary {
  background: #ff3e00;
}
```

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Crea build de producción
- `npm run preview` - Preview del build de producción

## 🐛 Solución de Problemas

### El servidor no responde

Asegúrate de que el backend esté corriendo:

```bash
cd ../..
npm start
```

### Error de CORS

El backend ya tiene CORS configurado. Si usas otro servidor, agrega:

```javascript
app.use(cors());
```

### La cámara no funciona

- Verifica permisos del navegador
- Usa `http://localhost` (no IP)
- En producción usa HTTPS

## 🚀 Deployment

### Build para Producción

```bash
npm run build
```

Los archivos estarán en la carpeta `dist/`

### Variables de Entorno

Crea un archivo `.env`:

```env
VITE_API_ENDPOINT=https://tu-api-produccion.com/api
```

Úsalo en el código:

```jsx
<HappyAccessAuth
  apiEndpoint={import.meta.env.VITE_API_ENDPOINT}
/>
```

## 📚 Más Información

- [Documentación del Plugin React](../../plugins/react/README.md)
- [Documentación Principal](../../README.md)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)

## 👤 Autor

eyrockscript

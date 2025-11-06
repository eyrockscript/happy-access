# Happy Access 🔐

Sistema de autenticación y control de acceso mediante reconocimiento facial con detección de sonrisa, desarrollado con JavaScript y face-api.js.

## 🌟 Características

- ✅ **Detección de Sonrisa**: Autenticación mediante sonrisa en tiempo real
- 👤 **Registro de Usuarios**: Captura facial con validación de sonrisa
- 🔍 **Login Facial**: Autenticación mediante reconocimiento facial
- 🚫 **Anti-Duplicados**: Previene registro del mismo rostro con diferentes nombres
- 📊 **Dashboard**: Interfaz post-autenticación
- 🎨 **UI Moderna**: Interfaz responsive con animaciones
- 🔒 **Almacenamiento Seguro**: Descriptores faciales en JSON
- 📹 **Tiempo Real**: Detección y feedback visual instantáneo
- 🎭 **Indicador Visual**: Barra de progreso de sonrisa

## 🔌 Componentes/Plugins Disponibles

Este proyecto incluye componentes listos para usar en:

- **React 18+** → `./plugins/react/`
- **Vue.js 3+** → `./plugins/vue/`
- **Svelte 4+** → `./plugins/svelte/`

[📚 Ver documentación de plugins](./plugins/README.md)

## 💻 Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js + Express
- **IA**: face-api.js (TensorFlow.js)
- **Reconocimiento Facial**: TinyFaceDetector, FaceLandmarks, FaceRecognition, FaceExpression
- **Frameworks**: React, Vue, Svelte (componentes incluidos)

## 📋 Requisitos

- Node.js (v14 o superior)
- Navegador moderno con soporte para WebRTC
- Cámara web
- Buena iluminación para mejor detección

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/eyrockscript/happy-access.git
cd happy-access
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor:
```bash
npm start
```

4. Abre tu navegador en:
```
http://localhost:3000
```

## 📖 Uso

### Aplicación Web Standalone

#### Registro de Usuario

1. Haz clic en "Registrarse"
2. Ingresa tu nombre de usuario
3. Haz clic en "Capturar Rostro"
4. Permite el acceso a la cámara
5. **Sonríe ampliamente** (se mostrará un indicador de nivel de sonrisa)
6. El sistema capturará tu rostro automáticamente cuando detecte una sonrisa

#### Iniciar Sesión

1. Haz clic en "Iniciar Sesión"
2. Haz clic en "Reconocer Rostro"
3. **Sonríe para la cámara**
4. El sistema te reconocerá y te dará acceso

### Uso como Plugin/Componente

#### React

```jsx
import HappyAccessAuth from './plugins/react/HappyAccessAuth';

function App() {
  return (
    <HappyAccessAuth
      apiEndpoint="http://localhost:3000/api"
      mode="login"
      onSuccess={(data) => console.log('¡Acceso concedido!', data)}
      smileThreshold={0.7}
    />
  );
}
```

#### Vue

```vue
<template>
  <HappyAccessAuth
    api-endpoint="http://localhost:3000/api"
    mode="login"
    @success="handleSuccess"
  />
</template>

<script setup>
import HappyAccessAuth from './plugins/vue/HappyAccessAuth.vue';
</script>
```

#### Svelte

```svelte
<script>
  import HappyAccessAuth from './plugins/svelte/HappyAccessAuth.svelte';
</script>

<HappyAccessAuth
  apiEndpoint="http://localhost:3000/api"
  mode="login"
  on:success={(e) => console.log(e.detail)}
/>
```

[📚 Ver documentación completa de plugins](./plugins/README.md)

## 📁 Estructura del Proyecto

```
happy-access/
├── public/
│   ├── css/
│   │   └── styles.css              # Estilos de la aplicación
│   ├── js/
│   │   ├── app.js                  # Lógica principal
│   │   └── faceDetection.js        # Servicio de detección facial
│   └── index.html                  # Interfaz principal
├── plugins/
│   ├── react/
│   │   ├── HappyAccessAuth.jsx     # Componente React
│   │   ├── package.json
│   │   └── README.md
│   ├── vue/
│   │   ├── HappyAccessAuth.vue     # Componente Vue
│   │   ├── package.json
│   │   └── README.md
│   ├── svelte/
│   │   ├── HappyAccessAuth.svelte  # Componente Svelte
│   │   ├── package.json
│   │   └── README.md
│   └── README.md                   # Documentación de plugins
├── server.js                       # Servidor Express + API
├── package.json
└── README.md
```

## 🔧 Cómo Funciona

1. **Detección Facial**: Utiliza TinyFaceDetector de face-api.js para detectar rostros en tiempo real
2. **Análisis de Expresiones**: FaceExpressionNet detecta emociones, incluyendo felicidad/sonrisa
3. **Validación de Sonrisa**: Solo captura cuando el nivel de sonrisa supera el umbral (default: 70%)
4. **Extracción de Características**: Genera un descriptor facial de 128 dimensiones único
5. **Prevención de Duplicados**: Compara descriptores antes de registrar (distancia euclidiana)
6. **Comparación**: Calcula distancia euclidiana entre rostros para autenticación
7. **Almacenamiento**: Los descriptores se guardan en `users_data.json` (no se guardan imágenes)

## ⚙️ Configuración

### Ajustar Umbral de Sonrisa

En `public/js/app.js` o en los props de los componentes:

```javascript
// Más estricto (necesita sonrisa más amplia)
smileThreshold: 0.85

// Más permisivo
smileThreshold: 0.6

// Default
smileThreshold: 0.7
```

### Ajustar Precisión de Reconocimiento

```javascript
// Más estricto (menor tasa de falsos positivos)
matchThreshold: 0.4

// Más permisivo (mayor tolerancia)
matchThreshold: 0.7

// Default (balanceado)
matchThreshold: 0.6
```

## 🔒 Seguridad

⚠️ **Nota Importante**: Esta es una prueba de concepto educativa. Para uso en producción:

### Implementaciones Recomendadas

- ✅ **HTTPS**: Obligatorio para WebRTC en producción
- ✅ **Encriptación**: Encripta descriptores faciales en la base de datos
- ✅ **Autenticación Adicional**: Combina con 2FA o contraseñas
- ✅ **Rate Limiting**: Previene ataques de fuerza bruta
- ✅ **Base de Datos**: Usa PostgreSQL/MongoDB en lugar de JSON
- ✅ **Tokens JWT**: Implementa sesiones con tokens
- ✅ **CORS**: Configura políticas CORS apropiadas
- ✅ **Privacidad**: Cumple con GDPR y regulaciones locales
- ✅ **Auditoría**: Registra todos los intentos de acceso
- ✅ **Liveness Detection**: Previene ataques con fotos

### Ejemplo de Mejoras de Seguridad

```javascript
// En server.js
app.post('/api/register', authenticateToken, rateLimit, async (req, res) => {
  // Validar entrada
  // Encriptar descriptor
  // Guardar en DB con hash
  // Registrar en audit log
});
```

## 🐛 Solución de Problemas

### La cámara no funciona
- ✅ Asegúrate de dar permisos de cámara al navegador
- ✅ Verifica que no haya otras aplicaciones usando la cámara
- ✅ Usa HTTPS o localhost
- ✅ Revisa la consola del navegador por errores

### No detecta mi rostro
- ✅ Mejora la iluminación (luz frontal, no de espaldas)
- ✅ Mira directamente a la cámara
- ✅ Mantén tu rostro centrado en el cuadro
- ✅ Acércate más a la cámara
- ✅ Quítate gafas de sol o máscaras

### No detecta mi sonrisa
- ✅ Sonríe de forma más amplia mostrando dientes
- ✅ Espera a que los modelos carguen completamente
- ✅ Ajusta el `smileThreshold` a un valor menor
- ✅ Verifica la iluminación de tu rostro

### No me reconoce (pero estoy registrado)
- ✅ Intenta registrarte de nuevo con mejor iluminación
- ✅ Mantén condiciones similares (con/sin gafas)
- ✅ Ajusta el `matchThreshold` a un valor mayor
- ✅ Verifica que tu sonrisa sea similar a la del registro

### Error: "Este rostro ya está registrado"
- ✅ Esto es correcto, el sistema previene rostros duplicados
- ✅ No puedes registrar el mismo rostro con diferentes nombres
- ✅ Usa el login en lugar de registro

### Modelos tardan en cargar
- ✅ La primera carga descarga ~7MB de modelos
- ✅ Se cachean en el navegador para cargas futuras
- ✅ Verifica tu conexión a internet
- ✅ Considera hospedar los modelos localmente

## 🌐 API Endpoints

### POST `/api/register`

Registra un nuevo usuario con su descriptor facial.

**Request:**
```json
{
  "username": "string",
  "descriptor": "number[]"  // Array de 128 números
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente"
}
```

**Response (Error - Duplicado):**
```json
{
  "error": "Este rostro ya está registrado con el usuario \"juan\"",
  "duplicate": true,
  "existingUser": "juan"
}
```

### GET `/api/users`

Obtiene todos los usuarios registrados (solo descriptores, no imágenes).

**Response:**
```json
[
  {
    "username": "string",
    "descriptor": "number[]",
    "registeredAt": "ISO-8601 date"
  }
]
```

### POST `/api/access-log`

Registra un evento de acceso (login/logout).

**Request:**
```json
{
  "username": "string",
  "action": "LOGIN" | "LOGOUT"
}
```

## 🎯 Casos de Uso

### Portal Corporativo
Autenticación facial para acceso a sistemas internos

### Control de Asistencia
Registro automático de entrada/salida de empleados

### Sistema de Acceso Físico
Control de acceso a edificios o áreas restringidas

### Kioscos Interactivos
Identificación de clientes para servicios personalizados

### E-Learning
Verificación de identidad en exámenes en línea

## 🤝 Contribuciones

Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

ISC

## 👤 Autor

**eyrockscript**
- GitHub: [@eyrockscript](https://github.com/eyrockscript)
- Email: dev.eliud.trejo@gmail.com

## 🙏 Reconocimientos

- [face-api.js](https://github.com/justadudewhohacks/face-api.js) - Librería de reconocimiento facial
- [TensorFlow.js](https://www.tensorflow.org/js) - Machine Learning en JavaScript
- [Express](https://expressjs.com/) - Framework web para Node.js

## 📚 Recursos Adicionales

- [Documentación de Plugins](./plugins/README.md)
- [face-api.js Documentation](https://justadudewhohacks.github.io/face-api.js/docs/index.html)
- [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)

---

Hecho con ❤️ y 😊 para aprendizaje y experimentación

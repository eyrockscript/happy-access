# Happy Access 🔐

Sistema de autenticación y control de acceso mediante reconocimiento facial, desarrollado con JavaScript y face-api.js.

## Características

- ✅ Registro de usuarios con captura facial
- 🔍 Login mediante reconocimiento facial
- 📊 Dashboard de acceso post-autenticación
- 🎨 Interfaz moderna y responsive
- 🔒 Almacenamiento local de descriptores faciales
- 📹 Detección en tiempo real

## Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js + Express
- **IA**: face-api.js (TensorFlow.js)
- **Reconocimiento Facial**: Modelos pre-entrenados de face-api.js

## Requisitos

- Node.js (v14 o superior)
- Navegador moderno con soporte para WebRTC
- Cámara web

## Instalación

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

4. Abre tu navegador y visita:
```
http://localhost:3000
```

## Uso

### Registro de Usuario

1. Haz clic en "Registrarse"
2. Ingresa tu nombre de usuario
3. Haz clic en "Capturar Rostro"
4. Permite el acceso a la cámara
5. Mira directamente a la cámara
6. El sistema detectará y guardará tu rostro

### Iniciar Sesión

1. Haz clic en "Iniciar Sesión"
2. Haz clic en "Reconocer Rostro"
3. Mira a la cámara
4. El sistema te reconocerá y te dará acceso

## Estructura del Proyecto

```
happy-access/
├── public/
│   ├── css/
│   │   └── styles.css          # Estilos de la aplicación
│   ├── js/
│   │   ├── app.js              # Lógica principal
│   │   └── faceDetection.js    # Servicio de detección facial
│   └── index.html              # Interfaz principal
├── server.js                   # Servidor Express
├── package.json
└── README.md
```

## Cómo Funciona

1. **Detección Facial**: Utiliza TinyFaceDetector de face-api.js para detectar rostros en tiempo real
2. **Extracción de Características**: Genera un descriptor facial de 128 dimensiones único para cada rostro
3. **Comparación**: Utiliza distancia euclidiana para comparar rostros y determinar coincidencias
4. **Almacenamiento**: Los descriptores faciales se guardan localmente en `users_data.json`

## Seguridad

⚠️ **Nota Importante**: Esta es una prueba de concepto educativa. Para uso en producción:

- Implementa encriptación para los descriptores faciales
- Usa HTTPS
- Agrega autenticación adicional (2FA)
- Implementa rate limiting
- Usa una base de datos segura
- Considera privacidad y cumplimiento GDPR

## Configuración

Puedes ajustar el umbral de reconocimiento en `app.js`:

```javascript
const match = faceDetectionService.findBestMatch(
    detection.descriptor,
    users,
    0.6  // Umbral: valores más bajos = más estricto
);
```

## Solución de Problemas

### La cámara no funciona
- Asegúrate de dar permisos de cámara al navegador
- Verifica que no haya otras aplicaciones usando la cámara
- Usa HTTPS o localhost

### No detecta mi rostro
- Asegúrate de tener buena iluminación
- Mira directamente a la cámara
- Mantén tu rostro centrado en el cuadro

### No me reconoce
- Intenta registrarte de nuevo con mejor iluminación
- Ajusta el umbral de reconocimiento

## Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

ISC

## Autor

**eyrockscript**

## Reconocimientos

- [face-api.js](https://github.com/justadudewhohacks/face-api.js) - Librería de reconocimiento facial
- [TensorFlow.js](https://www.tensorflow.org/js) - Machine Learning en JavaScript

---

Hecho con ❤️ para aprendizaje y experimentación

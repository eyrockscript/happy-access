# Happy Access - Demo App

Aplicación web standalone de demostración del sistema de autenticación facial con sonrisa.

## 🎯 ¿Qué es esto?

Esta es una **aplicación de demostración completa** que muestra Happy Access funcionando. Incluye:

- Frontend standalone (HTML/CSS/JS vanilla)
- Backend API (Node.js + Express)
- Sistema completo listo para probar

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor
npm start
```

Abre http://localhost:3000

## 📦 ¿Qué incluye?

- ✅ Servidor Express con API REST
- ✅ Interfaz web completa
- ✅ Detección de sonrisa en tiempo real
- ✅ Registro y login facial
- ✅ Dashboard post-autenticación
- ✅ Prevención de rostros duplicados

## 📁 Estructura

```
demo/
├── server.js              # Servidor Express con API
├── public/
│   ├── index.html        # Aplicación web
│   ├── css/
│   │   └── styles.css    # Estilos
│   └── js/
│       ├── app.js        # Lógica principal
│       └── faceDetection.js  # Servicio de detección facial
├── package.json
└── README.md             # Este archivo
```

## 🔌 ¿Quieres integrarlo en tu app?

Este demo **NO** es para integrarse en otros proyectos. Para eso, usa:

- **Plugins**: Componentes para React/Vue/Svelte → `../plugins/`
- **Ejemplos**: Proyectos completos de ejemplo → `../examples/`

## 🛠️ Scripts Disponibles

```bash
npm start        # Inicia el servidor en puerto 3000
npm run dev      # Alias de npm start
```

## 📡 API Endpoints

### POST /api/register
Registra un nuevo usuario con descriptor facial.

```json
{
  "username": "string",
  "descriptor": "number[]"
}
```

### GET /api/users
Obtiene todos los usuarios registrados.

### POST /api/access-log
Registra evento de acceso (login/logout).

## 🔒 Datos

Los descriptores faciales se almacenan en `users_data.json` (creado automáticamente).

⚠️ **Nota**: Este es un demo educativo. Para producción, usa una base de datos real.

## 📚 Más Información

- [README Principal](../README.md)
- [Plugins para Frameworks](../plugins/README.md)
- [Ejemplos Completos](../examples/README.md)

---

**Nota**: Este demo está diseñado para desarrollo y pruebas locales. No lo uses en producción sin las mejoras de seguridad necesarias (HTTPS, encriptación, rate limiting, etc.)

# ⚠️ IMPORTANTE: Instrucciones de Inicio

Este ejemplo es **AUTÓNOMO** e incluye su propio backend.

## 🚀 Pasos para ejecutar (simplificado):

### Opción 1: Dos Terminales (Recomendado)

**Terminal 1 - Backend:**
```bash
# Desde examples/react-example/
npm install
npm start
```

✅ Deberías ver:
```
🚀 Servidor corriendo en http://localhost:3000
📸 Sistema de reconocimiento facial activo
```

**Terminal 2 - Frontend:**
```bash
# Desde examples/react-example/
npm run dev
```

✅ Deberías ver:
```
Local: http://localhost:5173
```

### Opción 2: Una Terminal (Más Simple)

Si solo quieres probar rápido:

```bash
# Terminal 1 - Backend
npm install
npm start &  # El & lo ejecuta en segundo plano

# Terminal 1 - Frontend (en la misma terminal)
npm run dev
```

**Abre:** http://localhost:5173

---

## ✅ Ventajas de Esta Estructura

- ✅ Todo está en un solo lugar
- ✅ No necesitas ir a la raíz del proyecto
- ✅ Incluye su propio servidor
- ✅ Fácil de copiar y usar en tus proyectos

## 📂 Lo que incluye

```
react-example/
├── server.js              # Backend API (puerto 3000)
├── src/
│   ├── App.jsx           # App React (puerto 5173)
│   └── components/
│       └── HappyAccessAuth.jsx  # Componente
├── package.json          # Incluye Express + React
└── README.md            # Documentación completa
```

## ❌ Errores Comunes

### "Cannot find module 'express'"

**Solución:**
```bash
npm install
```

### El servidor no responde

**Causa:** El backend no está corriendo.

**Solución:** Abre otra terminal y ejecuta `npm start`

### Puerto 3000 ya en uso

Otro servidor está usando el puerto 3000.

**Solución:**
```bash
# Ver qué está usando el puerto
lsof -ti:3000
# Matarlo
kill -9 $(lsof -ti:3000)
# O usar otro puerto
PORT=3001 npm start
```

---

## 🔌 ¿Quieres solo el componente?

Si solo necesitas el componente de React sin el servidor, ve a:

```
../../plugins/react/HappyAccessAuth.jsx
```

## 📚 Más Info

- [README Completo](./README.md)
- [Documentación de Plugins](../../plugins/README.md)

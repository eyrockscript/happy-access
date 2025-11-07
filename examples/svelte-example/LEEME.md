# ⚠️ IMPORTANTE: Instrucciones de Inicio

Este ejemplo es **solo frontend** y requiere el backend de demo corriendo.

## 🚀 Pasos para ejecutar:

### Dos Terminales (Requerido)

**Terminal 1 - Backend (desde raíz del proyecto):**
```bash
# Desde happy-access/ (raíz)
npm run demo
```

✅ Deberías ver:
```
🚀 Servidor corriendo en http://localhost:3000
📸 Sistema de reconocimiento facial activo
```

**Terminal 2 - Frontend (desde este directorio):**
```bash
# Desde examples/svelte-example/
npm install
npm run dev
```

✅ Deberías ver:
```
Local: http://localhost:5175
```

**Abre:** http://localhost:5175

---

## ⚙️ Configuración (Opcional)

Este ejemplo usa variables de ambiente. Para personalizarlo:

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tus valores
```

**Variables disponibles:**
- `VITE_API_ENDPOINT` - URL del backend (default: http://localhost:3000/api)
- `VITE_SMILE_THRESHOLD` - Umbral de sonrisa 0-1 (default: 0.7)
- `VITE_MATCH_THRESHOLD` - Umbral de coincidencia 0-1 (default: 0.6)
- `VITE_MODELS_PATH` - Ruta de modelos de face-api.js

## ✅ Ventajas de Esta Estructura

- ✅ Solo frontend, fácil de entender
- ✅ Usa el plugin directamente desde `./plugins/svelte/`
- ✅ Configurable con variables de ambiente
- ✅ Ejemplo completo de integración

## 📂 Lo que incluye

```
svelte-example/
├── .env.example          # Variables de ambiente de ejemplo
├── src/
│   ├── App.svelte       # App Svelte (puerto 5175)
│   └── lib/
│       └── HappyAccessAuth.svelte  # Componente del plugin
├── package.json         # Dependencias de Svelte
└── README.md           # Documentación completa
```

## ❌ Errores Comunes

### "Error de red. Verifica que el servidor esté corriendo"

**Causa:** El backend no está corriendo.

**Solución:** Abre otra terminal en la raíz y ejecuta `npm run demo`

### Puerto 3000 ya en uso

Otro servidor está usando el puerto 3000.

**Solución:**
```bash
# Ver qué está usando el puerto
lsof -ti:3000
# Matarlo
kill -9 $(lsof -ti:3000)
```

---

## 🔌 ¿Quieres solo el componente?

Si solo necesitas el componente de Svelte sin el servidor, ve a:

```
../../plugins/svelte/HappyAccessAuth.svelte
```

## 📚 Más Info

- [README Completo](./README.md)
- [Documentación de Plugins](../../plugins/README.md)

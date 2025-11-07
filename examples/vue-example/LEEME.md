# ⚠️ IMPORTANTE: Instrucciones de Inicio

Este ejemplo **requiere** que el servidor backend esté corriendo primero.

## 🚀 Pasos para ejecutar (en orden):

### Paso 1: Inicia el Backend (Terminal 1)

```bash
# Desde la RAÍZ del proyecto (happy-access/), NO desde examples/
cd ../..     # Si estás en examples/vue-example
npm install
npm start
```

✅ Deberías ver:
```
🚀 Servidor corriendo en http://localhost:3000
📸 Sistema de reconocimiento facial activo
```

### Paso 2: Inicia este Ejemplo Vue (Terminal 2)

```bash
# Desde examples/vue-example/
npm install
npm run dev
```

✅ Deberías ver:
```
VITE ready in XXX ms
Local: http://localhost:5174
```

### Paso 3: Abre el Navegador

Abre http://localhost:5174

---

## ❌ Errores Comunes

### "npm start no funciona"

**Causa:** Estás ejecutando `npm start` desde la carpeta del ejemplo.

**Solución:**
```bash
# Sal de la carpeta del ejemplo
cd ../..

# Ahora ejecuta npm start
npm start
```

### "Error de red / servidor no responde"

**Causa:** El backend no está corriendo.

**Solución:**
1. Abre una terminal separada
2. Ve a la raíz del proyecto: `cd path/to/happy-access`
3. Ejecuta: `npm start`
4. Espera a ver el mensaje de confirmación
5. Regresa a tu ejemplo y recarga la página

### "Cannot find module 'express'"

**Causa:** No has instalado las dependencias del backend.

**Solución:**
```bash
cd ../..
npm install
npm start
```

---

## 📂 Estructura de Carpetas (para referencia)

```
happy-access/                    ← AQUÍ ejecutas "npm start"
├── server.js
├── package.json
└── examples/
    └── vue-example/            ← AQUÍ ejecutas "npm run dev"
        ├── src/
        └── package.json
```

---

## ✅ Checklist Rápido

Antes de reportar un problema, verifica:

- [ ] El backend está corriendo en otra terminal
- [ ] Ves el mensaje "🚀 Servidor corriendo en http://localhost:3000"
- [ ] Ejecutaste `npm install` en la raíz Y en examples/vue-example
- [ ] Estás usando el puerto correcto (5174 para Vue)
- [ ] No hay otro proceso usando el puerto 3000 o 5174

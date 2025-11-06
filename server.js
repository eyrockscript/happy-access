import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Archivo para almacenar datos de usuarios
const USERS_FILE = path.join(__dirname, 'users_data.json');

// Inicializar archivo de usuarios si no existe
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// Función para calcular distancia euclidiana entre descriptores faciales
function euclideanDistance(descriptor1, descriptor2) {
    if (!descriptor1 || !descriptor2 || descriptor1.length !== descriptor2.length) {
        return Infinity;
    }

    let sum = 0;
    for (let i = 0; i < descriptor1.length; i++) {
        const diff = descriptor1[i] - descriptor2[i];
        sum += diff * diff;
    }
    return Math.sqrt(sum);
}

// Verificar si un rostro ya está registrado
function isFaceDuplicate(newDescriptor, existingUsers, threshold = 0.6) {
    for (const user of existingUsers) {
        const distance = euclideanDistance(newDescriptor, user.descriptor);
        if (distance < threshold) {
            return { isDuplicate: true, existingUser: user.username, distance };
        }
    }
    return { isDuplicate: false };
}

// Endpoint para registrar un nuevo usuario
app.post('/api/register', (req, res) => {
    try {
        const { username, descriptor } = req.body;

        if (!username || !descriptor) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));

        // Verificar si el usuario ya existe (por nombre)
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Verificar si el rostro ya está registrado
        const duplicateCheck = isFaceDuplicate(descriptor, users, 0.6);
        if (duplicateCheck.isDuplicate) {
            return res.status(400).json({
                error: `Este rostro ya está registrado con el usuario "${duplicateCheck.existingUser}"`,
                duplicate: true,
                existingUser: duplicateCheck.existingUser
            });
        }

        // Agregar nuevo usuario
        users.push({
            username,
            descriptor,
            registeredAt: new Date().toISOString()
        });

        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

        res.json({ success: true, message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Endpoint para obtener todos los usuarios (solo descriptores)
app.get('/api/users', (req, res) => {
    try {
        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Endpoint para registrar acceso
app.post('/api/access-log', (req, res) => {
    try {
        const { username, action } = req.body;
        console.log(`[${new Date().toISOString()}] ${action}: ${username}`);
        res.json({ success: true });
    } catch (error) {
        console.error('Error al registrar acceso:', error);
        res.status(500).json({ error: 'Error al registrar acceso' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📸 Sistema de reconocimiento facial activo`);
});

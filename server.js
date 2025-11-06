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

// Endpoint para registrar un nuevo usuario
app.post('/api/register', (req, res) => {
    try {
        const { username, descriptor } = req.body;

        if (!username || !descriptor) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));

        // Verificar si el usuario ya existe
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ error: 'El usuario ya existe' });
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

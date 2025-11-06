// Aplicación principal de Happy Access

let currentUser = null;
let videoStream = null;

// Inicialización
window.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando Happy Access...');

    // Cargar modelos de face-api
    const loaded = await faceDetectionService.loadModels();

    if (loaded) {
        hideLoading();
    } else {
        showStatus('error', '❌ Error al cargar los modelos de IA', 'error');
        hideLoading();
    }
});

// Navegación entre pantallas
function showScreen(screenId) {
    // Detener stream de video si existe
    stopVideoStream();

    // Limpiar todos los canvas
    clearAllCanvas();

    // Resetear estados de botones
    resetButtons();

    // Limpiar mensajes de estado
    clearStatus('status-register');
    clearStatus('status-login');

    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Mostrar pantalla seleccionada
    document.getElementById(screenId).classList.add('active');
}

// Limpiar todos los canvas
function clearAllCanvas() {
    const canvases = ['overlay-register', 'overlay-login'];
    canvases.forEach(canvasId => {
        const canvas = document.getElementById(canvasId);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });
}

// Resetear estados de botones
function resetButtons() {
    const btnRegister = document.getElementById('btn-start-register');
    const btnLogin = document.getElementById('btn-start-login');

    if (btnRegister) btnRegister.disabled = false;
    if (btnLogin) btnLogin.disabled = false;
}

// Funciones de carga
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

// Mensajes de estado
function showStatus(elementId, message, type = 'info') {
    const statusElement = document.getElementById(elementId);
    statusElement.textContent = message;
    statusElement.className = `status-message ${type}`;
}

function clearStatus(elementId) {
    const statusElement = document.getElementById(elementId);
    statusElement.textContent = '';
    statusElement.className = 'status-message';
}

// Manejo de video
async function startVideo(videoElement) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 }
            },
            audio: false
        });

        videoElement.srcObject = stream;
        videoStream = stream;

        return new Promise((resolve) => {
            videoElement.onloadedmetadata = () => {
                resolve(true);
            };
        });
    } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        return false;
    }
}

function stopVideoStream() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }

    // Limpiar srcObject de los videos
    const videoRegister = document.getElementById('video-register');
    const videoLogin = document.getElementById('video-login');

    if (videoRegister && videoRegister.srcObject) {
        videoRegister.srcObject = null;
    }
    if (videoLogin && videoLogin.srcObject) {
        videoLogin.srcObject = null;
    }
}

// === REGISTRO DE USUARIO ===
async function startRegister() {
    const usernameInput = document.getElementById('username-register');
    const username = usernameInput.value.trim();

    if (!username) {
        showStatus('status-register', '⚠️ Por favor ingresa un nombre de usuario', 'warning');
        return;
    }

    const video = document.getElementById('video-register');
    const canvas = document.getElementById('overlay-register');
    const btnStart = document.getElementById('btn-start-register');

    btnStart.disabled = true;
    clearStatus('status-register');

    // Limpiar canvas antes de empezar
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Iniciar video
    showStatus('status-register', '📹 Iniciando cámara...', 'info');
    const videoStarted = await startVideo(video);

    if (!videoStarted) {
        showStatus('status-register', '❌ No se pudo acceder a la cámara', 'error');
        btnStart.disabled = false;
        return;
    }

    // Ajustar canvas al tamaño del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    showStatus('status-register', '👤 Detectando rostro...', 'info');

    // Esperar un momento para que el video se estabilice
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        // Detectar rostro con expresiones
        showStatus('status-register', '😊 ¡Sonríe para la cámara!', 'info');

        let detection = null;
        let attempts = 0;
        const maxAttempts = 30; // 30 intentos = ~6 segundos

        // Intentar detectar una sonrisa
        while (attempts < maxAttempts) {
            detection = await faceDetectionService.detectFaceWithExpression(video);

            if (detection) {
                // Dibujar detección con información de sonrisa
                faceDetectionService.drawDetection(canvas, detection, username, true);

                if (faceDetectionService.isSmiling(detection, 0.7)) {
                    showStatus('status-register', '✅ ¡Sonrisa detectada! Guardando...', 'success');
                    break;
                }
            }

            attempts++;
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        if (!detection) {
            showStatus('status-register', '❌ No se detectó ningún rostro. Intenta de nuevo.', 'error');
            btnStart.disabled = false;
            stopVideoStream();
            return;
        }

        if (!faceDetectionService.isSmiling(detection, 0.7)) {
            showStatus('status-register', '❌ No detectamos una sonrisa. ¡Sonríe e intenta de nuevo!', 'warning');
            btnStart.disabled = false;
            stopVideoStream();
            return;
        }

        // Guardar usuario
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                descriptor: Array.from(detection.descriptor)
            })
        });

        const result = await response.json();

        if (response.ok) {
            showStatus('status-register', `✅ ${result.message}`, 'success');
            usernameInput.value = '';

            // Volver al inicio después de 2 segundos
            setTimeout(() => {
                stopVideoStream();
                showScreen('home-screen');
            }, 2000);
        } else {
            showStatus('status-register', `❌ ${result.error}`, 'error');
            btnStart.disabled = false;
            stopVideoStream();
        }

    } catch (error) {
        console.error('Error en registro:', error);
        showStatus('status-register', '❌ Error al registrar usuario', 'error');
        btnStart.disabled = false;
        stopVideoStream();
    }
}

// === LOGIN CON RECONOCIMIENTO FACIAL ===
async function startLogin() {
    const video = document.getElementById('video-login');
    const canvas = document.getElementById('overlay-login');
    const btnStart = document.getElementById('btn-start-login');

    btnStart.disabled = true;
    clearStatus('status-login');

    // Limpiar canvas antes de empezar
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Obtener usuarios registrados
    showStatus('status-login', '📊 Cargando datos de usuarios...', 'info');
    const response = await fetch('/api/users');

    if (!response.ok) {
        showStatus('status-login', '❌ Error al cargar usuarios', 'error');
        btnStart.disabled = false;
        return;
    }

    const users = await response.json();

    if (users.length === 0) {
        showStatus('status-login', '⚠️ No hay usuarios registrados', 'warning');
        btnStart.disabled = false;
        return;
    }

    // Iniciar video
    showStatus('status-login', '📹 Iniciando cámara...', 'info');
    const videoStarted = await startVideo(video);

    if (!videoStarted) {
        showStatus('status-login', '❌ No se pudo acceder a la cámara', 'error');
        btnStart.disabled = false;
        return;
    }

    // Ajustar canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    showStatus('status-login', '🔍 Buscando rostro...', 'info');

    // Esperar estabilización
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        // Detectar rostro con expresiones
        showStatus('status-login', '😊 ¡Sonríe para autenticarte!', 'info');

        let detection = null;
        let attempts = 0;
        const maxAttempts = 30; // 30 intentos = ~6 segundos

        // Intentar detectar una sonrisa
        while (attempts < maxAttempts) {
            detection = await faceDetectionService.detectFaceWithExpression(video);

            if (detection) {
                // Dibujar detección con información de sonrisa
                faceDetectionService.drawDetection(canvas, detection, '', true);

                if (faceDetectionService.isSmiling(detection, 0.7)) {
                    showStatus('status-login', '✅ ¡Sonrisa detectada! Verificando...', 'success');
                    break;
                }
            }

            attempts++;
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        if (!detection) {
            showStatus('status-login', '❌ No se detectó ningún rostro. Intenta de nuevo.', 'error');
            btnStart.disabled = false;
            stopVideoStream();
            return;
        }

        if (!faceDetectionService.isSmiling(detection, 0.7)) {
            showStatus('status-login', '❌ No detectamos una sonrisa. ¡Sonríe e intenta de nuevo!', 'warning');
            btnStart.disabled = false;
            stopVideoStream();
            return;
        }

        // Buscar coincidencia
        showStatus('status-login', '🔍 Buscando coincidencia...', 'info');

        const match = faceDetectionService.findBestMatch(
            detection.descriptor,
            users,
            0.6 // threshold
        );

        if (match) {
            // Usuario reconocido
            faceDetectionService.drawDetection(canvas, detection, match.username);
            showStatus('status-login', `✅ Bienvenido, ${match.username}!`, 'success');

            currentUser = match;

            // Registrar acceso
            await fetch('/api/access-log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: match.username,
                    action: 'LOGIN'
                })
            });

            // Ir al dashboard
            setTimeout(() => {
                stopVideoStream();
                showDashboard();
            }, 1500);

        } else {
            // No se reconoció el rostro
            faceDetectionService.drawDetection(canvas, detection, 'Desconocido');
            showStatus('status-login', '❌ Rostro no reconocido. Acceso denegado.', 'error');
            btnStart.disabled = false;
            stopVideoStream();
        }

    } catch (error) {
        console.error('Error en login:', error);
        showStatus('status-login', '❌ Error al procesar reconocimiento', 'error');
        btnStart.disabled = false;
        stopVideoStream();
    }
}

// === DASHBOARD ===
function showDashboard() {
    if (!currentUser) return;

    // Mostrar información del usuario
    document.getElementById('stat-username').textContent = currentUser.username;

    const now = new Date();
    document.getElementById('stat-time').textContent = now.toLocaleTimeString('es-ES');

    showScreen('dashboard-screen');
}

// === LOGOUT ===
async function logout() {
    if (currentUser) {
        await fetch('/api/access-log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: currentUser.username,
                action: 'LOGOUT'
            })
        });
    }

    currentUser = null;
    showScreen('home-screen');
}

import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

/**
 * Genera un hash criptográfico SHA-256 del descriptor facial
 * Este hash puede ser usado como identificador único del rostro
 */
async function generateFaceHash(descriptor) {
    const descriptorString = JSON.stringify(Array.from(descriptor));
    const encoder = new TextEncoder();
    const data = encoder.encode(descriptorString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * HappyAccessAuth - Componente de autenticación facial con sonrisa para React 18+
 *
 * @param {Object} props
 * @param {string} props.apiEndpoint - URL base del API (ej: 'http://localhost:3000/api')
 * @param {Function} props.onSuccess - Callback cuando la autenticación es exitosa
 * @param {Function} props.onError - Callback cuando ocurre un error
 * @param {string} props.mode - Modo: 'register' o 'login'
 * @param {number} props.smileThreshold - Umbral de sonrisa (0-1, default: 0.7 o VITE_SMILE_THRESHOLD)
 * @param {number} props.matchThreshold - Umbral de coincidencia facial (0-1, default: 0.6 o VITE_MATCH_THRESHOLD)
 * @param {string} props.modelsPath - Ruta de los modelos de face-api.js (default: VITE_MODELS_PATH o CDN)
 */
const HappyAccessAuth = ({
    apiEndpoint = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000/api',
    onSuccess,
    onError,
    mode = 'login',
    smileThreshold = parseFloat(import.meta.env.VITE_SMILE_THRESHOLD) || 0.7,
    matchThreshold = parseFloat(import.meta.env.VITE_MATCH_THRESHOLD) || 0.6,
    modelsPath = import.meta.env.VITE_MODELS_PATH || 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model',
    className = ''
}) => {
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ message: '', type: 'info' });
    const [username, setUsername] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [smileScore, setSmileScore] = useState(0);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    // Cargar modelos al montar el componente
    useEffect(() => {
        loadModels();
        return () => {
            stopVideo();
        };
    }, []);

    const loadModels = async () => {
        try {
            setStatus({ message: 'Cargando modelos de IA...', type: 'info' });

            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath),
                faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath),
                faceapi.nets.faceRecognitionNet.loadFromUri(modelsPath),
                faceapi.nets.faceExpressionNet.loadFromUri(modelsPath)
            ]);

            setModelsLoaded(true);
            setLoading(false);
            setStatus({ message: 'Modelos cargados. Listo para usar.', type: 'success' });
        } catch (error) {
            console.error('Error al cargar modelos:', error);
            setLoading(false);
            setStatus({ message: 'Error al cargar modelos de IA', type: 'error' });
            onError?.({ error: 'MODEL_LOAD_ERROR', details: error });
        }
    };

    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 } },
                audio: false
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
            }

            return true;
        } catch (error) {
            console.error('Error al acceder a la cámara:', error);
            setStatus({ message: 'No se pudo acceder a la cámara', type: 'error' });
            onError?.({ error: 'CAMERA_ACCESS_ERROR', details: error });
            return false;
        }
    };

    const stopVideo = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        setSmileScore(0);
    };

    const detectFaceWithSmile = async () => {
        if (!videoRef.current || !canvasRef.current) return null;

        const detection = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor()
            .withFaceExpressions();

        if (detection && canvasRef.current) {
            const canvas = canvasRef.current;
            const displaySize = { width: canvas.width, height: canvas.height };
            faceapi.matchDimensions(canvas, displaySize);
            const resizedDetection = faceapi.resizeResults(detection, displaySize);

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            faceapi.draw.drawDetections(canvas, resizedDetection);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetection);

            if (detection.expressions) {
                const score = (detection.expressions.happy * 100).toFixed(0);
                setSmileScore(score);

                const box = detection.detection.box;
                const isSmiling = detection.expressions.happy > smileThreshold;

                ctx.fillStyle = isSmiling ? '#22c55e' : '#f59e0b';
                ctx.font = 'bold 18px Arial';
                ctx.fillText(`${isSmiling ? '😊' : '😐'} ${score}%`, box.x, box.y - 10);
            }
        }

        return detection;
    };

    const handleRegister = async () => {
        if (!username.trim()) {
            setStatus({ message: 'Por favor ingresa un nombre de usuario', type: 'warning' });
            return;
        }

        setIsProcessing(true);
        setStatus({ message: 'Iniciando cámara...', type: 'info' });

        const videoStarted = await startVideo();
        if (!videoStarted) {
            setIsProcessing(false);
            return;
        }

        // Esperar que el video se estabilice
        await new Promise(resolve => setTimeout(resolve, 1000));

        setStatus({ message: '😊 ¡Sonríe para la cámara!', type: 'info' });

        let detection = null;
        let attempts = 0;
        const maxAttempts = 30;

        while (attempts < maxAttempts) {
            detection = await detectFaceWithSmile();

            if (detection && detection.expressions.happy > smileThreshold) {
                setStatus({ message: '✅ ¡Sonrisa detectada! Guardando...', type: 'success' });
                break;
            }

            attempts++;
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        if (!detection) {
            setStatus({ message: 'No se detectó ningún rostro', type: 'error' });
            setIsProcessing(false);
            stopVideo();
            return;
        }

        if (detection.expressions.happy <= smileThreshold) {
            setStatus({ message: '¡Sonríe e intenta de nuevo!', type: 'warning' });
            setIsProcessing(false);
            stopVideo();
            return;
        }

        // Registrar usuario
        try {
            const response = await fetch(`${apiEndpoint}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: username.trim(),
                    descriptor: Array.from(detection.descriptor)
                })
            });

            const result = await response.json();

            if (response.ok) {
                // Generar hash criptográfico
                const faceHash = await generateFaceHash(detection.descriptor);

                setStatus({ message: result.message, type: 'success' });
                setUsername('');
                stopVideo();
                onSuccess?.({
                    username: username.trim(),
                    mode: 'register',
                    faceHash: faceHash,
                    timestamp: new Date().toISOString()
                });
            } else {
                setStatus({ message: result.error, type: 'error' });
                onError?.({ error: 'REGISTRATION_ERROR', details: result });
            }
        } catch (error) {
            setStatus({ message: 'Error al registrar usuario', type: 'error' });
            onError?.({ error: 'NETWORK_ERROR', details: error });
        }

        setIsProcessing(false);
    };

    const handleLogin = async () => {
        setIsProcessing(true);
        setStatus({ message: 'Cargando usuarios...', type: 'info' });

        try {
            const response = await fetch(`${apiEndpoint}/users`);
            const users = await response.json();

            if (users.length === 0) {
                setStatus({ message: 'No hay usuarios registrados', type: 'warning' });
                setIsProcessing(false);
                return;
            }

            const videoStarted = await startVideo();
            if (!videoStarted) {
                setIsProcessing(false);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));

            setStatus({ message: '😊 ¡Sonríe para autenticarte!', type: 'info' });

            let detection = null;
            let attempts = 0;
            const maxAttempts = 30;

            while (attempts < maxAttempts) {
                detection = await detectFaceWithSmile();

                if (detection && detection.expressions.happy > smileThreshold) {
                    setStatus({ message: '✅ ¡Sonrisa detectada! Verificando...', type: 'success' });
                    break;
                }

                attempts++;
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            if (!detection || detection.expressions.happy <= smileThreshold) {
                setStatus({ message: 'No se detectó una sonrisa', type: 'warning' });
                setIsProcessing(false);
                stopVideo();
                return;
            }

            // Buscar coincidencia
            setStatus({ message: 'Buscando coincidencia...', type: 'info' });

            let bestMatch = null;
            let bestDistance = Infinity;

            for (const user of users) {
                const distance = faceapi.euclideanDistance(detection.descriptor, user.descriptor);
                if (distance < bestDistance && distance < matchThreshold) {
                    bestDistance = distance;
                    bestMatch = user;
                }
            }

            if (bestMatch) {
                // Generar hash criptográfico
                const faceHash = await generateFaceHash(detection.descriptor);

                setStatus({ message: `¡Bienvenido, ${bestMatch.username}!`, type: 'success' });
                stopVideo();
                onSuccess?.({
                    username: bestMatch.username,
                    mode: 'login',
                    confidence: 1 - bestDistance,
                    faceHash: faceHash,
                    timestamp: new Date().toISOString()
                });
            } else {
                setStatus({ message: 'Rostro no reconocido', type: 'error' });
                onError?.({ error: 'FACE_NOT_RECOGNIZED' });
            }
        } catch (error) {
            setStatus({ message: 'Error al autenticar', type: 'error' });
            onError?.({ error: 'NETWORK_ERROR', details: error });
        }

        setIsProcessing(false);
    };

    const handleStart = () => {
        if (mode === 'register') {
            handleRegister();
        } else {
            handleLogin();
        }
    };

    if (loading) {
        return (
            <div className={`happy-access-loading ${className}`}>
                <div className="spinner"></div>
                <p>Cargando modelos de IA...</p>
            </div>
        );
    }

    return (
        <div className={`happy-access-container ${className}`}>
            <div className="happy-access-content">
                {mode === 'register' && (
                    <div className="form-group">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nombre de usuario"
                            className="input-field"
                            disabled={isProcessing}
                        />
                    </div>
                )}

                <div className="video-container">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        onLoadedMetadata={() => {
                            if (canvasRef.current && videoRef.current) {
                                canvasRef.current.width = videoRef.current.videoWidth;
                                canvasRef.current.height = videoRef.current.videoHeight;
                            }
                        }}
                    />
                    <canvas ref={canvasRef} />
                </div>

                {status.message && (
                    <div className={`status-message ${status.type}`}>
                        {status.message}
                    </div>
                )}

                {smileScore > 0 && (
                    <div className="smile-indicator">
                        <div className="smile-bar">
                            <div
                                className="smile-fill"
                                style={{
                                    width: `${smileScore}%`,
                                    backgroundColor: smileScore >= smileThreshold * 100 ? '#22c55e' : '#f59e0b'
                                }}
                            />
                        </div>
                        <span className="smile-text">{smileScore}% sonrisa</span>
                    </div>
                )}

                <button
                    onClick={handleStart}
                    disabled={isProcessing || !modelsLoaded}
                    className="btn-primary"
                >
                    {isProcessing ? 'Procesando...' : mode === 'register' ? '📸 Registrarse' : '🔓 Iniciar Sesión'}
                </button>

                {streamRef.current && (
                    <button onClick={stopVideo} className="btn-secondary">
                        Detener Cámara
                    </button>
                )}
            </div>
        </div>
    );
};

export default HappyAccessAuth;

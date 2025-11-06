<template>
  <div :class="['happy-access-container', className]">
    <div v-if="loading" class="happy-access-loading">
      <div class="spinner"></div>
      <p>Cargando modelos de IA...</p>
    </div>

    <div v-else class="happy-access-content">
      <div v-if="mode === 'register'" class="form-group">
        <input
          v-model="username"
          type="text"
          placeholder="Nombre de usuario"
          class="input-field"
          :disabled="isProcessing"
        />
      </div>

      <div class="video-container">
        <video
          ref="videoRef"
          autoplay
          muted
          playsinline
          @loadedmetadata="handleVideoLoaded"
        ></video>
        <canvas ref="canvasRef"></canvas>
      </div>

      <div v-if="status.message" :class="['status-message', status.type]">
        {{ status.message }}
      </div>

      <div v-if="smileScore > 0" class="smile-indicator">
        <div class="smile-bar">
          <div
            class="smile-fill"
            :style="{
              width: `${smileScore}%`,
              backgroundColor: smileScore >= smileThreshold * 100 ? '#22c55e' : '#f59e0b'
            }"
          ></div>
        </div>
        <span class="smile-text">{{ smileScore }}% sonrisa</span>
      </div>

      <button
        @click="handleStart"
        :disabled="isProcessing || !modelsLoaded"
        class="btn-primary"
      >
        {{ isProcessing ? 'Procesando...' : mode === 'register' ? '📸 Registrarse' : '🔓 Iniciar Sesión' }}
      </button>

      <button v-if="stream" @click="stopVideo" class="btn-secondary">
        Detener Cámara
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps, defineEmits } from 'vue';
import * as faceapi from 'face-api.js';

/**
 * HappyAccessAuth - Componente de autenticación facial con sonrisa para Vue 3+
 */
const props = defineProps({
  apiEndpoint: {
    type: String,
    required: true,
    // URL base del API (ej: 'http://localhost:3000/api')
  },
  mode: {
    type: String,
    default: 'login',
    validator: (value) => ['login', 'register'].includes(value)
  },
  smileThreshold: {
    type: Number,
    default: 0.7
  },
  matchThreshold: {
    type: Number,
    default: 0.6
  },
  modelsPath: {
    type: String,
    default: 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model'
  },
  className: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['success', 'error']);

const modelsLoaded = ref(false);
const loading = ref(true);
const status = ref({ message: '', type: 'info' });
const username = ref('');
const isProcessing = ref(false);
const smileScore = ref(0);

const videoRef = ref(null);
const canvasRef = ref(null);
const stream = ref(null);

onMounted(() => {
  loadModels();
});

onUnmounted(() => {
  stopVideo();
});

const loadModels = async () => {
  try {
    status.value = { message: 'Cargando modelos de IA...', type: 'info' };

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(props.modelsPath),
      faceapi.nets.faceLandmark68Net.loadFromUri(props.modelsPath),
      faceapi.nets.faceRecognitionNet.loadFromUri(props.modelsPath),
      faceapi.nets.faceExpressionNet.loadFromUri(props.modelsPath)
    ]);

    modelsLoaded.value = true;
    loading.value = false;
    status.value = { message: 'Modelos cargados. Listo para usar.', type: 'success' };
  } catch (error) {
    console.error('Error al cargar modelos:', error);
    loading.value = false;
    status.value = { message: 'Error al cargar modelos de IA', type: 'error' };
    emit('error', { error: 'MODEL_LOAD_ERROR', details: error });
  }
};

const startVideo = async () => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 640 }, height: { ideal: 480 } },
      audio: false
    });

    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream;
      stream.value = mediaStream;
    }

    return true;
  } catch (error) {
    console.error('Error al acceder a la cámara:', error);
    status.value = { message: 'No se pudo acceder a la cámara', type: 'error' };
    emit('error', { error: 'CAMERA_ACCESS_ERROR', details: error });
    return false;
  }
};

const stopVideo = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
    stream.value = null;
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null;
  }
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  }
  smileScore.value = 0;
};

const handleVideoLoaded = () => {
  if (canvasRef.value && videoRef.value) {
    canvasRef.value.width = videoRef.value.videoWidth;
    canvasRef.value.height = videoRef.value.videoHeight;
  }
};

const detectFaceWithSmile = async () => {
  if (!videoRef.value || !canvasRef.value) return null;

  const detection = await faceapi
    .detectSingleFace(videoRef.value, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor()
    .withFaceExpressions();

  if (detection && canvasRef.value) {
    const canvas = canvasRef.value;
    const displaySize = { width: canvas.width, height: canvas.height };
    faceapi.matchDimensions(canvas, displaySize);
    const resizedDetection = faceapi.resizeResults(detection, displaySize);

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetection);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetection);

    if (detection.expressions) {
      const score = (detection.expressions.happy * 100).toFixed(0);
      smileScore.value = score;

      const box = detection.detection.box;
      const isSmiling = detection.expressions.happy > props.smileThreshold;

      ctx.fillStyle = isSmiling ? '#22c55e' : '#f59e0b';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(`${isSmiling ? '😊' : '😐'} ${score}%`, box.x, box.y - 10);
    }
  }

  return detection;
};

const handleRegister = async () => {
  if (!username.value.trim()) {
    status.value = { message: 'Por favor ingresa un nombre de usuario', type: 'warning' };
    return;
  }

  isProcessing.value = true;
  status.value = { message: 'Iniciando cámara...', type: 'info' };

  const videoStarted = await startVideo();
  if (!videoStarted) {
    isProcessing.value = false;
    return;
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  status.value = { message: '😊 ¡Sonríe para la cámara!', type: 'info' };

  let detection = null;
  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    detection = await detectFaceWithSmile();

    if (detection && detection.expressions.happy > props.smileThreshold) {
      status.value = { message: '✅ ¡Sonrisa detectada! Guardando...', type: 'success' };
      break;
    }

    attempts++;
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  if (!detection) {
    status.value = { message: 'No se detectó ningún rostro', type: 'error' };
    isProcessing.value = false;
    stopVideo();
    return;
  }

  if (detection.expressions.happy <= props.smileThreshold) {
    status.value = { message: '¡Sonríe e intenta de nuevo!', type: 'warning' };
    isProcessing.value = false;
    stopVideo();
    return;
  }

  try {
    const response = await fetch(`${props.apiEndpoint}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value.trim(),
        descriptor: Array.from(detection.descriptor)
      })
    });

    const result = await response.json();

    if (response.ok) {
      status.value = { message: result.message, type: 'success' };
      username.value = '';
      stopVideo();
      emit('success', { username: username.value.trim(), mode: 'register' });
    } else {
      status.value = { message: result.error, type: 'error' };
      emit('error', { error: 'REGISTRATION_ERROR', details: result });
    }
  } catch (error) {
    status.value = { message: 'Error al registrar usuario', type: 'error' };
    emit('error', { error: 'NETWORK_ERROR', details: error });
  }

  isProcessing.value = false;
};

const handleLogin = async () => {
  isProcessing.value = true;
  status.value = { message: 'Cargando usuarios...', type: 'info' };

  try {
    const response = await fetch(`${props.apiEndpoint}/users`);
    const users = await response.json();

    if (users.length === 0) {
      status.value = { message: 'No hay usuarios registrados', type: 'warning' };
      isProcessing.value = false;
      return;
    }

    const videoStarted = await startVideo();
    if (!videoStarted) {
      isProcessing.value = false;
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    status.value = { message: '😊 ¡Sonríe para autenticarte!', type: 'info' };

    let detection = null;
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      detection = await detectFaceWithSmile();

      if (detection && detection.expressions.happy > props.smileThreshold) {
        status.value = { message: '✅ ¡Sonrisa detectada! Verificando...', type: 'success' };
        break;
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    if (!detection || detection.expressions.happy <= props.smileThreshold) {
      status.value = { message: 'No se detectó una sonrisa', type: 'warning' };
      isProcessing.value = false;
      stopVideo();
      return;
    }

    status.value = { message: 'Buscando coincidencia...', type: 'info' };

    let bestMatch = null;
    let bestDistance = Infinity;

    for (const user of users) {
      const distance = faceapi.euclideanDistance(detection.descriptor, user.descriptor);
      if (distance < bestDistance && distance < props.matchThreshold) {
        bestDistance = distance;
        bestMatch = user;
      }
    }

    if (bestMatch) {
      status.value = { message: `¡Bienvenido, ${bestMatch.username}!`, type: 'success' };
      stopVideo();
      emit('success', { username: bestMatch.username, mode: 'login', confidence: 1 - bestDistance });
    } else {
      status.value = { message: 'Rostro no reconocido', type: 'error' };
      emit('error', { error: 'FACE_NOT_RECOGNIZED' });
    }
  } catch (error) {
    status.value = { message: 'Error al autenticar', type: 'error' };
    emit('error', { error: 'NETWORK_ERROR', details: error });
  }

  isProcessing.value = false;
};

const handleStart = () => {
  if (props.mode === 'register') {
    handleRegister();
  } else {
    handleLogin();
  }
};
</script>

<style scoped>
/* Estilos mínimos, se pueden sobrescribir */
.happy-access-container {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
}

.video-container {
  position: relative;
  width: 100%;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
}

video {
  width: 100%;
  height: auto;
  display: block;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.status-message {
  padding: 15px;
  margin: 20px 0;
  border-radius: 8px;
  text-align: center;
}

.status-message.success {
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid #22c55e;
  color: #22c55e;
}

.status-message.error {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid #ef4444;
  color: #ef4444;
}

.status-message.warning {
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid #f59e0b;
  color: #f59e0b;
}

.status-message.info {
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid #6366f1;
  color: #6366f1;
}

.smile-indicator {
  margin: 15px 0;
}

.smile-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.smile-fill {
  height: 100%;
  transition: width 0.2s ease;
}

.smile-text {
  display: block;
  margin-top: 5px;
  text-align: center;
  font-size: 14px;
}
</style>

<script>
  import { onMount, onDestroy } from 'svelte';
  import * as faceapi from 'face-api.js';

  /**
   * HappyAccessAuth - Componente de autenticación facial con sonrisa para Svelte 4+
   */

  // Props
  export let apiEndpoint = ''; // URL base del API (requerido)
  export let mode = 'login'; // 'login' o 'register'
  export let smileThreshold = 0.7; // Umbral de sonrisa (0-1)
  export let matchThreshold = 0.6; // Umbral de coincidencia facial (0-1)
  export let modelsPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model';
  export let className = '';

  // Eventos
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Estado
  let modelsLoaded = false;
  let loading = true;
  let status = { message: '', type: 'info' };
  let username = '';
  let isProcessing = false;
  let smileScore = 0;

  // Referencias
  let videoElement;
  let canvasElement;
  let stream = null;

  onMount(() => {
    loadModels();
  });

  onDestroy(() => {
    stopVideo();
  });

  async function loadModels() {
    try {
      status = { message: 'Cargando modelos de IA...', type: 'info' };

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath),
        faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath),
        faceapi.nets.faceRecognitionNet.loadFromUri(modelsPath),
        faceapi.nets.faceExpressionNet.loadFromUri(modelsPath)
      ]);

      modelsLoaded = true;
      loading = false;
      status = { message: 'Modelos cargados. Listo para usar.', type: 'success' };
    } catch (error) {
      console.error('Error al cargar modelos:', error);
      loading = false;
      status = { message: 'Error al cargar modelos de IA', type: 'error' };
      dispatch('error', { error: 'MODEL_LOAD_ERROR', details: error });
    }
  }

  async function startVideo() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });

      if (videoElement) {
        videoElement.srcObject = stream;
      }

      return true;
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      status = { message: 'No se pudo acceder a la cámara', type: 'error' };
      dispatch('error', { error: 'CAMERA_ACCESS_ERROR', details: error });
      return false;
    }
  }

  function stopVideo() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
    if (videoElement) {
      videoElement.srcObject = null;
    }
    if (canvasElement) {
      const ctx = canvasElement.getContext('2d');
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }
    smileScore = 0;
  }

  function handleVideoLoaded() {
    if (canvasElement && videoElement) {
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
    }
  }

  async function detectFaceWithSmile() {
    if (!videoElement || !canvasElement) return null;

    const detection = await faceapi
      .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor()
      .withFaceExpressions();

    if (detection && canvasElement) {
      const canvas = canvasElement;
      const displaySize = { width: canvas.width, height: canvas.height };
      faceapi.matchDimensions(canvas, displaySize);
      const resizedDetection = faceapi.resizeResults(detection, displaySize);

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      faceapi.draw.drawDetections(canvas, resizedDetection);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetection);

      if (detection.expressions) {
        const score = (detection.expressions.happy * 100).toFixed(0);
        smileScore = score;

        const box = detection.detection.box;
        const isSmiling = detection.expressions.happy > smileThreshold;

        ctx.fillStyle = isSmiling ? '#22c55e' : '#f59e0b';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(`${isSmiling ? '😊' : '😐'} ${score}%`, box.x, box.y - 10);
      }
    }

    return detection;
  }

  async function handleRegister() {
    if (!username.trim()) {
      status = { message: 'Por favor ingresa un nombre de usuario', type: 'warning' };
      return;
    }

    isProcessing = true;
    status = { message: 'Iniciando cámara...', type: 'info' };

    const videoStarted = await startVideo();
    if (!videoStarted) {
      isProcessing = false;
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    status = { message: '😊 ¡Sonríe para la cámara!', type: 'info' };

    let detection = null;
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      detection = await detectFaceWithSmile();

      if (detection && detection.expressions.happy > smileThreshold) {
        status = { message: '✅ ¡Sonrisa detectada! Guardando...', type: 'success' };
        break;
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    if (!detection) {
      status = { message: 'No se detectó ningún rostro', type: 'error' };
      isProcessing = false;
      stopVideo();
      return;
    }

    if (detection.expressions.happy <= smileThreshold) {
      status = { message: '¡Sonríe e intenta de nuevo!', type: 'warning' };
      isProcessing = false;
      stopVideo();
      return;
    }

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
        status = { message: result.message, type: 'success' };
        username = '';
        stopVideo();
        dispatch('success', { username: username.trim(), mode: 'register' });
      } else {
        status = { message: result.error, type: 'error' };
        dispatch('error', { error: 'REGISTRATION_ERROR', details: result });
      }
    } catch (error) {
      status = { message: 'Error al registrar usuario', type: 'error' };
      dispatch('error', { error: 'NETWORK_ERROR', details: error });
    }

    isProcessing = false;
  }

  async function handleLogin() {
    isProcessing = true;
    status = { message: 'Cargando usuarios...', type: 'info' };

    try {
      const response = await fetch(`${apiEndpoint}/users`);
      const users = await response.json();

      if (users.length === 0) {
        status = { message: 'No hay usuarios registrados', type: 'warning' };
        isProcessing = false;
        return;
      }

      const videoStarted = await startVideo();
      if (!videoStarted) {
        isProcessing = false;
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      status = { message: '😊 ¡Sonríe para autenticarte!', type: 'info' };

      let detection = null;
      let attempts = 0;
      const maxAttempts = 30;

      while (attempts < maxAttempts) {
        detection = await detectFaceWithSmile();

        if (detection && detection.expressions.happy > smileThreshold) {
          status = { message: '✅ ¡Sonrisa detectada! Verificando...', type: 'success' };
          break;
        }

        attempts++;
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      if (!detection || detection.expressions.happy <= smileThreshold) {
        status = { message: 'No se detectó una sonrisa', type: 'warning' };
        isProcessing = false;
        stopVideo();
        return;
      }

      status = { message: 'Buscando coincidencia...', type: 'info' };

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
        status = { message: `¡Bienvenido, ${bestMatch.username}!`, type: 'success' };
        stopVideo();
        dispatch('success', { username: bestMatch.username, mode: 'login', confidence: 1 - bestDistance });
      } else {
        status = { message: 'Rostro no reconocido', type: 'error' };
        dispatch('error', { error: 'FACE_NOT_RECOGNIZED' });
      }
    } catch (error) {
      status = { message: 'Error al autenticar', type: 'error' };
      dispatch('error', { error: 'NETWORK_ERROR', details: error });
    }

    isProcessing = false;
  }

  function handleStart() {
    if (mode === 'register') {
      handleRegister();
    } else {
      handleLogin();
    }
  }
</script>

<div class="happy-access-container {className}">
  {#if loading}
    <div class="happy-access-loading">
      <div class="spinner"></div>
      <p>Cargando modelos de IA...</p>
    </div>
  {:else}
    <div class="happy-access-content">
      {#if mode === 'register'}
        <div class="form-group">
          <input
            bind:value={username}
            type="text"
            placeholder="Nombre de usuario"
            class="input-field"
            disabled={isProcessing}
          />
        </div>
      {/if}

      <div class="video-container">
        <video
          bind:this={videoElement}
          autoplay
          muted
          playsinline
          on:loadedmetadata={handleVideoLoaded}
        ></video>
        <canvas bind:this={canvasElement}></canvas>
      </div>

      {#if status.message}
        <div class="status-message {status.type}">
          {status.message}
        </div>
      {/if}

      {#if smileScore > 0}
        <div class="smile-indicator">
          <div class="smile-bar">
            <div
              class="smile-fill"
              style="width: {smileScore}%; background-color: {smileScore >= smileThreshold * 100 ? '#22c55e' : '#f59e0b'}"
            ></div>
          </div>
          <span class="smile-text">{smileScore}% sonrisa</span>
        </div>
      {/if}

      <button
        on:click={handleStart}
        disabled={isProcessing || !modelsLoaded}
        class="btn-primary"
      >
        {isProcessing ? 'Procesando...' : mode === 'register' ? '📸 Registrarse' : '🔓 Iniciar Sesión'}
      </button>

      {#if stream}
        <button on:click={stopVideo} class="btn-secondary">
          Detener Cámara
        </button>
      {/if}
    </div>
  {/if}
</div>

<style>
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

  .btn-primary,
  .btn-secondary {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    margin: 10px 5px;
  }

  .btn-primary {
    background: #6366f1;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: #4f46e5;
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: #64748b;
    color: white;
  }

  .btn-secondary:hover {
    background: #475569;
  }

  .input-field {
    width: 100%;
    padding: 12px;
    border: 2px solid #64748b;
    border-radius: 8px;
    font-size: 16px;
    margin-bottom: 20px;
  }

  .input-field:focus {
    outline: none;
    border-color: #6366f1;
  }
</style>

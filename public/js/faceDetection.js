// Módulo de detección facial usando face-api.js

class FaceDetectionService {
    constructor() {
        this.modelsLoaded = false;
        this.modelPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model';
    }

    async loadModels() {
        try {
            console.log('🔄 Cargando modelos de IA...');

            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(this.modelPath),
                faceapi.nets.faceLandmark68Net.loadFromUri(this.modelPath),
                faceapi.nets.faceRecognitionNet.loadFromUri(this.modelPath),
                faceapi.nets.faceExpressionNet.loadFromUri(this.modelPath)
            ]);

            this.modelsLoaded = true;
            console.log('✅ Modelos cargados correctamente');
            return true;
        } catch (error) {
            console.error('❌ Error al cargar modelos:', error);
            return false;
        }
    }

    async detectFace(videoElement, withExpressions = false) {
        if (!this.modelsLoaded) {
            throw new Error('Los modelos no están cargados');
        }

        let detection = faceapi
            .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (withExpressions) {
            detection = detection.withFaceExpressions();
        }

        return await detection;
    }

    async detectFaceWithExpression(videoElement) {
        return await this.detectFace(videoElement, true);
    }

    isSmiling(detection, threshold = 0.7) {
        if (!detection || !detection.expressions) {
            return false;
        }

        const happyScore = detection.expressions.happy;
        return happyScore > threshold;
    }

    getSmileScore(detection) {
        if (!detection || !detection.expressions) {
            return 0;
        }
        return detection.expressions.happy;
    }

    async detectAllFaces(videoElement) {
        if (!this.modelsLoaded) {
            throw new Error('Los modelos no están cargados');
        }

        const detections = await faceapi
            .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();

        return detections;
    }

    drawDetection(canvas, detection, text = '', showSmileInfo = false) {
        const displaySize = {
            width: canvas.width,
            height: canvas.height
        };

        faceapi.matchDimensions(canvas, displaySize);
        const resizedDetection = faceapi.resizeResults(detection, displaySize);
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar el recuadro de la cara
        faceapi.draw.drawDetections(canvas, resizedDetection);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetection);

        if (detection.detection) {
            const box = detection.detection.box;
            let yOffset = box.y - 10;

            // Agregar texto si se proporciona
            if (text) {
                ctx.fillStyle = '#6366f1';
                ctx.font = 'bold 20px Arial';
                ctx.fillText(text, box.x, yOffset);
                yOffset -= 25;
            }

            // Mostrar información de sonrisa si está disponible
            if (showSmileInfo && detection.expressions) {
                const smileScore = (detection.expressions.happy * 100).toFixed(0);
                const isSmiling = this.isSmiling(detection);

                ctx.fillStyle = isSmiling ? '#22c55e' : '#f59e0b';
                ctx.font = 'bold 18px Arial';
                ctx.fillText(`${isSmiling ? '😊' : '😐'} ${smileScore}%`, box.x, yOffset);
            }
        }
    }

    calculateDistance(descriptor1, descriptor2) {
        return faceapi.euclideanDistance(descriptor1, descriptor2);
    }

    findBestMatch(descriptor, knownDescriptors, threshold = 0.6) {
        let bestMatch = null;
        let bestDistance = Infinity;

        for (const known of knownDescriptors) {
            const distance = this.calculateDistance(descriptor, known.descriptor);

            if (distance < bestDistance && distance < threshold) {
                bestDistance = distance;
                bestMatch = {
                    ...known,
                    distance
                };
            }
        }

        return bestMatch;
    }
}

// Exportar instancia global
const faceDetectionService = new FaceDetectionService();

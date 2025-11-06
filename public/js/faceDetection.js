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

    async detectFace(videoElement) {
        if (!this.modelsLoaded) {
            throw new Error('Los modelos no están cargados');
        }

        const detection = await faceapi
            .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

        return detection;
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

    drawDetection(canvas, detection, text = '') {
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

        // Agregar texto si se proporciona
        if (text && detection.detection) {
            const box = detection.detection.box;
            ctx.fillStyle = '#6366f1';
            ctx.font = 'bold 20px Arial';
            ctx.fillText(text, box.x, box.y - 10);
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

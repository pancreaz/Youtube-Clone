/**
 * YOUTUBE ULTRA - AMBIENT GLOW & AUDIO VISUALIZER ENGINE
 */

class AmbientEngine {
  constructor(videoElement, canvasElement, audioCanvasElement) {
    this.video = videoElement;
    this.canvas = canvasElement;
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    
    this.audioCanvas = audioCanvasElement;
    this.audioCtx = this.audioCanvas ? this.audioCanvas.getContext('2d') : null;
    
    this.isRunning = false;
    this.isAudioVisualizerActive = false;
    
    this.audioContext = null;
    this.analyser = null;
    this.source = null;
    this.dataArray = null;
    
    this.bindEvents();
  }

  bindEvents() {
    if (!this.video) return;

    this.video.addEventListener('play', () => this.start());
    this.video.addEventListener('pause', () => this.stop());
    this.video.addEventListener('ended', () => this.stop());

    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    if (this.canvas) {
      this.canvas.width = 64; // Low res for fast blur canvas
      this.canvas.height = 36;
    }
    if (this.audioCanvas && this.audioCanvas.parentElement) {
      this.audioCanvas.width = this.audioCanvas.parentElement.clientWidth;
      this.audioCanvas.height = 120;
    }
  }

  initAudioContext() {
    if (this.audioContext) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;

      this.source = this.audioContext.createMediaElementSource(this.video);
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
    } catch (e) {
      console.warn("AudioContext setup failed or CORS policy restricted audio visualizer:", e);
    }
  }

  toggleAudioVisualizer() {
    this.isAudioVisualizerActive = !this.isAudioVisualizerActive;
    if (this.isAudioVisualizerActive) {
      this.initAudioContext();
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    } else if (this.audioCtx && this.audioCanvas) {
      this.audioCtx.clearRect(0, 0, this.audioCanvas.width, this.audioCanvas.height);
    }
    return this.isAudioVisualizerActive;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.handleResize();
    this.loop();
  }

  stop() {
    this.isRunning = false;
  }

  loop() {
    if (!this.isRunning) return;

    // 1. Draw Ambient Canvas Glow
    if (this.video && this.canvas && this.ctx && !this.video.paused && !this.video.ended) {
      try {
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
      } catch (err) {
        // Fallback for CORS protected cross-origin videos
        this.ctx.fillStyle = '#ff0055';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }

    // 2. Draw Audio Visualizer Waves if Active
    if (this.isAudioVisualizerActive && this.audioCanvas && this.audioCtx) {
      this.renderAudioVisualizer();
    }

    requestAnimationFrame(() => this.loop());
  }

  renderAudioVisualizer() {
    const width = this.audioCanvas.width;
    const height = this.audioCanvas.height;
    this.audioCtx.clearRect(0, 0, width, height);

    if (this.analyser && this.dataArray) {
      this.analyser.getByteFrequencyData(this.dataArray);
      const barWidth = (width / this.dataArray.length) * 2;
      let x = 0;

      for (let i = 0; i < this.dataArray.length; i++) {
        const barHeight = (this.dataArray[i] / 255) * height;

        const gradient = this.audioCtx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, 'rgba(62, 166, 255, 0.2)');
        gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.7)');
        gradient.addColorStop(1, 'rgba(255, 200, 0, 0.9)');

        this.audioCtx.fillStyle = gradient;
        this.audioCtx.fillRect(x, height - barHeight, barWidth - 4, barHeight);

        x += barWidth;
      }
    } else {
      // Simulated visualizer if Web Audio API blocked by CORS
      const time = Date.now() * 0.005;
      const bars = 24;
      const barWidth = width / bars;
      for (let i = 0; i < bars; i++) {
        const barHeight = Math.abs(Math.sin(time + i * 0.3)) * (height * 0.7) + 10;
        this.audioCtx.fillStyle = 'rgba(255, 0, 0, 0.6)';
        this.audioCtx.fillRect(i * barWidth, height - barHeight, barWidth - 4, barHeight);
      }
    }
  }
}

<template>
  <canvas ref="canvas" class="space-particles-canvas"></canvas>
</template>

<script>
export default {
  name: 'SpaceParticles',
  props: {
    starCount: { type: Number, default: 120 },
    shootingStarInterval: { type: Number, default: 3000 }
  },
  data() {
    return {
      animationId: null,
      stars: [],
      shootingStars: [],
      shootingStarTimer: null
    };
  },
  mounted() {
    this.initCanvas();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.shootingStarTimer) clearInterval(this.shootingStarTimer);
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      this.createStars();
      this.startShootingStars();
      this.animate();
    },
    handleResize() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      this.createStars();
    },
    createStars() {
      const canvas = this.$refs.canvas;
      this.stars = [];
      for (let i = 0; i < this.starCount; i++) {
        this.stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.8 + 0.3,
          opacity: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
          drift: (Math.random() - 0.5) * 0.15
        });
      }
    },
    startShootingStars() {
      if (this.shootingStarTimer) clearInterval(this.shootingStarTimer);
      this.spawnShootingStar();
      this.shootingStarTimer = setInterval(() => {
        if (Math.random() < 0.6) this.spawnShootingStar();
      }, this.shootingStarInterval);
    },
    spawnShootingStar() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      const startX = Math.random() * canvas.width * 0.8;
      const startY = Math.random() * canvas.height * 0.4;
      const angle = Math.PI / 6 + Math.random() * (Math.PI / 6);
      const speed = 4 + Math.random() * 4;
      this.shootingStars.push({
        x: startX,
        y: startY,
        length: 40 + Math.random() * 60,
        speed,
        angle,
        opacity: 1,
        life: 1
      });
    },
    animate() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      for (const star of this.stars) {
        star.twinklePhase += star.twinkleSpeed;
        const flicker = Math.sin(star.twinklePhase) * 0.35 + 0.65;
        const alpha = star.opacity * flicker;

        // Glow
        ctx.beginPath();
        const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 4);
        glow.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.3})`);
        glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glow;
        ctx.arc(star.x, star.y, star.radius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Drift
        star.x += star.drift;
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
      }

      // Draw shooting stars
      for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        const ss = this.shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.life -= 0.015;
        ss.opacity = ss.life;

        if (ss.life <= 0 || ss.x > canvas.width || ss.y > canvas.height) {
          this.shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(0.6, `rgba(255, 200, 150, ${ss.opacity * 0.4})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${ss.opacity})`);

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();

        // Head glow
        ctx.beginPath();
        const headGlow = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 4);
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
        headGlow.addColorStop(1, 'rgba(255, 200, 150, 0)');
        ctx.fillStyle = headGlow;
        ctx.arc(ss.x, ss.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      this.animationId = requestAnimationFrame(this.animate);
    }
  }
};
</script>

<style scoped>
.space-particles-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
</style>

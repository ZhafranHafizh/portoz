<template>
  <div class="home-view">
    <Particles
      id="tsparticles"
      :options="particlesOptions"
      :style="parallaxStyle"
    />

    <section class="hero" :style="heroParallaxStyle">
      <div class="profile-image-container" :style="profileParallaxStyle">
        <img src="../../public/galeri/Profil.png" alt="Foto Profil Zhafran Hafizh" class="profile-pic">
      </div>
      <h1 class="hero-title">Hello, I'm <strong>Zhafran Hafizh</strong>!</h1>
      <h2 class="hero-subtitle">A <span>Software Engineer</span> Bridging Design, Development, and Quality</h2>
      <p class="hero-description">
        Hello! This is where design meets code. As a product development enthusiast, I excel at creating intuitive UI/UX, implementing robust front-end interfaces, and ensuring software quality. Take a look at my end-to-end projects.
      </p>
      <router-link to="/projects" class="cta-button">
        See my works <span class="arrow">&rarr;</span>
      </router-link>
    </section>
  </div>
</template>

<script>

export default {
  name: 'HomeView',
  data() {
    return {
      scrollY: 0,
      particlesOptions: {
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: { enable: true, mode: 'push' },
            onHover: { enable: true, mode: 'repulse' },
            resize: true,
          },
          modes: {
            push: { quantity: 4 },
            repulse: { distance: 150, duration: 0.4 },
          },
        },
        particles: {
          color: { value: '#f97316' },
          links: {
            color: '#555555', distance: 150, enable: true,
            opacity: 0.4, width: 1,
          },
          move: {
            direction: 'none', enable: true, outModes: { default: 'out' },
            random: false, speed: 2, straight: false,
          },
          number: { density: { enable: true, area: 800 }, value: 80 },
          opacity: { value: 0.5 },
          shape: { type: 'circle' },
          size: { value: { min: 1, max: 4 }, random: true },
        },
        detectRetina: true,
      }
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrollY = window.scrollY;
    }
  },
  computed: {
    parallaxStyle() {
      return {
        transform: `translateY(${this.scrollY * 0.5}px)`
      };
    },
    heroParallaxStyle() {
      return {
        transform: `translateY(${this.scrollY * -0.3}px)`
      };
    },
    profileParallaxStyle() {
      return {
        transform: `translateY(${this.scrollY * -0.2}px)`
      };
    }
  }
}
</script>

<style scoped>
.home-view {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #fafaf9 0%, #e7e5e4 100%);
  font-family: 'Poppins', sans-serif;
  overflow-x: hidden;
  overflow-y: auto;
}

:global(body.dark-theme) .home-view {
  background: linear-gradient(135deg, #1c1917 0%, #0c0a09 100%);
}

/* Styling untuk #tsparticles */
#tsparticles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* Pastikan di paling belakang */
  transition: transform 0.1s ease-out;
}

.hero {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 700px;
  padding: 3rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transform: translateY(-20px);
  animation: fadeInSlideUp 0.8s ease-out forwards;
  transition: all 0.3s ease;
}

:global(body.dark-theme) .hero {
  background-color: rgba(41, 37, 36, 0.9);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* ... Pastikan semua style .hero lainnya ada di sini ... */
@keyframes fadeInSlideUp {
  from { opacity: 0; transform: translateY(0px); }
  to { opacity: 1; transform: translateY(-20px); }
}
.profile-image-container { 
  margin-bottom: 25px; 
  transition: transform 0.1s ease-out;
}
.profile-pic {
  width: 180px; height: 180px; border-radius: 50%; object-fit: cover;
  border: 5px solid #fff; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}
.profile-pic:hover { transform: scale(1.05); }
.hero-title {
  font-size: 2.8rem; font-weight: 700; color: #333;
  margin-bottom: 10px; line-height: 1.2;
}

:global(body.dark-theme) .hero-title {
  color: #e4e4e7;
}

.hero-title strong { color: #f97316; }

:global(body.dark-theme) .hero-title strong { color: #fb923c; }

.hero-subtitle {
  font-size: 1.6rem; font-weight: 400; color: #555; margin-bottom: 25px;
}

:global(body.dark-theme) .hero-subtitle {
  color: #a1a1aa;
}

.hero-subtitle span { font-weight: 600; color: #d97706; }

:global(body.dark-theme) .hero-subtitle span { color: #fbbf24; }

.hero-description {
  font-size: 1.1rem; color: #666; line-height: 1.7; margin-bottom: 30px;
  max-width: 550px; margin-left: auto; margin-right: auto;
}

:global(body.dark-theme) .hero-description {
  color: #a1a1aa;
}
.cta-button {
  display: inline-flex; align-items: center; padding: 14px 30px;
  background-image: linear-gradient(to right, #f97316 0%, #ea580c 100%);
  color: white; text-decoration: none; border-radius: 50px;
  font-size: 1.15rem; font-weight: 600; transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3); margin-top: 20px;
}
.cta-button:hover {
  background-image: linear-gradient(to right, #ea580c 0%, #f97316 100%);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
}
.cta-button .arrow { margin-left: 8px; transition: transform 0.3s ease; }
.cta-button:hover .arrow { transform: translateX(5px); }

/* Responsive Design */
@media (max-width: 768px) {
  .home-view {
    padding: 30px 15px;
  }
  
  .hero {
    padding: 2rem 1.5rem;
    max-width: 90vw;
  }
  
  .hero-title { 
    font-size: 2.2rem; 
  }
  
  .hero-subtitle { 
    font-size: 1.3rem; 
  }
  
  .profile-pic { 
    width: 150px; 
    height: 150px; 
  }
  
  .cta-button { 
    padding: 12px 25px; 
    font-size: 1rem; 
  }
}

@media (max-width: 480px) {
  .home-view {
    padding: 20px 12px;
    min-height: 100vh;
  }
  
  .hero {
    padding: 1.5rem 1.2rem;
    border-radius: 12px;
    max-width: 95vw;
    margin: 0 auto;
  }
  
  .profile-image-container {
    margin-bottom: 20px;
  }
  
  .profile-pic {
    width: 120px;
    height: 120px;
    border-width: 4px;
  }
  
  .hero-title {
    font-size: 1.6rem;
    margin-bottom: 8px;
    line-height: 1.3;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
    margin-bottom: 20px;
  }
  
  .hero-description {
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 20px;
    padding: 0 5px;
  }
  
  .cta-button {
    padding: 12px 20px;
    font-size: 0.95rem;
  }
}

/* Extra small screens */
@media (max-width: 400px) {
  .home-view {
    padding: 15px 8px;
  }
  
  .hero {
    padding: 1.2rem 1rem;
    max-width: 96vw;
    border-radius: 10px;
  }
  
  .profile-pic {
    width: 100px;
    height: 100px;
    border-width: 3px;
  }
  
  .hero-title {
    font-size: 1.4rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-description {
    font-size: 0.9rem;
    margin-bottom: 18px;
  }
  
  .cta-button {
    padding: 10px 18px;
    font-size: 0.9rem;
  }
}
</style>
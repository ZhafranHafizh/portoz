<template>
  <div class="home-view">
    <Particles
      id="tsparticles"
      :options="particlesOptions"
    />

    <section class="hero">
      <div class="profile-image-container">
        <img src="@/assets/Face.jpg" alt="Foto Profil Zhafran Hafizh" class="profile-pic">
      </div>
      <h1 class="hero-title">Halo, Saya <strong>Zhafran Hafizh</strong>!</h1>
      <h2 class="hero-subtitle">Seorang <span>UI/UX Designer</span> Kreatif & Inovatif</h2>
      <p class="hero-description">
        Selamat datang di portofolio digital saya. Saya mengubah ide kompleks
        menjadi pengalaman pengguna yang intuitif dan menawan. Mari lihat karya-karya saya!
      </p>
      <router-link to="/projects" class="cta-button">
        Lihat Proyek Saya <span class="arrow">&rarr;</span>
      </router-link>
    </section>
  </div>
</template>

<script>
// Impor engine utama tsparticles dan preset (jika perlu)
// import { loadFull } from "tsparticles";
// Komponen Particles.vue3 tidak perlu diimpor secara eksplisit jika
// Anda mendaftarkannya secara global, tapi kita akan daftarkan lokal saja.
// Namun, jika Anda menggunakan Vue 3 dengan <script setup>, caranya sedikit berbeda.
// Karena kita pakai Options API, kita tidak perlu impor 'Particles' di sini,
// tapi kita perlu mendaftarkannya di main.js atau App.vue jika ingin global,
// atau jika sudah terpasang, Vue CLI mungkin sudah menanganinya.
// Cara paling aman adalah mendaftarkannya di main.js.

export default {
  name: 'HomeView',
  // HAPUS methods: { ... } yang berisi particlesInit dan particlesLoaded
  data() {
    return {
      // Opsi partikel tetap di sini
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
          color: { value: '#007bff' },
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
  }
}
</script>

<style scoped>
.home-view {
  position: relative; /* Penting untuk positioning anak absolute */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Poppins', sans-serif;
  overflow: hidden; /* Mencegah partikel keluar batas jika perlu */
}

/* Styling untuk #tsparticles */
#tsparticles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* Pastikan di paling belakang */
}

.hero {
  position: relative; /* Penting agar bisa di atas partikel */
  z-index: 1; /* Pastikan di atas partikel */
  text-align: center;
  max-width: 700px;
  padding: 3rem; /* Padding lebih besar */
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transform: translateY(-20px);
  animation: fadeInSlideUp 0.8s ease-out forwards;
  /* ... sisa style .hero Anda ... */
}

/* ... Pastikan semua style .hero lainnya ada di sini ... */
@keyframes fadeInSlideUp {
  from { opacity: 0; transform: translateY(0px); }
  to { opacity: 1; transform: translateY(-20px); }
}
.profile-image-container { margin-bottom: 25px; }
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
.hero-title strong { color: #007bff; }
.hero-subtitle {
  font-size: 1.6rem; font-weight: 400; color: #555; margin-bottom: 25px;
}
.hero-subtitle span { font-weight: 600; color: #28a745; }
.hero-description {
  font-size: 1.1rem; color: #666; line-height: 1.7; margin-bottom: 30px;
  max-width: 550px; margin-left: auto; margin-right: auto;
}
.cta-button {
  display: inline-flex; align-items: center; padding: 14px 30px;
  background-image: linear-gradient(to right, #007bff 0%, #0056b3 100%);
  color: white; text-decoration: none; border-radius: 50px;
  font-size: 1.15rem; font-weight: 600; transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3); margin-top: 20px;
}
.cta-button:hover {
  background-image: linear-gradient(to right, #0056b3 0%, #007bff 100%);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}
.cta-button .arrow { margin-left: 8px; transition: transform 0.3s ease; }
.cta-button:hover .arrow { transform: translateX(5px); }

/* ... sisa style @media Anda ... */
@media (max-width: 768px) {
  .hero-title { font-size: 2.2rem; }
  .hero-subtitle { font-size: 1.3rem; }
  .profile-pic { width: 150px; height: 150px; }
  .cta-button { padding: 12px 25px; font-size: 1rem; }
}

</style>
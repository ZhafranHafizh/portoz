<template>
  <div id="app">
    <Navbar />
    <!-- <MaintenanceTicker /> -->
    <main class="content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
// import MaintenanceTicker from '@/components/MaintenanceTicker.vue'; // <-- Impor komponen

export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
    // MaintenanceTicker
  }
}
</script>

<style>
/* ... Style global Anda yang sudah ada ... */

/* !!! TAMBAHKAN CSS UNTUK TRANSISI DI SINI !!! */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease; /* Durasi dan tipe transisi */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0; /* State awal (masuk) dan akhir (keluar) */
}

/* ------------------------------------------- */

/* Pastikan style #app dan .content Anda mendukung layout */
body {
  margin: 0;
  font-family: 'Poppins', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  line-height: 1.6;
  transition: background-color 0.3s ease, color 0.3s ease;
  background-color: #ffffff;
}

/* Dark mode global styles */
body.dark-theme {
  background-color: #0f0f23 !important;
  color: #e4e4e7 !important;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1; /* Membuat konten mengisi ruang yang tersedia */
  padding: 0; /* Padding mungkin lebih baik diatur per halaman */
  position: relative; /* Bisa membantu jika ada positioning aneh */
}
</style>
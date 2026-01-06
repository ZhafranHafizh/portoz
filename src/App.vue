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
    <MobileNotice />
    <FloatingActionButton />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import MobileNotice from '@/components/MobileNotice.vue';
import FloatingActionButton from '@/components/FloatingActionButton.vue';
// import MaintenanceTicker from '@/components/MaintenanceTicker.vue'; // <-- Impor komponen

export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
    MobileNotice,
    FloatingActionButton,
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
  background-color: #1c1917 !important;
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

/* ===== CUSTOM SCROLLBAR STYLES ===== */
/* Webkit browsers (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #0c0c0c;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #f97316 0%, #d97706 100%);
  border-radius: 4px;
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #d97706 0%, #f97316 100%);
  transform: scale(1.1);
}

::-webkit-scrollbar-corner {
  background: #1f1f1f;
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #f97316 #162637;
}

/* Dark mode scrollbar */
body.dark-theme ::-webkit-scrollbar-track {
  background: #292524;
}

body.dark-theme ::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%);
}

body.dark-theme ::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%);
}

body.dark-theme ::-webkit-scrollbar-corner {
  background: #292524;
}

body.dark-theme * {
  scrollbar-color: #fb923c #292524;
}
</style>
<template>
  <div id="app">
    <!-- One Page View Mode -->
    <template v-if="isOnePageRoute">
      <SiteStatusChecker :current-route="currentRoute" />
      <NavbarOnePage />
      <DarkModeWarning />
      <main class="content one-page-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <AnchorNavigation />
      <Footer />
      <MobileNotice />
      <FloatingActionButton />
    </template>
    
    <!-- Tab View Mode (Default) -->
    <template v-else>
      <SiteStatusChecker :current-route="currentRoute" />
      <Navbar />
      <DarkModeWarning />
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
    </template>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import MobileNotice from '@/components/MobileNotice.vue';
import FloatingActionButton from '@/components/FloatingActionButton.vue';
import DarkModeWarning from '@/components/DarkModeWarning.vue';
import SiteStatusChecker from '@/components/SiteStatusChecker.vue';
import AnchorNavigation from '@/components/AnchorNavigation.vue';
// import MaintenanceTicker from '@/components/MaintenanceTicker.vue'; // <-- Impor komponen

export default {
  name: 'App',
  data() {
    return {
      currentRoute: ''
    };
  },
  computed: {
    isOnePageRoute() {
      return this.$route.name === 'OnePage';
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        this.currentRoute = to.path;
      }
    }
  },
  components: {
    Navbar,
    Footer,
    MobileNotice,
    FloatingActionButton,
    DarkModeWarning,
    SiteStatusChecker,
    AnchorNavigation
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

/* One Page Content Styling */
.one-page-content {
  padding: 0;
  margin: 0;
  min-height: calc(100vh - 80px);
}

/* ------------------------------------------- */

/* Pastikan style #app dan .content Anda mendukung layout */
body {
  margin: 0;
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-primary);
  line-height: var(--line-height-normal);
  transition: background-color 0.3s ease, color 0.3s ease;
  background-color: var(--background);
}

/* ... */

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--accent) var(--surface);
}

/* Dark mode scrollbar */
body.dark-theme ::-webkit-scrollbar-track {
  background: var(--surface);
}

body.dark-theme ::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, var(--accent-hover) 0%, var(--accent-strong) 100%);
}

body.dark-theme ::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, var(--accent-strong) 0%, var(--accent-hover) 100%);
}

body.dark-theme ::-webkit-scrollbar-corner {
  background: var(--surface);
}

body.dark-theme * {
  scrollbar-color: var(--accent) var(--surface);
}
</style>
<template>
  <div id="app">
    <Navbar />
    <main class="content">
      <router-view/>
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  }
}
</script>

<style>
/* Gaya Global (jika perlu) */
body {
  margin: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  line-height: 1.6;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1; /* Membuat konten mengisi ruang yang tersedia */
  padding: 0 20px; /* Tambahkan padding jika perlu */
}

h1, h2, h3 {
    color: #2c3e50;
}
</style>
<template>
  <nav class="navbar">
    <div class="brand">
      <router-link to="/">Porto<strong>Z</strong></router-link>
    </div>
    <ul class="nav-links">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/about">About Me</router-link></li>
      <li><router-link to="/projects">Project</router-link></li>
      <li><router-link to="/contact">Contact</router-link></li>
    </ul>
    <div class="nav-actions">
      <DarkModeToggle />
    </div>
  </nav>
</template>

<script>
import DarkModeToggle from '@/components/DarkModeToggle.vue'

export default {
  name: 'TheNavbar',
  components: {
    DarkModeToggle
  }
}
</script>

<style scoped>
/* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap'); */

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 1rem 3rem;
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
}

/* Dark mode styles */
.dark-theme .navbar {
  background-color: #1a1a2e;
  color: #e4e4e7;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.brand a {
  color: #333;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.6rem;
  transition: color 0.3s ease;
}

.dark-theme .brand a {
  color: #e4e4e7;
}

.brand a strong {
  font-weight: 400;
  color: #007bff;
}

.dark-theme .brand a strong {
  color: #60a5fa;
}

.brand a:hover {
  color: #007bff;
}

.dark-theme .brand a:hover {
  color: #60a5fa;
}

.nav-links {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}

.nav-actions {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.nav-links li {
  margin-left: 30px; /* Jarak antar link lebih besar */
}

.nav-links a {
  color: #555;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  padding: 5px 0;
  position: relative;
  transition: color 0.3s ease;
}

.dark-theme .nav-links a {
  color: #a1a1aa;
}

/* Garis bawah untuk hover dan active */
.nav-links a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 50%;
  background-color: #007bff;
  transition: all 0.3s ease-in-out;
  transform: translateX(-50%);
}

.dark-theme .nav-links a::after {
  background-color: #60a5fa;
}

.nav-links a:hover,
.nav-links a.router-link-exact-active {
  color: #007bff;
}

.dark-theme .nav-links a:hover,
.dark-theme .nav-links a.router-link-exact-active {
  color: #60a5fa;
}

.nav-links a:hover::after,
.nav-links a.router-link-exact-active::after {
  width: 100%; /* Garis bawah muncul penuh */
}

/* Responsif (Contoh sederhana untuk hamburger menu, butuh JS tambahan) */
/*
@media (max-width: 768px) {
  .nav-links {
    display: none; // Sembunyikan link di mobile, ganti dengan hamburger
  }
  // Anda perlu menambahkan tombol hamburger dan logika untuk menampilkannya
}
*/
</style>
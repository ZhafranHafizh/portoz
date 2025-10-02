<template>
  <nav class="navbar">
    <div class="brand">
      <router-link to="/">Porto<strong>Z</strong></router-link>
    </div>
    <button class="hamburger" @click="toggleMenu" :aria-expanded="menuOpen.toString()" aria-label="Toggle navigation">
      <span :class="{ 'open': menuOpen }"></span>
      <span :class="{ 'open': menuOpen }"></span>
      <span :class="{ 'open': menuOpen }"></span>
    </button>
    <ul class="nav-links" :class="{ 'open': menuOpen }">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/about">About Me</router-link></li>
      <li><router-link to="/projects">Project</router-link></li>
      <li><router-link to="/gallery">Gallery</router-link></li>
      <!-- <li><router-link to="/analytics">Analytics</router-link></li> -->
      <li><router-link to="/contact">Contact</router-link></li>
    </ul>
    <div class="nav-actions">
      <!-- <ViewCounter :compact="true" /> -->
      <DarkModeToggle />
    </div>
  </nav>
</template>

<script>
import DarkModeToggle from '@/components/DarkModeToggle.vue'
// import ViewCounter from '@/components/ViewCounter.vue'  // Disabled view counter

export default {
  name: 'TheNavbar',
  components: {
    DarkModeToggle
    // ViewCounter  // Disabled view counter
  },
  data() {
    return {
      menuOpen: false
    }
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    }
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
  gap: 12px;
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

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1200;
  margin-left: 10px;
}
.hamburger span {
  display: block;
  width: 26px;
  height: 3px;
  margin: 4px 0;
  background: #333;
  border-radius: 2px;
  transition: all 0.3s;
}
.dark-theme .hamburger span {
  background: #e4e4e7;
}
.hamburger span.open:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.hamburger span.open:nth-child(2) {
  opacity: 0;
}
.hamburger span.open:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

@media (max-width: 900px) {
  .navbar {
    padding: 1rem 1.2rem;
  }
  .brand a {
    font-size: 1.2rem;
  }
}
@media (max-width: 768px) {
  .navbar {
    padding: 0.7rem 0.5rem;
  }
  .brand a {
    font-size: 1.1rem;
  }
  .nav-actions {
    margin-left: 0;
  }
  .hamburger {
    display: flex;
  }
  .nav-links {
    position: fixed;
    top: 60px;
    right: 0;
    left: 0;
    background: #fff;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 0;
    padding: 1.5rem 0 2rem 0;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    z-index: 1100;
    display: none;
    transition: all 0.3s;
  }
  .dark-theme .nav-links {
    background: #1a1a2e;
  }
  .nav-links.open {
    display: flex;
  }
  .nav-links li {
    margin: 0.7rem 0;
  }
  .nav-links a {
    font-size: 1.1rem;
    padding: 10px 0;
  }
}
@media (max-width: 480px) {
  .navbar {
    padding: 0.5rem 0.2rem;
  }
  .brand a {
    font-size: 1rem;
  }
  .nav-links {
    top: 48px;
    padding: 1rem 0 1.5rem 0;
  }
}
</style>
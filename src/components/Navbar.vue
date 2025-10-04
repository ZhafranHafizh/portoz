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
      <li><router-link to="/" @click="closeMenu">Home</router-link></li>
      <li><router-link to="/about" @click="closeMenu">About Me</router-link></li>
      <li><router-link to="/projects" @click="closeMenu">Project</router-link></li>
      <li><router-link to="/gallery" @click="closeMenu">Gallery</router-link></li>
      <!-- <li><router-link to="/analytics" @click="closeMenu">Analytics</router-link></li> -->
      <li><router-link to="/contact" @click="closeMenu">Contact</router-link></li>
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
  mounted() {
    // Close menu when clicking outside
    document.addEventListener('click', this.handleClickOutside);
    // Close menu on route change
    this.$router.afterEach(() => {
      this.closeMenu();
    });
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
      // Prevent body scroll when menu is open on mobile
      if (this.menuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },
    closeMenu() {
      this.menuOpen = false;
      document.body.style.overflow = '';
    },
    handleClickOutside(event) {
      // Close menu if clicking outside of navbar on mobile
      if (window.innerWidth <= 768 && this.menuOpen) {
        const navbar = this.$el;
        if (navbar && !navbar.contains(event.target)) {
          this.closeMenu();
        }
      }
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
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 0;
    padding: 2rem 0 3rem 0;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    z-index: 1100;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .dark-theme .nav-links {
    background: rgba(26, 26, 46, 0.98);
  }
  .nav-links.open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  .nav-links li {
    margin: 0.8rem 0;
    transform: translateY(20px);
    opacity: 0;
    animation: none;
  }
  .nav-links.open li {
    animation: slideInUp 0.4s ease forwards;
  }
  .nav-links.open li:nth-child(1) { animation-delay: 0.1s; }
  .nav-links.open li:nth-child(2) { animation-delay: 0.15s; }
  .nav-links.open li:nth-child(3) { animation-delay: 0.2s; }
  .nav-links.open li:nth-child(4) { animation-delay: 0.25s; }
  .nav-links.open li:nth-child(5) { animation-delay: 0.3s; }
  .nav-links a {
    font-size: 1.2rem;
    padding: 15px 30px;
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  .nav-links a:hover {
    background: rgba(0, 123, 255, 0.1);
    transform: translateY(-2px);
  }
  .dark-theme .nav-links a:hover {
    background: rgba(96, 165, 250, 0.1);
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
    padding: 1.5rem 0 2rem 0;
  }
  .nav-links a {
    font-size: 1.1rem;
    padding: 12px 25px;
  }
}

/* Animation keyframes */
@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Improve hamburger animation */
.hamburger span {
  transform-origin: center;
}

/* Add subtle hover effect to brand */
.brand a {
  transition: all 0.3s ease;
}

.brand a:hover {
  transform: translateY(-1px);
}
</style>
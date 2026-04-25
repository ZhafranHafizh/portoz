<template>
  <nav class="navbar" aria-label="Primary navigation">
    <div class="navbar-shell">
      <div class="brand">
        <router-link to="/">Porto<strong>Z</strong></router-link>
      </div>

      <button
        class="hamburger"
        @click="toggleMenu"
        :aria-expanded="menuOpen.toString()"
        aria-label="Toggle navigation"
      >
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
      </button>

      <ul class="nav-links" :class="{ open: menuOpen }">
        <li><router-link to="/" @click="closeMenu">Home</router-link></li>
        <li><router-link to="/about" @click="closeMenu">About</router-link></li>
        <li><router-link to="/projects" @click="closeMenu">Projects</router-link></li>
        <li><router-link to="/gallery" @click="closeMenu">Gallery</router-link></li>
      </ul>

      <div class="nav-actions">
        <router-link to="/contact" class="nav-cta" @click="closeMenu">Let's Talk</router-link>
        <DarkModeToggle />
      </div>
    </div>
  </nav>
</template>

<script>
import DarkModeToggle from '@/components/DarkModeToggle.vue'

export default {
  name: 'TheNavbar',
  components: {
    DarkModeToggle
  },
  data() {
    return {
      menuOpen: false
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
    this.$router.afterEach(() => {
      this.closeMenu()
    })
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen
      document.body.style.overflow = this.menuOpen ? 'hidden' : ''
    },
    closeMenu() {
      this.menuOpen = false
      document.body.style.overflow = ''
    },
    handleClickOutside(event) {
      if (window.innerWidth <= 900 && this.menuOpen) {
        const navbar = this.$el
        if (navbar && !navbar.contains(event.target)) {
          this.closeMenu()
        }
      }
    }
  }
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--surface);
  border-bottom: 1px solid var(--border-subtle);
}

.dark-theme .navbar {
  background: var(--surface-elevated);
  border-bottom-color: var(--border-strong);
}

.navbar-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0.85rem 1.25rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
}

.brand a {
  color: var(--text-primary);
  text-decoration: none;
  font-size: 1.35rem;
  font-weight: 700;
}

.dark-theme .brand a {
  color: var(--text-primary);
}

.brand strong {
  color: var(--accent);
  font-weight: 500;
}

.nav-links {
  list-style: none;
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  margin: 0;
  padding: 0;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 600;
}

.dark-theme .nav-links a {
  color: var(--text-secondary);
}

.nav-links a.router-link-exact-active {
  color: var(--accent);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-cta {
  text-decoration: none;
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
  font-weight: 700;
  color: var(--accent-contrast);
  background: var(--accent);
}

.nav-cta:hover {
  background: var(--accent-strong);
}

.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-secondary);
  margin: 5px 0;
  transition: 0.3s ease;
}

.dark-theme .hamburger span {
  background: var(--text-primary);
}

.hamburger span.open:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger span.open:nth-child(2) {
  opacity: 0;
}

.hamburger span.open:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 900px) {
  .navbar-shell {
    grid-template-columns: auto auto;
  }

  .hamburger {
    display: block;
    justify-self: end;
  }

  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    display: none;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background: var(--surface);
    border-bottom: 1px solid var(--border-subtle);
    align-items: flex-start;
  }

  .dark-theme .nav-links {
    background: var(--surface-elevated);
    border-bottom-color: var(--border-strong);
  }

  .nav-links.open {
    display: flex;
  }

  .nav-actions {
    display: none;
  }
}
</style>

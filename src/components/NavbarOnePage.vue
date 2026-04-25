<template>
  <nav class="navbar-one-page">
    <div class="brand">
      <router-link to="/"><strong>Porto</strong>Z</router-link>
    </div>
    
    <div class="nav-center">
      <a href="#section-home" @click.prevent="scrollToSection('section-home')" :class="{ 'active': activeSection === 'section-home' }">Home</a>
      <a href="#section-about" @click.prevent="scrollToSection('section-about')" :class="{ 'active': activeSection === 'section-about' }">About</a>
      <a href="#section-projects" @click.prevent="scrollToSection('section-projects')" :class="{ 'active': activeSection === 'section-projects' }">Projects</a>
      <a href="#section-gallery" @click.prevent="scrollToSection('section-gallery')" :class="{ 'active': activeSection === 'section-gallery' }">Gallery</a>
      <a href="#section-contact" @click.prevent="scrollToSection('section-contact')" :class="{ 'active': activeSection === 'section-contact' }">Contact</a>
    </div>
    
    <div class="nav-actions">
      <DarkModeToggle />
    </div>
  </nav>
</template>

<script>
import DarkModeToggle from '@/components/DarkModeToggle.vue'



export default {
  name: 'NavbarOnePage',
  components: {
    DarkModeToggle
  },
  data() {
    return {
      activeSection: 'section-home'
    }
  },

  mounted() {
    this.setupIntersectionObserver()
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect()
    }
  },
  methods: {
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    setupIntersectionObserver() {
      const sections = ['section-home', 'section-about', 'section-projects', 'section-gallery', 'section-contact']
      
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
      }

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.activeSection = entry.target.id
          }
        })
      }, options)

      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId)
        if (element) {
          this.observer.observe(element)
        }
      })
    }
  }
}
</script>

<style scoped>
.navbar-one-page {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 1rem 2rem;
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

:global(body.dark-theme) .navbar-one-page {
  background-color: #1c1917;
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

:global(body.dark-theme) .brand a {
  color: #e4e4e7;
}

.brand a strong {
  font-weight: 400;
  color: #8b5a2b;
}

:global(body.dark-theme) .brand a strong {
  color: #d4a373;
}

.nav-center {
  display: flex;
  gap: 24px;
  align-items: center;
}

.nav-center a {
  color: #555;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

:global(body.dark-theme) .nav-center a {
  color: #a1a1aa;
}

.nav-center a:hover,
.nav-center a.active {
  color: #8b5a2b;
  background: rgba(249, 115, 22, 0.1);
}

:global(body.dark-theme) .nav-center a:hover,
:global(body.dark-theme) .nav-center a.active {
  color: #d4a373;
  background: rgba(251, 146, 60, 0.1);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}



@media (max-width: 1024px) {
  .navbar-one-page {
    padding: 1rem 1.5rem;
  }
  
  .nav-center {
    gap: 16px;
  }
  
  .nav-center a {
    font-size: 0.9rem;
    padding: 6px 10px;
  }
}

@media (max-width: 768px) {
  .navbar-one-page {
    padding: 0.8rem 1rem;
  }
  
  .brand a {
    font-size: 1.3rem;
  }
  
  .nav-center {
    gap: 8px;
  }
  
  .nav-center a {
    font-size: 0.85rem;
    padding: 5px 8px;
  }
}

@media (max-width: 640px) {
  .nav-center {
    display: none;
  }
}
</style>

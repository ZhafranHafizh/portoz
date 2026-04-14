<template>
  <nav class="anchor-navigation" :class="{ 'visible': isVisible, 'scrolled': hasScrolled }">
    <div class="nav-container">
      <ul class="nav-dots">
        <li
          v-for="section in sections"
          :key="section.id"
          class="nav-item"
        >
          <a
            :href="`#${section.id}`"
            :class="{ 'active': activeSection === section.id }"
            :title="section.label"
            @click.prevent="scrollToSection(section.id)"
          >
            <span class="dot"></span>
            <span class="label">{{ section.label }}</span>
          </a>
        </li>
      </ul>
      
      <!-- Back to top button -->
      <button class="back-to-top" @click="scrollToTop" title="Back to top">
        <i class="fas fa-arrow-up"></i>
      </button>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'AnchorNavigation',
  setup() {
    const activeSection = ref('section-home')
    const isVisible = ref(false)
    const hasScrolled = ref(false)
    
    const sections = [
      { id: 'section-home', label: 'Home' },
      { id: 'section-about', label: 'About' },
      { id: 'section-projects', label: 'Projects' },
      { id: 'section-gallery', label: 'Gallery' },
      { id: 'section-contact', label: 'Contact' }
    ]

    let observer = null

    const handleScroll = () => {
      hasScrolled.value = window.scrollY > 100
      
      // Show navigation after a short delay
      if (!isVisible.value) {
        isVisible.value = true
      }
    }

    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const setupIntersectionObserver = () => {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0]
      }

      // Track which section has the highest visibility
      const sectionVisibility = {}

      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const sectionId = entry.target.id
          sectionVisibility[sectionId] = entry.intersectionRatio

          // Find the section dengan visibility tertinggi
          let maxVisibility = 0
          let mostVisibleSection = activeSection.value

          Object.entries(sectionVisibility).forEach(([id, ratio]) => {
            if (ratio > maxVisibility) {
              maxVisibility = ratio
              mostVisibleSection = id
            }
          })

          // Update active section jika ada yang lebih visible
          if (mostVisibleSection && mostVisibleSection !== activeSection.value) {
            activeSection.value = mostVisibleSection
          }
        })
      }, options)

      // Initialize visibility tracking
      sections.forEach(section => {
        sectionVisibility[section.id] = 0
      })

      // Observe all sections
      sections.forEach(section => {
        const element = document.getElementById(section.id)
        if (element) {
          observer.observe(element)
          // Set initial visibility
          const rect = element.getBoundingClientRect()
          const viewportHeight = window.innerHeight
          const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
          if (visibleHeight > 0) {
            sectionVisibility[section.id] = visibleHeight / rect.height
          }
        }
      })

      // Set initial active section berdasarkan posisi scroll
      const initialMostVisible = Object.entries(sectionVisibility)
        .sort(([, a], [, b]) => b - a)[0]
      
      if (initialMostVisible) {
        activeSection.value = initialMostVisible[0]
      }
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
      
      // Setup intersection observer after DOM is ready
      setTimeout(() => {
        setupIntersectionObserver()
      }, 500)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll)
      if (observer) {
        observer.disconnect()
      }
    })

    return {
      activeSection,
      isVisible,
      hasScrolled,
      sections,
      scrollToSection,
      scrollToTop
    }
  }
}
</script>

<style scoped>
.anchor-navigation {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.anchor-navigation.visible {
  opacity: 1;
  visibility: visible;
}

.nav-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 16px 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

:global(body.dark-theme) .nav-container {
  background: rgba(41, 37, 36, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.nav-dots {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-item {
  position: relative;
}

.nav-item a {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  padding: 6px;
  border-radius: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.nav-item a:hover {
  background: rgba(249, 115, 22, 0.1);
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d1d5db;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

:global(body.dark-theme) .dot {
  background: #4b5563;
}

.nav-item a.active .dot {
  background: #f97316;
  transform: scale(1.3);
  box-shadow: 0 0 10px rgba(249, 115, 22, 0.5);
}

:global(body.dark-theme) .nav-item a.active .dot {
  background: #fb923c;
  box-shadow: 0 0 10px rgba(251, 146, 60, 0.5);
}

.label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  pointer-events: none;
}

:global(body.dark-theme) .label {
  color: #9ca3af;
}

.nav-item a:hover .label,
.nav-item a.active .label {
  opacity: 1;
  transform: translateX(0);
}

.nav-item a.active .label {
  color: #f97316;
}

:global(body.dark-theme) .nav-item a.active .label {
  color: #fb923c;
}

.back-to-top {
  margin-top: 12px;
  width: 100%;
  padding: 8px;
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 20px;
  color: #f97316;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

:global(body.dark-theme) .back-to-top {
  background: rgba(251, 146, 60, 0.1);
  border: 1px solid rgba(251, 146, 60, 0.3);
  color: #fb923c;
}

.back-to-top:hover {
  background: rgba(249, 115, 22, 0.2);
  transform: translateY(-2px);
}

:global(body.dark-theme) .back-to-top:hover {
  background: rgba(251, 146, 60, 0.2);
}

/* Responsive: hide on smaller screens */
@media (max-width: 1024px) {
  .anchor-navigation {
    right: 20px;
  }
}

@media (max-width: 768px) {
  .anchor-navigation {
    display: none;
  }
}

@media (max-width: 480px) {
  .label {
    display: none;
  }
  
  .nav-container {
    padding: 12px 8px;
  }
  
  .nav-dots {
    gap: 8px;
  }
  
  .dot {
    width: 10px;
    height: 10px;
  }
}
</style>

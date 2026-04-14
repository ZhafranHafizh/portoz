<template>
  <div class="one-page-container">
    <!-- Home Section -->
    <section id="section-home" class="page-section">
      <HomeView />
    </section>

    <!-- About Section -->
    <section id="section-about" class="page-section">
      <AboutView />
    </section>

    <!-- Projects Section -->
    <section id="section-projects" class="page-section">
      <ProjectsView />
    </section>

    <!-- Gallery Section -->
    <section id="section-gallery" class="page-section">
      <GalleryView />
    </section>

    <!-- Contact Section -->
    <section id="section-contact" class="page-section">
      <ContactView />
    </section>
  </div>
</template>

<script>
import { defineComponent, onMounted, onBeforeUnmount } from 'vue'
import HomeView from '@/views/Home.vue'
import AboutView from '@/views/About.vue'
import ProjectsView from '@/views/Projects.vue'
import GalleryView from '@/views/Gallery.vue'
import ContactView from '@/views/Contact.vue'

export default defineComponent({
  name: 'OnePageView',
  components: {
    HomeView,
    AboutView,
    ProjectsView,
    GalleryView,
    ContactView
  },
  setup() {
    // Handle smooth scroll for anchor links
    const handleAnchorClick = (event) => {
      const anchor = event.target.closest('a[href^="#"]')
      if (anchor) {
        event.preventDefault()
        const targetId = anchor.getAttribute('href').substring(1)
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleAnchorClick)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleAnchorClick)
    })
  }
})
</script>

<style scoped>
.one-page-container {
  width: 100%;
  overflow-x: hidden;
}

.page-section {
  width: 100%;
  position: relative;
  min-height: 100vh;
  /* Remove individual backgrounds - let child components handle their own styling */
}

/* Contact section might be shorter, but still ensure minimum height for detection */
#section-contact {
  min-height: 80vh;
}

/* Ensure smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Optional: Add section dividers or spacing if needed */
.page-section + .page-section {
  /* margin-top: 0; */ /* Adjust if needed for visual separation */
}
</style>

<template>
  <transition name="fab-fade">
    <button
      v-if="showButton"
      @click="navigateToNext"
      class="floating-action-button"
      :title="buttonTitle"
    >
      <svg
        class="fab-icon"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
    </button>
  </transition>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'FloatingActionButton',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const showButton = ref(false)
    
    // Define the page navigation sequence
    const pageSequence = [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'Projects', path: '/projects' },
      { name: 'Gallery', path: '/gallery' },
      { name: 'Contact', path: '/contact' }
    ]
    
    // Get current page index and next page
    const currentPageIndex = computed(() => {
      return pageSequence.findIndex(page => page.path === route.path)
    })
    
    const nextPage = computed(() => {
      const currentIndex = currentPageIndex.value
      if (currentIndex >= 0 && currentIndex < pageSequence.length - 1) {
        return pageSequence[currentIndex + 1]
      }
      return null
    })
    
    const buttonTitle = computed(() => {
      if (nextPage.value) {
        return `Next: ${nextPage.value.name}`
      }
      return 'Next Page'
    })
    
    // Scroll detection
    const handleScroll = () => {
      const scrollY = window.scrollY
      
      // Show button when user has scrolled down at least 300px
      const scrollThreshold = 300
      
      showButton.value = scrollY > scrollThreshold && nextPage.value !== null
    }
    
    // Navigation function
    const navigateToNext = () => {
      if (nextPage.value) {
        router.push(nextPage.value.path)
      }
    }
    
    // Lifecycle hooks
    onMounted(() => {
      window.addEventListener('scroll', handleScroll, { passive: true })
      // Initial check
      handleScroll()
    })
    
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })
    
    return {
      showButton,
      navigateToNext,
      buttonTitle
    }
  }
}
</script>

<style scoped>
.floating-action-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.floating-action-button:hover {
  transform: translateY(-2px) scale(1.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.floating-action-button:active {
  transform: translateY(0) scale(1.05);
  transition: all 0.1s ease;
}

.fab-icon {
  width: 1.5rem;
  height: 1.5rem;
  transition: transform 0.3s ease;
}

.floating-action-button:hover .fab-icon {
  transform: translateX(2px);
}

/* Transition animations */
.fab-fade-enter-active,
.fab-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fab-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.fab-fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

/* Dark mode support */
body.dark-theme .floating-action-button {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

body.dark-theme .floating-action-button:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
}

/* Responsive design */
@media (max-width: 768px) {
  .floating-action-button {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 3rem;
    height: 3rem;
  }
  
  .fab-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}

@media (max-width: 480px) {
  .floating-action-button {
    bottom: 1rem;
    right: 1rem;
    width: 2.75rem;
    height: 2.75rem;
  }
  
  .fab-icon {
    width: 1.125rem;
    height: 1.125rem;
  }
}

/* Ensure it doesn't interfere with other elements */
.floating-action-button {
  pointer-events: auto;
}

/* Smooth appearance when page loads */
.floating-action-button {
  will-change: transform, opacity;
}
</style>
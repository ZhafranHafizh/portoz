<template>
  <div class="error-page" :class="{ 'dark-theme': isDarkMode }">
    <div class="error-content">
      <!-- SVG Animation -->
      <div class="error-animation">
        <img 
          src="@/assets/404.svg" 
          alt="Error Animation" 
          class="animated-svg"
          @error="handleImageError"
        />
      </div>

      <!-- Error Message -->
      <div class="error-message">
        <h1 class="error-code">{{ errorCode }}</h1>
        <h2 class="error-title">{{ errorTitle }}</h2>
        <p class="error-description">{{ errorDescription }}</p>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="btn btn-primary" @click="goHome">
          <i class="fas fa-home"></i>
          <span>Back to Home</span>
        </button>
        <button class="btn btn-secondary" @click="goBack">
          <i class="fas fa-arrow-left"></i>
          <span>Go Back</span>
        </button>
      </div>

      <!-- Additional Info -->
      <div class="error-details" v-if="showDetails">
        <p class="detail-text">
          <i class="fas fa-info-circle"></i>
          URL: <code>{{ currentUrl }}</code>
        </p>
        <p class="detail-text" v-if="timestamp">
          <i class="fas fa-clock"></i>
          {{ timestamp }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'ErrorPage',
  props: {
    errorCode: {
      type: String,
      default: '404'
    },
    customMessage: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const isDarkMode = ref(false)
    const showDetails = ref(false)
    const timestamp = ref('')

    const currentUrl = computed(() => route.path)

    const errorTitles = {
      '404': 'Page Not Found',
      '500': 'Internal Server Error',
      '403': 'Access Denied',
      '400': 'Bad Request',
      '503': 'Service Unavailable'
    }

    const errorDescriptions = {
      '404': 'The page you\'re looking for doesn\'t exist or has been moved.',
      '500': 'Something went wrong on our end. Please try again later.',
      '403': 'You don\'t have permission to access this resource.',
      '400': 'The request could not be understood by the server.',
      '503': 'The service is temporarily unavailable. Please try again later.'
    }

    const errorTitle = computed(() => {
      return props.customMessage || errorTitles[props.errorCode] || 'Oops! Something went wrong'
    })

    const errorDescription = computed(() => {
      return errorDescriptions[props.errorCode] || 'An unexpected error occurred.'
    })

    const goHome = () => {
      router.push('/')
    }

    const goBack = () => {
      if (window.history.length > 1) {
        router.back()
      } else {
        router.push('/')
      }
    }

    const handleImageError = (e) => {
      console.error('Failed to load error animation SVG')
    }

    const checkDarkMode = () => {
      isDarkMode.value = document.body.classList.contains('dark-theme')
    }

    onMounted(() => {
      checkDarkMode()
      timestamp.value = new Date().toLocaleString()
      
      // Watch for dark mode changes
      const observer = new MutationObserver(checkDarkMode)
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
      
      // Toggle details on click
      document.addEventListener('keydown', (e) => {
        if (e.key === 'd' && e.ctrlKey) {
          e.preventDefault()
          showDetails.value = !showDetails.value
        }
      })
    })

    return {
      isDarkMode,
      showDetails,
      currentUrl,
      errorTitle,
      errorDescription,
      timestamp,
      goHome,
      goBack,
      handleImageError
    }
  }
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #fafaf9 0%, #e7e5e4 100%);
  transition: all 0.3s ease;
}

.error-page.dark-theme {
  background: linear-gradient(135deg, #1c1917 0%, #0c0a09 100%);
}

.error-content {
  max-width: 800px;
  width: 100%;
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.8s ease-out;
}

.error-page.dark-theme .error-content {
  background: rgba(41, 37, 36, 0.95);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

/* SVG Animation Container */
.error-animation {
  margin-bottom: 2rem;
  position: relative;
}

.animated-svg {
  width: 100%;
  max-width: 500px;
  height: auto;
  animation: floatAnimation 3s ease-in-out infinite;
  filter: drop-shadow(0 10px 20px rgba(249, 115, 22, 0.2));
}

@keyframes floatAnimation {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Error Message */
.error-message {
  margin-bottom: 2rem;
}

.error-code {
  font-size: 6rem;
  font-weight: 900;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  line-height: 1;
  animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(249, 115, 22, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 40px rgba(249, 115, 22, 0.6));
  }
}

.error-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 1rem 0 0.5rem;
}

.error-page.dark-theme .error-title {
  color: #e4e4e7;
}

.error-description {
  font-size: 1.1rem;
  color: #6b7280;
  margin: 0.5rem 0 0;
  line-height: 1.6;
}

.error-page.dark-theme .error-description {
  color: #a1a1aa;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  text-decoration: none;
}

.btn i {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.btn:hover i {
  transform: translateX(-3px);
}

.btn-primary {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(249, 115, 22, 0.4);
}

.btn-secondary {
  background: rgba(249, 115, 22, 0.1);
  color: #f97316;
  border: 2px solid rgba(249, 115, 22, 0.3);
}

.btn-secondary:hover {
  background: rgba(249, 115, 22, 0.2);
  border-color: #f97316;
  transform: translateY(-3px);
}

.error-page.dark-theme .btn-secondary {
  background: rgba(251, 146, 60, 0.1);
  border-color: rgba(251, 146, 60, 0.3);
  color: #fb923c;
}

.error-page.dark-theme .btn-secondary:hover {
  background: rgba(251, 146, 60, 0.2);
  border-color: #fb923c;
}

/* Error Details */
.error-details {
  padding-top: 2rem;
  border-top: 1px solid rgba(249, 115, 22, 0.2);
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.detail-text {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #6b7280;
}

.error-page.dark-theme .detail-text {
  color: #a1a1aa;
}

.detail-text i {
  margin-right: 8px;
  color: #f97316;
}

.detail-text code {
  background: rgba(249, 115, 22, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: #f97316;
  font-size: 0.85rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .error-content {
    padding: 2rem 1.5rem;
  }

  .error-code {
    font-size: 4rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-description {
    font-size: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .error-page {
    padding: 1rem;
  }

  .error-content {
    padding: 1.5rem 1rem;
    border-radius: 16px;
  }

  .error-code {
    font-size: 3rem;
  }

  .error-title {
    font-size: 1.3rem;
  }

  .btn {
    padding: 12px 24px;
    font-size: 0.95rem;
  }
}
</style>

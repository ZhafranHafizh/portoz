<template>
  <div v-if="showNotice" class="mobile-notice-overlay">
    <div class="mobile-notice">
      <div class="notice-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 2H7C5.9 2 5 2.9 5 4V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V4C19 2.9 18.1 2 17 2ZM17 18H7V6H17V18Z"/>
          <path d="M16 1H8C6.34 1 5 2.34 5 4V20C5 21.66 6.34 23 8 23H16C17.66 23 19 21.66 19 20V4C19 2.34 17.66 1 16 1ZM17 17H7V7H17V17Z"/>
        </svg>
      </div>
      <h3 class="notice-title">Better Experience on Desktop</h3>
      <p class="notice-message">
        For the complete experience and better navigation of my portfolio, 
        please consider viewing it on a desktop or laptop device.
      </p>
      <div class="notice-actions">
        <button @click="continueAnyway" class="btn-secondary">Continue Anyway</button>
        <button @click="hideNotice" class="btn-primary">Got It</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useDeviceDetection } from '@/composables/useDeviceDetection'

export default {
  name: 'MobileNotice',
  setup() {
    const { isMobile } = useDeviceDetection()
    const showNotice = ref(false)
    
    onMounted(() => {
      const hasSeenNotice = localStorage.getItem('mobile-notice-seen')
      const hasAcceptedMobile = localStorage.getItem('mobile-accepted')
      
      if (isMobile.value && !hasSeenNotice && !hasAcceptedMobile) {
        // Show notice after a short delay for better UX
        setTimeout(() => {
          showNotice.value = true
        }, 1000)
      }
    })
    
    const hideNotice = () => {
      showNotice.value = false
      localStorage.setItem('mobile-notice-seen', 'true')
    }
    
    const continueAnyway = () => {
      showNotice.value = false
      localStorage.setItem('mobile-notice-seen', 'true')
      localStorage.setItem('mobile-accepted', 'true')
    }
    
    return {
      showNotice,
      hideNotice,
      continueAnyway
    }
  }
}
</script>

<style scoped>
.mobile-notice-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.mobile-notice {
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

.dark-theme .mobile-notice {
  background: #1f2937;
  color: #e4e4e7;
}

.notice-icon {
  color: #3b82f6;
  margin-bottom: 16px;
}

.notice-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1f2937;
}

.dark-theme .notice-title {
  color: #f3f4f6;
}

.notice-message {
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 24px;
  font-size: 0.95rem;
}

.dark-theme .notice-message {
  color: #9ca3af;
}

.notice-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.btn-secondary:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.dark-theme .btn-secondary {
  color: #9ca3af;
  border-color: #4b5563;
}

.dark-theme .btn-secondary:hover {
  background: #374151;
  border-color: #6b7280;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

/* Mobile specific adjustments */
@media (max-width: 480px) {
  .mobile-notice {
    padding: 24px 20px;
    margin: 20px;
  }
  
  .notice-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>

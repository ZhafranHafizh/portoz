<template>
  <transition name="fade">
    <div class="floating-back-to-tab" v-if="isOnePage">
      <button
        class="floating-btn"
        @click="switchToTabMode"
        title="Back to Tab View"
      >
        <i class="fas fa-arrow-left"></i>
        <span>Back to Tab</span>
      </button>
    </div>
  </transition>
</template>

<script>
import { useViewMode } from '@/composables/useViewMode'
import { useRouter } from 'vue-router'

export default {
  name: 'FloatingBackToTab',
  setup() {
    const { isOnePage, switchToTab } = useViewMode()
    const router = useRouter()

    const switchToTabMode = () => {
      switchToTab()
      router.push('/')
    }

    return {
      isOnePage,
      switchToTabMode
    }
  }
}
</script>

<style scoped>
.floating-back-to-tab {
  position: fixed;
  bottom: 100px;
  left: 30px;
  z-index: 998;
}

.floating-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
  white-space: nowrap;
}

.floating-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 35px rgba(16, 185, 129, 0.5);
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
}

.floating-btn:active {
  transform: translateY(-1px) scale(1.02);
}

.floating-btn i {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.floating-btn:hover i {
  transform: translateX(-4px);
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Responsive */
@media (max-width: 768px) {
  .floating-back-to-tab {
    bottom: 90px;
    left: 20px;
  }
  
  .floating-btn span {
    display: none;
  }
  
  .floating-btn {
    padding: 14px;
    border-radius: 50%;
  }
  
  .floating-btn i {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .floating-back-to-tab {
    bottom: 80px;
    left: 15px;
  }
  
  .floating-btn {
    padding: 12px;
  }
}
</style>

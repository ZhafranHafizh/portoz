<template>
  <div class="view-mode-toggle" :class="{ 'is-one-page': isOnePage }">
    <button
      class="toggle-btn"
      @click="handleToggle"
      :title="isOnePage ? 'Switch to Tab View' : 'Switch to One Page View'"
      :aria-label="`Switch to ${isOnePage ? 'Tab' : 'One Page'} View`"
    >
      <div class="toggle-track">
        <div class="toggle-thumb"></div>
      </div>
      <div class="toggle-labels">
        <span class="label-tab" :class="{ active: isTabMode }">
          <i class="fas fa-columns"></i>
          <span class="label-text">Tab</span>
        </span>
        <span class="label-onepage" :class="{ active: isOnePageMode }">
          <i class="fas fa-scroll"></i>
          <span class="label-text">One Page</span>
        </span>
      </div>
    </button>
    
    <!-- Back to Tab button when in One Page mode -->
    <button
      v-if="isOnePage"
      class="back-to-tab-btn"
      @click="switchToTabMode"
      title="Back to Tab View"
    >
      <i class="fas fa-arrow-left"></i>
      <span>Back to Tab</span>
    </button>
  </div>
</template>

<script>
import { useViewMode } from '@/composables/useViewMode'
import { useRouter } from 'vue-router'

export default {
  name: 'ViewModeToggle',
  setup() {
    const { isOnePage, isTabMode, toggleMode, switchToTab } = useViewMode()
    const router = useRouter()

    const handleToggle = () => {
      toggleMode()
      
      // Navigate based on the new mode
      if (isOnePage.value) {
        router.push('/one-page')
      } else {
        router.push('/')
      }
    }

    const switchToTabMode = () => {
      switchToTab()
      router.push('/')
    }

    return {
      isOnePage,
      isTabMode,
      isOnePageMode: isOnePage,
      handleToggle,
      switchToTabMode
    }
  }
}
</script>

<style scoped>
.view-mode-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-track {
  width: 44px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  position: relative;
  transition: background 0.3s ease;
  flex-shrink: 0;
}

:global(body.dark-theme) .toggle-track {
  background: #374151;
}

.toggle-thumb {
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.is-one-page .toggle-thumb {
  transform: translateX(20px);
  background: #f97316;
}

.toggle-labels {
  display: flex;
  gap: 4px;
  align-items: center;
}

.toggle-labels span {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #6b7280;
  transition: color 0.3s ease;
  white-space: nowrap;
}

:global(body.dark-theme) .toggle-labels span {
  color: #9ca3af;
}

.toggle-labels span.active {
  color: #f97316;
  font-weight: 600;
}

:global(body.dark-theme) .toggle-labels span.active {
  color: #fb923c;
}

.toggle-labels i {
  font-size: 0.85rem;
}

.label-text {
  display: inline;
}

/* Back to Tab Button */
.back-to-tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
  white-space: nowrap;
}

.back-to-tab-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
  background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
}

.back-to-tab-btn i {
  font-size: 0.9rem;
  transition: transform 0.3s ease;
}

.back-to-tab-btn:hover i {
  transform: translateX(-3px);
}

/* Responsive: hide text labels on small screens */
@media (max-width: 768px) {
  .label-text {
    display: none;
  }
  
  .toggle-labels {
    gap: 6px;
  }
  
  .toggle-labels i {
    font-size: 1rem;
  }
  
  .back-to-tab-btn span {
    display: none;
  }
  
  .back-to-tab-btn {
    padding: 8px 12px;
  }
}

@media (max-width: 480px) {
  .view-mode-toggle {
    margin-left: 8px;
  }
  
  .toggle-track {
    width: 40px;
    height: 22px;
  }
  
  .toggle-thumb {
    width: 18px;
    height: 18px;
  }
  
  .is-one-page .toggle-thumb {
    transform: translateX(18px);
  }
}
</style>

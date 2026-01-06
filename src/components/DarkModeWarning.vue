<template>
  <transition name="fade-overlay">
    <div v-if="shouldShowWarning" class="dark-mode-warning">
      <div class="warning-content" @click.stop>
        <div class="warning-stripe"></div>
        <div>
          <i class="fas fa-exclamation-triangle warning-icon"></i>
          <div class="warning-text">
            <strong>Dark Mode is Currently Under Maintenance</strong>
            <p>We apologize for any inconvenience. Dark mode is currently being optimized for the best experience.</p>
          </div>
          <button @click="closeBanner" class="close-btn" aria-label="Close warning">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="warning-stripe"></div>
        
        <!-- Dark Mode Toggle Switch -->
        <div class="toggle-section">
          <span class="toggle-label">Switch to Light Mode</span>
          <div class="custom-toggle" @click="toggleDarkMode">
            <div class="toggle-bg" :class="{ 'active': visualIsDark }">
              <div class="toggle-circle" :class="{ 'active': visualIsDark }">
                <i :class="visualIsDark ? 'fas fa-moon' : 'fas fa-sun'"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'

const { isDarkMode, toggleDarkMode: toggleMode } = useDarkMode()
const showWarning = ref(true)
const isAnimating = ref(false)
// Visual state separate from actual mode to allow animation
const visualIsDark = ref(isDarkMode.value)

// Sync visual state when system mode changes externally
watch(isDarkMode, (newVal) => {
  if (!isAnimating.value) {
    visualIsDark.value = newVal
  }
  if (newVal) {
    showWarning.value = true
  }
})

const closeBanner = () => {
  showWarning.value = false
}

const toggleDarkMode = () => {
  if (isAnimating.value) return
  isAnimating.value = true
  
  // 1. Immediately update visual state to trigger animation
  visualIsDark.value = !visualIsDark.value
  
  // 2. Wait for animation to complete before changing actual mode
  setTimeout(() => {
    toggleMode()
    isAnimating.value = false
    
    // 3. Close warning if we switched to light mode
    setTimeout(() => {
      if (!isDarkMode.value) {
        showWarning.value = false
      }
    }, 100)
  }, 450)
}

const shouldShowWarning = ref(false)
watch([isDarkMode, showWarning], ([dark, show]) => {
  shouldShowWarning.value = dark && show
}, { immediate: true })
</script>

<style scoped>
/* Overlay backdrop */
.dark-mode-warning {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
}

/* Warning box container */
.warning-content {
  position: relative;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 16px;
  padding: 0;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: pulse-warning 2s ease-in-out infinite;
  overflow: hidden;
}

.warning-stripe {
  height: 8px;
  background: repeating-linear-gradient(
    45deg,
    #000,
    #000 20px,
    #fbbf24 20px,
    #fbbf24 40px
  );
}

/* Content inside warning box */
.warning-content > div {
  padding: 32px 40px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.warning-icon {
  font-size: 2rem;
  color: #78350f;
  flex-shrink: 0;
  animation: shake 0.5s ease-in-out infinite;
}

.warning-text {
  flex: 1;
  color: #78350f;
}

.warning-text strong {
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.warning-text p {
  margin: 0;
  font-size: 0.95rem;
  opacity: 0.9;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #78350f;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
}

.close-btn i {
  font-size: 1rem;
}

/* Toggle Section */
.toggle-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 24px 40px;
  background: transparent;
  border-top: none;
}

.toggle-label {
  font-size: 1rem;
  font-weight: 600;
  color: #78350f;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Custom Toggle Design */
.custom-toggle {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.custom-toggle:hover {
  transform: scale(1.05);
}

.custom-toggle:active {
  transform: scale(0.98);
}

.toggle-bg {
  width: 70px;
  height: 35px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-radius: 50px;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    inset 0 2px 8px rgba(0, 0, 0, 0.2),
    0 4px 12px rgba(251, 191, 36, 0.3);
  border: 2px solid rgba(120, 53, 15, 0.3);
}

.toggle-bg.active {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  box-shadow: 
    inset 0 2px 8px rgba(0, 0, 0, 0.5),
    0 4px 12px rgba(15, 23, 42, 0.4);
  border: 2px solid rgba(148, 163, 184, 0.3);
}

.toggle-circle {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 27px;
  height: 27px;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 50%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.2),
    0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-circle.active {
  transform: translateX(35px);
  background: linear-gradient(135deg, #1e293b, #0f172a);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.4),
    0 0 12px rgba(251, 191, 36, 0.3);
}

.toggle-circle i {
  font-size: 14px;
  transition: all 0.3s ease;
}

.toggle-circle:not(.active) i {
  color: #f59e0b;
  filter: drop-shadow(0 0 2px rgba(245, 158, 11, 0.5));
}

.toggle-circle.active i {
  color: #fbbf24;
  filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.8));
  animation: moonGlow 2s ease-in-out infinite;
}

@keyframes moonGlow {
  0%, 100% {
    filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.8));
  }
  50% {
    filter: drop-shadow(0 0 8px rgba(251, 191, 36, 1));
  }
}

/* Animations */
@keyframes pulse-warning {
  0%, 100% {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }
  50% {
    box-shadow: 0 20px 80px rgba(245, 158, 11, 0.8);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: all 0.3s ease;
}

.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}

.fade-overlay-enter-from .warning-content,
.fade-overlay-leave-to .warning-content {
  transform: scale(0.9);
}

/* Responsive */
@media (max-width: 768px) {
  .warning-content {
    max-width: 85%;
  }

  .warning-content > div {
    padding: 24px 28px;
    gap: 16px;
  }

  .warning-icon {
    font-size: 1.5rem;
  }

  .warning-text strong {
    font-size: 0.95rem;
  }

  .warning-text p {
    font-size: 0.85rem;
  }

  .close-btn {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 480px) {
  .warning-content {
    max-width: 90%;
  }

  .warning-content > div {
    flex-direction: column;
    text-align: center;
    padding: 20px;
    gap: 12px;
  }

  .close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
  }

  .warning-text strong {
    font-size: 0.9rem;
  }

  .warning-text p {
    font-size: 0.8rem;
  }

  .toggle-section {
    flex-direction: column;
    padding: 20px;
    gap: 12px;
  }

  .toggle-label {
    font-size: 0.9rem;
  }
}
</style>

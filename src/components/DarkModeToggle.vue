<template>
  <button 
    @click="toggleDarkMode" 
    class="dark-mode-toggle"
    :class="{ 'dark': isDarkMode }"
    aria-label="Toggle dark mode"
  >
    <div class="toggle-track">
      <div class="toggle-thumb" :class="{ 'dark': isDarkMode }">
        <i class="icon" :class="isDarkMode ? 'fas fa-moon' : 'fas fa-sun'"></i>
      </div>
    </div>
  </button>
</template>

<script>
import { useDarkMode } from '@/composables/useDarkMode'

export default {
  name: 'DarkModeToggle',
  setup() {
    const { isDarkMode, toggleDarkMode } = useDarkMode()
    
    return {
      isDarkMode,
      toggleDarkMode
    }
  }
}
</script>

<style scoped>
.dark-mode-toggle {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  outline: none;
  transition: transform 0.2s ease;
}

.dark-mode-toggle:hover {
  transform: scale(1.1);
}

.dark-mode-toggle:active {
  transform: scale(0.95);
}

.toggle-track {
  width: 50px;
  height: 25px;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e0);
  border-radius: 25px;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dark-mode-toggle.dark .toggle-track {
  background: linear-gradient(135deg, #4a5568, #2d3748);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 21px;
  height: 21px;
  background: linear-gradient(135deg, #ffffff, #f7fafc);
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1);
}

.toggle-thumb.dark {
  transform: translateX(25px);
  background: linear-gradient(135deg, #2d3748, #1a202c);
  /* Add a subtle border and shadow for contrast */
  border: 1.5px solid #e2e8f0;
  box-shadow: 0 0 0 3px rgba(226,232,240,0.12), 0 2px 8px rgba(0,0,0,0.4);
}

.icon {
  font-size: 10px;
  transition: all 0.3s ease;
  color: #ffd700;
}

.toggle-thumb:not(.dark) .icon {
  color: #f6ad55;
}

.toggle-thumb.dark .icon {
  color: #000000;
  /* Add a glow for visibility */
  text-shadow: 0 0 6px #ffe066, 0 0 2px #fff;
  filter: drop-shadow(0 0 2px #fff8) drop-shadow(0 0 4px #ffe06688);
}

/* Animation for icon change */
.toggle-thumb .icon {
  animation: iconRotate 0.3s ease;
}

@keyframes iconRotate {
  0% { transform: rotate(-30deg); opacity: 0; }
  100% { transform: rotate(0deg); opacity: 1; }
}
</style>

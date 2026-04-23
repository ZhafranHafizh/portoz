import { ref, computed } from 'vue'

const VIEW_MODE_KEY = 'portoz-view-mode-v2'
const MODE_TAB = 'tab'
const MODE_ONE_PAGE = 'one-page'

// Global reactive state
const currentMode = ref(MODE_ONE_PAGE)

// Initialize from localStorage
function initMode() {
  const stored = localStorage.getItem(VIEW_MODE_KEY)
  if (stored === MODE_ONE_PAGE || stored === MODE_TAB) {
    currentMode.value = stored
  }
}

export function useViewMode() {
  // Initialize on first use (redundant but kept for safety)
  if (currentMode.value === MODE_ONE_PAGE && localStorage.getItem(VIEW_MODE_KEY)) {
    initMode()
  }

  const isOnePage = computed(() => currentMode.value === MODE_ONE_PAGE)
  const isTabMode = computed(() => currentMode.value === MODE_TAB)

  function setMode(mode) {
    if (mode !== MODE_TAB && mode !== MODE_ONE_PAGE) {
      console.warn(`Invalid view mode: ${mode}. Use '${MODE_TAB}' or '${MODE_ONE_PAGE}'`)
      return
    }
    currentMode.value = mode
    localStorage.setItem(VIEW_MODE_KEY, mode)
  }

  function toggleMode() {
    const newMode = currentMode.value === MODE_TAB ? MODE_ONE_PAGE : MODE_TAB
    setMode(newMode)
  }

  function switchToOnePage() {
    setMode(MODE_ONE_PAGE)
  }

  function switchToTab() {
    setMode(MODE_TAB)
  }

  return {
    currentMode,
    isOnePage,
    isTabMode,
    setMode,
    toggleMode,
    switchToOnePage,
    switchToTab,
    MODE_TAB,
    MODE_ONE_PAGE
  }
}

// Auto-initialize when module loads
initMode()

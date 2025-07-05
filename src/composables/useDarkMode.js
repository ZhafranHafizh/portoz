import { ref, watch } from 'vue'

const isDarkMode = ref(false)

// Check if user has a saved preference
const savedTheme = localStorage.getItem('theme')
if (savedTheme) {
  isDarkMode.value = savedTheme === 'dark'
} else {
  // Check system preference
  isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Apply theme on initialization
updateTheme()

// Watch for changes and update DOM
watch(isDarkMode, () => {
  updateTheme()
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
})

function updateTheme() {
  if (isDarkMode.value) {
    document.body.classList.add('dark-theme')
  } else {
    document.body.classList.remove('dark-theme')
  }
}

export function useDarkMode() {
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
  }

  return {
    isDarkMode,
    toggleDarkMode
  }
}

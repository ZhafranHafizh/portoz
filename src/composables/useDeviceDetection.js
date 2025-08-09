import { ref, onMounted } from 'vue'

const isMobile = ref(false)
const isTablet = ref(false)

export function useDeviceDetection() {
  const checkDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    const screenWidth = window.innerWidth
    
    // Check for mobile devices
    const mobileKeywords = [
      'mobile', 'android', 'iphone', 'ipod', 'blackberry', 
      'windows phone', 'opera mini', 'iemobile'
    ]
    
    const isMobileDevice = mobileKeywords.some(keyword => 
      userAgent.includes(keyword)
    )
    
    // Check for tablet devices
    const tabletKeywords = ['ipad', 'tablet', 'kindle', 'playbook', 'silk']
    const isTabletDevice = tabletKeywords.some(keyword => 
      userAgent.includes(keyword)
    )
    
    // Also check screen width as fallback
    const isMobileWidth = screenWidth < 768
    const isTabletWidth = screenWidth >= 768 && screenWidth < 1024
    
    isMobile.value = isMobileDevice || (isMobileWidth && !isTabletDevice)
    isTablet.value = isTabletDevice || isTabletWidth
  }
  
  onMounted(() => {
    checkDevice()
    window.addEventListener('resize', checkDevice)
  })
  
  return {
    isMobile,
    isTablet,
    isDesktop: ref(!isMobile.value && !isTablet.value)
  }
}

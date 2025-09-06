import { useViewCounter, initializeViewCounter } from '@/composables/useViewCounterDB'

export default {
  install(app) {
    const { trackPageView } = useViewCounter()
    
    // Initialize view counter data
    initializeViewCounter()
    
    // Track page views on route changes
    app.config.globalProperties.$router.afterEach((to) => {
      // Get page name from route
      let pageName = 'Unknown'
      if (to.name) {
        pageName = to.name
      } else if (to.path === '/') {
        pageName = 'Home'
      } else {
        // Extract page name from path
        const segments = to.path.split('/').filter(Boolean)
        if (segments.length > 0) {
          pageName = segments[0].charAt(0).toUpperCase() + segments[0].slice(1)
        }
      }
      
      // Track the page view with a small delay to ensure the page is loaded
      setTimeout(() => {
        trackPageView(pageName, {
          path: to.path,
          fullPath: to.fullPath,
          query: to.query,
          params: to.params
        }).catch(err => {
          console.warn('Failed to track page view:', err)
        })
      }, 100)
    })
    
    // Track initial page load
    setTimeout(() => {
      const currentRoute = app.config.globalProperties.$router.currentRoute.value
      let pageName = 'Home'
      
      if (currentRoute.name) {
        pageName = currentRoute.name
      } else if (currentRoute.path !== '/') {
        const segments = currentRoute.path.split('/').filter(Boolean)
        if (segments.length > 0) {
          pageName = segments[0].charAt(0).toUpperCase() + segments[0].slice(1)
        }
      }
      
      trackPageView(pageName, {
        path: currentRoute.path,
        fullPath: currentRoute.fullPath,
        isInitialLoad: true
      }).catch(err => {
        console.warn('Failed to track initial page view:', err)
      })
    }, 500)
  }
}

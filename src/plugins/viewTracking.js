import { useViewCounter } from '@/composables/useViewCounter'

// Router plugin to automatically track page views
export function setupViewTracking(router) {
  const { trackPageView } = useViewCounter()
  
  router.afterEach((to, from) => {
    // Small delay to ensure the page has loaded
    setTimeout(() => {
      const pageName = to.name || 'Unknown'
      const additionalData = {
        path: to.path,
        params: to.params,
        query: to.query,
        fromPage: from.name || null,
        fromPath: from.path || null
      }
      
      trackPageView(pageName, additionalData)
    }, 100)
  })
}

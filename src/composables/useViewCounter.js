import { ref, reactive, computed, readonly } from 'vue'

// Reactive store for view counts
const viewCounts = reactive({
  total: 0,
  pages: {
    Home: 0,
    About: 0,
    Projects: 0,
    Gallery: 0,
    Contact: 0
  },
  sessions: [],
  uniqueVisitors: new Set(),
  dailyStats: {}
})

// Reactive state for real-time updates
const isTracking = ref(true)
const currentPageViews = ref(0)

// Initialize view counter from localStorage
function initializeViewCounter() {
  try {
    const savedData = localStorage.getItem('portfolio-view-counter')
    if (savedData) {
      const parsed = JSON.parse(savedData)
      viewCounts.total = parsed.total || 0
      viewCounts.pages = { ...viewCounts.pages, ...(parsed.pages || {}) }
      viewCounts.sessions = parsed.sessions || []
      
      // Restore dailyStats with proper Set conversion
      viewCounts.dailyStats = {}
      if (parsed.dailyStats) {
        Object.keys(parsed.dailyStats).forEach(date => {
          const dayData = parsed.dailyStats[date]
          viewCounts.dailyStats[date] = {
            total: dayData.total || 0,
            pages: dayData.pages || {},
            uniqueVisitors: new Set(dayData.uniqueVisitors || [])
          }
        })
      }
      
      // Convert uniqueVisitors array back to Set
      if (parsed.uniqueVisitors) {
        viewCounts.uniqueVisitors = new Set(parsed.uniqueVisitors)
      }
    }
  } catch (error) {
    console.warn('Failed to load view counter data:', error)
  }
}

// Save view counter data to localStorage
function saveViewCounter() {
  try {
    // Convert dailyStats Sets to arrays for JSON serialization
    const serializedDailyStats = {}
    Object.keys(viewCounts.dailyStats).forEach(date => {
      const dayData = viewCounts.dailyStats[date]
      serializedDailyStats[date] = {
        total: dayData.total,
        pages: dayData.pages,
        uniqueVisitors: Array.from(dayData.uniqueVisitors || new Set())
      }
    })
    
    const dataToSave = {
      total: viewCounts.total,
      pages: viewCounts.pages,
      sessions: viewCounts.sessions.slice(-50), // Keep only last 50 sessions
      uniqueVisitors: Array.from(viewCounts.uniqueVisitors),
      dailyStats: serializedDailyStats,
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem('portfolio-view-counter', JSON.stringify(dataToSave))
  } catch (error) {
    console.warn('Failed to save view counter data:', error)
  }
}

// Generate a simple visitor ID
function generateVisitorId() {
  const existingId = localStorage.getItem('portfolio-visitor-id')
  if (existingId) {
    return existingId
  }
  
  const newId = 'visitor_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
  localStorage.setItem('portfolio-visitor-id', newId)
  return newId
}

// Get today's date string
function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

// Track a page view
function trackPageView(pageName, additionalData = {}) {
  if (!isTracking.value) return
  
  const visitorId = generateVisitorId()
  const today = getTodayString()
  const timestamp = new Date().toISOString()
  
  // Update total views
  viewCounts.total++
  
  // Update page-specific views
  if (viewCounts.pages[pageName] !== undefined) {
    viewCounts.pages[pageName]++
    currentPageViews.value = viewCounts.pages[pageName]
  }
  
  // Track unique visitors
  viewCounts.uniqueVisitors.add(visitorId)
  
  // Update daily stats
  if (!viewCounts.dailyStats[today]) {
    viewCounts.dailyStats[today] = {
      total: 0,
      pages: {},
      uniqueVisitors: new Set()
    }
  }
  
  // Ensure uniqueVisitors is a Set (safety check)
  if (!(viewCounts.dailyStats[today].uniqueVisitors instanceof Set)) {
    viewCounts.dailyStats[today].uniqueVisitors = new Set(viewCounts.dailyStats[today].uniqueVisitors || [])
  }
  
  viewCounts.dailyStats[today].total++
  viewCounts.dailyStats[today].pages[pageName] = (viewCounts.dailyStats[today].pages[pageName] || 0) + 1
  viewCounts.dailyStats[today].uniqueVisitors.add(visitorId)
  
  // Add session data
  const sessionData = {
    id: Math.random().toString(36).substr(2, 9),
    visitorId,
    pageName,
    timestamp,
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    url: window.location.href,
    ...additionalData
  }
  
  viewCounts.sessions.push(sessionData)
  
  // Clean up old daily stats (keep only last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0]
  
  Object.keys(viewCounts.dailyStats).forEach(date => {
    if (date < cutoffDate) {
      delete viewCounts.dailyStats[date]
    }
  })
  
  // Save to localStorage
  saveViewCounter()
  
  // Dispatch custom event for other components to listen
  window.dispatchEvent(new CustomEvent('page-view-tracked', {
    detail: { pageName, viewCount: viewCounts.pages[pageName], total: viewCounts.total }
  }))
}

// Get analytics data
function getAnalytics() {
  const last7Days = []
  const last30Days = []
  const today = new Date()
  
  // Generate last 7 days data
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split('T')[0]
    const dayData = viewCounts.dailyStats[dateString]
    
    last7Days.push({
      date: dateString,
      total: dayData?.total || 0,
      unique: dayData?.uniqueVisitors?.size || 0,
      pages: dayData?.pages || {}
    })
  }
  
  // Generate last 30 days data
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split('T')[0]
    const dayData = viewCounts.dailyStats[dateString]
    
    last30Days.push({
      date: dateString,
      total: dayData?.total || 0,
      unique: dayData?.uniqueVisitors?.size || 0,
      pages: dayData?.pages || {}
    })
  }
  
  return {
    total: viewCounts.total,
    uniqueVisitors: viewCounts.uniqueVisitors.size,
    pages: viewCounts.pages,
    sessions: viewCounts.sessions,
    last7Days,
    last30Days,
    todayStats: viewCounts.dailyStats[getTodayString()] || { total: 0, pages: {}, uniqueVisitors: new Set() }
  }
}

// Reset all counts (for development/testing)
function resetViewCounter() {
  viewCounts.total = 0
  viewCounts.pages = { Home: 0, About: 0, Projects: 0, Gallery: 0, Contact: 0 }
  viewCounts.sessions = []
  viewCounts.uniqueVisitors.clear()
  viewCounts.dailyStats = {}
  currentPageViews.value = 0
  
  localStorage.removeItem('portfolio-view-counter')
  localStorage.removeItem('portfolio-visitor-id')
}

// Computed properties for easy access
const totalViews = computed(() => viewCounts.total)
const pageViews = computed(() => viewCounts.pages)
const uniqueVisitorsCount = computed(() => viewCounts.uniqueVisitors.size)
const todayViews = computed(() => {
  const today = getTodayString()
  return viewCounts.dailyStats[today]?.total || 0
})

// Main composable function
export function useViewCounter() {
  // Initialize on first use
  if (viewCounts.total === 0 && !localStorage.getItem('portfolio-view-counter-initialized')) {
    initializeViewCounter()
    localStorage.setItem('portfolio-view-counter-initialized', 'true')
  }
  
  return {
    // State
    viewCounts: readonly(viewCounts),
    currentPageViews: readonly(currentPageViews),
    isTracking: readonly(isTracking),
    
    // Computed
    totalViews,
    pageViews,
    uniqueVisitorsCount,
    todayViews,
    
    // Methods
    trackPageView,
    getAnalytics,
    resetViewCounter,
    
    // Control
    enableTracking: () => { isTracking.value = true },
    disableTracking: () => { isTracking.value = false }
  }
}

// Auto-initialize
initializeViewCounter()

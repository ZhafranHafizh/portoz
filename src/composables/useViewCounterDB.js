import { ref, reactive, computed } from 'vue'

// Reactive store for view counts
const viewCounts = reactive({
  total: 0,
  pages: {
    Home: 0,
    About: 0,
    Projects: 0,
    Gallery: 0,
    Contact: 0,
    Analytics: 0
  },
  last7Days: [],
  last30Days: [],
  todayStats: { total: 0, unique: 0 },
  uniqueVisitors: 0,
  lastUpdated: null
})

// Reactive state for real-time updates
const isTracking = ref(true)
const currentPageViews = ref(0)
const isLoading = ref(false)
const error = ref(null)

// API endpoints
const API_BASE = process.env.NODE_ENV === 'production' ? '/.netlify/functions' : '/api'
const isDevelopment = process.env.NODE_ENV === 'development'

// Generate a visitor ID (stored in localStorage)
function generateVisitorId() {
  const existingId = localStorage.getItem('portfolio-visitor-id')
  if (existingId) {
    return existingId
  }
  
  const newId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  localStorage.setItem('portfolio-visitor-id', newId)
  return newId
}

// Development mode: Load data from localStorage
async function loadFromLocalStorage() {
  try {
    const savedData = localStorage.getItem('portfolio-view-counter-dev')
    if (savedData) {
      const parsed = JSON.parse(savedData)
      
      viewCounts.total = parsed.total || 0
      viewCounts.pages = { ...viewCounts.pages, ...(parsed.pages || {}) }
      viewCounts.uniqueVisitors = parsed.uniqueVisitors || 0
      viewCounts.last7Days = parsed.last7Days || generateMockDays(7)
      viewCounts.last30Days = parsed.last30Days || generateMockDays(30)
      viewCounts.todayStats = parsed.todayStats || { total: 0, unique: 0 }
      viewCounts.lastUpdated = new Date().toISOString()
      
      return parsed
    } else {
      // Initialize with default data
      const defaultData = {
        total: 0,
        pages: { Home: 0, About: 0, Projects: 0, Gallery: 0, Contact: 0, Analytics: 0 },
        uniqueVisitors: 0,
        last7Days: generateMockDays(7),
        last30Days: generateMockDays(30),
        todayStats: { total: 0, unique: 0 }
      }
      
      viewCounts.total = defaultData.total
      viewCounts.pages = defaultData.pages
      viewCounts.uniqueVisitors = defaultData.uniqueVisitors
      viewCounts.last7Days = defaultData.last7Days
      viewCounts.last30Days = defaultData.last30Days
      viewCounts.todayStats = defaultData.todayStats
      viewCounts.lastUpdated = new Date().toISOString()
      
      return defaultData
    }
  } catch (err) {
    console.warn('Failed to load from localStorage:', err)
    throw err
  }
}

// Development mode: Save to localStorage
function saveToLocalStorage() {
  try {
    const dataToSave = {
      total: viewCounts.total,
      pages: viewCounts.pages,
      uniqueVisitors: viewCounts.uniqueVisitors,
      last7Days: viewCounts.last7Days,
      last30Days: viewCounts.last30Days,
      todayStats: viewCounts.todayStats,
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem('portfolio-view-counter-dev', JSON.stringify(dataToSave))
  } catch (err) {
    console.warn('Failed to save to localStorage:', err)
  }
}

// Generate mock data for development
function generateMockDays(days) {
  const result = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    result.push({
      date: date.toISOString().split('T')[0],
      total: Math.floor(Math.random() * 50),
      unique: Math.floor(Math.random() * 25)
    })
  }
  
  return result
}

// Fetch view counter data from database
async function fetchViewCounterData() {
  try {
    isLoading.value = true
    error.value = null
    
    // In development, use localStorage fallback
    if (isDevelopment) {
      return await loadFromLocalStorage()
    }
    
    console.log('Fetching view counter data from:', `${API_BASE}/view-counter`)
    
    const response = await fetch(`${API_BASE}/view-counter`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('Received data:', data)
    
    // Update reactive store
    viewCounts.total = data.total || 0
    viewCounts.pages = { ...viewCounts.pages, ...(data.pages || {}) }
    viewCounts.uniqueVisitors = data.uniqueVisitors || 0
    viewCounts.last7Days = data.last7Days || []
    viewCounts.last30Days = data.last30Days || []
    viewCounts.todayStats = data.todayStats || { total: 0, unique: 0 }
    viewCounts.lastUpdated = new Date().toISOString()
    
    return data
  } catch (err) {
    console.error('Failed to fetch view counter data:', err)
    error.value = err.message
    
    // Fallback to localStorage if API fails
    return await loadFromLocalStorage()
  } finally {
    isLoading.value = false
  }
}

// Track a page view in the database
async function trackPageView(pageName, additionalData = {}) {
  if (!isTracking.value || !pageName) return
  
  try {
    const visitorId = generateVisitorId()
    
    // In development mode, track locally
    if (isDevelopment) {
      return await trackPageViewLocally(pageName, visitorId)
    }
    
    const payload = {
      pageName,
      visitorId,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      ...additionalData
    }
    
    const response = await fetch(`${API_BASE}/view-counter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    console.log('Track response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Track API Error Response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    console.log('Track result:', result)
    
    // Update local counters optimistically
    viewCounts.total++
    if (viewCounts.pages[pageName] !== undefined) {
      viewCounts.pages[pageName]++
      currentPageViews.value = viewCounts.pages[pageName]
    }
    
    // Save backup to localStorage
    try {
      localStorage.setItem('portfolio-view-counter-backup', JSON.stringify({
        total: viewCounts.total,
        pages: viewCounts.pages,
        lastUpdated: new Date().toISOString()
      }))
    } catch (storageError) {
      console.warn('Failed to save backup to localStorage:', storageError)
    }
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('viewCountUpdated', {
      detail: { pageName, viewCount: viewCounts.pages[pageName], total: viewCounts.total }
    }))
    
    return result
    
  } catch (err) {
    console.error('Failed to track page view:', err)
    error.value = err.message
    
    // Fallback: track locally only
    await trackPageViewLocally(pageName, generateVisitorId())
    
    throw err
  }
}

// Development mode: Track page view locally
async function trackPageViewLocally(pageName, visitorId) {
  // Update counters
  viewCounts.total++
  if (viewCounts.pages[pageName] !== undefined) {
    viewCounts.pages[pageName]++
    currentPageViews.value = viewCounts.pages[pageName]
  }
  
  // Update today's stats
  viewCounts.todayStats.total++
  
  // Update unique visitors (simple check for development)
  const todayVisitors = localStorage.getItem('portfolio-today-visitors') || '[]'
  const visitors = JSON.parse(todayVisitors)
  if (!visitors.includes(visitorId)) {
    visitors.push(visitorId)
    viewCounts.uniqueVisitors++
    viewCounts.todayStats.unique++
    localStorage.setItem('portfolio-today-visitors', JSON.stringify(visitors))
  }
  
  // Update last 7 days (update today's entry)
  const today = new Date().toISOString().split('T')[0]
  const todayIndex = viewCounts.last7Days.findIndex(d => d.date === today)
  if (todayIndex >= 0) {
    viewCounts.last7Days[todayIndex].total++
  }
  
  // Save to localStorage
  saveToLocalStorage()
  
  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent('viewCountUpdated', {
    detail: { pageName, viewCount: viewCounts.pages[pageName], total: viewCounts.total }
  }))
  
  return { success: true, mode: 'development' }
}

// Get analytics data (formatted for display)
function getAnalytics() {
  // Fill in missing days for consistent chart display
  const fillMissingDays = (data, days) => {
    const result = []
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split('T')[0]
      
      const existingData = data.find(d => d.date === dateString)
      result.push({
        date: dateString,
        total: existingData?.total || 0,
        unique: existingData?.unique || 0
      })
    }
    
    return result
  }
  
  return {
    total: viewCounts.total,
    uniqueVisitors: viewCounts.uniqueVisitors,
    pages: viewCounts.pages,
    last7Days: fillMissingDays(viewCounts.last7Days, 7),
    last30Days: fillMissingDays(viewCounts.last30Days, 30),
    todayStats: viewCounts.todayStats,
    lastUpdated: viewCounts.lastUpdated
  }
}

// Refresh data from database
async function refreshAnalytics() {
  try {
    if (isDevelopment) {
      await loadFromLocalStorage()
    } else {
      await fetchViewCounterData()
    }
    return getAnalytics()
  } catch (err) {
    console.error('Failed to refresh analytics:', err)
    return getAnalytics() // Return cached data
  }
}

// Reset view counter (admin function)
async function resetViewCounter() {
  console.warn('Reset function not implemented for database version')
  // This would require an admin endpoint for security
}

// Composable hook
export function useViewCounter() {
  // Computed values
  const totalViews = computed(() => viewCounts.total)
  const pageViews = computed(() => viewCounts.pages)
  const uniqueVisitorsCount = computed(() => viewCounts.uniqueVisitors)
  const todayViews = computed(() => viewCounts.todayStats.total)
  
  // Initialize data on first use
  const initializeData = async () => {
    try {
      await fetchViewCounterData()
    } catch (err) {
      console.warn('Initial data fetch failed, using fallback:', err)
    }
  }
  
  return {
    // State
    viewCounts,
    currentPageViews,
    isTracking,
    isLoading,
    error,
    
    // Computed
    totalViews,
    pageViews,
    uniqueVisitorsCount,
    todayViews,
    
    // Methods
    trackPageView,
    getAnalytics,
    refreshAnalytics,
    resetViewCounter,
    fetchViewCounterData,
    initializeData,
    
    // Control
    enableTracking: () => { isTracking.value = true },
    disableTracking: () => { isTracking.value = false }
  }
}

// Auto-initialize on module load
let isInitialized = false

export async function initializeViewCounter() {
  if (isInitialized) return
  
  try {
    await fetchViewCounterData()
    isInitialized = true
  } catch (err) {
    console.warn('Auto-initialization failed:', err)
  }
}

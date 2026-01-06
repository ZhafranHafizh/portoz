<template>
  <div class="view-counter" :class="{ 'compact': compact, 'detailed': !compact }">
    <!-- Compact Mode (for navbar or footer) -->
    <div v-if="compact" class="counter-compact">
      <div v-if="isLoading" class="counter-badge loading">
        <i class="fas fa-spinner fa-spin"></i>
        <span class="label">loading...</span>
      </div>
      <div v-else-if="error" class="counter-badge error" :title="`Error: ${error}`">
        <i class="fas fa-exclamation-triangle"></i>
        <span class="label">error</span>
      </div>
      <div v-else class="counter-badge" :title="`Total Views: ${totalViews} | Today: ${todayViews} | Unique Visitors: ${uniqueVisitorsCount}`">
        <i class="fas fa-eye"></i>
        <span class="count">{{ formatNumber(totalViews) }}</span>
        <span class="label">views</span>
      </div>
    </div>

    <!-- Detailed Mode (for analytics page or dashboard) -->
    <div v-else class="counter-detailed">
      <!-- Header -->
      <div class="counter-header">
        <h3>
          <i class="fas fa-chart-line"></i>
          View Analytics
        </h3>
        <button 
          v-if="showControls" 
          @click="toggleDetails" 
          class="toggle-btn"
          :title="showDetails ? 'Hide Details' : 'Show Details'"
        >
          <i :class="showDetails ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        </button>
      </div>

      <!-- Overview Stats -->
      <div class="stats-overview">
        <div class="stat-item primary">
          <div class="stat-icon">
            <i class="fas fa-eye"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ formatNumber(totalViews) }}</div>
            <div class="stat-label">Total Views</div>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon">
            <i class="fas fa-calendar-day"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ formatNumber(todayViews) }}</div>
            <div class="stat-label">Today</div>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ formatNumber(uniqueVisitorsCount) }}</div>
            <div class="stat-label">Unique Visitors</div>
          </div>
        </div>

        <div class="stat-item">
          <div class="stat-icon">
            <i class="fas fa-star"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ getMostPopularPage() }}</div>
            <div class="stat-label">Popular Page</div>
          </div>
        </div>
      </div>

      <!-- Detailed Analytics (collapsible) -->
      <div v-if="showDetails" class="stats-details">
        <!-- Page Views Breakdown -->
        <div class="section">
          <h4>
            <i class="fas fa-file-alt"></i>
            Page Views
          </h4>
          <div class="page-stats">
            <div 
              v-for="(count, page) in pageViews" 
              :key="page"
              class="page-stat"
            >
              <div class="page-name">
                <i :class="getPageIcon(page)"></i>
                {{ page }}
              </div>
              <div class="page-count">{{ formatNumber(count) }}</div>
              <div class="page-bar">
                <div 
                  class="page-bar-fill" 
                  :style="{ width: getPagePercentage(count) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity (if available) -->
        <div v-if="recentSessions.length > 0" class="section">
          <h4>
            <i class="fas fa-clock"></i>
            Recent Activity
          </h4>
          <div class="recent-activity">
            <div 
              v-for="session in recentSessions" 
              :key="session.id"
              class="activity-item"
            >
              <div class="activity-icon">
                <i :class="getPageIcon(session.pageName)"></i>
              </div>
              <div class="activity-content">
                <div class="activity-page">{{ session.pageName }}</div>
                <div class="activity-time">{{ formatTime(session.timestamp) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 7-Day Chart (simplified) -->
        <div class="section">
          <h4>
            <i class="fas fa-chart-bar"></i>
            Last 7 Days
          </h4>
          <div class="mini-chart">
            <div 
              v-for="(day, index) in last7DaysData" 
              :key="index"
              class="chart-bar"
              :title="`${day.date}: ${day.total} views`"
            >
              <div 
                class="bar-fill" 
                :style="{ height: getChartBarHeight(day.total) + '%' }"
              ></div>
              <div class="bar-label">{{ formatDayLabel(day.date) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div v-if="showControls" class="counter-controls">
        <button @click="refreshData" class="control-btn">
          <i class="fas fa-sync-alt"></i>
          Refresh
        </button>
        <button 
          v-if="isDevelopment" 
          @click="resetCounter" 
          class="control-btn danger"
        >
          <i class="fas fa-trash"></i>
          Reset
        </button>
      </div>
    </div>

    <!-- Live Update Indicator -->
    <div v-if="showLiveIndicator" class="live-indicator" :class="{ 'active': isLive }">
      <div class="pulse-dot"></div>
      <span>Live</span>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useViewCounter } from '@/composables/useViewCounterDB'

export default {
  name: 'ViewCounter',
  props: {
    compact: {
      type: Boolean,
      default: false
    },
    showControls: {
      type: Boolean,
      default: false
    },
    showLiveIndicator: {
      type: Boolean,
      default: false
    },
    autoRefresh: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const { 
      totalViews, 
      pageViews, 
      uniqueVisitorsCount, 
      todayViews, 
      getAnalytics,
      refreshAnalytics,
      resetViewCounter,
      isLoading,
      error,
      initializeData,
      fetchViewCounterData
    } = useViewCounter()

    const showDetails = ref(false)
    const isLive = ref(false)
    const isDevelopment = computed(() => process.env.NODE_ENV === 'development')
    const forceUpdateKey = ref(0)

    let refreshInterval = null
    let liveIndicatorTimeout = null

    // Analytics data - make it reactive to changes
    const analyticsData = computed(() => getAnalytics())

    // Computed properties
    const recentSessions = computed(() => {
      // Database version doesn't store sessions in the same way
      // This will be empty or we can remove this feature
      return []
    })

    const last7DaysData = computed(() => {
      return analyticsData.value.last7Days
    })

    // Methods
    const formatNumber = (num) => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
      }
      return num.toString()
    }

    const formatTime = (timestamp) => {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) { // Less than 1 minute
        return 'Just now'
      } else if (diff < 3600000) { // Less than 1 hour
        return Math.floor(diff / 60000) + 'm ago'
      } else if (diff < 86400000) { // Less than 1 day
        return Math.floor(diff / 3600000) + 'h ago'
      } else {
        return date.toLocaleDateString()
      }
    }

    const formatDayLabel = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)
    }

    const getPageIcon = (pageName) => {
      const icons = {
        Home: 'fas fa-home',
        About: 'fas fa-user',
        Projects: 'fas fa-code',
        Gallery: 'fas fa-images',
        Contact: 'fas fa-envelope'
      }
      return icons[pageName] || 'fas fa-file'
    }

    const getMostPopularPage = () => {
      let maxCount = 0
      let popularPage = 'Home'
      
      Object.entries(pageViews.value).forEach(([page, count]) => {
        if (count > maxCount) {
          maxCount = count
          popularPage = page
        }
      })
      
      return popularPage
    }

    const getPagePercentage = (count) => {
      const maxCount = Math.max(...Object.values(pageViews.value))
      return maxCount > 0 ? (count / maxCount) * 100 : 0
    }

    const getChartBarHeight = (total) => {
      const maxTotal = Math.max(...last7DaysData.value.map(d => d.total))
      return maxTotal > 0 ? Math.max((total / maxTotal) * 100, 5) : 5
    }

    const toggleDetails = () => {
      showDetails.value = !showDetails.value
    }

    const refreshData = async () => {
      try {
        // Force refresh from database
        await fetchViewCounterData()
        const newData = await refreshAnalytics()
        
        // Force reactivity update
        forceUpdateKey.value++
        
        // Show live indicator
        isLive.value = true
        clearTimeout(liveIndicatorTimeout)
        liveIndicatorTimeout = setTimeout(() => {
          isLive.value = false
        }, 2000)
        
        console.log('Data refreshed successfully:', newData)
      } catch (err) {
        console.warn('Failed to refresh analytics data:', err)
      }
    }

    const resetCounter = () => {
      if (confirm('Are you sure you want to reset all view counter data? This action cannot be undone.')) {
        resetViewCounter()
        refreshData()
      }
    }

    // Lifecycle
    onMounted(async () => {
      // Initialize data first
      try {
        await initializeData()
        await refreshData()
      } catch (err) {
        console.warn('Failed to initialize view counter:', err)
      }
      
      // Auto refresh if enabled (less frequent than global refresh)
      if (props.autoRefresh) {
        refreshInterval = setInterval(refreshData, 60000) // Refresh every 60 seconds
      }

      // Listen for page view events (using updated event name)
      window.addEventListener('viewCountUpdated', refreshData)
    })

    onUnmounted(() => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
      clearTimeout(liveIndicatorTimeout)
      window.removeEventListener('viewCountUpdated', refreshData)
    })

    return {
      // State
      showDetails,
      isLive,
      isDevelopment,
      analyticsData,
      isLoading,
      error,
      forceUpdateKey,
      
      // Computed
      totalViews,
      pageViews,
      uniqueVisitorsCount,
      todayViews,
      recentSessions,
      last7DaysData,
      
      // Methods
      formatNumber,
      formatTime,
      formatDayLabel,
      getPageIcon,
      getMostPopularPage,
      getPagePercentage,
      getChartBarHeight,
      toggleDetails,
      refreshData,
      resetCounter
    }
  }
}
</script>

<style scoped>
.view-counter {
  font-family: 'Poppins', sans-serif;
  position: relative;
}

/* Compact Mode Styles */
.counter-compact {
  display: inline-flex;
  align-items: center;
}

.counter-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-color, #333);
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: default;
}

.counter-badge:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.counter-badge i {
  font-size: 0.9rem;
  opacity: 0.8;
}

.counter-badge .count {
  font-weight: 600;
  color: var(--primary-color, #f97316);
}

.counter-badge .label {
  font-size: 0.8rem;
  opacity: 0.7;
}

/* Loading and Error States */
.counter-badge.loading {
  background: #f59e0b;
  color: white;
}

.counter-badge.loading i {
  animation: spin 1s linear infinite;
}

.counter-badge.error {
  background: #ef4444;
  color: white;
}

.counter-badge.error:hover {
  background: #dc2626;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Detailed Mode Styles */
.counter-detailed {
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color, #e2e8f0);
}

.counter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.counter-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: var(--text-color, #333);
  font-size: 1.25rem;
  font-weight: 600;
}

.toggle-btn {
  background: none;
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  color: var(--text-color, #333);
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: var(--primary-color, #f97316);
  color: white;
  border-color: var(--primary-color, #f97316);
}

/* Stats Overview */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-color, #f8f9fa);
  border-radius: 12px;
  border: 1px solid var(--border-color, #e2e8f0);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-item.primary {
  background: linear-gradient(135deg, var(--primary-color, #f97316) 0%, rgba(249, 115, 22, 0.8) 100%);
  color: white;
  border-color: var(--primary-color, #f97316);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 1.2rem;
}

.stat-item:not(.primary) .stat-icon {
  background: var(--primary-color, #f97316);
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.85rem;
  opacity: 0.8;
  font-weight: 500;
}

/* Details Section */
.stats-details {
  border-top: 1px solid var(--border-color, #e2e8f0);
  padding-top: 24px;
}

.section {
  margin-bottom: 24px;
}

.section:last-child {
  margin-bottom: 0;
}

.section h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  color: var(--text-color, #333);
  font-size: 1rem;
  font-weight: 600;
}

/* Page Stats */
.page-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.page-stat {
  display: grid;
  grid-template-columns: 1fr auto 100px;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-color, #f8f9fa);
  border-radius: 8px;
  border: 1px solid var(--border-color, #e2e8f0);
}

.page-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: var(--text-color, #333);
}

.page-count {
  font-weight: 600;
  color: var(--primary-color, #f97316);
}

.page-bar {
  height: 6px;
  background: var(--border-color, #e2e8f0);
  border-radius: 3px;
  overflow: hidden;
}

.page-bar-fill {
  height: 100%;
  background: var(--primary-color, #f97316);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Recent Activity */
.recent-activity {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: var(--bg-color, #f8f9fa);
  border-radius: 8px;
  border: 1px solid var(--border-color, #e2e8f0);
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--primary-color, #f97316);
  color: white;
  font-size: 0.8rem;
}

.activity-content {
  flex: 1;
}

.activity-page {
  font-weight: 500;
  color: var(--text-color, #333);
  font-size: 0.9rem;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--text-secondary, #666);
}

/* Mini Chart */
.mini-chart {
  display: flex;
  align-items: end;
  gap: 8px;
  height: 60px;
  padding: 8px;
  background: var(--bg-color, #f8f9fa);
  border-radius: 8px;
  border: 1px solid var(--border-color, #e2e8f0);
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  cursor: default;
}

.bar-fill {
  width: 100%;
  background: var(--primary-color, #f97316);
  border-radius: 2px 2px 0 0;
  min-height: 2px;
  transition: height 0.3s ease;
}

.bar-label {
  margin-top: 4px;
  font-size: 0.7rem;
  color: var(--text-secondary, #666);
  font-weight: 500;
}

/* Controls */
.counter-controls {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color, #e2e8f0);
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 8px;
  background: transparent;
  color: var(--text-color, #333);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: var(--primary-color, #f97316);
  color: white;
  border-color: var(--primary-color, #f97316);
}

.control-btn.danger:hover {
  background: #ef4444;
  border-color: #ef4444;
}

/* Live Indicator */
.live-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;
  color: #22c55e;
  font-size: 0.7rem;
  font-weight: 500;
  opacity: 0;
  transition: all 0.3s ease;
}

.live-indicator.active {
  opacity: 1;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}

/* Dark Mode Support */
body.dark-theme .counter-badge {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #e4e4e7;
}

body.dark-theme .counter-badge:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

body.dark-theme .counter-detailed {
  background: #1a1a2e;
  border-color: #374151;
}

body.dark-theme .stat-item {
  background: #2a2a3e;
  border-color: #374151;
}

body.dark-theme .page-stat,
body.dark-theme .activity-item,
body.dark-theme .mini-chart {
  background: #2a2a3e;
  border-color: #374151;
}

body.dark-theme .page-bar {
  background: #374151;
}

/* Responsive Design */
@media (max-width: 768px) {
  .stats-overview {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }
  
  .stat-item {
    padding: 12px;
  }
  
  .stat-number {
    font-size: 1.25rem;
  }
  
  .page-stat {
    grid-template-columns: 1fr auto;
    gap: 8px;
  }
  
  .page-bar {
    grid-column: 1 / -1;
    margin-top: 8px;
  }
  
  .counter-detailed {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .counter-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>

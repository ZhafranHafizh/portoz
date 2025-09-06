<template>
  <div class="analytics-view">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title" :class="{ 'visible': titleVisible }">
          <span class="title-gradient">Analytics Dashboard</span>
        </h1>
        <p class="page-subtitle" :class="{ 'visible': subtitleVisible }">
          Track visitor engagement and view statistics across the portfolio
        </p>
      </div>
    </div>

    <!-- Analytics Content -->
    <div class="analytics-content">
      <!-- Main View Counter Component -->
      <div class="main-analytics">
        <ViewCounter 
          :compact="false" 
          :show-controls="true" 
          :show-live-indicator="true"
          :auto-refresh="true"
        />
      </div>

      <!-- Additional Analytics Cards -->
      <div class="analytics-grid">
        <!-- Quick Stats Card -->
        <div class="analytics-card stats-card">
          <div class="card-header">
            <h3>
              <i class="fas fa-chart-pie"></i>
              Quick Overview
            </h3>
          </div>
          <div class="card-content">
            <div class="quick-stats">
              <div class="quick-stat">
                <div class="stat-value">{{ formatNumber(analytics.total) }}</div>
                <div class="stat-label">Total Views</div>
                <div class="stat-change" :class="getChangeClass(todayGrowth)">
                  <i :class="getChangeIcon(todayGrowth)"></i>
                  {{ Math.abs(todayGrowth) }}% today
                </div>
              </div>
              <div class="quick-stat">
                <div class="stat-value">{{ formatNumber(analytics.uniqueVisitors) }}</div>
                <div class="stat-label">Unique Visitors</div>
                <div class="stat-change positive">
                  <i class="fas fa-user-plus"></i>
                  New visitors
                </div>
              </div>
              <div class="quick-stat">
                <div class="stat-value">{{ getMostViewedPage() }}</div>
                <div class="stat-label">Top Page</div>
                <div class="stat-change neutral">
                  <i class="fas fa-crown"></i>
                  Most popular
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Page Performance Card -->
        <div class="analytics-card performance-card">
          <div class="card-header">
            <h3>
              <i class="fas fa-tachometer-alt"></i>
              Page Performance
            </h3>
          </div>
          <div class="card-content">
            <div class="performance-list">
              <div 
                v-for="(count, page) in analytics.pages" 
                :key="page"
                class="performance-item"
              >
                <div class="page-info">
                  <div class="page-icon">
                    <i :class="getPageIcon(page)"></i>
                  </div>
                  <div class="page-details">
                    <div class="page-name">{{ page }}</div>
                    <div class="page-views">{{ formatNumber(count) }} views</div>
                  </div>
                </div>
                <div class="page-percentage">
                  {{ getPagePercentage(count) }}%
                </div>
                <div class="page-progress">
                  <div 
                    class="progress-bar" 
                    :style="{ width: getPagePercentage(count) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Time-based Analytics Card -->
        <div class="analytics-card timeline-card">
          <div class="card-header">
            <h3>
              <i class="fas fa-clock"></i>
              Timeline Analytics
            </h3>
            <div class="time-filter">
              <button 
                v-for="period in timePeriods" 
                :key="period.value"
                @click="selectedPeriod = period.value"
                :class="['time-btn', { active: selectedPeriod === period.value }]"
              >
                {{ period.label }}
              </button>
            </div>
          </div>
          <div class="card-content">
            <div class="timeline-chart">
              <div class="chart-container">
                <div 
                  v-for="(data, index) in getTimelineData()" 
                  :key="index"
                  class="chart-bar"
                  :title="`${data.date}: ${data.total} views`"
                >
                  <div class="bar-container">
                    <div 
                      class="bar-fill" 
                      :style="{ height: getBarHeight(data.total) + '%' }"
                    ></div>
                  </div>
                  <div class="bar-label">{{ formatDateLabel(data.date) }}</div>
                  <div class="bar-value">{{ data.total }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Visitor Insights Card -->
        <div class="analytics-card insights-card">
          <div class="card-header">
            <h3>
              <i class="fas fa-users"></i>
              Visitor Insights
            </h3>
          </div>
          <div class="card-content">
            <div class="insights-grid">
              <div class="insight-item">
                <div class="insight-icon">
                  <i class="fas fa-calendar-day"></i>
                </div>
                <div class="insight-content">
                  <div class="insight-value">{{ analytics.todayStats.total || 0 }}</div>
                  <div class="insight-label">Today's Views</div>
                </div>
              </div>
              <div class="insight-item">
                <div class="insight-icon">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div class="insight-content">
                  <div class="insight-value">{{ getAverageDaily() }}</div>
                  <div class="insight-label">Daily Average</div>
                </div>
              </div>
              <div class="insight-item">
                <div class="insight-icon">
                  <i class="fas fa-fire"></i>
                </div>
                <div class="insight-content">
                  <div class="insight-value">{{ getPeakDay() }}</div>
                  <div class="insight-label">Peak Day</div>
                </div>
              </div>
              <div class="insight-item">
                <div class="insight-icon">
                  <i class="fas fa-trending-up"></i>
                </div>
                <div class="insight-content">
                  <div class="insight-value">{{ getGrowthRate() }}%</div>
                  <div class="insight-label">Growth Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Export Section -->
      <div class="export-section">
        <div class="analytics-card export-card">
          <div class="card-header">
            <h3>
              <i class="fas fa-download"></i>
              Export Data
            </h3>
          </div>
          <div class="card-content">
            <div class="export-options">
              <button @click="exportData('json')" class="export-btn">
                <i class="fas fa-file-code"></i>
                Export as JSON
              </button>
              <button @click="exportData('csv')" class="export-btn">
                <i class="fas fa-file-csv"></i>
                Export as CSV
              </button>
              <button @click="copyToClipboard" class="export-btn">
                <i class="fas fa-copy"></i>
                Copy Summary
              </button>
            </div>
            <div class="export-info">
              <p>Last updated: {{ lastUpdated }}</p>
              <p>Data retention: 30 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useViewCounter } from '@/composables/useViewCounter'
import ViewCounter from '@/components/ViewCounter.vue'

export default {
  name: 'AnalyticsView',
  components: {
    ViewCounter
  },
  setup() {
    const { getAnalytics } = useViewCounter()
    
    const titleVisible = ref(false)
    const subtitleVisible = ref(false)
    const selectedPeriod = ref('7d')
    
    const timePeriods = [
      { label: '7D', value: '7d' },
      { label: '30D', value: '30d' }
    ]
    
    const analytics = ref(getAnalytics())
    
    // Computed properties
    const todayGrowth = computed(() => {
      const today = analytics.value.todayStats.total || 0
      const yesterday = analytics.value.last7Days[5]?.total || 0
      return yesterday > 0 ? Math.round(((today - yesterday) / yesterday) * 100) : 0
    })
    
    const lastUpdated = computed(() => {
      return new Date().toLocaleString()
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
    
    const getMostViewedPage = () => {
      let maxCount = 0
      let topPage = 'Home'
      
      Object.entries(analytics.value.pages).forEach(([page, count]) => {
        if (count > maxCount) {
          maxCount = count
          topPage = page
        }
      })
      
      return topPage
    }
    
    const getPagePercentage = (count) => {
      const total = analytics.value.total
      return total > 0 ? Math.round((count / total) * 100) : 0
    }
    
    const getChangeClass = (change) => {
      if (change > 0) return 'positive'
      if (change < 0) return 'negative'
      return 'neutral'
    }
    
    const getChangeIcon = (change) => {
      if (change > 0) return 'fas fa-arrow-up'
      if (change < 0) return 'fas fa-arrow-down'
      return 'fas fa-minus'
    }
    
    const getTimelineData = () => {
      return selectedPeriod.value === '7d' ? analytics.value.last7Days : analytics.value.last30Days
    }
    
    const getBarHeight = (total) => {
      const data = getTimelineData()
      const maxTotal = Math.max(...data.map(d => d.total))
      return maxTotal > 0 ? Math.max((total / maxTotal) * 100, 2) : 2
    }
    
    const formatDateLabel = (dateString) => {
      const date = new Date(dateString)
      if (selectedPeriod.value === '7d') {
        return date.toLocaleDateString('en-US', { weekday: 'short' })
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
    }
    
    const getAverageDaily = () => {
      const data = getTimelineData()
      const total = data.reduce((sum, day) => sum + day.total, 0)
      return Math.round(total / data.length)
    }
    
    const getPeakDay = () => {
      const data = getTimelineData()
      const peak = data.reduce((max, day) => day.total > max.total ? day : max, data[0])
      return formatDateLabel(peak.date)
    }
    
    const getGrowthRate = () => {
      const data = getTimelineData()
      if (data.length < 2) return 0
      
      const recent = data.slice(-3).reduce((sum, day) => sum + day.total, 0) / 3
      const earlier = data.slice(0, 3).reduce((sum, day) => sum + day.total, 0) / 3
      
      return earlier > 0 ? Math.round(((recent - earlier) / earlier) * 100) : 0
    }
    
    const exportData = (format) => {
      const data = analytics.value
      
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        downloadBlob(blob, 'portfolio-analytics.json')
      } else if (format === 'csv') {
        const csv = convertToCSV(data)
        const blob = new Blob([csv], { type: 'text/csv' })
        downloadBlob(blob, 'portfolio-analytics.csv')
      }
    }
    
    const convertToCSV = (data) => {
      const headers = ['Date', 'Total Views', 'Unique Visitors']
      const rows = data.last30Days.map(day => [
        day.date,
        day.total,
        day.unique
      ])
      
      return [headers, ...rows].map(row => row.join(',')).join('\n')
    }
    
    const downloadBlob = (blob, filename) => {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }
    
    const copyToClipboard = async () => {
      const summary = `Portfolio Analytics Summary
Total Views: ${analytics.value.total}
Unique Visitors: ${analytics.value.uniqueVisitors}
Today's Views: ${analytics.value.todayStats.total || 0}
Most Popular Page: ${getMostViewedPage()}
Generated: ${new Date().toLocaleString()}`
      
      try {
        await navigator.clipboard.writeText(summary)
        alert('Analytics summary copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy: ', err)
      }
    }
    
    // Lifecycle
    onMounted(() => {
      setTimeout(() => titleVisible.value = true, 200)
      setTimeout(() => subtitleVisible.value = true, 400)
      
      // Refresh analytics data
      analytics.value = getAnalytics()
    })
    
    return {
      titleVisible,
      subtitleVisible,
      selectedPeriod,
      timePeriods,
      analytics,
      todayGrowth,
      lastUpdated,
      formatNumber,
      getPageIcon,
      getMostViewedPage,
      getPagePercentage,
      getChangeClass,
      getChangeIcon,
      getTimelineData,
      getBarHeight,
      formatDateLabel,
      getAverageDaily,
      getPeakDay,
      getGrowthRate,
      exportData,
      copyToClipboard
    }
  }
}
</script>

<style scoped>
.analytics-view {
  min-height: 100vh;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #333333);
}

/* Header Section */
.header-section {
  padding: 80px 2rem 60px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 20px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-title.visible {
  opacity: 1;
  transform: translateY(0);
}

.title-gradient {
  background: linear-gradient(135deg, #ffffff 0%, #e8f4fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.9;
  font-weight: 400;
  line-height: 1.6;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.page-subtitle.visible {
  opacity: 0.9;
  transform: translateY(0);
}

/* Analytics Content */
.analytics-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 20px;
}

.main-analytics {
  margin-bottom: 40px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

/* Analytics Cards */
.analytics-card {
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color, #e2e8f0);
  transition: all 0.3s ease;
}

.analytics-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: var(--text-color, #333);
  font-size: 1.25rem;
  font-weight: 600;
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.quick-stat {
  text-align: center;
  padding: 16px;
  background: var(--bg-color, #f8f9fa);
  border-radius: 12px;
  border: 1px solid var(--border-color, #e2e8f0);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color, #667eea);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary, #666);
  margin-bottom: 8px;
}

.stat-change {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #22c55e;
}

.stat-change.negative {
  color: #ef4444;
}

.stat-change.neutral {
  color: var(--text-secondary, #666);
}

/* Performance List */
.performance-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.performance-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bg-color, #f8f9fa);
  border-radius: 12px;
  border: 1px solid var(--border-color, #e2e8f0);
}

.page-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--primary-color, #667eea);
  color: white;
}

.page-name {
  font-weight: 600;
  color: var(--text-color, #333);
}

.page-views {
  font-size: 0.85rem;
  color: var(--text-secondary, #666);
}

.page-percentage {
  font-weight: 600;
  color: var(--primary-color, #667eea);
  font-size: 0.9rem;
}

.page-progress {
  width: 80px;
  height: 6px;
  background: var(--border-color, #e2e8f0);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--primary-color, #667eea);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Time Filter */
.time-filter {
  display: flex;
  gap: 4px;
  background: var(--bg-color, #f8f9fa);
  border-radius: 8px;
  padding: 4px;
  border: 1px solid var(--border-color, #e2e8f0);
}

.time-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-color, #333);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-btn.active {
  background: var(--primary-color, #667eea);
  color: white;
}

/* Timeline Chart */
.timeline-chart {
  height: 200px;
}

.chart-container {
  display: flex;
  align-items: end;
  gap: 8px;
  height: 100%;
  padding: 20px 0;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.bar-container {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: end;
  margin-bottom: 8px;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(to top, var(--primary-color, #667eea), rgba(102, 126, 234, 0.6));
  border-radius: 3px 3px 0 0;
  min-height: 4px;
  transition: height 0.3s ease;
}

.bar-label {
  font-size: 0.75rem;
  color: var(--text-secondary, #666);
  margin-bottom: 4px;
}

.bar-value {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-color, #333);
}

/* Insights Grid */
.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.insight-item {
  text-align: center;
  padding: 16px;
  background: var(--bg-color, #f8f9fa);
  border-radius: 12px;
  border: 1px solid var(--border-color, #e2e8f0);
}

.insight-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--primary-color, #667eea);
  color: white;
  margin: 0 auto 12px;
  font-size: 1.1rem;
}

.insight-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color, #333);
  margin-bottom: 4px;
}

.insight-label {
  font-size: 0.8rem;
  color: var(--text-secondary, #666);
}

/* Export Section */
.export-section {
  margin-top: 40px;
}

.export-options {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 8px;
  background: var(--bg-color, #f8f9fa);
  color: var(--text-color, #333);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.export-btn:hover {
  background: var(--primary-color, #667eea);
  color: white;
  border-color: var(--primary-color, #667eea);
}

.export-info {
  color: var(--text-secondary, #666);
  font-size: 0.85rem;
}

.export-info p {
  margin: 4px 0;
}

/* Dark Mode Support */
body.dark-theme .header-section {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

body.dark-theme .analytics-card {
  background: #1a1a2e;
  border-color: #374151;
}

body.dark-theme .quick-stat,
body.dark-theme .performance-item,
body.dark-theme .insight-item {
  background: #2a2a3e;
  border-color: #374151;
}

body.dark-theme .time-filter {
  background: #2a2a3e;
  border-color: #374151;
}

body.dark-theme .export-btn {
  background: #2a2a3e;
  border-color: #374151;
  color: #e4e4e7;
}

/* Responsive Design */
@media (max-width: 768px) {
  .analytics-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .quick-stats {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .insights-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .export-options {
    flex-direction: column;
  }
  
  .chart-container {
    padding: 10px 0;
  }
  
  .page-title {
    font-size: 2.2rem;
  }
  
  .page-subtitle {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .analytics-content {
    padding: 40px 15px;
  }
  
  .analytics-card {
    padding: 16px;
  }
  
  .performance-item {
    grid-template-columns: 1fr;
    gap: 12px;
    text-align: center;
  }
  
  .page-progress {
    width: 100%;
    margin-top: 8px;
  }
  
  .insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>

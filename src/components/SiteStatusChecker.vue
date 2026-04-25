<template>
  <div v-if="showMaintenanceOverlay" class="maintenance-overlay">
    <div class="maintenance-modal">
      <div class="maintenance-icon">
        <i class="fas fa-tools fa-spin"></i>
      </div>
      <h1>Website Under Development</h1>
      <p class="maintenance-message">{{ maintenanceMessage }}</p>
      <div class="maintenance-details">
        <p>I'm currently building and improving this portfolio. Thank you for your patience!</p>
        <p class="check-back">Please check back soon for amazing updates. 🚀</p>
      </div>
      <div class="maintenance-footer">
        <p class="estimated-time">
          <i class="fas fa-clock"></i>
          Last updated: {{ lastUpdated }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/config/supabaseClient';

export default {
  name: 'SiteStatusChecker',
  props: {
    currentRoute: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isPublic: true,
      maintenanceMessage: 'Website is currently under development. Please check back soon!',
      lastUpdated: 'Loading...',
      loaded: false
    };
  },
  computed: {
    showMaintenanceOverlay() {
      // Don't show overlay on admin page
      if (this.currentRoute === '/admin') {
        return false;
      }
      // Only show if site is not public
      return !this.isPublic;
    }
  },
  async mounted() {
    await this.checkSiteStatus();
    // Check every 30 seconds in case admin changes it
    setInterval(this.checkSiteStatus, 30000);
  },
  methods: {
    async checkSiteStatus() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('key', 'site_status')
          .single();

        if (error) {
          console.error('Error fetching site status:', error);
          // Default to public if error
          this.isPublic = true;
          return;
        }

        if (data && data.value) {
          this.isPublic = data.value.is_public ?? true;
          this.maintenanceMessage = data.value.maintenance_message || 'Website is currently under development. Please check back soon!';
          this.lastUpdated = new Date(data.updated_at).toLocaleString();
        }
      } catch (error) {
        console.error('Error:', error);
        this.isPublic = true;
      }
      this.loaded = true;
    }
  }
};
</script>

<style scoped>
.maintenance-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--accent-hover) 72%, white) 0%,
    color-mix(in srgb, var(--accent-strong) 78%, #d8cec1) 100%
  );
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: gradientShift 15s ease infinite;
  background-size: 200% 200%;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.maintenance-modal {
  background: var(--background);
  border-radius: 20px;
  padding: 60px 40px;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-md);
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.maintenance-icon {
  margin-bottom: 30px;
}

.maintenance-icon i {
  font-size: 80px;
  color: var(--accent);
  animation: spin 4s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.maintenance-modal h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 20px 0;
  line-height: 1.2;
}

.maintenance-message {
  font-size: 1.2rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 30px 0;
}

.maintenance-details {
  background: var(--surface);
  border-radius: 12px;
  padding: 24px;
  margin: 0 0 30px 0;
}

.maintenance-details p {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.maintenance-details p:last-child {
  margin-bottom: 0;
}

.check-back {
  font-weight: 600;
  color: var(--accent) !important;
}

.maintenance-footer {
  border-top: 1px solid var(--border-subtle);
  padding-top: 20px;
}

.estimated-time {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.estimated-time i {
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .maintenance-modal {
    padding: 40px 24px;
  }

  .maintenance-modal h1 {
    font-size: 1.8rem;
  }

  .maintenance-message {
    font-size: 1rem;
  }

  .maintenance-icon i {
    font-size: 60px;
  }
}

@media (max-width: 480px) {
  .maintenance-modal {
    padding: 30px 20px;
  }

  .maintenance-modal h1 {
    font-size: 1.5rem;
  }

  .maintenance-message {
    font-size: 0.9rem;
  }

  .maintenance-icon i {
    font-size: 50px;
  }

  .maintenance-details {
    padding: 16px;
  }
}
</style>

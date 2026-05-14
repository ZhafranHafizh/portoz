<template>
  <div class="visitor-heatmap">
    <div class="heatmap-header">
      <h3><i class="fas fa-map-marked-alt"></i> Visitor Heatmap</h3>
      <div class="heatmap-stats">
        <span class="heatmap-badge">{{ validPoints.length }} locations tracked</span>
      </div>
    </div>
    <div ref="mapContainer" class="map-container"></div>
    <div v-if="!validPoints.length" class="map-empty-state">
      <i class="fas fa-globe-asia"></i>
      <p>No geolocation data available yet. Visitor locations will appear here as traffic comes in.</p>
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

export default {
  name: 'VisitorHeatmap',
  props: {
    events: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      map: null,
      heatLayer: null
    };
  },
  computed: {
    validPoints() {
      // Filter events that have valid lat/lng, aggregate by location
      const pointMap = {};
      this.events.forEach(event => {
        const lat = parseFloat(event.latitude);
        const lng = parseFloat(event.longitude);
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
          if (!pointMap[key]) {
            pointMap[key] = { lat, lng, intensity: 0 };
          }
          pointMap[key].intensity++;
        }
      });
      return Object.values(pointMap);
    },
    heatData() {
      // Format: [lat, lng, intensity]
      return this.validPoints.map(p => [p.lat, p.lng, p.intensity]);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap();
    });
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  },
  watch: {
    events: {
      handler() {
        this.updateHeatmap();
      },
      deep: true
    }
  },
  methods: {
    initMap() {
      if (!this.$refs.mapContainer) return;

      // Initialize map centered on a world view
      this.map = L.map(this.$refs.mapContainer, {
        center: [0, 20],
        zoom: 2,
        minZoom: 2,
        maxZoom: 12,
        scrollWheelZoom: true,
        zoomControl: true
      });

      // Use CartoDB dark tile layer for a clean look
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(this.map);

      // Add heatmap layer
      this.heatLayer = L.heatLayer(this.heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 10,
        max: Math.max(...this.validPoints.map(p => p.intensity), 1),
        gradient: {
          0.2: '#2563eb',
          0.4: '#06b6d4',
          0.6: '#10b981',
          0.8: '#f59e0b',
          1.0: '#ef4444'
        }
      }).addTo(this.map);

      // Fit bounds if we have data
      if (this.validPoints.length > 0) {
        const bounds = L.latLngBounds(this.validPoints.map(p => [p.lat, p.lng]));
        this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
      }
    },
    updateHeatmap() {
      if (!this.map || !this.heatLayer) return;

      this.heatLayer.setLatLngs(this.heatData);

      if (this.validPoints.length > 0) {
        this.heatLayer.setOptions({
          max: Math.max(...this.validPoints.map(p => p.intensity), 1)
        });
      }
    }
  }
};
</script>

<style scoped>
.visitor-heatmap {
  position: relative;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.heatmap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.heatmap-header h3 {
  margin: 0;
  font-size: 18px;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
}

.heatmap-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 20px;
  border: 1px solid #bfdbfe;
}

.map-container {
  width: 100%;
  height: 420px;
  z-index: 1;
}

.map-empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #6b7280;
  z-index: 2;
  pointer-events: none;
}

.map-empty-state i {
  font-size: 48px;
  margin-bottom: 12px;
  color: #d1d5db;
}

.map-empty-state p {
  margin: 0;
  font-size: 14px;
  max-width: 300px;
}
</style>

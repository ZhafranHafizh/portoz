import { supabase } from '@/config/supabaseClient';

class AnalyticsService {
  constructor() {
    this.locationData = null;
    this.isFetchingLocation = false;
  }

  async getLocationData() {
    // Return cached data if available
    if (this.locationData) return this.locationData;
    
    // Check session storage
    const cached = sessionStorage.getItem('portoz_location_data');
    if (cached) {
      try {
        this.locationData = JSON.parse(cached);
        return this.locationData;
      } catch (e) {
        console.error('Error parsing cached location data', e);
      }
    }

    if (this.isFetchingLocation) {
      // If already fetching, just return null for now to prevent duplicate calls
      // Alternatively, could return a Promise that resolves when fetching is done
      return null;
    }

    this.isFetchingLocation = true;
    try {
      // Using geojs.io which is free, has no auth, and supports CORS
      const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
      if (response.ok) {
        const data = await response.json();
        this.locationData = {
          city: data.city,
          region: data.region,
          country: data.country,
          ip_address: data.ip,
          latitude: data.latitude ? parseFloat(data.latitude) : null,
          longitude: data.longitude ? parseFloat(data.longitude) : null
        };
        sessionStorage.setItem('portoz_location_data', JSON.stringify(this.locationData));
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    } finally {
      this.isFetchingLocation = false;
    }

    return this.locationData || {};
  }

  async trackEvent(eventType, pageUrl, elementId = null) {
    try {
      const location = await this.getLocationData();
      
      const event = {
        event_type: eventType,
        page_url: pageUrl,
        element_id: elementId,
        city: location?.city || null,
        region: location?.region || null,
        country: location?.country || null,
        ip_address: location?.ip_address || null,
        latitude: location?.latitude || null,
        longitude: location?.longitude || null,
        user_agent: navigator.userAgent
      };

      const { error } = await supabase
        .from('analytics_events')
        .insert([event]);

      if (error) {
        console.error('Error logging analytics event:', error);
      }
    } catch (err) {
      console.error('Analytics tracking failed:', err);
    }
  }

  trackPageView(pageUrl) {
    // Ensure it runs completely async without blocking navigation
    setTimeout(() => {
      this.trackEvent('page_view', pageUrl);
    }, 0);
  }

  trackClick(elementId) {
    const pageUrl = window.location.pathname;
    setTimeout(() => {
      this.trackEvent('click', pageUrl, elementId);
    }, 0);
  }
}

export const analytics = new AnalyticsService();

<template>
  <nav class="navbar">
    <div class="brand">
      <router-link to="/">Porto<strong>Z</strong></router-link>
    </div>
    <button class="hamburger" @click="toggleMenu" :aria-expanded="menuOpen.toString()" aria-label="Toggle navigation">
      <span :class="{ 'open': menuOpen }"></span>
      <span :class="{ 'open': menuOpen }"></span>
      <span :class="{ 'open': menuOpen }"></span>
    </button>
    <ul class="nav-links" :class="{ 'open': menuOpen }">
      <li><router-link to="/" @click="closeMenu">Home</router-link></li>
      <li><router-link to="/about" @click="closeMenu">About Me</router-link></li>
      <li><router-link to="/projects" @click="closeMenu">Project</router-link></li>
      <li><router-link to="/gallery" @click="closeMenu">Gallery</router-link></li>
      <!-- <li><router-link to="/analytics" @click="closeMenu">Analytics</router-link></li> -->
      <li><router-link to="/contact" @click="closeMenu">Contact</router-link></li>
      <!-- View mode toggle inside mobile menu -->
      <li class="mobile-view-toggle">
        <ViewModeToggle />
      </li>
    </ul>
    <div class="nav-actions">
      <!-- <ViewCounter :compact="true" /> -->
      <div class="desktop-view-toggle" ref="desktopToggle">
        <ViewModeToggle />
      </div>
      <DarkModeToggle />
    </div>
    
    <!-- One-time tooltip for new feature -->
    <Transition name="tooltip-fade">
      <div v-if="showTooltip" class="feature-tooltip" :class="{ 'mobile': isMobile }">
        <div class="tooltip-arrow"></div>
        <div class="tooltip-content">
          <div class="tooltip-icon">
            <i class="fas fa-sparkles"></i>
          </div>
          <div class="tooltip-text">
            <strong> New! One Page View</strong>
            <p v-if="!isMobile">Use this toggle to switch between <b>Tab</b> and <b>One Page</b> view mode.</p>
            <p v-else>Open the <b>menu ☰</b> to find the view mode toggle and try <b>One Page</b> view!</p>
          </div>
          <button class="tooltip-close" @click="dismissTooltip" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="tooltip-progress">
          <div class="tooltip-progress-bar" :style="{ animationDuration: tooltipDuration + 'ms' }"></div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script>
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import ViewModeToggle from '@/components/ViewModeToggle.vue'
// import ViewCounter from '@/components/ViewCounter.vue'  // Disabled view counter

export default {
  name: 'TheNavbar',
  components: {
    DarkModeToggle,
    ViewModeToggle
    // ViewCounter  // Disabled view counter
  },
  data() {
    return {
      menuOpen: false,
      showTooltip: false,
      isMobile: false,
      tooltipDuration: 8000,
      tooltipTimer: null
    }
  },
  mounted() {
    // Close menu when clicking outside
    document.addEventListener('click', this.handleClickOutside);
    // Close menu on route change
    this.$router.afterEach(() => {
      this.closeMenu();
    });
    
    // Check and show tooltip for new feature
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    this.maybeShowTooltip();
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('resize', this.checkMobile);
    if (this.tooltipTimer) clearTimeout(this.tooltipTimer);
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
      // Prevent body scroll when menu is open on mobile
      if (this.menuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },
    closeMenu() {
      this.menuOpen = false;
      document.body.style.overflow = '';
    },
    handleClickOutside(event) {
      // Close menu if clicking outside of navbar on mobile
      if (window.innerWidth <= 768 && this.menuOpen) {
        const navbar = this.$el;
        if (navbar && !navbar.contains(event.target)) {
          this.closeMenu();
        }
      }
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    maybeShowTooltip() {
      const shown = localStorage.getItem('portoz_onepage_tooltip_shown');
      if (!shown) {
        // Show tooltip after a brief delay for a natural feel
        setTimeout(() => {
          this.showTooltip = true;
          // Auto-dismiss after duration
          this.tooltipTimer = setTimeout(() => {
            this.dismissTooltip();
          }, this.tooltipDuration);
        }, 1500);
      }
    },
    dismissTooltip() {
      this.showTooltip = false;
      localStorage.setItem('portoz_onepage_tooltip_shown', 'true');
      if (this.tooltipTimer) {
        clearTimeout(this.tooltipTimer);
        this.tooltipTimer = null;
      }
    }
  }
}
</script>

<style scoped>
/* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap'); */

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 1rem 3rem;
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
}

/* Dark mode styles */
.dark-theme .navbar {
  background-color: #1c1917;
  color: #e4e4e7;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.brand a {
  color: #333;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.6rem;
  transition: color 0.3s ease;
}

.dark-theme .brand a {
  color: #e4e4e7;
}

.brand a strong {
  font-weight: 400;
  color: #f97316;
}

.dark-theme .brand a strong {
  color: #fb923c;
}

.brand a:hover {
  color: #f97316;
}

.dark-theme .brand a:hover {
  color: #fb923c;
}

.nav-links {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 20px;
}

/* Hide mobile toggle on desktop, show desktop toggle */
.mobile-view-toggle {
  display: none;
}

.desktop-view-toggle {
  display: flex;
}

.nav-links li {
  margin-left: 30px; /* Jarak antar link lebih besar */
}

.nav-links a {
  color: #555;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  padding: 5px 0;
  position: relative;
  transition: color 0.3s ease;
}

.dark-theme .nav-links a {
  color: #a1a1aa;
}

/* Garis bawah untuk hover dan active */
.nav-links a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 50%;
  background-color: #f97316;
  transition: all 0.3s ease-in-out;
  transform: translateX(-50%);
}

.dark-theme .nav-links a::after {
  background-color: #fb923c;
}

.nav-links a:hover,
.nav-links a.router-link-exact-active {
  color: #f97316;
}

.dark-theme .nav-links a:hover,
.dark-theme .nav-links a.router-link-exact-active {
  color: #fb923c;
}

.nav-links a:hover::after,
.nav-links a.router-link-exact-active::after {
  width: 100%; /* Garis bawah muncul penuh */
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1200;
  margin-left: 10px;
}
.hamburger span {
  display: block;
  width: 26px;
  height: 3px;
  margin: 4px 0;
  background: #333;
  border-radius: 2px;
  transition: all 0.3s;
}
.dark-theme .hamburger span {
  background: #e4e4e7;
}
.hamburger span.open:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.hamburger span.open:nth-child(2) {
  opacity: 0;
}
.hamburger span.open:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

@media (max-width: 900px) {
  .navbar {
    padding: 1rem 1.2rem;
  }
  .brand a {
    font-size: 1.2rem;
  }
}
@media (max-width: 768px) {
  .navbar {
    padding: 0.7rem 0.5rem;
  }
  .brand a {
    font-size: 1.1rem;
  }
  .nav-actions {
    margin-left: 0;
  }
  /* Hide desktop toggle, show mobile toggle in menu */
  .desktop-view-toggle {
    display: none;
  }
  .mobile-view-toggle {
    display: flex;
    justify-content: center;
    margin-top: 8px;
    padding-top: 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
  }
  .dark-theme .mobile-view-toggle {
    border-top-color: rgba(255, 255, 255, 0.08);
  }
  .hamburger {
    display: flex;
  }
  .nav-links {
    position: fixed;
    top: 60px;
    right: 0;
    left: 0;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 0;
    padding: 2rem 0 3rem 0;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    z-index: 1100;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .dark-theme .nav-links {
    background: rgba(28, 25, 23, 0.98);
  }
  .nav-links.open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  .nav-links li {
    margin: 0.8rem 0;
    transform: translateY(20px);
    opacity: 0;
    animation: none;
  }
  .nav-links.open li {
    animation: slideInUp 0.4s ease forwards;
  }
  .nav-links.open li:nth-child(1) { animation-delay: 0.1s; }
  .nav-links.open li:nth-child(2) { animation-delay: 0.15s; }
  .nav-links.open li:nth-child(3) { animation-delay: 0.2s; }
  .nav-links.open li:nth-child(4) { animation-delay: 0.25s; }
  .nav-links.open li:nth-child(5) { animation-delay: 0.3s; }
  .nav-links a {
    font-size: 1.2rem;
    padding: 15px 30px;
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  .nav-links a:hover {
    background: rgba(249, 115, 22, 0.1);
    transform: translateY(-2px);
  }
  .dark-theme .nav-links a:hover {
    background: rgba(251, 146, 60, 0.1);
  }
}
@media (max-width: 480px) {
  .navbar {
    padding: 0.5rem 0.2rem;
  }
  .brand a {
    font-size: 1rem;
  }
  .nav-links {
    top: 48px;
    padding: 1.5rem 0 2rem 0;
  }
  .nav-links a {
    font-size: 1.1rem;
    padding: 12px 25px;
  }
}

/* Animation keyframes */
@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Improve hamburger animation */
.hamburger span {
  transform-origin: center;
}

/* Add subtle hover effect to brand */
.brand a {
  transition: all 0.3s ease;
}

.brand a:hover {
  transform: translateY(-1px);
}

/* ============ Feature Tooltip ============ */
.feature-tooltip {
  position: absolute;
  top: calc(100% + 12px);
  right: 60px;
  z-index: 2000;
  width: 320px;
  background: linear-gradient(135deg, #fff9f0, #ffffff);
  border-radius: 14px;
  box-shadow: 
    0 8px 32px rgba(249, 115, 22, 0.15),
    0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(249, 115, 22, 0.2);
  overflow: hidden;
  animation: tooltipBounce 0.5s ease;
}

.dark-theme .feature-tooltip {
  background: linear-gradient(135deg, #292524, #1c1917);
  border-color: rgba(251, 146, 60, 0.3);
  box-shadow:
    0 8px 32px rgba(251, 146, 60, 0.15),
    0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Arrow pointing up toward the toggle */
.tooltip-arrow {
  position: absolute;
  top: -8px;
  right: 40px;
  width: 16px;
  height: 16px;
  background: #fff9f0;
  border: 1px solid rgba(249, 115, 22, 0.2);
  border-bottom: none;
  border-right: none;
  transform: rotate(45deg);
}

.dark-theme .tooltip-arrow {
  background: #292524;
  border-color: rgba(251, 146, 60, 0.3);
}

.tooltip-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 16px 12px;
  position: relative;
}

.tooltip-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  animation: iconPulse 2s ease-in-out infinite;
}

.tooltip-text {
  flex: 1;
}

.tooltip-text strong {
  display: block;
  font-size: 0.9rem;
  color: #1c1917;
  margin-bottom: 4px;
}

.dark-theme .tooltip-text strong {
  color: #fef3c7;
}

.tooltip-text p {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.dark-theme .tooltip-text p {
  color: #9ca3af;
}

.tooltip-text b {
  color: #f97316;
  font-weight: 700;
}

.dark-theme .tooltip-text b {
  color: #fb923c;
}

.tooltip-close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.06);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 0.7rem;
  transition: all 0.2s ease;
}

.dark-theme .tooltip-close {
  background: rgba(255, 255, 255, 0.08);
  color: #6b7280;
}

.tooltip-close:hover {
  background: rgba(249, 115, 22, 0.15);
  color: #f97316;
  transform: scale(1.1);
}

/* Progress bar */
.tooltip-progress {
  height: 3px;
  background: rgba(249, 115, 22, 0.1);
}

.dark-theme .tooltip-progress {
  background: rgba(251, 146, 60, 0.1);
}

.tooltip-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #f97316, #f59e0b);
  border-radius: 0 3px 3px 0;
  animation: progressShrink linear forwards;
  width: 100%;
}

.dark-theme .tooltip-progress-bar {
  background: linear-gradient(90deg, #fb923c, #fbbf24);
}

/* Mobile positioning */
.feature-tooltip.mobile {
  right: 10px;
  left: 10px;
  width: auto;
}

.feature-tooltip.mobile .tooltip-arrow {
  right: auto;
  left: 50px;
}

/* Transition */
.tooltip-fade-enter-active {
  animation: tooltipBounce 0.4s ease;
}

.tooltip-fade-leave-active {
  transition: all 0.3s ease;
}

.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Keyframes */
@keyframes tooltipBounce {
  0% {
    opacity: 0;
    transform: translateY(-12px);
  }
  60% {
    transform: translateY(3px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

@keyframes progressShrink {
  from { width: 100%; }
  to { width: 0%; }
}
</style>
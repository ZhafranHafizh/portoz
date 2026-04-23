<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <!-- Modal Header -->
      <div class="modal-header">
        <button class="close-btn" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="modal-content">
        <div class="modal-header-section">
          <div class="modal-meta">
            <div class="modal-categories">
              <span 
                v-for="category in getProjectCategories(project)" 
                :key="category"
                class="modal-category"
              >
                {{ category }}
              </span>
            </div>
            <h1 class="modal-title">{{ project.title }}</h1>
          </div>
        </div>

        <div class="modal-details">
          <div class="detail-section">
            <h3 class="section-title">About This Project</h3>
            <p class="modal-description">{{ project.description }}</p>
          </div>

          <!-- Image Gallery Section (Tokopedia-style) -->
          <div class="detail-section modal-image-section" v-if="allImages.length > 0">
            <div class="modal-gallery-container" @mouseenter="onGalleryMouseEnter" @mouseleave="onGalleryMouseLeave">
              <!-- Main Image -->
              <div class="gallery-main">
                <div class="gallery-main-wrapper">
                  <transition :name="slideDirection" mode="out-in">
                    <img 
                      :key="activeImageIndex"
                      :src="allImages[activeImageIndex]" 
                      :alt="project.title + ' - Image ' + (activeImageIndex + 1)" 
                      class="gallery-main-img"
                      @click="openLightbox"
                    />
                  </transition>
                </div>
                <!-- Navigation Arrows -->
                <button v-if="allImages.length > 1" class="gallery-nav gallery-nav-prev" @click="prevImage">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <button v-if="allImages.length > 1" class="gallery-nav gallery-nav-next" @click="nextImage">
                  <i class="fas fa-chevron-right"></i>
                </button>
                <!-- Counter -->
                <div v-if="allImages.length > 1" class="gallery-counter">
                  {{ activeImageIndex + 1 }} / {{ allImages.length }}
                </div>
              </div>

              <!-- Thumbnail Strip -->
              <div v-if="allImages.length > 1" class="gallery-thumbs">
                <div class="gallery-thumbs-track">
                  <button
                    v-for="(img, idx) in allImages"
                    :key="idx"
                    :class="['gallery-thumb', { active: idx === activeImageIndex }]"
                    @click="activeImageIndex = idx"
                  >
                    <img :src="img" :alt="'Thumbnail ' + (idx + 1)" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Single image fallback -->
          <div v-else-if="project.imageUrl" class="detail-section modal-image-section">
            <img :src="project.imageUrl" :alt="project.title" class="modal-image" />
          </div>

          <div class="detail-section">
            <h3 class="section-title">Technologies Used</h3>
            <div class="tech-stack">
              <span v-for="tag in project.tags" :key="tag" class="tech-tag">
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="detail-section" v-if="project.features">
            <h3 class="section-title">Key Features</h3>
            <ul class="features-list">
              <li v-for="feature in project.features" :key="feature">
                <i class="fas fa-check-circle"></i>
                {{ feature }}
              </li>
            </ul>
          </div>

          <div class="detail-section" v-if="project.challenges">
            <h3 class="section-title">Challenges & Solutions</h3>
            <p class="challenges-text">{{ project.challenges }}</p>
          </div>

          <div class="detail-section" v-if="project.duration || project.team">
            <h3 class="section-title">Project Info</h3>
            <div class="project-info-grid">
              <div v-if="project.duration" class="info-item">
                <i class="fas fa-clock"></i>
                <span class="info-label">Duration</span>
                <span class="info-value">{{ project.duration }}</span>
              </div>
              <div v-if="project.team" class="info-item">
                <i class="fas fa-users"></i>
                <span class="info-label">Team Size</span>
                <span class="info-value">{{ project.team }}</span>
              </div>
              <div v-if="project.role" class="info-item">
                <i class="fas fa-user-tag"></i>
                <span class="info-label">My Role</span>
                <span class="info-value">{{ project.role }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="modal-actions">
            <a 
              v-if="project.link && project.link !== '#'" 
              :href="project.link" 
              target="_blank" 
              rel="noopener noreferrer"
              class="action-btn primary"
              @click="trackClick('project_live', project.title)"
            >
              <i class="fas fa-external-link-alt"></i>
              View Live Project
            </a>
            <a 
              v-if="project.github" 
              :href="project.github" 
              target="_blank" 
              rel="noopener noreferrer"
              class="action-btn secondary"
              @click="trackClick('project_github', project.title)"
            >
              <i class="fab fa-github"></i>
              View Repository
            </a>
            <a 
              v-if="project.figma" 
              :href="project.figma" 
              target="_blank" 
              rel="noopener noreferrer"
              class="action-btn figma"
              @click="trackClick('project_figma', project.title)"
            >
              <i class="fab fa-figma"></i>
              View Design
            </a>
            <button v-if="project.case_study" @click="openCaseStudy" class="action-btn tertiary">
              <i class="fas fa-file-alt"></i>
              Read Case Study
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div v-if="lightboxOpen" class="lightbox-overlay" @click="closeLightbox">
      <button class="lightbox-close" @click="closeLightbox">
        <i class="fas fa-times"></i>
      </button>
      <img :src="allImages[activeImageIndex]" class="lightbox-img" @click.stop />
      <button v-if="allImages.length > 1" class="lightbox-nav lightbox-prev" @click.stop="prevImage">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button v-if="allImages.length > 1" class="lightbox-nav lightbox-next" @click.stop="nextImage">
        <i class="fas fa-chevron-right"></i>
      </button>
      <div v-if="allImages.length > 1" class="lightbox-counter">
        {{ activeImageIndex + 1 }} / {{ allImages.length }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    project: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['close'],
  data() {
    return {
      activeImageIndex: 0,
      lightboxOpen: false,
      autoSlideTimer: null,
      isGalleryHovered: false,
      slideDirection: 'slide-right'
    };
  },
  computed: {
    allImages() {
      const imgs = [];
      // Main image first
      if (this.project.imageUrl) {
        imgs.push(this.project.imageUrl);
      }
      // Then additional images from the images array
      if (Array.isArray(this.project.images)) {
        this.project.images.forEach(url => {
          if (url && !imgs.includes(url)) {
            imgs.push(url);
          }
        });
      }
      return imgs;
    }
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeydown);
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
    }
  },
  unmounted() {
    document.removeEventListener('keydown', this.handleKeydown);
    document.body.style.overflow = '';
    this.stopAutoSlide();
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
        this.activeImageIndex = 0;
        this.lightboxOpen = false;
        this.startAutoSlide();
      } else {
        document.body.style.overflow = '';
        this.stopAutoSlide();
      }
    },
    lightboxOpen(val) {
      if (val) {
        this.stopAutoSlide();
      } else {
        this.startAutoSlide();
      }
    }
  },
  methods: {
    trackClick(type, projectTitle) {
      import('@/services/analytics').then(({ analytics }) => {
        analytics.trackClick(`${type}_${projectTitle.replace(/\s+/g, '-').toLowerCase()}`);
      });
    },
    closeModal() {
      this.$emit('close');
    },
    handleKeydown(e) {
      if (!this.isOpen) return;
      if (e.key === 'Escape') {
        if (this.lightboxOpen) {
          this.closeLightbox();
        } else {
          this.closeModal();
        }
      }
      if (e.key === 'ArrowLeft') this.prevImage();
      if (e.key === 'ArrowRight') this.nextImage();
    },
    prevImage() {
      if (this.allImages.length <= 1) return;
      this.slideDirection = 'slide-left';
      this.activeImageIndex = (this.activeImageIndex - 1 + this.allImages.length) % this.allImages.length;
      this.resetAutoSlide();
    },
    nextImage() {
      if (this.allImages.length <= 1) return;
      this.slideDirection = 'slide-right';
      this.activeImageIndex = (this.activeImageIndex + 1) % this.allImages.length;
      this.resetAutoSlide();
    },
    startAutoSlide() {
      this.stopAutoSlide();
      if (this.allImages.length <= 1) return;
      this.autoSlideTimer = setInterval(() => {
        if (!this.isGalleryHovered && !this.lightboxOpen) {
          this.activeImageIndex = (this.activeImageIndex + 1) % this.allImages.length;
        }
      }, 4000);
    },
    stopAutoSlide() {
      if (this.autoSlideTimer) {
        clearInterval(this.autoSlideTimer);
        this.autoSlideTimer = null;
      }
    },
    resetAutoSlide() {
      if (this.isOpen && !this.lightboxOpen) {
        this.startAutoSlide();
      }
    },
    onGalleryMouseEnter() {
      this.isGalleryHovered = true;
    },
    onGalleryMouseLeave() {
      this.isGalleryHovered = false;
    },
    openLightbox() {
      this.lightboxOpen = true;
    },
    closeLightbox() {
      this.lightboxOpen = false;
    },
    openCaseStudy() {
      console.log('Opening case study for:', this.project.title);
    },
    getProjectCategories(project) {
      return Array.isArray(project.category) ? project.category : [project.category];
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: modalFadeIn 0.3s ease-out;
}

.modal-container {
  background: white;
  border-radius: 24px;
  max-width: 900px;
  max-height: 90vh;
  width: 100%;
  overflow: hidden;
  position: relative;
  animation: modalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-header {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}

.close-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.close-btn:hover {
  background: white;
  transform: scale(1.1);
}

.close-btn i {
  font-size: 18px;
  color: #374151;
}

.modal-content {
  max-height: 90vh;
  overflow-y: auto;
}

/* Modal Header Section */
.modal-header-section {
  padding: 40px 40px 20px 40px;
  background: linear-gradient(135deg, #1c1917 0%, #0c0a09 100%);
}

.modal-meta {
  color: white;
}

.modal-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.modal-category {
  display: inline-block;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.modal-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
}

/* ===================== */
/* Image Gallery Section */
/* ===================== */
.modal-image-section {
  border-radius: 16px;
  overflow: hidden;
  margin: 32px 0;
}

.modal-gallery-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Main Image */
.gallery-main {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: #f5f5f4;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  cursor: zoom-in;
}

.gallery-main-wrapper {
  position: relative;
  overflow: hidden;
}

.gallery-main-img {
  width: 100%;
  height: auto;
  max-height: 500px;
  display: block;
  object-fit: contain;
  background: #f5f5f4;
}

/* Slide Transitions */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(60px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-60px);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-60px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(60px);
}

/* Navigation Arrows */
.gallery-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.85);
  border: none;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  opacity: 0;
  z-index: 2;
}

.gallery-main:hover .gallery-nav {
  opacity: 1;
}

.gallery-nav:hover {
  background: white;
  transform: translateY(-50%) scale(1.1);
}

.gallery-nav i {
  font-size: 16px;
  color: #374151;
}

.gallery-nav-prev {
  left: 12px;
}

.gallery-nav-next {
  right: 12px;
}

/* Counter Badge */
.gallery-counter {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(8px);
}

/* Thumbnail Strip */
.gallery-thumbs {
  overflow-x: auto;
  padding: 4px 0;
  scrollbar-width: thin;
  scrollbar-color: #f97316 #fef3e2;
}

.gallery-thumbs::-webkit-scrollbar {
  height: 4px;
}

.gallery-thumbs::-webkit-scrollbar-track {
  background: #fef3e2;
  border-radius: 2px;
}

.gallery-thumbs::-webkit-scrollbar-thumb {
  background: #f97316;
  border-radius: 2px;
}

.gallery-thumbs-track {
  display: flex;
  gap: 8px;
}

.gallery-thumb {
  flex-shrink: 0;
  width: 72px;
  height: 56px;
  border-radius: 10px;
  overflow: hidden;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  background: #f5f5f4;
  opacity: 0.6;
}

.gallery-thumb:hover {
  opacity: 0.9;
  border-color: #fed7aa;
}

.gallery-thumb.active {
  border-color: #f97316;
  opacity: 1;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.35);
}

.gallery-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Single image fallback */
.modal-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  max-height: 500px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

/* ============ */
/* Lightbox     */
/* ============ */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: modalFadeIn 0.2s ease-out;
}

.lightbox-img {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255,255,255,0.15);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 20px;
  transition: background 0.2s;
}

.lightbox-close:hover {
  background: rgba(255,255,255,0.3);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.15);
  border: none;
  border-radius: 50%;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 20px;
  transition: background 0.2s;
}

.lightbox-nav:hover {
  background: rgba(255,255,255,0.3);
}

.lightbox-prev { left: 24px; }
.lightbox-next { right: 24px; }

.lightbox-counter {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Modal Details */
.modal-details {
  padding: 40px;
}

.detail-section {
  margin-bottom: 32px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: 2px;
}

.modal-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #4b5563;
  margin: 0;
}

/* Tech Stack */
.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tech-tag {
  padding: 8px 16px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Features List */
.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 1rem;
  line-height: 1.6;
  color: #4b5563;
}

.features-list i {
  color: #f59e0b;
  margin-top: 2px;
  flex-shrink: 0;
}

.challenges-text {
  font-size: 1rem;
  line-height: 1.7;
  color: #4b5563;
  margin: 0;
}

/* Project Info Grid */
.project-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.info-item i {
  font-size: 1.25rem;
  color: #f97316;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #e5e7eb;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
}

.action-btn.primary {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
}

.action-btn.secondary {
  background: #1f2937;
  color: white;
}

.action-btn.secondary:hover {
  background: #111827;
  transform: translateY(-2px);
}

.action-btn.figma {
  background: #F24E1E;
  color: white;
}

.action-btn.figma:hover {
  background: #D73A16;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(242, 78, 30, 0.4);
}

.action-btn.tertiary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.action-btn.tertiary:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
}

/* Animations */
@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalSlideIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-overlay { padding: 10px; }
  .modal-header-section { padding: 30px 24px 16px 24px; }
  .modal-title { font-size: 2rem; }
  .modal-details { padding: 30px 24px; }
  .modal-actions { flex-direction: column; }
  .action-btn { justify-content: center; }
  .project-info-grid { grid-template-columns: 1fr; }
  .modal-image-section { margin: 24px 0; }
  .gallery-nav { opacity: 1; width: 36px; height: 36px; }
  .gallery-nav i { font-size: 14px; }
  .gallery-thumb { width: 60px; height: 48px; }
  .lightbox-nav { width: 44px; height: 44px; }
  .lightbox-prev { left: 12px; }
  .lightbox-next { right: 12px; }
}

@media (max-width: 480px) {
  .modal-container { max-width: 98vw; width: 98vw; min-width: 0; border-radius: 12px; }
  .modal-header { top: 8px; right: 8px; }
  .close-btn { width: 36px; height: 36px; font-size: 1rem; }
  .modal-header-section { padding: 20px 16px 12px 16px; }
  .modal-title { font-size: 1.1rem; }
  .modal-details { padding: 12px 6px; }
  .detail-section { margin-bottom: 18px; }
  .section-title { font-size: 1rem; margin-bottom: 8px; }
  .modal-description, .challenges-text { font-size: 0.92rem; }
  .tech-stack { gap: 5px; }
  .tech-tag { padding: 4px 8px; font-size: 0.75rem; }
  .features-list li { font-size: 0.92rem; margin-bottom: 7px; }
  .project-info-grid { gap: 8px; }
  .info-item { padding: 10px; font-size: 0.9rem; }
  .modal-actions { gap: 8px; margin-top: 18px; padding-top: 18px; }
  .action-btn { font-size: 0.95rem; padding: 8px 12px; border-radius: 8px; }
  .modal-image-section { margin: 18px 0; border-radius: 12px; }
  .gallery-main-img { max-height: 300px; }
  .gallery-thumb { width: 52px; height: 42px; border-width: 2px; border-radius: 8px; }
}

/* Custom Scrollbar for Modal */
.modal-content::-webkit-scrollbar { width: 6px; }
.modal-content::-webkit-scrollbar-track { background: #fef3e2; }
.modal-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: 3px;
}
</style>

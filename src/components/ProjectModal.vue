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

          <!-- Project Image in Middle -->
          <div class="detail-section modal-image-section">
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
  mounted() {
    // Handle escape key
    document.addEventListener('keydown', this.handleEscape);
    // Prevent body scroll when modal is open
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
    }
  },
  unmounted() {
    document.removeEventListener('keydown', this.handleEscape);
    document.body.style.overflow = '';
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    handleEscape(e) {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeModal();
      }
    },
    openCaseStudy() {
      // This could open another modal or navigate to a detailed page
      console.log('Opening case study for:', this.project.title);
    },
    getProjectCategories(project) {
      // Returns all categories as an array for proper display
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

/* Modal Image Section - Now in Middle */
.modal-image-section {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  margin: 32px 0;
}

.modal-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  max-height: 500px;
}

.image-gradient-overlay {
  display: none;
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
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-header-section {
    padding: 30px 24px 16px 24px;
  }
  
  .modal-title {
    font-size: 2rem;
  }
  
  .modal-details {
    padding: 30px 24px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .action-btn {
    justify-content: center;
  }
  
  .project-info-grid {
    grid-template-columns: 1fr;
  }

  .modal-image-section {
    margin: 24px 0;
  }
}

@media (max-width: 480px) {
  .modal-container {
    max-width: 98vw;
    width: 98vw;
    min-width: 0;
    border-radius: 12px;
  }
  .modal-header {
    top: 8px;
    right: 8px;
  }
  .close-btn {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
  .modal-header-section {
    padding: 20px 16px 12px 16px;
  }
  .modal-title {
    font-size: 1.1rem;
  }
  .modal-details {
    padding: 12px 6px;
  }
  .detail-section {
    margin-bottom: 18px;
  }
  .section-title {
    font-size: 1rem;
    margin-bottom: 8px;
  }
  .modal-description,
  .challenges-text {
    font-size: 0.92rem;
  }
  .tech-stack {
    gap: 5px;
  }
  .tech-tag {
    padding: 4px 8px;
    font-size: 0.75rem;
  }
  .features-list li {
    font-size: 0.92rem;
    margin-bottom: 7px;
  }
  .project-info-grid {
    gap: 8px;
  }
  .info-item {
    padding: 10px;
    font-size: 0.9rem;
  }
  .modal-actions {
    gap: 8px;
    margin-top: 18px;
    padding-top: 18px;
  }
  .action-btn {
    font-size: 0.95rem;
    padding: 8px 12px;
    border-radius: 8px;
  }
  .modal-image-section {
    margin: 18px 0;
    border-radius: 12px;
  }
  .modal-image {
    max-height: 300px;
  }
}

/* Custom Scrollbar for Modal */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: #fef3e2;
}

.modal-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: 3px;
}
</style>

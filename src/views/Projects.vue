<template>
  <div class="projects-view">
    <!-- Header section -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title" :class="{ 'visible': titleVisible }">
          <span class="title-gradient">My Projects</span>
        </h1>
        <p class="page-subtitle" :class="{ 'visible': subtitleVisible }">
          A curated collection of my work, showcasing innovation and creativity
        </p>
        
        <!-- Download CV Button -->
        <div class="cv-download-section" :class="{ 'visible': subtitleVisible }">
          <a 
            href="/cv/Zhafran_Resume_Latest.pdf" 
            download="Zhafran_Hafizh_Resume_2025.pdf"
            class="download-cv-btn"
            @click="trackDownload"
          >
            <i class="fas fa-download"></i>
            <span>Download My CV</span>
          </a>
        </div>
        
        <!-- Filter pills -->
        <div class="filter-pills" :class="{ 'visible': filtersVisible }">
          <button 
            v-for="filter in filters" 
            :key="filter"
            :class="{ 'active': activeFilter === filter }"
            @click="setFilter(filter)"
            class="filter-pill"
          >
            {{ filter }}
          </button>
        </div>
      </div>
    </div>

    <!-- Bento Grid Layout -->
    <div class="bento-grid" :class="{ 'visible': projectsVisible, 'mobile-layout': isMobile }">
      <div 
        v-for="(project, index) in filteredProjects" 
        :key="project.id"
        class="bento-item"
        :class="[!isMobile ? getBentoClass(index) : 'mobile', { 'visible': projectsVisible }]"
        :style="getProjectStyle(index)"
        @click="openModal(project)"
      >
        <div class="bento-card">
          <div class="card-image">
            <img :src="project.imageUrl" :alt="project.title" loading="lazy" />
            <div class="image-overlay">
              <div class="overlay-content">
                <button class="maximize-btn" @click.stop="openModal(project)">
                  <i class="fas fa-expand"></i>
                </button>
                <button v-if="project.link && project.link !== '#'" class="external-btn" @click.stop="openExternal(project.link)">
                  <i class="fas fa-external-link-alt"></i>
                </button>
              </div>
            </div>
          </div>
          <!-- Card overlay for entire card clickability -->
          <div class="card-overlay" @click="openModal(project)">
            <div class="overlay-actions">
              <button class="overlay-maximize-btn" @click.stop="openModal(project)">
                <i class="fas fa-expand"></i>
                <span>View Details</span>
              </button>
            </div>
          </div>
          <div class="card-content">
            <div class="project-meta">
              <span class="category-badge">{{ getPrimaryCategory(project) }}</span>
            </div>
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-description">{{ getTruncatedDescription(project.description) }}</p>
            <div class="project-tags">
              <span v-for="tag in project.tags.slice(0, 3)" :key="tag" class="tag">
                {{ tag }}
              </span>
              <span v-if="project.tags.length > 3" class="tag-more">
                +{{ project.tags.length - 3 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer stats -->
    <div class="stats-section" :class="{ 'visible': projectsVisible }">
      <div class="stat-item">
        <span class="stat-number">{{ projectsData.length }}</span>
        <span class="stat-label">Projects</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ uniqueCategories }}</span>
        <span class="stat-label">Categories</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ totalTags }}</span>
        <span class="stat-label">Technologies</span>
      </div>
    </div>

    <!-- Project Modal -->
    <ProjectModal 
      :is-open="modalOpen" 
      :project="selectedProject" 
      @close="closeModal" 
    />
  </div>
</template>

<script>
import ProjectModal from '@/components/ProjectModal.vue';
import { useHead } from '@vueuse/head';

export default {
  setup() {
    useHead({
      title: 'My Projects | Portofolio Zhafran',
      meta: [
        {
          name: 'description',
          content: 'Lihat koleksi proyek web development dan UI/UX design saya.'
        }
      ]
    })
  },
  name: 'ProjectsView',
  components: {
    ProjectModal
  },
  data() {
    return {
      titleVisible: false,
      subtitleVisible: false,
      filtersVisible: false,
      projectsVisible: false,
      modalOpen: false,
      selectedProject: {},
      activeFilter: 'All',
      filters: ['All', 'Web Development', 'UI/UX Design', 'Mobile'],
      isMobile: false,
      resizeObserver: null,
      
      
      projectsData: [] 
    };
  },
  computed: {
    filteredProjects() {
      if (this.activeFilter === 'All') {
        return this.projectsData;
      }
      return this.projectsData.filter(project => {
        // Handle both single category (string) and multiple categories (array)
        if (Array.isArray(project.category)) {
          return project.category.includes(this.activeFilter);
        } else {
          return project.category === this.activeFilter;
        }
      });
    },
    uniqueCategories() {
      const allCategories = this.projectsData.flatMap(p => 
        Array.isArray(p.category) ? p.category : [p.category]
      );
      return new Set(allCategories).size;
    },
    totalTags() {
      const allTags = this.projectsData.flatMap(p => p.tags);
      return new Set(allTags).size;
    }
  },
  mounted() {
    this.checkMobile();
    
    // KITA PANGGIL FUNGSI BARU DI SINI
    this.fetchProjects(); 
    
    // Add resize listener for responsive updates
    window.addEventListener('resize', this.checkMobile);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    async fetchProjects() {
      try {
        // Path '/projects.json' berfungsi karena filenya ada di folder 'public'
        const response = await fetch('/projects.json'); 
        const data = await response.json();
        this.projectsData = data;

        // Pindahkan initAnimations ke sini agar animasi
        // baru berjalan SETELAH data siap
        this.initAnimations();

      } catch (error) {
        console.error("Gagal mengambil data proyek:", error);
        // Jika error, tetap jalankan animasi agar UI lain muncul
        this.initAnimations(); 
      }
    },

    setFilter(filter) {
      this.activeFilter = filter;
      this.projectsVisible = false;
      setTimeout(() => {
        this.projectsVisible = true;
      }, 150);
    },
    getBentoClass(index) {
      const patterns = ['normal', 'wide', 'normal', 'large', 'normal', 'tall'];
      return patterns[index % patterns.length] || 'normal';
    },
    getProjectStyle(index) {
      return {
        animationDelay: `${index * 0.1}s`
      };
    },
    openProject(project) {
      // This method is kept for backward compatibility but now opens modal
      this.openModal(project);
    },
    openModal(project) {
      this.selectedProject = project;
      this.modalOpen = true;
    },
    closeModal() {
      this.modalOpen = false;
      this.selectedProject = {};
    },
    openExternal(link) {
      if (link && link !== '#') {
        window.open(link, '_blank', 'noopener,noreferrer');
      }
    },
    trackDownload() {
      console.log('CV downloaded at:', new Date().toISOString());
      // You can add Google Analytics or other tracking here
    },
    getPrimaryCategory(project) {
      // Returns the first category if it's an array, or the category if it's a string
      return Array.isArray(project.category) ? project.category[0] : project.category;
    },
    getAllCategories(project) {
      // Returns all categories as an array
      return Array.isArray(project.category) ? project.category : [project.category];
    },
    getTruncatedDescription(description, maxSentences = 2) {
      if (!description) return '';
      
      // Split by sentence endings (. ! ?)
      const sentences = description.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
      
      if (sentences.length <= maxSentences) {
        return description;
      }
      
      // Take first maxSentences and add ellipsis
      const truncated = sentences.slice(0, maxSentences).join('. ').trim();
      return truncated + (truncated.endsWith('.') ? '..' : '...');
    },
    initAnimations() {
      // Fungsi ini dipanggil dari fetchProjects() setelah data dimuat
      setTimeout(() => this.titleVisible = true, 200);
      setTimeout(() => this.subtitleVisible = true, 400);
      setTimeout(() => this.filtersVisible = true, 600);
      setTimeout(() => this.projectsVisible = true, 800);
    },
    checkMobile() {
      // Check if device is mobile based on screen width
      this.isMobile = window.innerWidth <= 768;
    }
  }
}
</script>

<style scoped>
.projects-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #fafaf9 0%, #e7e5e4 100%);
  padding: 0;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  transition: background 0.3s ease;
}

:global(body.dark-theme) .projects-view {
  background: linear-gradient(135deg, #1c1917 0%, #0c0a09 100%) !important;
}

/* Header Section */
.header-section {
  padding: 80px 2rem 60px;
  text-align: center;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  position: relative;
  overflow: hidden;
  transition: background 0.3s ease;
}

:global(body.dark-theme) .header-section {
  background: linear-gradient(135deg, #292524 0%, #1c1917 100%) !important;
}

.header-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.header-content {
  position: relative;
  z-index: 1;
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
  background: linear-gradient(135deg, #ffffff 0%, #fff7ed 100%);
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
}

.page-subtitle.visible {
  opacity: 0.9;
  transform: translateY(0);
}

/* Download CV Section */
.cv-download-section {
  margin: 30px 0 40px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
}

.cv-download-section.visible {
  opacity: 1;
  transform: translateY(0);
}

.download-cv-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #f97316 0%, #d97706 100%);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
  position: relative;
  overflow: hidden;
}

.download-cv-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #d97706 0%, #f97316 100%);
  transition: left 0.3s ease;
  z-index: -1;
}

.download-cv-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(249, 115, 22, 0.4);
}

.download-cv-btn:hover::before {
  left: 0;
}

.download-cv-btn:active {
  transform: translateY(-1px);
}

.download-cv-btn i {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.download-cv-btn:hover i {
  transform: translateY(-2px);
}

/* Filter Pills */
.filter-pills {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s;
}

.filter-pills.visible {
  opacity: 1;
  transform: translateY(0);
}

.filter-pill {
  padding: 12px 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.filter-pill:hover,
.filter-pill.active {
  background: white;
  color: #f97316;
  border-color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Bento Grid */
.bento-grid {
  padding: 60px 2rem;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  grid-auto-rows: 400px;
  gap: 24px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Mobile Layout - Simplified for Performance */
.bento-grid.mobile-layout {
  display: flex;
  flex-direction: column;
  grid-template-columns: unset;
  grid-auto-rows: unset;
  gap: 20px;
  padding: 40px 1.5rem;
  max-width: 600px;
}

.bento-grid.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Bento Item Sizes */
.bento-item {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.bento-item.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.bento-item.large {
  grid-column: span 2;
  grid-row: span 2;
}

.bento-item.wide {
  grid-column: span 2;
}

.bento-item.tall {
  grid-row: span 2;
}

/* Mobile Item - No Bento Complexity */
.bento-item.mobile {
  grid-column: unset !important;
  grid-row: unset !important;
  width: 100%;
  height: auto;
  min-height: unset;
}

/* Bento Card */
.bento-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
}

:global(body.dark-theme) .bento-card {
  background: #292524 !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.bento-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

/* Card Image - Increased sizes */
.card-image {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.bento-item.large .card-image {
  height: 320px;
}

.bento-item.tall .card-image {
  height: 280px;
}

.bento-item.wide .card-image {
  height: 260px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.bento-card:hover .card-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.8), rgba(217, 119, 6, 0.8));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.bento-card:hover .image-overlay {
  opacity: 1;
}

.overlay-content {
  display: flex;
  gap: 16px;
  transform: translateY(10px);
  transition: transform 0.3s ease;
}

.bento-card:hover .overlay-content {
  transform: translateY(0);
}

.maximize-btn,
.external-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.maximize-btn:hover,
.external-btn:hover {
  background: white;
  transform: scale(1.1);
}

.maximize-btn i,
.external-btn i {
  font-size: 18px;
  color: #374151;
}

/* Full Card Overlay */
.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.95), rgba(217, 119, 6, 0.95));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.4s ease;
  backdrop-filter: blur(8px);
  z-index: 2;
}

.bento-card:hover .card-overlay {
  opacity: 1;
}

/* Mobile touch optimization */
@media (max-width: 768px) {
  .card-overlay {
    /* Show overlay on mobile tap instead of hover */
    opacity: 0;
    pointer-events: none;
  }
  
  .bento-card:active .card-overlay {
    opacity: 1;
    pointer-events: auto;
  }
  
  /* Make entire card more touch-friendly */
  .bento-card {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Improve touch feedback */
  .bento-card:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
}

.overlay-actions {
  text-align: center;
  transform: translateY(20px);
  transition: transform 0.4s ease;
}

.bento-card:hover .overlay-actions {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .bento-card:active .overlay-actions {
    transform: translateY(0);
  }
}

.overlay-maximize-btn {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 16px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  -webkit-tap-highlight-color: transparent;
}

.overlay-maximize-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .overlay-maximize-btn {
    padding: 14px 20px;
    font-size: 15px;
  }
  
  .overlay-maximize-btn:active {
    transform: scale(0.95);
  }
}

.overlay-maximize-btn i {
  font-size: 18px;
}

/* Card Content */
.card-content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.project-meta {
  margin-bottom: 12px;
}

.category-badge {
  display: inline-block;
  padding: 6px 12px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.project-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 12px;
  line-height: 1.3;
}

:global(body.dark-theme) .project-title {
  color: #e4e4e7 !important;
}

.bento-item.large .project-title {
  font-size: 1.6rem;
}

.project-description {
  color: #78716c;
  line-height: 1.6;
  margin-bottom: 20px;
  flex: 1;
  font-size: 0.95rem;
}

:global(body.dark-theme) .project-description {
  color: #a1a1aa !important;
}

/* Project Tags */
.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}

.tag {
  padding: 6px 12px;
  background: #fef3e2;
  color: #78716c;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #fed7aa;
}

:global(body.dark-theme) .tag {
  background: #374151 !important;
  color: #e4e4e7 !important;
  border: 1px solid #4b5563 !important;
}

.tag-more {
  padding: 6px 12px;
  background: #ea580c;
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Stats Section */
.stats-section {
  padding: 60px 2rem;
  /* background removed to fix dark mode issue */
  display: flex;
  justify-content: center;
  gap: 60px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}



.stats-section.visible {
  opacity: 1;
  transform: translateY(0);
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.stat-label {
  display: block;
  color: #78716c;
  font-weight: 500;
  margin-top: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.875rem;
}

:global(body.dark-theme) .stat-label {
  color: #a1a1aa !important;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .bento-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-auto-rows: 380px;
    gap: 20px;
  }
  
  .bento-item.large {
    grid-column: span 1;
    grid-row: span 1;
  }
  
  .bento-item.wide {
    grid-column: span 1;
  }
  
  .card-image,
  .bento-item.large .card-image,
  .bento-item.tall .card-image,
  .bento-item.wide .card-image {
    height: 220px;
  }
}

/* Medium screens (tablets) */
@media (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 350px;
    gap: 20px;
    padding: 50px 1.5rem;
  }
  
  .bento-item {
    grid-column: span 1 !important;
    grid-row: span 1 !important;
  }
  
  .card-image {
    height: 180px;
  }
  
  .card-content {
    padding: 20px 18px;
  }
}

@media (max-width: 768px) {
  .header-section {
    padding: 60px 1.5rem 40px;
  }
  
  .header-content {
    padding: 0 10px;
  }
  
  .page-title {
    font-size: 2.5rem;
    margin-bottom: 16px;
  }
  
  .page-subtitle {
    font-size: 1.1rem;
    margin-bottom: 30px;
  }
  
  .cv-download-section {
    margin: 25px 0 35px;
  }
  
  .download-cv-btn {
    padding: 14px 28px;
    font-size: 0.95rem;
  }
  
  .filter-pills {
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .filter-pill {
    font-size: 0.9rem;
    padding: 10px 20px;
  }
  
  /* Convert to single column layout */
  .bento-grid {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 40px 1.5rem;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .bento-item {
    width: 100%;
    height: auto;
    min-height: unset;
  }
  
  .bento-card {
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: auto;
    min-height: 420px;
  }
  
  .card-image {
    height: 200px;
    flex-shrink: 0;
  }
  
  .card-content {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .project-title {
    font-size: 1.3rem;
    margin-bottom: 10px;
    line-height: 1.4;
  }
  
  .project-description {
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 16px;
  }
  
  .project-tags {
    margin-top: auto;
    gap: 6px;
  }
  
  .tag {
    font-size: 0.8rem;
    padding: 5px 10px;
  }
  
  .stats-section {
    flex-direction: row;
    gap: 40px;
    padding: 40px 1.5rem;
  }
}

@media (max-width: 480px) {
  .header-section {
    padding: 40px 1rem 30px;
  }
  
  .header-content {
    padding: 0 5px;
  }
  
  .page-title {
    font-size: 2rem;
    margin-bottom: 12px;
  }
  
  .page-subtitle {
    font-size: 1rem;
    margin-bottom: 25px;
    line-height: 1.5;
  }
  
  .cv-download-section {
    margin: 20px 0 30px;
  }
  
  .download-cv-btn {
    padding: 12px 24px;
    font-size: 0.9rem;
    gap: 10px;
  }
  
  .filter-pills {
    gap: 8px;
    margin-bottom: 15px;
  }
  
  .filter-pill {
    font-size: 0.85rem;
    padding: 8px 16px;
  }
  
  /* Mobile vertical card layout */
  .bento-grid {
    padding: 30px 1rem;
    gap: 20px;
    max-width: 100%;
  }
  
  .bento-card {
    border-radius: 16px;
    min-height: 380px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .card-image {
    height: 180px;
  }
  
  .card-content {
    padding: 18px 16px;
  }
  
  .category-badge {
    font-size: 0.7rem;
    padding: 4px 10px;
  }
  
  .project-title {
    font-size: 1.2rem;
    margin-bottom: 8px;
    line-height: 1.3;
  }
  
  .project-description {
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 14px;
  }
  
  .project-tags {
    gap: 5px;
  }
  
  .tag {
    font-size: 0.75rem;
    padding: 4px 8px;
    border-radius: 10px;
  }
  
  .tag-more {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
  
  .stats-section {
    flex-direction: column;
    gap: 20px;
    padding: 30px 1rem;
    text-align: center;
  }
  
  .stat-number {
    font-size: 2.5rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
  }
}

/* Animation keyframes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #fef3e2;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #f97316, #ea580c);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #fb923c, #f97316);
}
</style>
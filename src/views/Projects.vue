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
            href="/cv/Zhafran_Hafizh_Resume_2025.pdf" 
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
    <div class="bento-grid" :class="{ 'visible': projectsVisible }">
      <div 
        v-for="(project, index) in filteredProjects" 
        :key="project.id"
        class="bento-item"
        :class="[getBentoClass(index), { 'visible': projectsVisible }]"
        :style="getProjectStyle(index)"
        @click="openModal(project)"
      >
        <div class="bento-card">
          <div class="card-image">
            <img :src="project.imageUrl" :alt="project.title" />
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
              <span class="category-badge">{{ project.category }}</span>
            </div>
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-description">{{ project.description }}</p>
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
export default {
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
      projectsData: [
        {
          id: 1,
          title: 'System Monitoring Update at PT. JICT (GBOSS/MyJICT)',
          description: 'Professional internship project involving comprehensive updates to the GBOSS/MyJICT monitoring system, focusing on frontend improvements, enhanced user experience, and modern interface design.',
          imageUrl: '../galeri/ManifestL1.png',
          link: 'https://my.jict.co.id/gboss-eunoia/',
          tags: ['Frontend Development', 'UI/UX Enhancement', 'System Monitoring', 'User Experience', 'Vue.js'],
          category: 'Web Development',
          features: [
            'Modernized user interface for better usability',
            'Enhanced system monitoring capabilities',
            'Improved user experience flow',
            'Responsive design implementation',
            'Performance optimization',
            'Integration with existing GBOSS infrastructure'
          ],
          challenges: 'Working with legacy systems while implementing modern frontend practices and ensuring seamless integration with existing workflows at a major port terminal company.',
          duration: 'Internship Period',
          team: 'Development Team at PT. JICT',
          role: 'Frontend Web Developer Intern'
        },
        {
          id: 2,
          title: 'Teaching Plotting Information System',
          description: 'Comprehensive final project involving the complete design and development of an information system for teaching assignment plotting, utilizing User-Centered Design (UCD) methodology.',
          imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
          link: 'https://siplongjar.com/',
          github: 'https://github.com/rasjidzz/cap-plongjar',
          tags: ['System Design', 'UCD Methodology', 'Information System', 'Final Project'],
          category: 'Web Development',
          features: [
            'Complete system architecture design',
            'User-Centered Design implementation',
            'Teaching assignment management',
            'Automated plotting algorithms',
            'Comprehensive user interface',
            'Database design and optimization'
          ],
          challenges: 'Designing a comprehensive system from proposal to implementation while ensuring it meets real-world educational institution requirements and follows UCD principles.',
          duration: 'Final Project Timeline',
          team: 'Academic Project Team',
          role: 'System Designer & UI/UX Lead'
        },
        {
          id: 3,
          title: 'UI/UX Design for Chevalier LAB',
          description: 'Professional UI/UX design project for Chevalier LAB, creating comprehensive designs for Learning Management System (LMS) and coffee shop application with modern, user-friendly interfaces.',
          imageUrl: 'https://images.unsplash.com/photo-1559028006-44a10e643c68?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
          link: '#',
          tags: ['UI/UX Design', 'LMS Design', 'Mobile App', 'Figma', 'Design System'],
          category: 'UI/UX Design',
          features: [
            'Complete LMS interface design',
            'Coffee shop mobile app design',
            'Design system development',
            'User journey mapping',
            'Interactive prototyping',
            'Cross-platform design consistency'
          ],
          challenges: 'Creating intuitive designs for both educational and commercial applications while maintaining consistency across different platforms and user types.',
          duration: 'Client Project Timeline',
          team: 'Chevalier LAB Design Team',
          role: 'Lead UI/UX Designer'
        },
        {
          id: 4,
          title: 'Cardiovascular Detection System with AI',
          description: 'Advanced artificial intelligence project focused on cardiovascular disease detection, showcasing expertise in AI integration, medical technology, and complex system design.',
          imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
          link: '#',
          github: '#',
          tags: ['Artificial Intelligence', 'Healthcare Tech', 'Machine Learning', 'Medical Detection'],
          category: 'Web Development',
          features: [
            'AI-powered cardiovascular analysis',
            'Medical data processing',
            'Real-time detection algorithms',
            'Healthcare-compliant interface',
            'Data visualization for medical professionals',
            'Integration with medical devices'
          ],
          challenges: 'Developing a highly accurate AI system for medical applications while ensuring compliance with healthcare standards and creating an intuitive interface for medical professionals.',
          duration: 'Research Project Timeline',
          team: 'AI Research Team',
          role: 'AI Developer & Interface Designer'
        },
        {
          id: 5,
          title: 'Mobile App "Rent-It"',
          description: 'Comprehensive mobile application development project for rental services, demonstrating cross-platform development skills and mobile-first design approach.',
          imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
          link: '#',
          github: '#',
          tags: ['Mobile Development', 'Cross-platform', 'Rental System', 'Mobile UI'],
          category: 'Mobile',
          features: [
            'Cross-platform mobile application',
            'Rental booking system',
            'Payment integration',
            'User authentication',
            'Real-time availability tracking',
            'Push notifications'
          ],
          challenges: 'Creating a seamless rental experience across different mobile platforms while implementing secure payment processing and real-time inventory management.',
          duration: 'Mobile Project Timeline',
          team: 'Mobile Development Team',
          role: 'Mobile Developer & UI Designer'
        },
        {
          id: 6,
          title: 'Design & Prototype for "DetectMe" Project',
          description: 'End-to-end design project encompassing complete UI/UX design, prototyping, and asset creation for the DetectMe application, demonstrating full design process expertise.',
          imageUrl: '../galeri/Detectme.png',
          link: 'https://detectme.id/',
          tags: ['UI/UX Design', 'Prototyping', 'Design Assets', 'Complete Design Process'],
          category: 'UI/UX Design',
          features: [
            'Complete UI/UX design system',
            'Interactive prototypes',
            'Development-ready assets',
            'User research integration',
            'Design documentation',
            'Handoff to development team'
          ],
          challenges: 'Managing the complete design process from concept to development handoff while ensuring design consistency and creating comprehensive documentation for seamless development implementation.',
          duration: 'Still in Development',
          team: 'Design & Development Team',
          role: 'Lead Designer & Design Process Manager'
        }
      ]
    };
  },
  computed: {
    filteredProjects() {
      if (this.activeFilter === 'All') {
        return this.projectsData;
      }
      return this.projectsData.filter(project => project.category === this.activeFilter);
    },
    uniqueCategories() {
      return new Set(this.projectsData.map(p => p.category)).size;
    },
    totalTags() {
      const allTags = this.projectsData.flatMap(p => p.tags);
      return new Set(allTags).size;
    }
  },
  mounted() {
    this.initAnimations();
  },
  methods: {
    setFilter(filter) {
      this.activeFilter = filter;
      this.projectsVisible = false;
      setTimeout(() => {
        this.projectsVisible = true;
      }, 150);
    },
    getBentoClass(index) {
      // Simplified pattern for better reliability
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
      // Optional: Add analytics tracking for CV downloads
      console.log('CV downloaded at:', new Date().toISOString());
      // You can add Google Analytics or other tracking here
    },
    initAnimations() {
      setTimeout(() => this.titleVisible = true, 200);
      setTimeout(() => this.subtitleVisible = true, 400);
      setTimeout(() => this.filtersVisible = true, 600);
      setTimeout(() => this.projectsVisible = true, 800);
    }
  }
}
</script>

<style scoped>
.projects-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  transition: background 0.3s ease;
}

:global(.dark) .projects-view {
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
}

/* Header Section */
.header-section {
  padding: 80px 2rem 60px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
  transition: background 0.3s ease;
}

:global(.dark) .header-section {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
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
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  transition: left 0.3s ease;
  z-index: -1;
}

.download-cv-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
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
  color: #667eea;
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

:global(.dark) .bento-card {
  background: #1a1a2e;
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
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8));
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
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95));
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

.overlay-actions {
  text-align: center;
  transform: translateY(20px);
  transition: transform 0.4s ease;
}

.bento-card:hover .overlay-actions {
  transform: translateY(0);
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
}

.overlay-maximize-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
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
  background: linear-gradient(135deg, #667eea, #764ba2);
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

:global(.dark) .project-title {
  color: #e4e4e7;
}

.bento-item.large .project-title {
  font-size: 1.6rem;
}

.project-description {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 20px;
  flex: 1;
  font-size: 0.95rem;
}

:global(.dark) .project-description {
  color: #a1a1aa;
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
  background: #f1f5f9;
  color: #475569;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #e2e8f0;
}

:global(.dark) .tag {
  background: #374151;
  color: #e4e4e7;
  border: 1px solid #4b5563;
}

.tag-more {
  padding: 6px 12px;
  background: #667eea;
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Stats Section */
.stats-section {
  padding: 60px 2rem;
  background: white;
  display: flex;
  justify-content: center;
  gap: 60px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

:global(.dark) .stats-section {
  background: #1a1a2e;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.stat-label {
  display: block;
  color: #64748b;
  font-weight: 500;
  margin-top: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.875rem;
}

:global(.dark) .stat-label {
  color: #a1a1aa;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .bento-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-auto-rows: 380px;
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

@media (max-width: 768px) {
  .header-section {
    padding: 1.2rem 0.5rem;
  }
  .page-title {
    font-size: 2rem;
  }
  .page-subtitle {
    font-size: 1.1rem;
  }
  .cv-download-section {
    margin-bottom: 1.2rem;
  }
  .filter-pills {
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 1.2rem;
  }
  .filter-pill {
    font-size: 0.95rem;
    padding: 7px 16px;
  }
  .bento-grid {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    padding: 0 4px;
  }
  .bento-card {
    padding: 12px 8px;
    border-radius: 12px;
  }
  .card-image {
    height: 120px;
  }
}

@media (max-width: 480px) {
  .header-section {
    padding: 0.7rem 0.2rem;
  }
  .header-content {
    padding: 0 2vw;
  }
  .page-title {
    font-size: 1.2rem;
  }
  .page-subtitle {
    font-size: 0.95rem;
  }
  .cv-download-section {
    margin-bottom: 0.7rem;
  }
  .filter-pills {
    gap: 6px;
    margin-bottom: 0.7rem;
  }
  .filter-pill {
    font-size: 0.85rem;
    padding: 6px 10px;
    border-radius: 16px;
  }
  .bento-grid {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 0 2px;
  }
  .bento-card {
    padding: 8px 4px;
    border-radius: 8px;
  }
  .card-image {
    height: 90px;
  }
  .project-description {
    font-size: 0.85rem;
  }
  .stats-section {
    flex-direction: column;
    gap: 8px;
    font-size: 0.9rem;
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
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8, #6b46c1);
}
</style>
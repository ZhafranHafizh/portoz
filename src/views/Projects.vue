<template>
  <div class="projects-view">
    <!-- Animated background elements -->
    <div class="background-elements">
      <div class="floating-shape shape-1" :style="shape1Style"></div>
      <div class="floating-shape shape-2" :style="shape2Style"></div>
      <div class="floating-shape shape-3" :style="shape3Style"></div>
      <div class="grid-pattern"></div>
    </div>

    <!-- Header section with parallax -->
    <div class="header-section" :style="headerParallaxStyle">
      <h1 class="page-title" :class="{ 'visible': titleVisible }">My Projects</h1>
      <p class="page-subtitle" :class="{ 'visible': subtitleVisible }">
        Here are some projects I have worked on with great passion and dedication.
      </p>
      
      <!-- Filter buttons -->
      <div class="filter-buttons" :class="{ 'visible': filtersVisible }">
        <button 
          v-for="filter in filters" 
          :key="filter"
          :class="{ 'active': activeFilter === filter }"
          @click="setFilter(filter)"
          class="filter-btn"
        >
          {{ filter }}
        </button>
      </div>
    </div>

    <!-- Projects grid with stagger animation -->
    <div class="project-list" :style="projectsParallaxStyle">
      <div 
        v-for="(project, index) in filteredProjects" 
        :key="project.id"
        class="project-wrapper"
        :style="getProjectStyle(index)"
        :class="{ 'visible': projectsVisible }"
      >
        <ProjectCard :project="project" />
      </div>
    </div>

    <!-- Scroll indicator -->
      <div class="scroll-indicator" v-if="showScrollIndicator">
        <div class="scroll-text">Scroll to see more</div>
        <div class="scroll-arrow">↓</div>
      </div>
  </div>
</template>

<script>
import ProjectCard from '@/components/ProjectCard.vue';

export default {
  name: 'ProjectsView',
  components: {
    ProjectCard
  },
  data() {
    return {
      scrollY: 0,
      titleVisible: false,
      subtitleVisible: false,
      filtersVisible: false,
      projectsVisible: false,
      showScrollIndicator: true,
      activeFilter: 'All',
      filters: ['All', 'Web Development', 'UI/UX Design', 'Mobile'],
      projectsData: [
        {
          id: 1,
          title: 'Weather Web App',
          description: 'An app to display current weather forecasts using an open-source API with an intuitive and responsive interface.',
          imageUrl: 'https://images.unsplash.com/photo-1585210159781-76a1b7a27a6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
          link: '#',
          tags: ['Vue.js', 'API', 'CSS', 'Weather'],
          category: 'Web Development'
        },
        {
          id: 2,
          title: 'Task Management System',
          description: 'A platform to manage team daily tasks with drag-and-drop features, real-time notifications, and an analytics dashboard.',
          imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
          link: '#',
          tags: ['React', 'Node.js', 'Socket.IO'],
          category: 'Web Development'
        },
        {
          id: 3,
          title: 'Startup Landing Page Design',
          description: 'Modern, high-conversion UI/UX design for an AI technology startup focused on exceptional user experience.',
          imageUrl: 'https://images.unsplash.com/photo-1559028006-44a10e643c68?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
          link: '#',
          tags: ['Figma', 'UI/UX', 'Design', 'Web'],
          category: 'UI/UX Design'
        },
        {
          id: 4,
          title: 'E-commerce Fashion',
          description: 'A complete e-commerce platform with payment integration, inventory management, and product recommendation system.',
          imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
          link: '#',
          tags: ['Vue.js', 'Vuetify', 'Stripe'],
          category: 'Web Development'
        },
        {
          id: 5,
          title: 'Mobile Banking App Design',
          description: 'Interface design for a mobile banking app focused on security, accessibility, and user-friendly design.',
          imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
          link: '#',
          tags: ['Mobile Design', 'Figma', 'Prototyping'],
          category: 'Mobile'
        },
        {
          id: 6,
          title: 'Dashboard Analytics',
          description: 'A comprehensive dashboard for business data monitoring and analysis with interactive, real-time visualizations.',
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60',
          link: '#',
          tags: ['Vue.js', 'D3.js', 'Analytics'],
          category: 'Web Development'
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
    headerParallaxStyle() {
      return {
        transform: `translateY(${this.scrollY * -0.2}px)`
      };
    },
    projectsParallaxStyle() {
      return {
        transform: `translateY(${this.scrollY * -0.1}px)`
      };
    },
    shape1Style() {
      return {
        transform: `translate(${this.scrollY * 0.1}px, ${this.scrollY * 0.15}px) rotate(${this.scrollY * 0.05}deg)`
      };
    },
    shape2Style() {
      return {
        transform: `translate(${this.scrollY * -0.08}px, ${this.scrollY * 0.12}px) rotate(${this.scrollY * -0.03}deg)`
      };
    },
    shape3Style() {
      return {
        transform: `translate(${this.scrollY * 0.06}px, ${this.scrollY * -0.1}px) rotate(${this.scrollY * 0.02}deg)`
      };
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.initAnimations();
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrollY = window.scrollY;
      this.showScrollIndicator = window.scrollY < 100;
    },
    setFilter(filter) {
      this.activeFilter = filter;
      this.projectsVisible = false;
      setTimeout(() => {
        this.projectsVisible = true;
      }, 150);
    },
    getProjectStyle(index) {
      return {
        animationDelay: `${index * 0.1}s`
      };
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
  position: relative;
  max-width: 1200px;
  margin: 60px auto;
  padding: 2rem 1.5rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Background Elements */
.background-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #007bff, #28a745);
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(45deg, #28a745, #ffc107);
  top: 70%;
  left: 5%;
  animation-delay: 2s;
}

.shape-3 {
  width: 120px;
  height: 120px;
  background: linear-gradient(45deg, #ffc107, #dc3545);
  top: 40%;
  left: 15%;
  animation-delay: 4s;
}

.grid-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 123, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 123, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(5deg); }
  66% { transform: translateY(10px) rotate(-3deg); }
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* Header Section */
.header-section {
  margin-bottom: 60px;
  transition: transform 0.1s ease-out;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;
  padding-bottom: 15px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.page-title.visible {
  opacity: 1;
  transform: translateY(0);
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(45deg, #007bff, #28a745);
  border-radius: 2px;
  animation: lineGrow 1s ease 0.5s forwards;
  transform-origin: center;
  scale: 0;
}

@keyframes lineGrow {
  to { scale: 1; }
}

.page-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 40px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
}

.page-subtitle.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Filter Buttons */
.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  flex-wrap: wrap;
}

.filter-buttons.visible {
  opacity: 1;
  transform: translateY(0);
}

.filter-btn {
  padding: 12px 24px;
  border: 2px solid #e9ecef;
  background-color: white;
  color: #666;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.filter-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #007bff, #28a745);
  transition: left 0.3s ease;
  z-index: -1;
}

.filter-btn:hover {
  color: white;
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
}

.filter-btn:hover::before {
  left: 0;
}

.filter-btn.active {
  background: linear-gradient(45deg, #007bff, #28a745);
  color: white;
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.4);
}

/* Projects Grid */
.project-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  justify-items: center;
  margin-top: 40px;
  transition: transform 0.1s ease-out;
}

.project-wrapper {
  opacity: 0;
  transform: translateY(50px) scale(0.9);
  transition: all 0.6s ease;
  width: 100%;
  max-width: 400px;
}

.project-wrapper.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.project-wrapper:hover {
  transform: translateY(-10px) scale(1.02);
}

/* Scroll Indicator */
.scroll-indicator {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: #666;
  animation: bounce 2s infinite;
  z-index: 10;
  transition: opacity 0.3s ease;
}

.scroll-text {
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.scroll-arrow {
  font-size: 1.5rem;
  animation: arrowBounce 1.5s ease-in-out infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
  40% { transform: translateX(-50%) translateY(-10px); }
  60% { transform: translateX(-50%) translateY(-5px); }
}

@keyframes arrowBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.2rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
    padding: 0 20px;
  }
  
  .filter-buttons {
    gap: 10px;
    padding: 0 20px;
  }
  
  .filter-btn {
    padding: 10px 20px;
    font-size: 0.8rem;
  }
  
  .project-list {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .floating-shape {
    display: none; /* Hide on mobile for better performance */
  }
  
  .grid-pattern {
    opacity: 0.5;
  }
  
  /* Disable parallax on mobile */
  .header-section,
  .project-list {
    transform: none !important;
  }
}

@media (max-width: 480px) {
  .projects-view {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .filter-buttons {
    flex-direction: column;
    align-items: center;
  }
}

/* Enhanced animations for modern feel */
.project-wrapper:nth-child(even) {
  animation-delay: 0.1s;
}

.project-wrapper:nth-child(3n) {
  animation-delay: 0.2s;
}

/* Smooth scrolling enhancement */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #007bff, #28a745);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #0056b3, #1e7e34);
}
</style>
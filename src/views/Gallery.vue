<template>
  <div class="gallery-container">
    <!-- Header section -->
    <div class="header-section">
      <div class="header-content">
        <h1 class="page-title" :class="{ 'visible': titleVisible }">
          <span class="title-gradient">Gallery</span>
        </h1>
        <p class="page-subtitle" :class="{ 'visible': subtitleVisible }">
          A visual showcase of my creative work and design journey
        </p>
      </div>
    </div>

    <div class="gallery-content">
      <div class="hint-container">
        <button class="hint-toggle-btn" @click="toggleHint" :title="showHint ? 'Sembunyikan panduan' : 'Tampilkan panduan'">
          <i :class="showHint ? 'fas fa-eye-slash' : 'fas fa-question-circle'"></i>
          <span>{{ showHint ? 'Sembunyikan Panduan' : 'Panduan Interaksi' }}</span>
        </button>
        
        <div class="interaction-hint" v-show="showHint">
          <p>
            <i class="fas fa-mouse-pointer" v-if="activeCategory === 'All'"></i> 
            <span v-if="activeCategory === 'All'">Hover untuk efek parallax • </span>
            <i class="fas fa-info-circle"></i> Tombol info untuk penjelasan • 
            <i class="fas fa-eye"></i> Klik card untuk detail lengkap
          </p>
        </div>
      </div>
      
      <div class="filter-tabs">
        <button 
          v-for="category in categories" 
          :key="category"
          :class="['filter-btn', { active: activeCategory === category }]"
          @click="setActiveCategory(category)"
        >
          {{ getCategoryName(category) }}
        </button>
      </div>

      <div class="gallery-container">
        <div class="gallery-grid">
          <div 
            v-for="(image, index) in filteredImages" 
            :key="index"
            :data-index="index"
            class="gallery-item"
            :class="{ 'flipped': flippedCards.includes(index) }"
            @click="openModal(image)"
            @mousemove="handleMouseMove"
            @mouseleave="handleMouseLeave"
          >
          <div class="card-3d">
            <div class="card-front">
              <div class="image-container">
                <img 
                  :src="image.src" 
                  :alt="image.title" 
                  loading="lazy"
                  class="parallax-image"
                />
                <div class="overlay">
                  <h3>{{ image.title }}</h3>
                  <p>{{ image.category }}</p>
                  <div class="overlay-icon">
                    <i class="fas fa-expand-alt"></i>
                  </div>
                </div>
              </div>
              <!-- Flip Button -->
              <button 
                class="flip-btn" 
                @click.stop="toggleFlip(index)"
                :title="flippedCards.includes(index) ? 'Kembali ke gambar' : 'Lihat penjelasan singkat'"
              >
                <i class="fas fa-info-circle"></i>
              </button>
            </div>
            <div class="card-back">
              <div class="card-back-content">
                <div class="card-back-header">
                  <h3>{{ image.title }}</h3>
                  <span class="category-badge">{{ image.category }}</span>
                </div>
                <div 
                  class="card-back-body"
                  @wheel="handleCardBackWheel"
                  @scroll.stop="handleCardBackScroll"
                >
                  <p class="project-description">{{ image.description }}</p>
                  
                  <div class="project-details">
                    <div class="detail-item">
                      <i class="fas fa-calendar"></i>
                      <span>2024</span>
                    </div>
                    <div class="detail-item">
                      <i class="fas fa-tools"></i>
                      <span>{{ getToolsUsed(image.category) }}</span>
                    </div>
                    <div class="detail-item">
                      <i class="fas fa-clock"></i>
                      <span>{{ getProjectDuration(image.category) }}</span>
                    </div>
                  </div>

                  <!-- Additional project information -->
                  <div class="project-objectives">
                    <h4><i class="fas fa-bullseye"></i> Objectives</h4>
                    <ul>
                      <li>{{ getProjectObjective(image.category) }}</li>
                      <li>Deliver high-quality user experience</li>
                      <li>Ensure responsive design across devices</li>
                    </ul>
                  </div>

                  <div class="project-challenges">
                    <h4><i class="fas fa-exclamation-triangle"></i> Key Challenges</h4>
                    <p>{{ getProjectChallenges(image.category) }}</p>
                  </div>

                  <div class="project-results">
                    <h4><i class="fas fa-chart-line"></i> Results</h4>
                    <p>{{ getProjectResults(image.category) }}</p>
                  </div>

                  <!-- Additional sections to ensure scrolling -->
                  <div class="project-technologies">
                    <h4><i class="fas fa-code"></i> Technologies Used</h4>
                    <p>{{ getToolsUsed(image.category) }} and various supporting frameworks, libraries, and development tools for optimal performance and user experience.</p>
                  </div>

                  <div class="project-learnings">
                    <h4><i class="fas fa-lightbulb"></i> Key Learnings</h4>
                    <p>This project provided valuable insights into modern development practices, user-centered design principles, and the importance of iterative improvement based on user feedback.</p>
                  </div>

                  <div class="project-future">
                    <h4><i class="fas fa-rocket"></i> Future Enhancements</h4>
                    <p>Plans for future improvements include performance optimization, additional features based on user feedback, enhanced accessibility, and integration with emerging technologies.</p>
                  </div>

                  <!-- Button di dalam scrollable content, di bagian paling bawah -->
                  <div class="card-back-footer-inline">
                    <button class="view-full-btn" @click.stop="openModal(image)">
                      <i class="fas fa-expand-arrows-alt"></i>
                      Lihat Detail Lengkap
                    </button>
                  </div>
                </div>
              </div>
              <!-- Back Flip Button -->
              <button 
                class="flip-btn flip-btn-back" 
                @click.stop="toggleFlip(index)"
                title="Kembali ke gambar"
              >
                <i class="fas fa-undo"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div> <!-- Close gallery-container -->

      <!-- Empty state when no images -->
      <div v-if="filteredImages.length === 0" class="empty-state">
        <i class="fas fa-images"></i>
        <h3>Segera Hadir</h3>
        <p>Gambar galeri akan segera ditambahkan. Nantikan!</p>
      </div>
    </div>

    <!-- Modal for image preview -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
        <img :src="selectedImage.src" :alt="selectedImage.title" />
        <div class="modal-info">
          <h3>{{ selectedImage.title }}</h3>
          <p>{{ selectedImage.description }}</p>
          <span class="category-tag">{{ selectedImage.category }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GalleryView',
  data() {
    return {
      titleVisible: false,
      subtitleVisible: false,
      activeCategory: 'All',
      showModal: false,
      selectedImage: null,
      flippedCards: [],
      showHint: false,
      categories: ['All', 'UI/UX Desing', 'Website', 'Mobile App', 'Branding'],
      
      // Sample images dari Unsplash - ganti dengan data gambar Anda nanti
      images: [
        {
          src: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&crop=center',
          title: 'E-Commerce Mobile App',
          description: 'UI/UX design untuk aplikasi e-commerce mobile dengan fokus pada user experience yang intuitif',
          category: 'Mobile App'
        },
        {
          src: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop&crop=center',
          title: 'Corporate Website Design',
          description: 'Desain website corporate yang modern dan profesional',
          category: 'Website'
        },
        {
          src: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop&crop=center',
          title: 'Brand Identity Design',
          description: 'Identitas visual lengkap untuk startup teknologi',
          category: 'Branding'
        },
        {
          src: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop&crop=center',
          title: 'Dashboard Analytics',
          description: 'Interface dashboard untuk analytics dan monitoring data real-time',
          category: 'UI/UX Desing'
        },
        {
          src: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=600&fit=crop&crop=center',
          title: 'Restaurant Website',
          description: 'Desain website restaurant dengan focus pada visual makanan yang menarik',
          category: 'Website'
        },
        {
          src: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&crop=center',
          title: 'Fitness Mobile App',
          description: 'Aplikasi mobile untuk tracking workout dan program fitness personal',
          category: 'Mobile App'
        }
        // Tambahkan gambar lainnya di sini
      ]
    }
  },
  computed: {
    filteredImages() {
      if (this.activeCategory === 'All') {
        return this.images;
      }
      return this.images.filter(image => image.category === this.activeCategory);
    }
  },
  methods: {
    setActiveCategory(category) {
      this.activeCategory = category;
    },
    getCategoryName(category) {
      // Karena categories sudah menggunakan nama yang proper, langsung return saja
      return category;
    },
    openModal(image) {
      this.selectedImage = image;
      this.showModal = true;
      document.body.style.overflow = 'hidden';
    },
    closeModal() {
      this.showModal = false;
      this.selectedImage = null;
      document.body.style.overflow = 'auto';
    },
    toggleHint() {
      this.showHint = !this.showHint;
    },
    toggleFlip(index) {
      if (this.flippedCards.includes(index)) {
        // Close current card
        this.flippedCards = [];
      } else {
        // Close all other cards and open this one
        this.flippedCards = [index];
      }
      
      // Apply focus effect to cards
      this.$nextTick(() => {
        this.applyFocusEffect();
      });
    },
    applyFocusEffect() {
      const galleryItems = document.querySelectorAll('.gallery-item');
      const hasFlippedCard = this.flippedCards.length > 0;
      const flippedIndex = hasFlippedCard ? this.flippedCards[0] : -1;
      
      if (hasFlippedCard) {
        // Apply focus effect - blur all other cards
        galleryItems.forEach((item, index) => {
          if (index === flippedIndex) {
            // Focused card - remove any blur and make it stand out
            item.classList.add('focused');
            item.classList.remove('blurred');
            item.style.filter = '';
            item.style.zIndex = '100';
            item.style.transform = 'translateY(-10px) scale(1.05)';
          } else {
            // Background cards - apply blur effect
            item.classList.add('blurred');
            item.classList.remove('focused');
            item.style.filter = 'blur(3px) brightness(0.6) saturate(0.7)';
            item.style.zIndex = '1';
            item.style.transform = 'scale(0.95)';
          }
        });
        
        // Add glass overlay to the entire gallery
        const galleryGrid = document.querySelector('.gallery-grid');
        if (galleryGrid) {
          galleryGrid.classList.add('focus-mode');
        }
      } else {
        // Reset all cards when no card is flipped
        galleryItems.forEach(item => {
          item.classList.remove('blurred', 'focused');
          item.style.filter = '';
          item.style.zIndex = '';
          item.style.transform = '';
        });
        
        // Remove glass overlay
        const galleryGrid = document.querySelector('.gallery-grid');
        if (galleryGrid) {
          galleryGrid.classList.remove('focus-mode');
        }
      }
    },
    handleCardBackScroll(event) {
      // Prevent scroll event from bubbling up to prevent page scroll
      event.stopPropagation();
      event.stopImmediatePropagation();
      
      // Additional check to ensure scroll stays within the card
      const target = event.target;
      const isAtTop = target.scrollTop === 0;
      const isAtBottom = target.scrollTop >= (target.scrollHeight - target.clientHeight);
      
      // If trying to scroll beyond boundaries, prevent default
      if ((isAtTop && event.deltaY < 0) || (isAtBottom && event.deltaY > 0)) {
        event.preventDefault();
      }
    },
    handleCardBackWheel(event) {
      // Handle wheel events specifically for the card content
      const target = event.currentTarget;
      const isAtTop = target.scrollTop === 0;
      const isAtBottom = target.scrollTop >= (target.scrollHeight - target.clientHeight);
      
      // If trying to scroll beyond content boundaries, prevent the event
      if ((isAtTop && event.deltaY < 0) || (isAtBottom && event.deltaY > 0)) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        // Allow normal scrolling within the card but prevent bubbling
        event.stopPropagation();
      }
    },
    getToolsUsed(category) {
      const toolsMap = {
        'UI/UX Desing': 'Figma, Adobe XD',
        'Website': 'Vue.js, HTML, CSS',
        'Mobile App': 'Flutter, Dart',
        'Branding': 'Illustrator, Photoshop'
      };
      return toolsMap[category] || 'Various Tools';
    },
    getProjectDuration(category) {
      const durationMap = {
        'UI/UX Desing': '2-3 minggu',
        'Website': '1-2 bulan',
        'Mobile App': '2-3 bulan',
        'Branding': '1-2 minggu'
      };
      return durationMap[category] || '1-4 minggu';
    },
    getProjectObjective(category) {
      const objectiveMap = {
        'UI/UX Desing': 'Create intuitive and user-friendly interface',
        'Website': 'Build responsive and performant web platform',
        'Mobile App': 'Develop cross-platform mobile experience',
        'Branding': 'Establish strong visual identity'
      };
      return objectiveMap[category] || 'Deliver exceptional user experience';
    },
    getProjectChallenges(category) {
      const challengeMap = {
        'UI/UX Desing': 'Balancing user needs with business requirements while maintaining accessibility standards.',
        'Website': 'Optimizing performance across different browsers and ensuring mobile responsiveness.',
        'Mobile App': 'Creating consistent experience across iOS and Android platforms while managing app store guidelines.',
        'Branding': 'Developing unique visual language that stands out in competitive market.'
      };
      return challengeMap[category] || 'Overcoming technical and design challenges';
    },
    getProjectResults(category) {
      const resultMap = {
        'UI/UX Desing': 'Achieved 40% increase in user engagement and 25% reduction in bounce rate.',
        'Website': 'Improved page load speed by 60% and increased conversion rate by 35%.',
        'Mobile App': 'Reached 4.8/5 app store rating with 50K+ downloads in first month.',
        'Branding': 'Brand recognition increased by 45% with consistent visual implementation.'
      };
      return resultMap[category] || 'Successfully met all project objectives';
    },
    handleMouseMove(event) {
      // Only apply parallax effect when showing all images
      if (this.activeCategory !== 'All') {
        return;
      }
      
      const card = event.currentTarget;
      const cardIndex = parseInt(card.dataset.index);
      
      // Skip parallax effect if card is flipped
      if (this.flippedCards.includes(cardIndex)) {
        return;
      }
      
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      
      const rotateX = (mouseY - cardCenterY) / 10;
      const rotateY = (cardCenterX - mouseX) / 10;
      
      // Find the card3d and parallax image elements directly
      const card3d = card.querySelector('.card-3d');
      const parallaxImage = card.querySelector('.parallax-image');
      
      // Apply 3D transform to card
      if (card3d) {
        card3d.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
      }
      
      // Apply parallax effect to image
      if (parallaxImage) {
        const moveX = (mouseX - cardCenterX) / 50;
        const moveY = (mouseY - cardCenterY) / 50;
        parallaxImage.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
      }
    },
    handleMouseLeave(event) {
      // Only reset parallax effect when showing all images
      if (this.activeCategory !== 'All') {
        return;
      }
      
      const card = event.currentTarget;
      const cardIndex = parseInt(card.dataset.index);
      
      // Skip reset if card is flipped
      if (this.flippedCards.includes(cardIndex)) {
        return;
      }
      
      // Find the card3d and parallax image elements directly
      const card3d = card.querySelector('.card-3d');
      const parallaxImage = card.querySelector('.parallax-image');
      
      // Reset 3D transform
      if (card3d) {
        card3d.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      }
      
      // Reset parallax effect
      if (parallaxImage) {
        parallaxImage.style.transform = 'translate(0px, 0px) scale(1)';
      }
    }
  },
  mounted() {
    // Trigger animations with delay
    setTimeout(() => this.titleVisible = true, 200);
    setTimeout(() => this.subtitleVisible = true, 400);
    
    // Add aggressive scroll prevention for card content
    this.$nextTick(() => {
      const cardBodies = document.querySelectorAll('.card-back-body');
      cardBodies.forEach(body => {
        // Prevent wheel events from propagating
        body.addEventListener('wheel', (e) => {
          e.stopPropagation();
          e.stopImmediatePropagation();
          
          const target = e.currentTarget;
          const isAtTop = target.scrollTop === 0;
          const isAtBottom = target.scrollTop >= (target.scrollHeight - target.clientHeight);
          
          // Only prevent default if trying to scroll beyond boundaries
          if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
            e.preventDefault();
          }
        }, { passive: false });
        
        // Also prevent touchmove for mobile
        body.addEventListener('touchmove', (e) => {
          e.stopPropagation();
        }, { passive: false });
      });
    });
  },
  beforeUnmount() {
    // Pastikan scroll dikembalikan jika component di-unmount
    document.body.style.overflow = 'auto';
  }
}
</script>

<style scoped>
@import '@/styles/views/gallery.css';

/* Gallery-specific dynamic classes and effects */
.gallery-item:nth-child(odd) {
  animation: floatAnimation 6s ease-in-out infinite;
}

.gallery-item:nth-child(even) {
  animation: floatAnimation 6s ease-in-out infinite 3s;
}

/* Performance optimizations */
.gallery-item {
  will-change: transform;
}

.card-3d {
  will-change: transform;
}

.parallax-image {
  will-change: transform;
}

/* Magnetic and pulse effects combined with functionality */
.gallery-item::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
  border-radius: var(--radius-md);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

.gallery-item:hover::before {
  opacity: 0.3;
}

.gallery-item.flipped::before {
  opacity: 0.5;
}

.gallery-item.flipped {
  transform: translateY(-15px);
}
</style>

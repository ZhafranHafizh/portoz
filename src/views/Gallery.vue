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
                <div class="card-back-body">
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
                </div>
                <div class="card-back-footer">
                  <button class="view-full-btn" @click.stop="openModal(image)">
                    <i class="fas fa-expand-arrows-alt"></i>
                    Lihat Detail Lengkap
                  </button>
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
        this.flippedCards = this.flippedCards.filter(i => i !== index);
      } else {
        this.flippedCards.push(index);
      }
      
      // Apply focus effect to cards
      this.$nextTick(() => {
        this.applyFocusEffect(index);
      });
    },
    applyFocusEffect(flippedIndex) {
      const galleryItems = document.querySelectorAll('.gallery-item');
      const isFlipped = this.flippedCards.includes(flippedIndex);
      
      if (isFlipped) {
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
        galleryItems.forEach((item, index) => {
          if (index === flippedIndex) return;
          
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
      
      // Reset all when no cards are flipped
      if (this.flippedCards.length === 0) {
        galleryItems.forEach(item => {
          item.classList.remove('blurred', 'focused');
          item.style.filter = '';
          item.style.zIndex = '';
          item.style.transform = '';
        });
        
        const galleryGrid = document.querySelector('.gallery-grid');
        if (galleryGrid) {
          galleryGrid.classList.remove('focus-mode');
        }
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
    handleMouseMove(event) {
      // Only apply parallax effect when showing all images
      if (this.activeCategory !== 'All') {
        return;
      }
      
      const card = event.currentTarget;
      
      // Skip parallax effect if card is flipped
      if (card.classList.contains('flipped')) {
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
      
      // Skip reset if card is flipped
      if (card.classList.contains('flipped')) {
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
    
    // Add resize listener for responsive focus effects
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    // Pastikan scroll dikembalikan jika component di-unmount
    document.body.style.overflow = 'auto';
    
    // Remove resize listener
    window.removeEventListener('resize', this.handleResize);
  }
}
</script>

<style scoped>
.gallery-container {
  min-height: 100vh;
  background: var(--bg-color);
  color: var(--text-color);
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
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.page-subtitle.visible {
  opacity: 0.9;
  transform: translateY(0);
}

.gallery-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.hint-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.hint-toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--primary-color, #667eea);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.2);
  margin-bottom: 15px;
}

.hint-toggle-btn:hover {
  background: var(--primary-color-dark, #5a6fd8);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.hint-toggle-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.hint-toggle-btn i {
  font-size: 0.9rem;
}

.interaction-hint {
  text-align: center;
  padding: 15px 25px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 25px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  transform-origin: top;
}

.interaction-hint p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.interaction-hint i {
  color: var(--primary-color, #667eea);
  margin-right: 5px;
}

:global(.dark) .interaction-hint {
  background: rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.filter-tabs {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 40px;
}

.filter-btn {
  padding: 12px 24px;
  border: 2px solid var(--border-color);
  background: transparent;
  color: var(--text-color);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  text-transform: capitalize;
}

.filter-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
  transform: translateY(-2px);
}

/* Gallery container with overflow to handle focus effects */
.gallery-container {
  position: relative;
  overflow: visible;
  padding: 0 20px; /* Reduced padding */
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 35px; /* Reduced gap back to normal */
  margin-bottom: 40px;
  padding: 15px; /* Reduced padding */
}

.gallery-item {
  cursor: pointer;
  height: 300px;
  position: relative;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
  perspective: 1000px;
}

.gallery-item:hover:not(.flipped):not(.blurred):not(.focused) {
  transform: translateY(-10px);
}

/* Flipped card gets larger and elevated */
.gallery-item.flipped {
  transform: translateY(-20px) scale(1.05) !important;
  z-index: 100 !important;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

/* Focus effect for active card */
.gallery-item.focused {
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
  z-index: 100 !important;
}

/* Blur effect for background cards */
.gallery-item.blurred {
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
  z-index: 1 !important;
}

/* Glass overlay effect when in focus mode */
.gallery-grid.focus-mode {
  position: relative;
}

.gallery-grid.focus-mode::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1px);
  border-radius: 20px;
  pointer-events: none;
  z-index: 0;
  animation: fadeInGlass 0.6s ease-out;
}

@keyframes fadeInGlass {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(1px);
  }
}

/* Enhanced shadow and glow for flipped card */
.gallery-item.flipped::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 25px;
  z-index: -1;
  opacity: 0.3;
  filter: blur(15px);
  animation: pulse 2s ease-in-out infinite alternate;
}

@keyframes pulse {
  0% { opacity: 0.2; transform: scale(0.95); }
  100% { opacity: 0.4; transform: scale(1.02); }
}

.card-3d {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transform: rotateY(0deg);
}

.card-3d:hover {
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15px;
  overflow: hidden;
  background: var(--card-bg);
}

.card-front {
  z-index: 2;
  transform: rotateY(0deg);
}

.card-back {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  color: white;
  position: relative;
}

/* Flip Button Styles */
.flip-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s ease;
  z-index: 100;
  backdrop-filter: blur(10px);
  opacity: 0;
  transform: scale(0.8);
}

.gallery-item:hover .flip-btn {
  opacity: 1;
  transform: scale(1);
}

.flip-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.flip-btn:active {
  transform: scale(0.95);
}

.flip-btn i {
  transition: transform 0.2s ease;
}

.flip-btn:hover i {
  transform: scale(1.1);
}

.flip-btn-back i {
  transform: scaleX(-1);
}

.flip-btn-back {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  opacity: 1;
  z-index: 100;
}

  .flip-btn-back:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }

  /* Always show flip button on mobile */
  @media (max-width: 768px) {
    .flip-btn {
      opacity: 1;
      transform: scale(1);
      background: rgba(0, 0, 0, 0.7);
    }
  }

/* Alternative CSS approach - more explicit */
.gallery-item .card-3d {
  transform: rotateY(0deg);
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.320, 1);
}

.gallery-item.flipped .card-3d {
  transform: rotateY(180deg) !important;
}

.card-back-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
  z-index: 3;
  padding: 0;
}

.card-back-header {
  padding: 20px 20px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.card-back-header h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: white;
  line-height: 1.3;
}

.category-badge {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.card-back-body {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.project-description {
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 20px;
  opacity: 0.9;
  color: white;
}

.project-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
}

.detail-item i {
  width: 16px;
  color: rgba(255, 255, 255, 0.8);
}

.card-back-footer {
  padding: 15px 20px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.view-full-btn {
  width: 100%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  font-size: 0.9rem;
}

.view-full-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.image-container {
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: 15px;
}

.parallax-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  will-change: transform;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
  padding: 20px;
  backdrop-filter: blur(10px);
}

.gallery-item:hover .overlay {
  opacity: 1;
}

.overlay h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 10px;
  transform: translateY(20px);
  transition: transform 0.4s ease 0.1s;
}

.gallery-item:hover .overlay h3 {
  transform: translateY(0);
}

.overlay p {
  font-size: 0.9rem;
  margin-bottom: 15px;
  opacity: 0.9;
  transform: translateY(20px);
  transition: transform 0.4s ease 0.2s;
}

.gallery-item:hover .overlay p {
  transform: translateY(0);
}

.overlay-icon {
  font-size: 1.5rem;
  transform: translateY(20px);
  transition: transform 0.4s ease 0.3s;
}

.gallery-item:hover .overlay-icon {
  transform: translateY(0);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.empty-state p {
  font-size: 1rem;
  opacity: 0.8;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: var(--card-bg);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 1.2rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1001;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

.modal-content img {
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
  background: #f8f9fa;
}

.modal-info {
  padding: 25px;
  color: var(--text-color);
}

.modal-info h3 {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.modal-info p {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 15px;
}

.category-tag {
  display: inline-block;
  padding: 6px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: capitalize;
}

/* Responsive Design */
@media (max-width: 768px) {
  .gallery-content {
    padding: 40px 15px;
  }

  .gallery-container {
    padding: 0 10px; /* Reduced padding on mobile */
  }

  .gallery-grid {
    gap: 20px; /* Reduced gap on mobile */
    padding: 10px 0; /* Reduced padding on mobile */
  }

  .interaction-hint {
    padding: 12px 20px;
  }

  .hint-toggle-btn {
    padding: 8px 16px;
    font-size: 0.8rem;
    border-radius: 18px;
    margin-bottom: 12px;
  }

  .hint-toggle-btn span {
    display: none;
  }

  .interaction-hint p {
    font-size: 0.8rem;
    gap: 15px;
  }

  .page-title {
    font-size: 2.2rem;
  }

  .page-subtitle {
    font-size: 1.1rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .gallery-item {
    height: 250px;
  }

  /* Reduce push effect on mobile */
  .gallery-item.flipped {
    transform: translateY(-15px) scale(1.03);
  }

  .filter-tabs {
    gap: 10px;
  }

  .filter-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .card-back-content h3 {
    font-size: 1.3rem;
  }

  .card-back-content p {
    font-size: 0.9rem;
  }

  .card-back-header {
    padding: 15px 15px 12px;
  }

  .card-back-body {
    padding: 15px;
  }

  .card-back-footer {
    padding: 12px 15px 15px;
  }

  .project-details {
    gap: 10px;
  }

  .detail-item {
    font-size: 0.8rem;
  }

  .view-full-btn {
    font-size: 0.85rem;
    padding: 10px 16px;
  }

  /* Disable 3D effects on mobile for performance but keep flip */
  .parallax-image {
    transform: none !important;
  }

  .overlay h3 {
    font-size: 1.2rem;
  }

  .overlay p {
    font-size: 0.8rem;
  }

  .modal-content {
    max-width: 95vw;
    max-height: 95vh;
  }

  .modal-info {
    padding: 20px;
  }

  .modal-info h3 {
    font-size: 1.4rem;
  }
}

@media (max-width: 480px) {
  .interaction-hint p {
    flex-direction: column;
    gap: 10px;
    font-size: 0.75rem;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .gallery-item {
    height: 200px;
  }

  .filter-tabs {
    flex-direction: column;
    align-items: center;
  }

  .filter-btn {
    width: 200px;
  }

  .card-back {
    padding: 15px;
  }

  .card-back-content h3 {
    font-size: 1.1rem;
  }

  .card-back-content p {
    font-size: 0.8rem;
  }

  .card-back-header h3 {
    font-size: 1.1rem;
  }

  .project-description {
    font-size: 0.8rem;
  }

  .detail-item {
    font-size: 0.75rem;
  }

  .view-full-btn {
    font-size: 0.8rem;
    padding: 8px 14px;
  }
}

/* Additional animations and effects */
@keyframes floatAnimation {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

.gallery-item:nth-child(odd) {
  animation: floatAnimation 6s ease-in-out infinite;
}

.gallery-item:nth-child(even) {
  animation: floatAnimation 6s ease-in-out infinite 3s;
}

/* Magnetic effect on hover */
.gallery-item::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
  border-radius: 20px;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

.gallery-item:hover::before {
  opacity: 0.3;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Glowing effect for flipped cards */
.gallery-item.flipped::before {
  opacity: 0.5;
}

.gallery-item.flipped {
  transform: translateY(-15px);
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

/* CSS Variables */
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
  --text-secondary: #666666;
  --card-bg: #ffffff;
  --border-color: #e2e8f0;
  --primary-color: #667eea;
}

:global(body.dark-theme) {
  --bg-color: #0f0f23;
  --text-color: #e4e4e7;
  --text-secondary: #a1a1aa;
  --card-bg: #1a1a2e;
  --border-color: #374151;
  --primary-color: #8b5cf6;
}
</style>

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
            <i class="fas fa-info-circle"></i> Tombol info untuk deskripsi • 
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
                :title="flippedCards.includes(index) ? 'Kembali ke gambar' : 'Lihat deskripsi'"
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
                
                <!-- Simplified content - just description -->                
                <div class="card-back-body">
                  <div class="image-description">
                    <p>{{ getTruncatedDescription(image.description) }}</p>
                    <p v-if="image.description && getTruncatedDescription(image.description) !== image.description" class="description-hint">
                      <i class="fas fa-info-circle"></i>
                      Klik tombol detail untuk deskripsi lengkap
                    </p>
                  </div>
                  
                  <!-- Simple meta info -->
                  <div class="image-meta">
                    <div class="meta-item">
                      <i class="fas fa-tag"></i>
                      <span>{{ image.category }}</span>
                    </div>
                  </div>
                  
                  <!-- View full button -->
                  <div class="card-back-footer">
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
        <div class="modal-image-container">
          <img :src="selectedImage.src" :alt="selectedImage.title" class="modal-image" />
        </div>
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
          src: '../galeri/Detectme.webp',
          title: 'DetectMe',
          description: 'A system that helps pregnant mothers detect fetal conditions.',
          category: 'Mobile App'
        },
        {
          src: '../galeri/rentit.webp',
          title: 'Rent-It',
          description: 'Facility rental system at Telkom University campus',
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

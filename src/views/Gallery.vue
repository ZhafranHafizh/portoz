<template>
  <div class="gallery-container">
    <div class="hero-section">
      <h1 class="page-title" :class="{ 'visible': titleVisible }">
        <span class="title-gradient">Gallery</span>
      </h1>
      <p class="page-subtitle" :class="{ 'visible': subtitleVisible }">
        A visual showcase of my creative work and design journey
      </p>
    </div>

    <div class="gallery-content">
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

      <div class="gallery-grid">
        <div 
          v-for="(image, index) in filteredImages" 
          :key="index"
          class="gallery-item"
          @click="openModal(image)"
        >
          <div class="image-container">
            <img :src="image.src" :alt="image.title" loading="lazy" />
            <div class="overlay">
              <h3>{{ image.title }}</h3>
              <p>{{ image.category }}</p>
              <div class="overlay-icon">
                <i class="fas fa-expand-alt"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

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
.gallery-container {
  min-height: 100vh;
  padding: 80px 20px 60px;
  background: var(--bg-color);
  color: var(--text-color);
}

.hero-section {
  text-align: center;
  margin-bottom: 60px;
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

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.gallery-item {
  cursor: pointer;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: var(--card-bg);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.gallery-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.image-container {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-item:hover .image-container img {
  transform: scale(1.1);
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
  transition: all 0.3s ease;
  padding: 20px;
}

.gallery-item:hover .overlay {
  opacity: 1;
}

.overlay h3 {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.overlay p {
  font-size: 0.9rem;
  margin-bottom: 15px;
  opacity: 0.9;
}

.overlay-icon {
  font-size: 1.5rem;
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
  .gallery-container {
    padding: 60px 15px 40px;
  }

  .page-title {
    font-size: 2.2rem;
  }

  .page-subtitle {
    font-size: 1.1rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .filter-tabs {
    gap: 10px;
  }

  .filter-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .image-container {
    height: 200px;
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
  .page-title {
    font-size: 1.8rem;
  }

  .filter-tabs {
    flex-direction: column;
    align-items: center;
  }

  .filter-btn {
    width: 200px;
  }
}
</style>

<template>
  <div class="about-view" :class="{ 'dark': isDarkMode }">
    <section class="about-content" :class="{ 'visible': sectionVisible, 'dark': isDarkMode }">
      
      <div class="profile-header">
        <img src="../../public/galeri/Profil.png" alt="My Photo" class="about-pic" :style="imageParallaxStyle">
        <div class="profile-text">
          <h1>About Me</h1>
          <h2>Linking <strong> Ideas, Design, </strong> and <strong>Code</strong>.</h2>
          <p class="intro">
            Hi! I'm <strong>Zhafran Hafizh Izdihar Riyadi</strong>, A Software Engineer who is passionate about creating intuitive, functional, and high-quality digital products.
          </p>
          <!-- Download CV Button -->
          <div class="cv-download-section">
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
        </div>
      </div>

      <div class="story-content">
        <h3>My Philosophy</h3>
        <p>
          I believe that the best technology is technology that “disappears,” allowing users to focus on their goals rather than on how to use the tool. For me, “bridging design and development” is not just a technical matter, but a matter of empathy. Understanding what users need (from a UI/UX perspective) and translating that into clean, efficient, and scalable code (from a front-end perspective).
        </p>

        <h3>My Core Expertise</h3>
        <p>
          My journey in the software world has given me expertise in various fields. I most often work with:
        </p>
        <ul class="skills-list">
          <li><strong>UI/UX Design:</strong> Creating wireframes, interactive prototypes, and design systems using Figma.</li>
          <li><strong>Front-End Development:</strong> Bringing designs to life as responsive and fast web applications using <strong>Vue.js</strong>.</li>
          <li><strong>Quality Assurance & DevOps:</strong> Ensuring software runs bug-free and implementing CI/CD processes for efficient deployments.</li>
        </ul>

        <h3>Let's Connect</h3>
        <p>
          I'm always open to collaborating on challenging projects or just discussing technology and design. If you're looking for someone who can understand the big picture while also paying attention to technical details, I'd love to hear from you.
        </p>
        <router-link to="/contact" class="cta-button">
            Contact Me →
        </router-link>
      </div>

    </section>
  </div>
</template>
<script>
// Blok script ini HANYA untuk memberi nama multi-kata
export default {
  name: 'AboutView'
}
</script>
<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { useDarkMode } from '@/composables/useDarkMode'

// Setup dark mode
const { isDarkMode } = useDarkMode()

// Meta tags setup
useHead({
  title: 'About Me | Zhafran Hafizh Izdihar Riyadi',
  meta: [
    {
      name: 'description',
      content: 'Pelajari tentang Zhafran Hafizh Izdihar Riyadi, perjalanan karir, filosofi, dan keahlian saya di bidang software engineering dan UI/UX.'
    }
  ]
})

// 2. Animasi fade-in sederhana (tanpa parallax, tanpa fetch)
const sectionVisible = ref(false)

const trackDownload = () => {
  console.log('CV downloaded at:', new Date().toISOString())
  // You can add Google Analytics or other tracking here
}

onMounted(() => {
  setTimeout(() => {
    sectionVisible.value = true
  }, 100)
})
</script>

<style scoped>
/* HAPUS SEMUA CSS LAMA ANDA, DAN GANTI DENGAN INI.
  Ini jauh lebih bersih dan menghapus semua style timeline.
*/

.about-view {
  max-width: 900px;
  margin: 60px auto;
  padding: 2rem 1.5rem;
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
}

/* Animasi Fade-in */
.about-content {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 2rem 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.about-content.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Dark Mode */
.about-view.dark {
  background: linear-gradient(135deg, #1c1917 0%, #0c0a09 100%);
}

.about-content.dark {
  background-color: rgba(41, 37, 36, 0.9);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  color: #e4e4e7;
}

/* 1. Bagian Profile Header */
.profile-header {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid #e9ecef;
}

.about-content.dark .profile-header {
  border-bottom-color: #374151;
}

.about-pic {
  width: 180px;
  height: 180px;
  border-radius: 50%; /* Ubah jadi bulat agar lebih personal */
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 4px solid white;
  flex-shrink: 0; /* Mencegah gambar menyusut */
}

.about-content.dark .about-pic {
  border-color: #0c0a09;
}

.profile-text h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.profile-text h2 {
  font-size: 1.5rem;
  font-weight: 400;
  color: #f97316; /* Warna aksen */
  margin: 10px 0;
}

.profile-text .intro {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #555;
  margin: 0;
}

.about-content.dark .profile-text h1 { color: #e4e4e7; }
.about-content.dark .profile-text h2 { color: #fb923c; }
.about-content.dark .profile-text .intro { color: #a1a1aa; }

/* Download CV Button */
.cv-download-section {
  margin-top: 20px;
}

.download-cv-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
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
  background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
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

/* 2. Bagian Story Content */
.story-content {
  text-align: left;
  line-height: 1.8;
  font-size: 1.05rem;
}

.story-content h3 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
  margin-top: 40px;
  margin-bottom: 20px;
  border-bottom: 2px solid #f97316;
  padding-bottom: 8px;
  display: inline-block;
}

.story-content p {
  color: #555;
  margin-bottom: 20px;
}

.about-content.dark .story-content h3 { color: #e4e4e7; border-bottom-color: #fb923c; }
.about-content.dark .story-content p { color: #a1a1aa; }

.skills-list {
  list-style: none;
  padding-left: 0;
}

.skills-list li {
  position: relative;
  padding-left: 30px;
  margin-bottom: 15px;
  font-size: 1rem;
  color: #555;
}

/* Membuat ikon centang (checklist) */
.skills-list li::before {
  content: '✓'; /* Ganti dengan ikon fontawesome jika mau */
  position: absolute;
  left: 0;
  top: 0;
  color: #d97706; /* Warna hijau sukses -> Amber/Brown */
  font-weight: 700;
  font-size: 1.2rem;
}

.about-content.dark .skills-list li { color: #a1a1aa; }
.about-content.dark .skills-list li::before { color: #fbbf24; }

/* Tombol CTA (Call to Action) */
.cta-button {
  display: inline-block;
  padding: 14px 32px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
  margin-top: 20px;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(249, 115, 22, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .about-content {
    padding: 1.5rem;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
    border-bottom: 0;
    margin-bottom: 20px;
    padding-bottom: 0;
  }

  .about-pic {
    width: 150px;
    height: 150px;
  }

  .profile-text h1 { font-size: 2rem; }
  .profile-text h2 { font-size: 1.2rem; }
  .profile-text .intro { font-size: 1rem; }
  
  .download-cv-btn {
    padding: 10px 24px;
    font-size: 0.9rem;
    margin-top: 15px;
  }
  
  .story-content {
    text-align: left;
    font-size: 1rem;
  }
  
  .story-content h3 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .about-view {
    margin: 30px auto;
    padding: 1rem 0.5rem;
  }

  .about-content {
    padding: 1.5rem 1rem;
  }

  .about-pic {
    width: 120px;
    height: 120px;
  }
}
</style>
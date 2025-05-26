<template>
  <div class="projects-view">
    <h1 class="page-title">Proyek Saya</h1>
    <p class="page-subtitle">Berikut adalah beberapa proyek yang telah saya kerjakan.</p>
    <div class="project-list">
      <ProjectCard
        v-for="project in projectsData"
        :key="project.id"
        :project="project"
      />
    </div>
  </div>
</template>

<script>
import ProjectCard from '@/components/ProjectCard.vue';

export default {
  name: 'ProjectsView', // Pastikan tidak ada spasi
  components: {
    ProjectCard
  },
  data() {
    return {
      projectsData: [
        {
          id: 1,
          title: 'Aplikasi Web Cuaca',
          description: 'Aplikasi untuk menampilkan perkiraan cuaca saat ini menggunakan API open-source.',
          imageUrl: 'https://images.unsplash.com/photo-1585210159781-76a1b7a27a6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60', // Ganti dengan gambar nyata
          link: '#',
          tags: ['Vue.js', 'API', 'CSS', 'Weather']
        },
        {
          id: 2,
          title: 'Sistem Manajemen Tugas',
          description: 'Platform untuk mengatur tugas harian tim dengan fitur drag-and-drop dan notifikasi.',
          imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60', // Ganti dengan gambar nyata
          link: '#',
          tags: ['React', 'Node.js', 'Socket.IO']
        },
        {
          id: 3,
          title: 'Desain Landing Page Startup',
          description: 'Desain UI/UX modern dan konversi tinggi untuk startup teknologi AI.',
          imageUrl: 'https://images.unsplash.com/photo-1559028006-44a10e643c68?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60', // Ganti dengan gambar nyata
          link: '#',
          tags: ['Figma', 'UI/UX', 'Desain', 'Web']
        },
        {
          id: 4,
          title: 'E-commerce Fashion',
          description: 'Platform E-commerce lengkap dengan integrasi pembayaran dan manajemen inventaris.',
          imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60', // Ganti dengan gambar nyata
          link: '#',
          tags: ['Vue.js', 'Vuetify', 'Stripe']
        }
      ]
    };
  }
}
</script>

<style scoped>
.projects-view {
  max-width: 1200px;
  margin: 60px auto; /* Jarak atas/bawah lebih besar */
  padding: 2rem 1.5rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  min-height: 70vh; /* Pastikan ada tinggi minimal */
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
  position: relative;
  display: inline-block;
  padding-bottom: 10px;
}

/* Garis bawah dekoratif untuk judul */
.page-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background-color: #007bff; /* Warna aksen */
  border-radius: 2px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 50px; /* Jarak ke daftar proyek */
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.project-list {
  display: grid; /* Gunakan Grid untuk layout yang lebih kuat */
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); /* Kolom responsif */
  gap: 30px; /* Jarak antar kartu (grid & row) */
  justify-items: center; /* Pusatkan item di dalam sel grid */
  margin-top: 40px;
}
</style>
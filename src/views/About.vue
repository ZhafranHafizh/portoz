<template>
  <div class="about-view">
    <!-- Background parallax elements -->
    <div class="parallax-bg" :style="backgroundParallaxStyle"></div>
    <div class="parallax-shapes">
      <div class="shape shape-1" :style="shape1ParallaxStyle"></div>
      <div class="shape shape-2" :style="shape2ParallaxStyle"></div>
      <div class="shape shape-3" :style="shape3ParallaxStyle"></div>
    </div>

    <section class="about-me-section" :style="aboutSectionParallaxStyle">
      <h1>About Me</h1>
      <div class="content">
        <img src="@/assets/Face.jpg" alt="My Photo" class="about-pic" :style="imageParallaxStyle">
        <div class="text" :style="textParallaxStyle">
          <p>
            Hi! I'm Zhafran Hafizh, a passionate UI/UX Designer with experience in front-end web development and UI/UX design.
            I love turning complex ideas into elegant and user-friendly solutions.
          </p>
          <p>
            I have expertise in technologies such as Vue.js, Figma, Adobe XD, and more.
            I'm always eager to learn new things and collaborate on challenging and impactful projects.
          </p>
        </div>
      </div>
    </section>

    <section class="timeline-section" :style="timelineParallaxStyle">
      <h2 class="section-title">My Journey & Achievements</h2>
      <div class="timeline">
        <div v-for="(item, index) in timelineData" :key="item.year" class="timeline-item" :style="getTimelineItemStyle(index)">
          <div class="timeline-marker">
            <div class="timeline-year">{{ item.year }}</div>
          </div>
          <div class="timeline-content">
            <ul>
              <li v-for="(achievement, achievementIndex) in item.achievements" :key="achievementIndex">
                <strong>{{ achievement.title }}</strong> - {{ achievement.description }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: 'AboutView',
  data() {
    return {
      scrollY: 0,
      timelineData: [
        {
          year: '2021',
          achievements: [
            { title: 'Memulai Perjalanan di Telkom University', description: 'Memulai studi S1 Teknik Rekayasa Perangkat Lunak dan langsung bergabung dengan CHEVA Lab sebagai desainer UI/UX.' },
            { title: 'Proyek Desain Aplikasi & Web Pertama', description: 'Membuat desain UI untuk website dan aplikasi sebagai proyek akhir mata kuliah Design Thinking.' },
            { title: 'Pengembangan Game Sederhana', description: 'Membuat sebuah game sederhana untuk proyek akhir mata kuliah Pengenalan Rekayasa Perangkat Lunak.' },
          ]
        },
        {
          year: '2022',
          achievements: [
            { title: 'UI/UX Designer di Proyek DetectMe', description: 'Bertanggung jawab membuat desain UI/UX, prototipe, dan berbagai aset visual untuk proyek.' },
            { title: 'Spesialisasi Dokumen Rekayasa Perangkat Lunak', description: 'Membuat dokumen SRS (Software Requirements Specification) untuk aplikasi layanan darurat.' },
            { title: 'Desain UI Aplikasi Manajemen Toko', description: 'Merancang antarmuka untuk aplikasi manajemen toko sebagai bagian dari mata kuliah Interaksi Manusia & Komputer.' },
          ]
        },
        {
          year: '2023',
          achievements: [
            { title: 'UI/UX Designer di Chevalier LAB', description: 'Berkontribusi dalam pembuatan UI/UX untuk proyek LMS (Learning Management System) dan aplikasi coffee shop.' },
            { title: 'Pengembangan Berbagai Aplikasi Web', description: 'Mengembangkan website untuk registrasi konsultasi rumah sakit dan sistem penyewaan fasilitas kampus.' },
          ]
        },
        {
          year: '2024',
          achievements: [
            { title: 'Internship sebagai Scrum Master', description: 'Menjalani magang di HUMIC Research Center, memimpin Daily Standup dan Sprint Planning.' },
            { title: 'Internship sebagai Web Developer (Front End)', description: 'Magang di PT. Jakarta International Container Terminal, meng-update tampilan dan fungsi sistem monitoring.' },
            { title: 'Asisten Praktikum Pemrograman Web', description: 'Membimbing mahasiswa dalam konsep dan implementasi HTML, CSS, JavaScript, dan framework terkait di Laboratorium Informatika Telkom University.' },
          ]
        },
        {
          year: '2025',
          achievements: [
            { title: 'Pengembangan Proyek Akhir', description: 'Merancang UI dan mengembangkan proposal untuk Sistem Informasi Plotting Mengajar sebagai tugas akhir.' },
            { title: 'Implementasi Proses DevOps', description: 'Menerapkan proses CI/CD dan DevOps ke dalam proyek MySkin.' },
          ]
        },
      ]
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrollY = window.scrollY;
    },
    getTimelineItemStyle(index) {
      const offset = index * 50; // Stagger each timeline item
      return {
        transform: `translateY(${(this.scrollY - offset) * -0.1}px)`,
        transition: 'transform 0.1s ease-out'
      };
    }
  },
  computed: {
    backgroundParallaxStyle() {
      return {
        transform: `translateY(${this.scrollY * 0.5}px)`
      };
    },
    shape1ParallaxStyle() {
      return {
        transform: `translate(${this.scrollY * 0.2}px, ${this.scrollY * 0.3}px) rotate(${this.scrollY * 0.1}deg)`
      };
    },
    shape2ParallaxStyle() {
      return {
        transform: `translate(${this.scrollY * -0.15}px, ${this.scrollY * 0.25}px) rotate(${this.scrollY * -0.08}deg)`
      };
    },
    shape3ParallaxStyle() {
      return {
        transform: `translate(${this.scrollY * 0.1}px, ${this.scrollY * -0.2}px) rotate(${this.scrollY * 0.05}deg)`
      };
    },
    aboutSectionParallaxStyle() {
      return {
        transform: `translateY(${this.scrollY * -0.2}px)`
      };
    },
    imageParallaxStyle() {
      return {
        transform: `translateY(${this.scrollY * -0.15}px)`
      };
    },
    textParallaxStyle() {
      return {
        transform: `translateY(${this.scrollY * -0.1}px)`
      };
    },
    timelineParallaxStyle() {
      return {
        transform: `translateY(${this.scrollY * -0.05}px)`
      };
    }
  }
}
</script>

<style scoped>
/* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap'); */

.about-view {
  position: relative;
  max-width: 900px;
  margin: 60px auto;
  padding: 2rem 1.5rem;
  font-family: 'Poppins', sans-serif;
  overflow-x: hidden;
}

/* Parallax Background Elements */
.parallax-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.05) 0%, rgba(40, 167, 69, 0.05) 100%);
  z-index: -2;
  transition: transform 0.1s ease-out;
}

.parallax-shapes {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  transition: transform 0.1s ease-out;
}

.shape-1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #007bff, #28a745);
  top: 10%;
  right: 10%;
}

.shape-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(45deg, #28a745, #ffc107);
  top: 60%;
  left: 5%;
}

.shape-3 {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #ffc107, #007bff);
  top: 30%;
  left: 15%;
}

/* Styling untuk bagian 'Tentang Saya' (ambil dari About.vue sebelumnya) */
.about-me-section {
  position: relative;
  z-index: 1;
  text-align: center;
  margin-bottom: 80px; /* Jarak ke bagian timeline */
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.1s ease-out;
}

.about-me-section h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 40px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
}
.about-pic {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  margin-bottom: 20px;
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}
.about-pic:hover { 
  transform: scale(1.05); 
}
.text {
  max-width: 600px;
  transition: transform 0.1s ease-out;
}
.text p {
  line-height: 1.7;
  margin-bottom: 15px;
  color: #555;
}

@media (min-width: 768px) {
  .content {
    flex-direction: row;
    text-align: left;
  }
  .about-pic {
    margin-right: 40px;
    margin-bottom: 0;
    width: 250px; /* Sedikit lebih besar di desktop */
    height: 250px;
  }
}

/* Styling untuk bagian Timeline BARU */
.timeline-section {
  position: relative;
  z-index: 1;
  margin-top: 80px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.1s ease-out;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 60px;
  position: relative;
  display: inline-block;
  padding-bottom: 10px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 4px;
  background-color: #28a745; /* Warna aksen berbeda */
  border-radius: 2px;
}

.timeline {
  position: relative;
  max-width: 700px;
  margin: 0 auto;
  padding: 20px 0;
}

/* Garis vertikal utama */
.timeline::before {
  content: '';
  position: absolute;
  left: 60px; /* Sesuaikan posisi garis */
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #e9ecef;
  border-radius: 2px;
}

.timeline-item {
  display: flex;
  margin-bottom: 40px;
  position: relative;
  align-items: flex-start; /* Rata atas */
  transition: transform 0.1s ease-out;
}

/* Hapus margin bottom item terakhir */
.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: 60px;
  top: 0;
  transform: translateX(-50%); /* Posisi awal */
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #fff;
  border: 4px solid #007bff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  box-shadow: 0 0 0 6px #fff;
  /* Hapus 'transition' atau sesuaikan jika perlu, */
  /* karena 'animation' akan lebih dominan saat hover */
  transition: border-color 0.3s ease; /* Transisi untuk warna border */
}

.timeline-item:hover .timeline-marker {
  /* Terapkan animasi saat hover */
  animation: heartbeat 1.2s ease-in-out infinite;
  /* Anda bisa mempertahankan border-color jika mau */
  border-color: #0056b3;
}

@keyframes heartbeat {
  0% {
    transform: translateX(-50%) scale(1);
    box-shadow: 0 0 0 6px #fff, 0 0 10px rgba(0, 123, 255, 0.2);
  }
  30% {
    transform: translateX(-50%) scale(1.15); /* Puncak detak */
    box-shadow: 0 0 0 6px #fff, 0 0 30px rgba(0, 123, 255, 0.6); /* Glow saat puncak */
  }
  60% {
    transform: translateX(-50%) scale(1);
    box-shadow: 0 0 0 6px #fff, 0 0 10px rgba(0, 123, 255, 0.2);
  }
  100% {
    transform: translateX(-50%) scale(1);
    box-shadow: 0 0 0 6px #fff, 0 0 10px rgba(0, 123, 255, 0.2);
  }
}

.timeline-year {
  color: #007bff;
  font-weight: 700;
  font-size: 0.9rem;
}

.timeline-content {
  background-color: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px 25px;
  margin-left: 110px; /* Jarak dari garis/marker */
  width: 100%;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  text-align: left;
}

.timeline-content h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 1.2rem;
}

.timeline-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.timeline-content li {
  margin-bottom: 10px;
  line-height: 1.6;
  color: #555;
  font-size: 0.95rem;
}

.timeline-content li:last-child {
  margin-bottom: 0;
}

.timeline-content li strong {
  font-weight: 600;
  color: #333;
}

/* Penyesuaian untuk layar kecil */
@media (max-width: 768px) {
  .parallax-shapes {
    display: none; /* Hide decorative shapes on mobile for better performance */
  }
  
  .shape {
    transform: none !important; /* Disable parallax on mobile */
  }
  
  .timeline::before {
    left: 30px; /* Geser garis ke kiri */
  }
  .timeline-marker {
    left: 32px; /* Geser marker ke kiri */
    width: 40px;
    height: 40px;
    border-width: 3px;
    box-shadow: 0 0 0 4px #fff;
  }
  .timeline-year {
    font-size: 0.8rem;
  }
  .timeline-content {
    margin-left: 70px; /* Kurangi jarak */
    padding: 15px 20px;
  }
  
  /* Disable parallax effects on mobile for better performance */
  .about-me-section,
  .timeline-section,
  .about-pic,
  .text,
  .timeline-item {
    transform: none !important;
  }
}
</style>
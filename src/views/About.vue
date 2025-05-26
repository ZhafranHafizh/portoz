<template>
  <div class="about-view">
    <section class="about-me-section">
      <h1>Tentang Saya</h1>
      <div class="content">
        <img src="@/assets/Face.jpg" alt="Foto Saya" class="about-pic">
        <div class="text">
          <p>
            Halo! Saya Zhafran Hafizh, seorang UI/UX Designer yang bersemangat
            dengan pengalaman dalam pengembangan web front-end dan desain UI/UX.
            Saya suka mengubah ide-ide kompleks menjadi solusi yang elegan dan mudah digunakan.
          </p>
          <p>
            Saya memiliki keahlian dalam teknologi seperti Vue.js, Figma, Adobe XD, dll.
            Saya selalu antusias untuk mempelajari hal-hal baru dan berkolaborasi dalam proyek-proyek
            yang menantang dan berdampak.
          </p>
        </div>
      </div>
    </section>

    <section class="timeline-section">
      <h2 class="section-title">Perjalanan & Pencapaian Saya</h2>
      <div class="timeline">
        <div v-for="item in timelineData" :key="item.year" class="timeline-item">
          <div class="timeline-marker">
            <div class="timeline-year">{{ item.year }}</div>
          </div>
          <div class="timeline-content">
            <ul>
              <li v-for="(achievement, index) in item.achievements" :key="index">
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
  name: 'AboutView', // Pastikan nama sesuai (tanpa spasi)
  data() {
    return {
      timelineData: [
        {
          year: '2021',
          achievements: [
            { title: 'Mulai Belajar UI/UX', description: 'Memulai perjalanan mendalami dasar-dasar desain antarmuka dan pengalaman pengguna.' },
            { title: 'Proyek Desain Pertama', description: 'Menyelesaikan proyek desain aplikasi mobile untuk tugas kuliah.' },
            { title: 'Ikut Workshop Figma', description: 'Meningkatkan skill menggunakan Figma untuk prototyping.' },
          ]
        },
        {
          year: '2022',
          achievements: [
            { title: 'Magang di Startup A', description: 'Pengalaman kerja pertama sebagai UI/UX Designer intern.' },
            { title: 'Redesain Situs Web', description: 'Memimpin proyek redesain untuk situs web organisasi kampus.' },
            { title: 'Belajar Vue.js', description: 'Mulai mempelajari framework front-end Vue.js.' },
          ]
        },
        {
          year: '2023',
          achievements: [
            { title: 'Juara 1 Lomba Desain', description: 'Memenangkan kompetisi desain UI/UX tingkat nasional.' },
            { title: 'Freelance Project X', description: 'Mengerjakan proyek freelance untuk klien internasional.' },
            { title: 'Kontributor Open Source', description: 'Berkontribusi pada proyek open source sebagai desainer.' },
          ]
        },
        {
          year: '2024',
          achievements: [
            { title: 'Lulus Kuliah', description: 'Meraih gelar Sarjana Desain Komunikasi Visual.' },
            { title: 'Bekerja di Perusahaan B', description: 'Memulai karier penuh waktu sebagai UI/UX Designer.' },
            { title: 'Membangun Portofolio Vue', description: 'Membuat portofolio interaktif ini dari nol!' },
          ]
        },
        // Tambahkan tahun dan pencapaian lainnya di sini
      ]
    };
  }
}
</script>

<style scoped>
/* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap'); */

.about-view {
  max-width: 900px;
  margin: 60px auto;
  padding: 2rem 1.5rem;
  font-family: 'Poppins', sans-serif;
}

/* Styling untuk bagian 'Tentang Saya' (ambil dari About.vue sebelumnya) */
.about-me-section {
  text-align: center;
  margin-bottom: 80px; /* Jarak ke bagian timeline */
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
}
.text {
  max-width: 600px;
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
  margin-top: 80px;
  text-align: center;
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
}
</style>
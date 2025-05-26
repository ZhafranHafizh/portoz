<template>
  <div class="contact-view">
    <h1 class="page-title">Hubungi Saya</h1>
    <p class="page-subtitle">
      Punya ide menarik, pertanyaan, atau hanya ingin menyapa? <br>
      Saya akan senang mendengar dari Anda!
    </p>

    <div class="contact-card">
      <div class="contact-item">
        <div class="icon-wrapper email">
          <i class="fas fa-envelope"></i>
        </div>
        <div class="info-content">
          <h3>Email</h3>
          <p>Cara terbaik untuk menghubungi saya.</p>
          <a href="mailto:zhafranhafizhir@gmail.com" class="contact-link">
            zharfanhafizhir@gmail.com
          </a>
        </div>
      </div>

      <div class="contact-item">
        <div class="icon-wrapper linkedin">
          <i class="fab fa-linkedin-in"></i>
        </div>
        <div class="info-content">
          <h3>LinkedIn</h3>
          <p>Lihat profil profesional saya.</p>
          <a href="https://www.linkedin.com/in/zhafran-hafizh-izdihar-riyadi-01b940223/"  class="contact-link">
            Kunjungi Profil LinkedIn
          </a>
        </div>
      </div>

      <div class="contact-item">
        <div class="icon-wrapper github">
          <i class="fab fa-github"></i>
        </div>
        <div class="info-content">
          <h3>GitHub</h3>
          <p>Lihat kode dan proyek saya.</p>
          <a href="https://github.com/ZhafranHafizh" class="contact-link">
            Kunjungi Profil GitHub
          </a>
        </div>
      </div>
    </div>

    </div>
</template>

<script>
export default {
  name: 'ContactView' // Pastikan tidak ada spasi
}
</script>

<style scoped>
/* Pastikan Font Awesome sudah diimpor */
.contact-view {
  max-width: 900px;
  margin: 60px auto;
  padding: 2rem 1.5rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  min-height: 70vh;
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

.page-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background-color: #007bff;
  border-radius: 2px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 60px; /* Jarak lebih besar ke kartu kontak */
  line-height: 1.7;
}

.contact-card {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  padding: 40px;
  display: grid; /* Gunakan grid untuk layout item */
  gap: 30px; /* Jarak antar item */
}

.contact-item {
  display: flex;
  align-items: flex-start; /* Rata atas */
  text-align: left;
  background-color: #f8f9fa; /* Background lembut untuk tiap item */
  padding: 25px;
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-left: 5px solid transparent; /* Border kiri untuk hover */
}

.contact-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.06);
  border-left-color: #007bff; /* Border muncul saat hover */
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 25px;
  color: #fff;
  font-size: 1.8rem;
  flex-shrink: 0; /* Mencegah ikon menyusut */
}

/* Warna background ikon yang berbeda */
.icon-wrapper.email { background-color: #dd4b39; }
.icon-wrapper.linkedin { background-color: #0077b5; }
.icon-wrapper.github { background-color: #333; }

.info-content h3 {
  margin-top: 0;
  margin-bottom: 5px;
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
}

.info-content p {
  margin-bottom: 15px;
  color: #555;
  font-size: 0.95rem;
}

.contact-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

/* Responsif untuk layout item */
@media (min-width: 768px) {
  .contact-card {
    /* Jika Anda ingin 2 kolom di layar besar, gunakan ini */
    /* grid-template-columns: 1fr 1fr; */
    /* Tapi untuk 3 item, 1 kolom mungkin lebih baik atau 3 kolom jika lebar */
    grid-template-columns: 1fr; /* Tetap 1 kolom tapi lebih lebar */
  }
}
</style>
<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p class="copyright">
        &copy; {{ currentYear }} <strong>Porto Zhafran</strong>. Made with
        <a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer">Vue.js</a>
        and <span class="heart">&hearts;</span>.
      </p>
      <div class="social-links">
        <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <i class="fab fa-github"></i>
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <i class="fab fa-linkedin-in"></i>
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Dribbble">
          <i class="fab fa-dribbble"></i>
        </a>
        </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter', // Pastikan tidak ada spasi di akhir nama
  data() {
    return {
      currentYear: new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
/* Pastikan Anda sudah mengimpor Font Awesome jika ingin menggunakan ikon */
/* Anda bisa menambahkannya di public/index.html:
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
*/
/* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap'); */

.app-footer {
  background-color: #f8f9fa; /* Warna background lebih terang */
  color: #6c757d; /* Warna teks lebih lembut */
  padding: 2rem 1.5rem; /* Padding lebih besar */
  text-align: center;
  border-top: 1px solid #e9ecef; /* Border atas yang halus */
  font-family: 'Poppins', sans-serif; /* Sesuaikan font */
  margin-top: auto; /* Mendorong footer ke bawah jika konten pendek */
}

.footer-content {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem; /* Jarak antar elemen */
}

.copyright {
  font-size: 0.9rem;
  margin: 0;
}

.copyright strong {
  font-weight: 600;
  color: #495057;
}

.copyright a {
  color: #007bff; /* Warna link aksen */
  text-decoration: none;
  font-weight: 600;
}

.copyright a:hover {
  text-decoration: underline;
}

.heart {
  color: #e25555; /* Warna hati */
  display: inline-block;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.social-links {
  display: flex;
  gap: 1.5rem; /* Jarak antar ikon */
}

.social-links a {
  color: #6c757d;
  font-size: 1.3rem; /* Ukuran ikon */
  transition: color 0.3s ease, transform 0.3s ease;
}

.social-links a:hover {
  color: #007bff; /* Warna hover ikon */
  transform: translateY(-3px); /* Efek ikon terangkat */
}

/* Responsif */
@media (min-width: 768px) {
  .footer-content {
    flex-direction: row;
    justify-content: space-between;
  }
  .copyright {
    text-align: left;
  }
  .social-links {
    justify-content: flex-end;
  }
}
</style>
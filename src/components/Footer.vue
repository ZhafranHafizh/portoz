<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p class="copyright">
        &copy; {{ currentYear }} <strong>Zhafran's Portfolio</strong>. Built with
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
  background-color: #f8f9fa;
  color: #6c757d;
  padding: 2rem 1.5rem;
  text-align: center;
  border-top: 1px solid #e9ecef;
  font-family: 'Poppins', sans-serif;
  margin-top: auto;
  transition: all 0.3s ease;
}

:global(.dark) .app-footer {
  background-color: #1a1a2e;
  color: #a1a1aa;
  border-top: 1px solid #374151;
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

:global(.dark) .copyright strong {
  color: #e4e4e7;
}

.copyright a {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
}

:global(.dark) .copyright a {
  color: #60a5fa;
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
  font-size: 1.3rem;
  transition: color 0.3s ease, transform 0.3s ease;
}

:global(.dark) .social-links a {
  color: #a1a1aa;
}

.social-links a:hover {
  color: #007bff;
  transform: translateY(-3px);
}

:global(.dark) .social-links a:hover {
  color: #60a5fa;
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

@media (max-width: 480px) {
  .app-footer {
    padding: 1rem 0.5rem;
    font-size: 0.85rem;
  }
  .footer-content {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
  .copyright {
    font-size: 0.8rem;
    text-align: center;
  }
  .social-links {
    gap: 1rem;
    justify-content: center;
    font-size: 1.1rem;
  }
}
</style>
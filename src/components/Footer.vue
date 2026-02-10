<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p class="copyright">
        &copy; {{ currentYear }} <strong>Zhafran's Portfolio</strong>. Built with
        <a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer">Vue.js</a>
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
  name: 'AppFooter',
  data() {
    return {
      currentYear: new Date().getFullYear()
    }
  }
}
</script>

<style scoped>

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

:global(body.dark-theme) .app-footer {
  background-color: #1c1917;
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

:global(body.dark-theme) .copyright strong {
  color: #e4e4e7;
}

.copyright a {
  color: #f97316;
  text-decoration: none;
  font-weight: 600;
}

:global(body.dark-theme) .copyright a {
  color: #fb923c;
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

:global(body.dark-theme) .social-links a {
  color: #a1a1aa;
}

.social-links a:hover {
  color: #f97316;
  transform: translateY(-3px);
}

:global(body.dark-theme) .social-links a:hover {
  color: #fb923c;
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
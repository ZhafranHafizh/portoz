<template>
  <footer class="app-footer">
    <div class="footer-shell">
      <p>&copy; {{ currentYear }} Zhafran Hafizh</p>
      <p>
        <a href="mailto:zhafranhafizhir@gmail.com">zhafranhafizhir@gmail.com</a>
      </p>
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
  border-top: 1px solid #e7e5e4;
  background: #ffffff;
  padding: 1.25rem;
}

:global(body.dark-theme) .app-footer {
  background: #1c1917;
  border-top-color: #44403c;
}

.footer-shell {
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.footer-shell p {
  margin: 0;
  font-size: 0.92rem;
  color: #57534e;
}

.footer-shell a {
  color: #f97316;
  text-decoration: none;
  font-weight: 600;
}

:global(body.dark-theme) .footer-shell p {
  color: #d6d3d1;
}

:global(body.dark-theme) .footer-shell a {
  color: #fb923c;
}

@media (max-width: 640px) {
  .footer-shell {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

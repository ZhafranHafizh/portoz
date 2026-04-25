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
  border-top: 1px solid var(--border-subtle);
  background: var(--surface);
  padding: 1.25rem;
}

:global(body.dark-theme) .app-footer {
  background: var(--surface-elevated);
  border-top-color: var(--border-strong);
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
  color: var(--text-secondary);
}

.footer-shell a {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
}

:global(body.dark-theme) .footer-shell p {
  color: var(--text-secondary);
}

:global(body.dark-theme) .footer-shell a {
  color: var(--accent-hover);
}

@media (max-width: 640px) {
  .footer-shell {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

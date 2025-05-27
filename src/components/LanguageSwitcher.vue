<!-- <template>
  <div class="language-switcher">
    <button
      @click="setLocale('id')"
      :class="{ active: currentLocale === 'id' }"
      aria-label="Ganti ke Bahasa Indonesia"
    >
      ID
    </button>
    <span class="separator">|</span>
    <button
      @click="setLocale('en')"
      :class="{ active: currentLocale === 'en' }"
      aria-label="Switch to English"
    >
      EN
    </button>
  </div>
</template>

<script>
export default {
  name: 'LanguageSwitcher',
  computed: {
    currentLocale() {
      return this.$i18n.locale;
    }
  },
  methods: {
    setLocale(locale) {
      this.$i18n.locale = locale;
      // Opsional: Simpan pilihan bahasa ke localStorage
      // localStorage.setItem('user-locale', locale);
    }
  },
  // Opsional: Muat bahasa dari localStorage saat komponen dibuat
  // created() {
  //   const savedLocale = localStorage.getItem('user-locale');
  //   if (savedLocale && ['id', 'en'].includes(savedLocale)) {
  //     this.$i18n.locale = savedLocale;
  //   }
  // }
}
</script>

<style scoped>
.language-switcher button {
  background: none;
  border: none;
  color: #555; /* Sesuaikan dengan warna navbar Anda */
  font-weight: bold;
  cursor: pointer;
  padding: 5px 8px;
  transition: color 0.3s ease;
  font-size: 0.9rem;
}

.language-switcher button:hover {
  color: #007bff; /* Warna hover */
}

.language-switcher button.active {
  color: #007bff; /* Warna aktif */
  text-decoration: underline;
}

.separator {
  margin: 0 5px;
  color: #ccc; /* Warna pemisah */
}
</style> -->
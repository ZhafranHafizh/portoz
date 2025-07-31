import { createI18n } from 'vue-i18n';
import id from './locales/id.json';
import en from './locales/en.json';

// Ambil bahasa default dari browser atau set ke 'id'
const defaultLocale = navigator.language.split('-')[0] || 'id';

const i18n = createI18n({
  legacy: false, // Penting untuk Vue 3 Composition API / Options API modern
  locale: defaultLocale, // Bahasa default saat dimuat
  fallbackLocale: 'en', // Bahasa cadangan jika terjemahan tidak ada
  messages: { // Daftarkan semua file bahasa Anda di sini
    id,
    en
  }
});

export default i18n;
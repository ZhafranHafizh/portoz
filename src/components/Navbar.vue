<template>
  <nav class="navbar">
    <div class="brand">
      <router-link to="/">Porto<strong>Z</strong></router-link>
    </div>
    <ul class="nav-links">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/about">Tentang Saya</router-link></li>
      <li><router-link to="/projects">Proyek</router-link></li>
      <li><router-link to="/contact">Kontak</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'TheNavbar' // Pastikan tidak ada spasi di akhir nama
}
</script>

<style scoped>
/* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap'); */

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff; /* Ubah ke putih */
  padding: 1rem 3rem; /* Padding sedikit lebih banyak */
  color: #333; /* Warna teks utama jadi gelap */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08); /* Bayangan halus */
  position: sticky; /* Membuat navbar tetap di atas saat scroll */
  top: 0;
  z-index: 1000; /* Pastikan di atas elemen lain */
  width: 100%;
  box-sizing: border-box; /* Agar padding tidak menambah lebar */
  transition: background-color 0.3s ease;
  font-family: 'Poppins', sans-serif; /* Sesuaikan font */
}

.brand a {
  color: #333; /* Warna brand */
  text-decoration: none;
  font-weight: 700; /* Lebih tebal */
  font-size: 1.6rem; /* Sedikit lebih besar */
  transition: color 0.3s ease;
}

.brand a strong {
  font-weight: 400; /* Nama belakang lebih ringan */
  color: #007bff; /* Warna aksen, sesuaikan */
}

.brand a:hover {
  color: #007bff; /* Warna hover */
}

.nav-links {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}

.nav-links li {
  margin-left: 30px; /* Jarak antar link lebih besar */
}

.nav-links a {
  color: #555; /* Warna link sedikit abu-abu */
  text-decoration: none;
  font-size: 1rem; /* Ukuran font standar */
  font-weight: 600; /* Sedikit tebal */
  padding: 5px 0;
  position: relative; /* Untuk garis bawah */
  transition: color 0.3s ease;
}

/* Garis bawah untuk hover dan active */
.nav-links a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px; /* Posisi garis bawah */
  left: 50%;
  background-color: #007bff; /* Warna aksen */
  transition: all 0.3s ease-in-out;
  transform: translateX(-50%);
}

.nav-links a:hover,
.nav-links a.router-link-exact-active {
  color: #007bff; /* Warna link saat hover/active */
}

.nav-links a:hover::after,
.nav-links a.router-link-exact-active::after {
  width: 100%; /* Garis bawah muncul penuh */
}

/* Responsif (Contoh sederhana untuk hamburger menu, butuh JS tambahan) */
/*
@media (max-width: 768px) {
  .nav-links {
    display: none; // Sembunyikan link di mobile, ganti dengan hamburger
  }
  // Anda perlu menambahkan tombol hamburger dan logika untuk menampilkannya
}
*/
</style>
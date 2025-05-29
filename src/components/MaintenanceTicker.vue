<template>
  <div class="led-board-wrapper">
    <div class="led-board">
      <div class="scrolling-content">
        <span class="icon">⚠️</span>
        <span>SITE STILL UNDER DEVELOPMENT</span>
        <span class="separator">//</span>
        <span class="countdown">
          ESTIMATED COMPLETION IN:
          <span class="time">{{ days }} DAY</span> :
          <span class="time">{{ hours }} HOUR</span> :
          <span class="time">{{ minutes }} MINUTES</span> :
          <span class="time">{{ seconds }} SECOND</span>
        </span>
        <span class="separator">//</span>
        <span class="icon">🚧</span>
        <span>THIS WEBSITE WILL BE AVAILABLE SOON</span>
        <span class="separator">//</span>

        <span class="icon">⚠️</span>
        <span>SITE STILL UNDER DEVELOPMENT</span>
        <span class="separator">//</span>
        <span class="countdown">
          ESTIMATED COMPLETION IN:
          <span class="time">{{ days }} DAY</span> :
          <span class="time">{{ hours }} HOUR</span> :
          <span class="time">{{ minutes }} MINUTES</span> :
          <span class="time">{{ seconds }} SECOND</span>
        </span>
        <span class="separator">//</span>
        <span class="icon">🚧</span>
        <span>THIS WEBSITE WILL BE AVAILABLE SOON</span>
        <span class="separator">//</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MaintenanceTicker',
  data() {
    return {
      // Atur tanggal target Anda di sini (Tahun, Bulan-1, Hari, Jam, Menit, Detik)
      // Bulan di JavaScript dimulai dari 0 (Januari) hingga 11 (Desember)
      // Jadi Agustus adalah bulan ke-7.
      // Kita set 17 Agustus 2025 00:00:00
      targetDate: new Date(2025, 7, 17, 0, 0, 0).getTime(),
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
      timerInterval: null // Untuk menyimpan interval agar bisa dihapus
    };
  },
  methods: {
    calculateTimeLeft() {
      const now = new Date().getTime();
      const distance = this.targetDate - now;

      if (distance < 0) {
        // Jika waktu sudah lewat, hentikan timer dan tampilkan pesan
        clearInterval(this.timerInterval);
        this.days = '00';
        this.hours = '00';
        this.minutes = '00';
        this.seconds = '00';
        // Anda bisa mengubah teks countdown di sini jika mau
        return;
      }

      // Hitung hari, jam, menit, detik
      this.days = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
      this.hours = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
      this.minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      this.seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
    },
    startTimer() {
      this.calculateTimeLeft(); // Panggil sekali saat mulai
      // Set interval untuk update setiap 1 detik
      this.timerInterval = setInterval(this.calculateTimeLeft, 1000);
    }
  },
  mounted() {
    // Mulai timer saat komponen dimuat
    this.startTimer();
  },
  beforeUnmount() {
    // Hentikan timer saat komponen dihancurkan (penting untuk mencegah memory leak)
    clearInterval(this.timerInterval);
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

.led-board-wrapper {
  padding: 10px;
  background-color: #1a1a1a;
  border-radius: 5px;
  margin: 30px 0;
}

.led-board {
  background-color: #080808;
  padding: 20px 0;
  overflow: hidden;
  white-space: nowrap;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.8);
  border: 1px solid #000;
}

.scrolling-content {
  display: inline-block; /* Agar bisa dianimasikan */
  animation: scroll-left 30s linear infinite; /* Sedikit lebih lambat */
  /* HAPUS BARIS INI: padding-left: 100%; */
}

.scrolling-content span {
  font-family: 'VT323', 'Courier New', monospace;
  font-size: 1.8rem;
  font-weight: normal;
  color: #FFD700;
  text-transform: uppercase;
  margin: 0 30px;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.6),
               0 0 3px rgba(255, 255, 255, 0.3);
  vertical-align: middle;
}

.scrolling-content span.icon {
    font-size: 1.5rem;
    color: #FF6347;
    text-shadow: 0 0 8px rgba(255, 99, 71, 0.6);
}

.scrolling-content span.separator {
    color: #555;
    text-shadow: none;
    font-weight: bold;
}

/* Style untuk Countdown */
.scrolling-content span.countdown {
    color: #00FF64; /* Warna hijau untuk countdown */
    text-shadow: 0 0 8px rgba(0, 255, 100, 0.6);
}

.scrolling-content span.countdown .time {
    color: #FFFFFF; /* Warna putih untuk angka */
    background-color: #333; /* Background gelap untuk angka */
    padding: 2px 6px;
    border-radius: 3px;
    margin: 0 3px;
    text-shadow: none;
    font-size: 1.7rem; /* Sedikit lebih kecil agar pas */
    border: 1px solid #444;
}

@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.led-board:hover .scrolling-content {
    animation-play-state: paused;
}
</style>
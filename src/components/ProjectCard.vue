<template>
  <div class="project-card">
    <a :href="project.link" target="_blank" rel="noopener noreferrer" class="card-link">
      <div class="image-container">
        <img :src="project.imageUrl" :alt="project.title" class="project-image">
        <div class="overlay">
          <i class="fas fa-link"></i> </div>
      </div>
      <div class="card-content">
        <h3 class="project-title">{{ project.title }}</h3>
        <p class="project-description">{{ project.description }}</p>
        <div class="tags">
            <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: 'ProjectCard',
  props: {
    project: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.project-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  overflow: hidden; /* Pastikan gambar tidak keluar dari radius */
  width: 100%; /* Lebar penuh sesuai sel grid */
  max-width: 350px; /* Batas lebar maks (opsional) */
  text-align: left;
  display: flex; /* Untuk memastikan link mengisi kartu */
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.card-link {
  text-decoration: none;
  color: inherit; /* Mewarisi warna teks */
  display: flex;
  flex-direction: column;
  height: 100%; /* Link mengisi tinggi kartu */
}

.image-container {
  position: relative;
  width: 100%;
  padding-top: 60%; /* Aspect ratio 5:3 (60% dari lebar) */
  overflow: hidden;
}

.project-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.project-card:hover .project-image {
  transform: scale(1.05); /* Efek zoom gambar saat hover */
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 123, 255, 0.6); /* Warna overlay (biru) */
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.4s ease;
  color: white;
  font-size: 2.5rem;
}

.project-card:hover .overlay {
  opacity: 1;
}

.card-content {
  padding: 20px 25px;
  flex-grow: 1; /* Konten mengisi ruang yang tersisa */
  display: flex;
  flex-direction: column;
}

.project-title {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
}

.project-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  flex-grow: 1; /* Deskripsi mengisi ruang */
}

.tags {
  margin-top: auto; /* Mendorong tags ke bawah */
  padding-top: 10px; /* Jarak dari deskripsi */
  display: flex;
  flex-wrap: wrap;
  gap: 8px; /* Jarak antar tag */
}

.tag {
  display: inline-block;
  background-color: #e9ecef; /* Warna background tag */
  color: #495057; /* Warna teks tag */
  padding: 5px 12px;
  border-radius: 15px; /* Tag lebih rounded */
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
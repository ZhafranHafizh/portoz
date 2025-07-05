<template>
  <div class="about-view">
    <!-- Background parallax elements -->
    <div class="parallax-bg" :style="backgroundParallaxStyle"></div>
    <div class="parallax-shapes">
      <div class="shape shape-1" :style="shape1ParallaxStyle"></div>
      <div class="shape shape-2" :style="shape2ParallaxStyle"></div>
      <div class="shape shape-3" :style="shape3ParallaxStyle"></div>
    </div>

    <section class="about-me-section" :style="aboutSectionParallaxStyle">
      <h1>About Me</h1>
      <div class="content">
        <img src="@/assets/Face.jpg" alt="My Photo" class="about-pic" :style="imageParallaxStyle">
        <div class="text" :style="textParallaxStyle">
          <p>
            Hi! I'm Zhafran Hafizh, a passionate UI/UX Designer with experience in front-end web development and UI/UX design.
            I love turning complex ideas into elegant and user-friendly solutions.
          </p>
          <p>
            I have expertise in technologies such as Vue.js, Figma, Adobe XD, and more.
            I'm always eager to learn new things and collaborate on challenging and impactful projects.
          </p>
        </div>
      </div>
    </section>

    <section class="timeline-section" :style="timelineParallaxStyle">
      <h2 class="section-title">My Journey & Achievements</h2>
      <div class="timeline">
        <div v-for="(item, index) in timelineData" :key="item.year" class="timeline-item" :style="getTimelineItemStyle(index)">
          <div class="timeline-marker">
            <div class="timeline-year">{{ item.year }}</div>
          </div>
          <div class="timeline-content">
            <div v-if="item.year === '2025'" class="progress-indicator">
              <span class="progress-badge">
                <i class="fas fa-clock"></i>
                In Progress
              </span>
            </div>
            <ul>
              <li v-for="(achievement, achievementIndex) in item.achievements" :key="achievementIndex">
                <strong>{{ achievement.title }}</strong> - {{ achievement.description }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: 'AboutView',
  data() {
    return {
      scrollY: 0,
      timelineData: [
        {
          year: '2021',
          achievements: [
            { title: 'Started My Journey at Telkom University', description: 'Began my undergraduate studies in Software Engineering and immediately joined CHEVA Lab as a UI/UX designer.' },
            { title: 'First App & Web Design Project', description: 'Created UI designs for websites and apps as a final project for the Design Thinking course.' },
            { title: 'Simple Game Development', description: 'Developed a simple game for the final project in the Introduction to Software Engineering course.' },
          ]
        },
        {
          year: '2022',
          achievements: [
            { title: 'UI/UX Designer for DetectMe Project', description: 'Responsible for creating UI/UX designs, prototypes, and various visual assets for the project.' },
            { title: 'Software Engineering Documentation Specialist', description: 'Created SRS (Software Requirements Specification) documents for an emergency service application.' },
            { title: 'Store Management App UI Design', description: 'Designed the interface for a store management app as part of the Human-Computer Interaction course.' },
          ]
        },
        {
          year: '2023',
          achievements: [
            { title: 'UI/UX Designer at Chevalier LAB', description: 'Contributed to UI/UX development for LMS (Learning Management System) and coffee shop app projects.' },
            { title: 'Developed Various Web Applications', description: 'Developed websites for hospital consultation registration and campus facility rental systems.' },
          ]
        },
        {
          year: '2024',
          achievements: [
            { title: 'Internship as Scrum Master', description: 'Interned at HUMIC Research Center, leading Daily Standups and Sprint Planning.' },
            { title: 'Internship as Web Developer (Front End)', description: 'Interned at PT. Jakarta International Container Terminal, updating the appearance and functions of the monitoring system.' },
            { title: 'Web Programming Lab Assistant', description: 'Guided students in the concepts and implementation of HTML, CSS, JavaScript, and related frameworks at the Informatics Laboratory, Telkom University.' },
          ]
        },
        {
          year: '2025',
          achievements: [
            { title: 'Final Project Development', description: 'Designed the UI and developed the proposal for the Teaching Plotting Information System as a final project.' },
            { title: 'DevOps Process Implementation', description: 'Implemented CI/CD and DevOps processes into the MySkin project.' },
          ]
        },
      ]
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrollY = window.scrollY;
    },
    getTimelineItemStyle(index) {
      const offset = index * 50; // Stagger each timeline item
      return {
        transform: `translateY(${(this.scrollY - offset) * -0.1}px)`,
        transition: 'transform 0.1s ease-out'
      };
    }
  },
  computed: {
    backgroundParallaxStyle() {
      return {
        transform: `translateY(${this.scrollY * 0.5}px)`
      };
    },
    shape1ParallaxStyle() {
      return {
        transform: `translate(${this.scrollY * 0.2}px, ${this.scrollY * 0.3}px) rotate(${this.scrollY * 0.1}deg)`
      };
    },
    shape2ParallaxStyle() {
      return {
        transform: `translate(${this.scrollY * -0.15}px, ${this.scrollY * 0.25}px) rotate(${this.scrollY * -0.08}deg)`
      };
    },
    shape3ParallaxStyle() {
      return {
        transform: `translate(${this.scrollY * 0.1}px, ${this.scrollY * -0.2}px) rotate(${this.scrollY * 0.05}deg)`
      };
    },
    aboutSectionParallaxStyle() {
      return {
        transform: `translateY(${this.scrollY * -0.2}px)`
      };
    },
    imageParallaxStyle() {
      return {
        transform: `translateY(${this.scrollY * -0.15}px)`
      };
    },
    textParallaxStyle() {
      return {
        transform: `translateY(${this.scrollY * -0.1}px)`
      };
    },
    timelineParallaxStyle() {
      return {
        transform: `translateY(${this.scrollY * -0.05}px)`
      };
    }
  }
}
</script>

<style scoped>
/* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap'); */

.about-view {
  position: relative;
  max-width: 900px;
  margin: 60px auto;
  padding: 2rem 1.5rem;
  font-family: 'Poppins', sans-serif;
  overflow-x: hidden;
}

/* Dark mode styles */
:global(.dark) .about-view {
  background-color: #0f0f23;
  color: #e4e4e7;
}

/* Parallax Background Elements */
.parallax-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.05) 0%, rgba(40, 167, 69, 0.05) 100%);
  z-index: -2;
  transition: transform 0.1s ease-out;
}

.parallax-shapes {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  transition: transform 0.1s ease-out;
}

.shape-1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #007bff, #28a745);
  top: 10%;
  right: 10%;
}

.shape-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(45deg, #28a745, #ffc107);
  top: 60%;
  left: 5%;
}

.shape-3 {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #ffc107, #007bff);
  top: 30%;
  left: 15%;
}

/* Styling untuk bagian 'Tentang Saya' (ambil dari About.vue sebelumnya) */
.about-me-section {
  position: relative;
  z-index: 1;
  text-align: center;
  margin-bottom: 80px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.1s ease-out;
}

:global(.dark) .about-me-section {
  background-color: rgba(26, 26, 46, 0.9);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.about-me-section h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 40px;
}

:global(.dark) .about-me-section h1 {
  color: #e4e4e7;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
}
.about-pic {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  margin-bottom: 20px;
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}
.about-pic:hover { 
  transform: scale(1.05); 
}
.text {
  max-width: 600px;
  transition: transform 0.1s ease-out;
}
.text p {
  line-height: 1.7;
  margin-bottom: 15px;
  color: #555;
}

:global(.dark) .text p {
  color: #a1a1aa;
}

@media (min-width: 768px) {
  .content {
    flex-direction: row;
    text-align: left;
  }
  .about-pic {
    margin-right: 40px;
    margin-bottom: 0;
    width: 250px; /* Sedikit lebih besar di desktop */
    height: 250px;
  }
}

/* Styling untuk bagian Timeline BARU */
.timeline-section {
  position: relative;
  z-index: 1;
  margin-top: 80px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.1s ease-out;
}

:global(.dark) .timeline-section {
  background-color: rgba(26, 26, 46, 0.95);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 60px;
  position: relative;
  display: inline-block;
  padding-bottom: 10px;
}

:global(.dark) .section-title {
  color: #e4e4e7;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 4px;
  background-color: #28a745; /* Warna aksen berbeda */
  border-radius: 2px;
}

.timeline {
  position: relative;
  max-width: 700px;
  margin: 0 auto;
  padding: 20px 0;
}

/* Garis vertikal utama */
.timeline::before {
  content: '';
  position: absolute;
  left: 60px;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #e9ecef;
  border-radius: 2px;
}

:global(.dark) .timeline::before {
  background-color: #374151;
}

.timeline-item {
  display: flex;
  margin-bottom: 40px;
  position: relative;
  align-items: flex-start; /* Rata atas */
  transition: transform 0.1s ease-out;
}

/* Hapus margin bottom item terakhir */
.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: 60px;
  top: 0;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #fff;
  border: 4px solid #007bff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  box-shadow: 0 0 0 6px #fff;
  transition: border-color 0.3s ease;
}

:global(.dark) .timeline-marker {
  background-color: #1a1a2e;
  border-color: #60a5fa;
  box-shadow: 0 0 0 6px #1a1a2e;
}

.timeline-item:hover .timeline-marker {
  animation: heartbeat 1.2s ease-in-out infinite;
  border-color: #0056b3;
}

:global(.dark) .timeline-item:hover .timeline-marker {
  border-color: #3b82f6;
}

@keyframes heartbeat {
  0% {
    transform: translateX(-50%) scale(1);
    box-shadow: 0 0 0 6px #fff, 0 0 10px rgba(0, 123, 255, 0.2);
  }
  30% {
    transform: translateX(-50%) scale(1.15); /* Puncak detak */
    box-shadow: 0 0 0 6px #fff, 0 0 30px rgba(0, 123, 255, 0.6); /* Glow saat puncak */
  }
  60% {
    transform: translateX(-50%) scale(1);
    box-shadow: 0 0 0 6px #fff, 0 0 10px rgba(0, 123, 255, 0.2);
  }
  100% {
    transform: translateX(-50%) scale(1);
    box-shadow: 0 0 0 6px #fff, 0 0 10px rgba(0, 123, 255, 0.2);
  }
}

.timeline-year {
  color: #007bff;
  font-weight: 700;
  font-size: 0.9rem;
}

:global(.dark) .timeline-year {
  color: #60a5fa;
}

.timeline-content {
  background-color: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px 25px;
  margin-left: 110px;
  width: 100%;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  text-align: left;
}

:global(.dark) .timeline-content {
  background-color: #1a1a2e;
  border: 1px solid #374151;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
}

.timeline-content h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 1.2rem;
}

:global(.dark) .timeline-content h4 {
  color: #e4e4e7;
}

.timeline-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.timeline-content li {
  margin-bottom: 10px;
  line-height: 1.6;
  color: #555;
  font-size: 0.95rem;
}

:global(.dark) .timeline-content li {
  color: #a1a1aa;
}

.timeline-content li:last-child {
  margin-bottom: 0;
}

.timeline-content li strong {
  font-weight: 600;
  color: #333;
}

:global(.dark) .timeline-content li strong {
  color: #e4e4e7;
}

/* Progress Indicator Styles */
.progress-indicator {
  margin-bottom: 15px;
  display: flex;
  justify-content: flex-start;
}

.progress-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  animation: pulseGlow 2s ease-in-out infinite;
}

.progress-badge i {
  font-size: 0.8rem;
  opacity: 0.9;
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.5);
  }
}

/* Penyesuaian untuk layar kecil */
@media (max-width: 768px) {
  .parallax-shapes {
    display: none; /* Hide decorative shapes on mobile for better performance */
  }
  
  .shape {
    transform: none !important; /* Disable parallax on mobile */
  }
  
  .timeline::before {
    left: 30px; /* Geser garis ke kiri */
  }
  .timeline-marker {
    left: 32px; /* Geser marker ke kiri */
    width: 40px;
    height: 40px;
    border-width: 3px;
    box-shadow: 0 0 0 4px #fff;
  }
  .timeline-year {
    font-size: 0.8rem;
  }
  .timeline-content {
    margin-left: 70px; /* Kurangi jarak */
    padding: 15px 20px;
  }
  
  /* Disable parallax effects on mobile for better performance */
  .about-me-section,
  .timeline-section,
  .about-pic,
  .text,
  .timeline-item {
    transform: none !important;
  }
}
</style>
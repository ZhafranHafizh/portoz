<template>
  <div class="contact-view">
    <!-- Animated background elements -->
    <div class="background-elements">
      <div class="floating-circle circle-1" :style="circle1Style"></div>
      <div class="floating-circle circle-2" :style="circle2Style"></div>
      <div class="floating-circle circle-3" :style="circle3Style"></div>
      <div class="wave-pattern"></div>
    </div>

    <!-- Header section with parallax -->
    <div class="header-section" :style="headerParallaxStyle">
      <h1 class="page-title" :class="{ 'visible': titleVisible }">Hubungi Saya</h1>
      <p class="page-subtitle" :class="{ 'visible': subtitleVisible }">
        Punya ide menarik, pertanyaan, atau hanya ingin menyapa? <br>
        Saya akan senang mendengar dari Anda!
      </p>
    </div>

    <!-- Contact cards with stagger animation -->
    <div class="contact-cards-container" :style="cardsParallaxStyle">
      <div class="contact-card" :class="{ 'visible': cardsVisible }">
        <div 
          v-for="(contact, index) in contactData" 
          :key="contact.id"
          class="contact-item"
          :style="getContactItemStyle(index)"
          :class="{ 'visible': cardsVisible }"
          @click="handleContactClick(contact)"
        >
          <div class="icon-wrapper" :class="contact.iconClass">
            <i :class="contact.icon"></i>
            <div class="icon-ripple"></div>
          </div>
          <div class="info-content">
            <h3>{{ contact.title }}</h3>
            <p>{{ contact.description }}</p>
            <a :href="contact.link" class="contact-link" @click.stop>
              {{ contact.linkText }}
            </a>
            <div class="contact-stats" v-if="contact.stats">
              <span class="stat-item">{{ contact.stats }}</span>
            </div>
          </div>
          <div class="hover-indicator">
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
      </div>

      <!-- Social media floating action -->
      <div class="social-floating" :class="{ 'visible': socialVisible }">
        <div class="social-title">Ikuti Saya</div>
        <div class="social-buttons">
          <a href="https://www.instagram.com/zhafranhafizh_ir/" class="social-btn instagram" target="_blank">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="https://twitter.com" class="social-btn twitter" target="_blank">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="https://dribbble.com" class="social-btn dribbble" target="_blank">
            <i class="fab fa-dribbble"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactView',
  data() {
    return {
      scrollY: 0,
      titleVisible: false,
      subtitleVisible: false,
      cardsVisible: false,
      socialVisible: false,
      contactData: [
        {
          id: 1,
          title: 'Email',
          description: 'Cara terbaik untuk menghubungi saya secara langsung.',
          icon: 'fas fa-envelope',
          iconClass: 'email',
          link: 'mailto:zhafranhafizhir@gmail.com',
          linkText: 'zhafranhafizhir@gmail.com',
          stats: 'Respon dalam 24 jam'
        },
        {
          id: 2,
          title: 'LinkedIn',
          description: 'Terhubung secara profesional dan lihat pengalaman kerja saya.',
          icon: 'fab fa-linkedin-in',
          iconClass: 'linkedin',
          link: 'https://www.linkedin.com/in/zhafran-hafizh-izdihar-riyadi-01b940223/',
          linkText: 'Kunjungi Profil LinkedIn',
          stats: '500+ Koneksi'
        },
        {
          id: 3,
          title: 'GitHub',
          description: 'Eksplorasi repository dan kontribusi open source saya.',
          icon: 'fab fa-github',
          iconClass: 'github',
          link: 'https://github.com/ZhafranHafizh',
          linkText: 'Kunjungi Profil GitHub',
          stats: '50+ Repositories'
        },
        {
          id: 4,
          title: 'WhatsApp',
          description: 'Chat langsung untuk diskusi cepat dan informal.',
          icon: 'fab fa-whatsapp',
          iconClass: 'whatsapp',
          link: 'https://wa.me/6281311501365',
          linkText: 'Chat di WhatsApp',
          stats: 'Online sekarang'
        }
      ]
    };
  },
  computed: {
    headerParallaxStyle() {
      return {
        transform: `translateY(${this.scrollY * -0.2}px)`
      };
    },
    cardsParallaxStyle() {
      return {
        transform: `translateY(${this.scrollY * -0.1}px)`
      };
    },
    circle1Style() {
      return {
        transform: `translate(${this.scrollY * 0.1}px, ${this.scrollY * 0.15}px) rotate(${this.scrollY * 0.05}deg)`
      };
    },
    circle2Style() {
      return {
        transform: `translate(${this.scrollY * -0.08}px, ${this.scrollY * 0.12}px) rotate(${this.scrollY * -0.03}deg)`
      };
    },
    circle3Style() {
      return {
        transform: `translate(${this.scrollY * 0.06}px, ${this.scrollY * -0.1}px) rotate(${this.scrollY * 0.02}deg)`
      };
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.initAnimations();
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrollY = window.scrollY;
    },
    initAnimations() {
      setTimeout(() => this.titleVisible = true, 200);
      setTimeout(() => this.subtitleVisible = true, 400);
      setTimeout(() => this.cardsVisible = true, 600);
      setTimeout(() => this.socialVisible = true, 800);
    },
    getContactItemStyle(index) {
      return {
        animationDelay: `${index * 0.15}s`
      };
    },
    handleContactClick(contact) {
      // Add click analytics or special handling
      console.log(`Clicked on ${contact.title}`);
    }
  }
}
</script>

<style scoped>
.contact-view {
  position: relative;
  max-width: 1200px;
  margin: 60px auto;
  padding: 2rem 1.5rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Background Elements */
.background-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: floatCircle 8s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #007bff, #28a745);
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(45deg, #28a745, #ffc107);
  top: 60%;
  left: 5%;
  animation-delay: 3s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #ffc107, #dc3545);
  top: 30%;
  left: 20%;
  animation-delay: 6s;
}

.wave-pattern {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' fill='%23007bff' fill-opacity='0.05'%3E%3C/path%3E%3C/svg%3E") repeat-x;
  animation: waveMove 15s ease-in-out infinite;
}

@keyframes floatCircle {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-30px) rotate(10deg); }
  66% { transform: translateY(15px) rotate(-5deg); }
}

@keyframes waveMove {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-50px); }
}

/* Header Section */
.header-section {
  margin-bottom: 80px;
  transition: transform 0.1s ease-out;
}

.page-title {
  font-size: 3.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;
  padding-bottom: 15px;
  opacity: 0;
  transform: translateY(50px);
  transition: all 1s ease;
}

.page-title.visible {
  opacity: 1;
  transform: translateY(0);
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 4px;
  background: linear-gradient(45deg, #007bff, #28a745);
  border-radius: 2px;
  animation: lineExpand 1.2s ease 0.8s forwards;
  transform-origin: center;
  scale: 0;
}

@keyframes lineExpand {
  to { scale: 1; }
}

.page-subtitle {
  font-size: 1.3rem;
  color: #666;
  margin-bottom: 60px;
  line-height: 1.8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease 0.2s;
}

.page-subtitle.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Contact Cards */
.contact-cards-container {
  transition: transform 0.1s ease-out;
}

.contact-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 60px;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease;
}

.contact-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.contact-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  text-align: left;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
}

.contact-item.visible {
  opacity: 1;
  transform: translateY(0);
}

.contact-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.contact-item:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.contact-item:hover::before {
  left: 100%;
}

.icon-wrapper {
  position: relative;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 25px;
  color: #fff;
  font-size: 2rem;
  flex-shrink: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.icon-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
}

.contact-item:hover .icon-ripple {
  width: 100px;
  height: 100px;
}

.icon-wrapper.email { background: linear-gradient(45deg, #dd4b39, #ff6b6b); }
.icon-wrapper.linkedin { background: linear-gradient(45deg, #0077b5, #00a0dc); }
.icon-wrapper.github { background: linear-gradient(45deg, #333, #666); }
.icon-wrapper.whatsapp { background: linear-gradient(45deg, #25d366, #128c7e); }

.info-content {
  flex: 1;
}

.info-content h3 {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
}

.info-content p {
  margin-bottom: 15px;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
}

.contact-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
}

.contact-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(45deg, #007bff, #28a745);
  transition: width 0.3s ease;
}

.contact-link:hover {
  color: #0056b3;
}

.contact-link:hover::after {
  width: 100%;
}

.contact-stats {
  margin-top: 10px;
  font-size: 0.8rem;
  color: #28a745;
  font-weight: 600;
}

.hover-indicator {
  position: absolute;
  top: 20px;
  right: 20px;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;
  color: #007bff;
  font-size: 1.2rem;
}

.contact-item:hover .hover-indicator {
  opacity: 1;
  transform: translateX(0);
}

/* Social Media Floating */
.social-floating {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease;
}

.social-floating.visible {
  opacity: 1;
  transform: translateY(0);
}

.social-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.social-btn.instagram {
  background: linear-gradient(45deg, #e1306c, #fd1d1d, #fcb045);
}

.social-btn.twitter {
  background: linear-gradient(45deg, #1da1f2, #0d8bd9);
}

.social-btn.dribbble {
  background: linear-gradient(45deg, #ea4c89, #f082ac);
}

.social-btn:hover {
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .contact-view {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 2.5rem;
  }
  
  .contact-card {
    grid-template-columns: 1fr;
  }
  
  .floating-circle {
    display: none;
  }
  
  /* Disable parallax on mobile */
  .header-section,
  .contact-cards-container {
    transform: none !important;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2rem;
  }
  
  .contact-item {
    flex-direction: column;
    text-align: center;
  }
  
  .icon-wrapper {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .social-buttons {
    flex-wrap: wrap;
  }
}
</style>
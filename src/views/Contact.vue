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
      <div class="header-content-wrapper">
        <h1 class="page-title" :class="{ 'visible': titleVisible }">Get In Touch</h1>
        <p class="page-subtitle" :class="{ 'visible': subtitleVisible }">
          Ready to bring your ideas to life? Whether you have a project in mind, 
          need collaboration, or just want to chat about technology and innovation, 
          I'd love to connect with you!
        </p>
        <div class="cta-buttons" :class="{ 'visible': subtitleVisible }">
          <a href="mailto:zhafranhafizhir@gmail.com" class="primary-cta">
            <i class="fas fa-envelope"></i>
            Send Email
          </a>
          <a href="#contact-methods" class="secondary-cta">
            <i class="fas fa-arrow-down"></i>
            View All Options
          </a>
        </div>
      </div>
    </div>

    <!-- Contact cards with stagger animation -->
    <div class="contact-cards-container" id="contact-methods" :style="cardsParallaxStyle">
      <div class="section-header" :class="{ 'visible': cardsVisible }">
        <h2>Choose Your Preferred Way</h2>
        <p>Select the platform that works best for you</p>
      </div>
      
      <div class="contact-card" :class="{ 'visible': cardsVisible }">
        <div 
          v-for="(contact, index) in contactData" 
          :key="contact.id"
          class="contact-item"
          :style="getContactItemStyle(index)"
          :class="{ 'visible': cardsVisible, 'featured': contact.featured }"
          @click="handleContactClick(contact)"
        >
          <div class="contact-item-header">
            <div class="icon-wrapper" :class="contact.iconClass">
              <i :class="contact.icon"></i>
              <div class="icon-ripple"></div>
            </div>
            <div class="badge-wrapper" v-if="contact.featured">
              <span class="featured-badge">Recommended</span>
            </div>
          </div>
          <div class="info-content">
            <h3>{{ contact.title }}</h3>
            <p>{{ contact.description }}</p>
            <a :href="contact.link" class="contact-link" @click.stop>
              <i :class="contact.linkIcon || 'fas fa-external-link-alt'"></i>
              {{ contact.linkText }}
            </a>
            <div class="contact-stats" v-if="contact.stats">
              <i class="fas fa-info-circle"></i>
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
        <div class="social-header">
          <i class="fas fa-share-alt"></i>
          <div class="social-title">Follow My Journey</div>
          <p class="social-subtitle">Stay updated with my latest projects and insights</p>
        </div>
        <div class="social-buttons">
          <a href="https://www.instagram.com/zhafranhafizh_ir/" class="social-btn instagram" target="_blank">
            <i class="fab fa-instagram"></i>
            <span class="social-label">Instagram</span>
          </a>
          <a href="https://twitter.com" class="social-btn twitter" target="_blank">
            <i class="fab fa-twitter"></i>
            <span class="social-label">Twitter</span>
          </a>
          <a href="https://dribbble.com" class="social-btn dribbble" target="_blank">
            <i class="fab fa-dribbble"></i>
            <span class="social-label">Dribbble</span>
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
          description: 'The most reliable way to reach me for professional inquiries and detailed discussions.',
          icon: 'fas fa-envelope',
          iconClass: 'email',
          link: 'mailto:zhafranhafizhir@gmail.com',
          linkText: 'zhafranhafizhir@gmail.com',
          linkIcon: 'fas fa-envelope',
          stats: 'Usually responds within 24 hours',
          featured: true
        },
        {
          id: 2,
          title: 'LinkedIn',
          description: 'Connect with me professionally and explore my career journey and work experience.',
          icon: 'fab fa-linkedin-in',
          iconClass: 'linkedin',
          link: 'https://www.linkedin.com/in/zhafran-hafizh-izdihar-riyadi-01b940223/',
          linkText: 'View LinkedIn Profile',
          linkIcon: 'fab fa-linkedin',
          stats: '300+ Professional connections'
        },
        {
          id: 3,
          title: 'GitHub',
          description: 'Dive into my code repositories and see my open source contributions in action.',
          icon: 'fab fa-github',
          iconClass: 'github',
          link: 'https://github.com/ZhafranHafizh',
          linkText: 'Explore GitHub Profile',
          linkIcon: 'fab fa-github',
          stats: '30+ Public repositories'
        },
        {
          id: 4,
          title: 'WhatsApp',
          description: 'For quick questions, casual conversations, and immediate collaboration discussions.',
          icon: 'fab fa-whatsapp',
          iconClass: 'whatsapp',
          link: 'https://wa.me/6281311501365',
          linkText: 'Start WhatsApp Chat',
          linkIcon: 'fab fa-whatsapp',
          stats: 'Available during business hours'
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
  margin-bottom: 100px;
  transition: transform 0.1s ease-out;
  padding: 40px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 420px;
}

.header-content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  text-align: center;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(45deg, #007bff, #28a745);
  color: white;
  padding: 10px 24px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 32px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}

.header-badge.visible {
  opacity: 1;
  transform: translateY(0);
}

.header-badge i {
  font-size: 0.8rem;
}

.page-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #333;
  margin-bottom: 32px;
  position: relative;
  display: inline-block;
  padding-bottom: 15px;
  opacity: 0;
  transform: translateY(50px);
  transition: all 1s ease 0.2s;
  background: linear-gradient(135deg, #333 0%, #555 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  animation: lineExpand 1.2s ease 1s forwards;
  transform-origin: center;
  scale: 0;
}

@keyframes lineExpand {
  to { scale: 1; }
}

.page-subtitle {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 48px;
  line-height: 1.7;
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease 0.4s;
}

.page-subtitle.visible {
  opacity: 1;
  transform: translateY(0);
}

.header-divider {
  width: 120px;
  height: 4px;
  background: linear-gradient(45deg, #007bff, #28a745);
  border-radius: 2px;
  margin: 18px 0 28px 0;
  opacity: 0.85;
}

.cta-buttons {
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease 0.6s;
  margin-top: 18px;
}

.cta-buttons.visible {
  opacity: 1;
  transform: translateY(0);
}

.primary-cta, .secondary-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.primary-cta {
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
}

.primary-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
}

.secondary-cta {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  border: 2px solid #e0e0e0;
}

.secondary-cta:hover {
  background: rgba(248, 249, 250, 1);
  transform: translateY(-2px);
  border-color: #007bff;
  color: #007bff;
}

/* Contact Cards */
.contact-cards-container {
  transition: transform 0.1s ease-out;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.section-header.visible {
  opacity: 1;
  transform: translateY(0);
}

.section-header h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.section-header p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.contact-card {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  margin-bottom: 80px;
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
  flex-direction: column;
  text-align: left;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 35px;
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
}

.contact-item.featured {
  border: 2px solid #007bff;
  box-shadow: 0 12px 40px rgba(0, 123, 255, 0.15);
}

.contact-item.visible {
  opacity: 1;
  transform: translateY(0);
}

.contact-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.badge-wrapper {
  position: relative;
}

.featured-badge {
  background: linear-gradient(45deg, #007bff, #28a745);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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
  color: #fff;
  font-size: 2rem;
  flex-shrink: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.info-content {
  flex: 1;
}

.info-content h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.info-content p {
  margin-bottom: 20px;
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
}

.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  position: relative;
  padding: 8px 16px;
  border-radius: 25px;
  background: rgba(0, 123, 255, 0.1);
  border: 1px solid rgba(0, 123, 255, 0.2);
}

.contact-link:hover {
  background: rgba(0, 123, 255, 0.15);
  transform: translateX(5px);
  border-color: #007bff;
}

.contact-stats {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #28a745;
  font-weight: 600;
  padding: 6px 12px;
  background: rgba(40, 167, 69, 0.1);
  border-radius: 15px;
  border: 1px solid rgba(40, 167, 69, 0.2);
}

.contact-stats i {
  font-size: 0.8rem;
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
  border-radius: 25px;
  padding: 40px;
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

.social-header {
  margin-bottom: 30px;
}

.social-header i {
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 15px;
}

.social-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.social-subtitle {
  font-size: 1rem;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.social-btn {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.3rem;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.social-label {
  font-size: 0.7rem;
  font-weight: 600;
  margin-top: 2px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.social-btn:hover .social-label {
  opacity: 1;
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
  transform: translateY(-5px) scale(1.1);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .contact-view {
    padding: 1.5rem 2rem;
  }
  
  .contact-card {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
  }
}

@media (max-width: 768px) {
  .contact-view {
    padding: 1rem 1.5rem;
    margin: 40px auto;
  }
  
  .page-title {
    font-size: 2.8rem;
  }
  
  .header-section {
    padding: 30px 0;
    min-height: 360px;
  }
  
  .header-content-wrapper {
    max-width: 95vw;
    padding: 0 20px;
  }
  
  .header-divider {
    width: 90px;
    margin: 12px 0 18px 0;
  }
  
  .cta-buttons {
    flex-direction: column;
    gap: 15px;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  
  .primary-cta, .secondary-cta {
    width: 100%;
    max-width: 300px;
    justify-content: center;
    padding: 16px 32px;
    margin: 0 auto;
  }
  
  .contact-cards-container {
    padding: 0 10px;
  }
  
  .contact-card {
    grid-template-columns: 1fr;
    gap: 25px;
    margin-bottom: 60px;
  }
  
  .section-header {
    margin-bottom: 40px;
  }
  
  .section-header h2 {
    font-size: 1.8rem;
  }
  
  .contact-item {
    padding: 28px 24px;
    margin: 0 5px;
    border-radius: 18px;
  }
  
  .floating-circle {
    display: none;
  }
  
  .social-floating {
    margin: 0 10px;
    padding: 35px 25px;
  }
  
  .social-buttons {
    gap: 18px;
  }
  
  .social-btn {
    width: 55px;
    height: 55px;
  }
  
  /* Disable parallax on mobile */
  .header-section,
  .contact-cards-container {
    transform: none !important;
  }
}

@media (max-width: 480px) {
  .contact-view {
    padding: 1rem 1.2rem;
    margin: 30px auto;
  }
  
  .header-section {
    padding: 20px 15px;
    min-height: 300px;
  }
  
  .header-content-wrapper {
    max-width: 96vw;
    padding: 0 15px;
  }
  
  .header-badge {
    font-size: 0.85rem;
    padding: 8px 16px;
    margin-bottom: 20px;
  }
  
  .page-title {
    font-size: 2.2rem;
    margin-bottom: 20px;
  }
  
  .page-subtitle {
    font-size: 1rem;
    margin-bottom: 25px;
    line-height: 1.6;
  }
  
  .cta-buttons {
    flex-direction: column;
    gap: 12px;
    margin-top: 15px;
    align-items: center;
    justify-content: center;
    width: 100%;
    text-align: center;
  }
  
  .primary-cta, .secondary-cta {
    width: 100%;
    max-width: 280px;
    justify-content: center;
    font-size: 0.95rem;
    padding: 14px 24px;
    margin: 0 auto;
    display: flex;
  }
  
  .contact-cards-container {
    padding: 0 15px;
  }
  
  .section-header {
    margin-bottom: 30px;
  }
  
  .section-header h2 {
    font-size: 1.6rem;
    margin-bottom: 8px;
  }
  
  .section-header p {
    font-size: 0.95rem;
  }
  
  .contact-card {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 40px;
  }
  
  .contact-item {
    padding: 24px 20px;
    margin: 0 5px;
    border-radius: 15px;
  }
  
  .icon-wrapper {
    width: 50px;
    height: 50px;
    font-size: 1.3rem;
  }
  
  .info-content h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
  
  .info-content p {
    font-size: 0.9rem;
    margin-bottom: 16px;
    line-height: 1.5;
  }
  
  .contact-link {
    font-size: 0.9rem;
    padding: 8px 14px;
  }
  
  .contact-stats {
    font-size: 0.8rem;
    padding: 5px 10px;
    margin-top: 12px;
  }
  
  .social-floating {
    padding: 25px 20px;
    border-radius: 15px;
    margin: 0 15px 20px;
  }
  
  .social-header {
    margin-bottom: 25px;
  }
  
  .social-header i {
    font-size: 1.8rem;
    margin-bottom: 12px;
  }
  
  .social-title {
    font-size: 1.3rem;
    margin-bottom: 6px;
  }
  
  .social-subtitle {
    font-size: 0.9rem;
  }
  
  .social-buttons {
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .social-btn {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
    border-radius: 12px;
  }
}
</style>
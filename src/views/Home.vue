<template>
  <div class="home-view">
    <main class="content-shell">
      <section class="hero" aria-labelledby="home-hero-title">
        <div class="hero-geometry" aria-hidden="true">
          <span class="geo-circle"></span>
          <span class="geo-line"></span>
          <span class="geo-diamond"></span>
        </div>
        <p class="hero-kicker">Portfolio</p>
        <h1 id="home-hero-title" class="hero-title" v-html="homeContent.hero.title"></h1>
        <p class="hero-subtitle" v-html="homeContent.hero.subtitle"></p>
        <router-link :to="homeContent.hero.cta_link" class="cta-button">
          {{ homeContent.hero.cta_text }}
        </router-link>
      </section>

      <section class="grid-section" aria-label="Highlights">
        <article class="info-card" v-for="(item, index) in highlights" :key="item.title">
          <div class="card-heading">
            <span class="card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                <path :d="iconPaths[index % iconPaths.length]" />
              </svg>
            </span>
            <h2>{{ item.title }}</h2>
          </div>
          <p>{{ item.description }}</p>
        </article>
      </section>

      <section class="summary-section" aria-label="About this site">
        <h2>Built for clarity and impact</h2>
        <p class="summary-text" v-html="homeContent.hero.description"></p>
      </section>
    </main>
  </div>
</template>

<script>
import { supabase } from '@/config/supabaseClient';

export default {
  name: 'HomeView',
  data() {
    return {
      homeContent: {
        hero: {
          title: "Hello, I'm <strong>Zhafran Hafizh</strong>",
          subtitle: 'Software Engineer who turns product ideas into polished digital experiences.',
          description: 'I focus on UI/UX, front-end engineering, and software quality to deliver products that feel intuitive, fast, and reliable.',
          cta_text: 'See my works',
          cta_link: '/projects'
        }
      },
      highlights: [
        {
          title: 'Product-focused engineering',
          description: 'From user flow to final release, I align technical decisions with product outcomes.'
        },
        {
          title: 'Frontend craftsmanship',
          description: 'I build responsive, accessible interfaces with consistent interaction and visual rhythm.'
        },
        {
          title: 'Quality-first workflow',
          description: 'Testing, review, and refinement are integrated early to keep delivery stable and predictable.'
        },
        {
          title: 'Collaboration-ready',
          description: 'I communicate clearly with design, product, and engineering teams to keep momentum high.'
        }
      ],
      iconPaths: [
        'M4 12h16M12 4v16M6 6l12 12',
        'M4 18L10 6l4 8 2-4 4 8',
        'M6 8h12M6 12h8M6 16h12',
        'M5 12h4l2-6 2 12 2-6h4'
      ]
    };
  },
  mounted() {
    this.fetchHomeContent();
  },
  methods: {
    async fetchHomeContent() {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('*')
          .eq('page', 'home');

        if (error || !data || data.length === 0) return;

        data.forEach(item => {
          if (item.section === 'hero' && Object.prototype.hasOwnProperty.call(this.homeContent.hero, item.key)) {
            let value = item.value;
            if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
              value = value.slice(1, -1);
            }
            this.homeContent.hero[item.key] = value;
          }
        });
      } catch (error) {
        console.error('Error fetching home content:', error);
      }
    }
  }
}
</script>

<style scoped>
.home-view {
  background: linear-gradient(180deg, #fafaf9 0%, #f5f5f4 100%);
  min-height: calc(100vh - 80px);
  padding: 3rem 1.25rem 4rem;
}

:global(body.dark-theme) .home-view {
  background: linear-gradient(180deg, #1c1917 0%, #0c0a09 100%);
}

:global(body.dark-theme) .hero {
  border-color: rgba(251, 146, 60, 0.22);
  background:
    linear-gradient(135deg, rgba(249, 115, 22, 0.18), rgba(28, 25, 23, 0.15) 55%),
    linear-gradient(180deg, rgba(41, 37, 36, 0.94), rgba(28, 25, 23, 0.92));
}

:global(body.dark-theme) .hero::after {
  background-image:
    linear-gradient(to right, rgba(251, 146, 60, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(251, 146, 60, 0.08) 1px, transparent 1px);
}

.content-shell {
  --section-gap: 3.5rem;
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--section-gap);
}

.hero {
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  padding: clamp(1.5rem, 3vw, 2.25rem);
  border-radius: 18px;
  border: 1px solid rgba(249, 115, 22, 0.14);
  background:
    linear-gradient(135deg, rgba(249, 115, 22, 0.12), rgba(255, 255, 255, 0) 52%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.9));
  overflow: hidden;
}

.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(249, 115, 22, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(249, 115, 22, 0.05) 1px, transparent 1px);
  background-size: 34px 34px;
  opacity: 0.35;
  pointer-events: none;
  mask-image: radial-gradient(circle at 50% 35%, #000 40%, transparent 85%);
}

.hero > * {
  position: relative;
  z-index: 1;
}

.hero-geometry {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.geo-circle,
.geo-line,
.geo-diamond {
  position: absolute;
  opacity: 0.55;
}

.geo-circle {
  width: 68px;
  height: 68px;
  border: 1px solid rgba(249, 115, 22, 0.45);
  border-radius: 50%;
  right: 4%;
  top: 14%;
}

.geo-line {
  width: 88px;
  height: 1px;
  background: linear-gradient(90deg, rgba(249, 115, 22, 0), rgba(249, 115, 22, 0.42), rgba(249, 115, 22, 0));
  left: 8%;
  bottom: 22%;
}

.geo-diamond {
  width: 10px;
  height: 10px;
  border: 1px solid rgba(249, 115, 22, 0.55);
  transform: rotate(45deg);
  right: 16%;
  bottom: 16%;
}

.hero-kicker {
  margin: 0 0 0.75rem;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #f97316;
}

.hero-title {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.2rem);
  line-height: 1.2;
  color: #1c1917;
}

.hero-title :deep(strong) {
  color: #f97316;
}

.hero-subtitle {
  margin: 1rem auto 1.75rem;
  max-width: 640px;
  font-size: clamp(1rem, 2.2vw, 1.2rem);
  color: #44403c;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.35rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #fb923c, #f97316);
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.cta-button:hover {
  background: #ea580c;
  transform: translateY(-1px);
}

.grid-section {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1.25rem;
  position: relative;
}

.grid-section::before {
  content: '';
  position: absolute;
  inset: -6px;
  background-image: radial-gradient(rgba(120, 113, 108, 0.1) 0.6px, transparent 0.6px);
  background-size: 12px 12px;
  opacity: 0.25;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent);
}

.info-card {
  grid-column: span 6;
  background: #ffffff;
  border: 1px solid #e7e5e4;
  border-radius: 12px;
  padding: 1.25rem;
  position: relative;
}

.card-heading {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.55rem;
}

.card-icon {
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 8px;
  border: 1px solid rgba(249, 115, 22, 0.32);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(249, 115, 22, 0.06);
}

.card-icon svg {
  width: 1rem;
  height: 1rem;
  fill: none;
  stroke: #ea580c;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.info-card h2 {
  margin: 0;
  font-size: 1.1rem;
  color: #1c1917;
  text-align: left;
}

.info-card p {
  margin: 0;
  color: #57534e;
  text-align: left;
}

.summary-section {
  background: #ffffff;
  border: 1px solid #e7e5e4;
  border-radius: 12px;
  padding: 1.5rem;
}

.summary-section h2 {
  margin: 0 0 0.75rem;
  text-align: left;
  color: #1c1917;
}

.summary-text {
  margin: 0;
  text-align: left;
  color: #57534e;
}

:global(body.dark-theme) .hero-title,
:global(body.dark-theme) .summary-section h2,
:global(body.dark-theme) .info-card h2 {
  color: #f5f5f4;
}

:global(body.dark-theme) .hero-subtitle,
:global(body.dark-theme) .summary-text,
:global(body.dark-theme) .info-card p {
  color: #d6d3d1;
}

:global(body.dark-theme) .info-card,
:global(body.dark-theme) .summary-section {
  background: #292524;
  border-color: #44403c;
}

:global(body.dark-theme) .card-icon {
  border-color: rgba(251, 146, 60, 0.4);
  background: rgba(251, 146, 60, 0.08);
}

:global(body.dark-theme) .card-icon svg {
  stroke: #fdba74;
}

@media (max-width: 900px) {
  .content-shell {
    --section-gap: 3rem;
  }

  .info-card {
    grid-column: span 12;
  }
}

@media (max-width: 640px) {
  .home-view {
    padding-top: 2.25rem;
  }

  .content-shell {
    --section-gap: 2.5rem;
  }
}
</style>

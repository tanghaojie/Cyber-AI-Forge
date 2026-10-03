<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { THEME_COLORS, type ThemeColor } from '@cyber-ai-forge/design-tokens'
import structureArtwork from './assets/prism-structure.png'
import BrandMark from './components/BrandMark.vue'
import ProductScene from './components/ProductScene.vue'
import { content, GITHUB_URL, type Locale } from './content'
const props = defineProps<{ initialLocale: Locale }>()
const locale = ref<Locale>(props.initialLocale)
const t = computed(() => content[locale.value])
const mobileMenuOpen = ref(false)
const activeScene = ref(0)
const copied = ref(false)
const themeColors = THEME_COLORS
const theme = ref<ThemeColor>('jade')
const darkMode = ref(false)
const themeNames = {
  zh: ['翡翠', '朱砂', '黑白', '蔚蓝', '鸢尾', '琥珀'],
  en: ['Jade', 'Civic', 'Mono', 'Azure', 'Violet', 'Amber'],
}
const languageLinks = computed(() => ({
  en: locale.value === 'zh' ? '../' : './',
  zh: locale.value === 'zh' ? './' : 'zh/',
}))
const commands = `pnpm install
Copy-Item apps/backend/env/.env.foundation.example apps/backend/env/.env.foundation.local
Copy-Item apps/backend/env/.env.platform.example apps/backend/env/.env.platform.local
pnpm db:migrate
pnpm dev`
function closeMobileMenu(): void {
  mobileMenuOpen.value = false
}
function selectScene(direction: number): void {
  activeScene.value =
    (activeScene.value + direction + t.value.showcase.scenes.length) %
    t.value.showcase.scenes.length
}
function toggleDarkMode(): void {
  darkMode.value = !darkMode.value
  applyAppearance()
}
function applyAppearance(): void {
  document.documentElement.dataset.theme = theme.value
  document.documentElement.classList.toggle('dark', darkMode.value)
  try {
    localStorage.setItem(
      'forge-website-appearance',
      JSON.stringify({ theme: theme.value, darkMode: darkMode.value }),
    )
  } catch {
    /* Appearance remains usable when persistence is blocked. */
  }
}
onMounted(function restoreAppearance() {
  try {
    const saved = JSON.parse(localStorage.getItem('forge-website-appearance') ?? 'null')
    if (saved && THEME_COLORS.includes(saved.theme)) {
      theme.value = saved.theme
      darkMode.value = saved.darkMode === true
    }
  } catch {
    /* Invalid or unavailable preferences use the default. */
  }
  applyAppearance()
})
async function copyCommands(): Promise<void> {
  try {
    await navigator.clipboard.writeText(commands)
    copied.value = true
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <a class="skip-link" href="#main-content">{{ t.skip }}</a>

  <header class="site-header" :class="{ 'is-open': mobileMenuOpen }">
    <div class="header-inner">
      <a class="brand-lockup" href="#top" aria-label="Cyber AI Forge home" @click="closeMobileMenu">
        <BrandMark />
        <span><strong>CYBER</strong><small>AI FORGE</small></span>
      </a>

      <nav class="desktop-nav" :aria-label="t.header.menuLabel">
        <a v-for="item in t.header.nav" :key="item.href" :href="item.href">{{ item.label }}</a>
      </nav>

      <div class="header-actions">
        <div class="appearance-controls">
          <select
            v-model="theme"
            :aria-label="locale === 'zh' ? '主题色' : 'Theme color'"
            @change="applyAppearance"
          >
            <option v-for="(color, index) in themeColors" :key="color" :value="color">
              {{ themeNames[locale][index] }}
            </option></select
          ><button
            type="button"
            :aria-pressed="darkMode"
            :aria-label="locale === 'zh' ? '切换深色模式' : 'Toggle dark mode'"
            @click="toggleDarkMode"
          >
            {{ darkMode ? '◐' : '◑' }}
          </button>
        </div>
        <div
          class="language-switcher"
          :class="{ 'is-zh': locale === 'zh' }"
          :aria-label="t.header.languageLabel"
          role="group"
        >
          <a
            :class="{ 'is-active': locale === 'en' }"
            :aria-current="locale === 'en' ? 'page' : undefined"
            aria-label="English"
            :href="languageLinks.en"
          >
            EN
          </a>
          <a
            :class="{ 'is-active': locale === 'zh' }"
            :aria-current="locale === 'zh' ? 'page' : undefined"
            aria-label="中文"
            :href="languageLinks.zh"
          >
            中
          </a>
        </div>

        <a class="header-github" :href="GITHUB_URL" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.88c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.57 9.57 0 0 1 12 6.82a9.6 9.6 0 0 1 2.5.34c1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86V21c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
            />
          </svg>
          <span>{{ t.header.github }}</span>
        </a>

        <button
          class="menu-toggle"
          type="button"
          :aria-label="t.header.menuLabel"
          :aria-expanded="mobileMenuOpen"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span></span><span></span>
        </button>
      </div>
    </div>

    <nav class="mobile-nav" :aria-label="t.header.menuLabel">
      <a
        v-for="(item, index) in t.header.nav"
        :key="item.href"
        :href="item.href"
        @click="closeMobileMenu"
        ><small>0{{ index + 1 }}</small
        >{{ item.label }}</a
      >
      <a :href="GITHUB_URL" target="_blank" rel="noreferrer" @click="closeMobileMenu"
        ><small>↗</small>{{ t.header.github }}</a
      >
    </nav>
  </header>

  <main id="main-content">
    <section id="top" class="hero-section">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="container hero-layout">
        <div class="hero-copy">
          <div class="eyebrow reveal"><i></i>{{ t.hero.eyebrow }}</div>
          <h1 class="hero-title reveal">
            <span>{{ t.hero.titleTop }}</span
            ><span class="outline-text">{{ t.hero.titleBottom }}</span>
          </h1>
          <p class="hero-lead reveal">{{ t.hero.lead }}</p>
          <div class="hero-actions reveal">
            <a class="button button-primary" :href="GITHUB_URL" target="_blank" rel="noreferrer"
              ><span>{{ t.hero.source }}</span
              ><i aria-hidden="true">↗</i></a
            >
            <a class="button button-ghost" href="#showcase"
              ><span>{{ t.hero.explore }}</span
              ><i aria-hidden="true">↓</i></a
            >
          </div>
        </div>

        <figure class="hero-machine" aria-hidden="true">
          <img :src="structureArtwork" alt="" width="1024" height="1024" fetchpriority="high" />
          <figcaption>FORM / STRUCTURE / CONTINUITY</figcaption>
        </figure>

        <div class="hero-status reveal">
          <span><i></i>{{ t.hero.signal }}</span
          ><b>CYBER / 0.1.0</b>
        </div>
      </div>

      <div class="hero-stats container reveal">
        <div v-for="stat in t.hero.stats" :key="stat.label">
          <strong>{{ stat.value }}</strong
          ><span>{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <section class="manifesto-section light-section">
      <div class="container">
        <div class="section-heading dark-heading reveal">
          <span class="section-label">{{ t.manifesto.label }}</span>
          <h2>{{ t.manifesto.title }}</h2>
          <p>{{ t.manifesto.lead }}</p>
        </div>
        <div class="comparison-grid reveal">
          <article class="comparison-card is-muted">
            <span class="comparison-index">A /</span>
            <h3>{{ t.manifesto.directTitle }}</h3>
            <p>{{ t.manifesto.directText }}</p>
            <div class="broken-line" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
          </article>
          <article class="comparison-card is-cyber">
            <span class="comparison-index">B /</span>
            <h3>{{ t.manifesto.cyberTitle }}</h3>
            <p>{{ t.manifesto.cyberText }}</p>
            <div class="node-line" aria-hidden="true">
              <i></i><i></i><i></i><i></i><span></span>
            </div>
          </article>
        </div>
        <blockquote class="manifesto-quote reveal">
          <span>“</span>{{ t.manifesto.quote }}
        </blockquote>
      </div>
    </section>

    <section id="showcase" class="showcase-section container">
      <div class="section-heading">
        <span class="section-label">{{ t.showcase.label }}</span>
        <h2>{{ t.showcase.title }}</h2>
        <p>{{ t.showcase.lead }}</p>
      </div>
      <div class="scene-pagination" role="group" :aria-label="t.showcase.sceneLabel">
        <button
          v-for="(scene, index) in t.showcase.scenes"
          :key="scene.code"
          type="button"
          :aria-pressed="activeScene === index"
          :class="{ 'is-active': activeScene === index }"
          @click="activeScene = index"
        >
          <span>{{ String(index + 1).padStart(2, '0') }}</span
          >{{ scene.title }}
        </button>
      </div>
      <figure
        class="showcase-frame"
        tabindex="0"
        :aria-label="t.showcase.sceneLabel"
        @keydown.left.prevent="selectScene(-1)"
        @keydown.right.prevent="selectScene(1)"
      >
        <ProductScene :scene="t.showcase.scenes[activeScene]" />
        <figcaption>
          <span>{{
            locale === 'zh'
              ? 'PRISM 界面设计预览 · 示例数据'
              : 'PRISM UI design preview · sample data'
          }}</span
          ><span>{{ String(activeScene + 1).padStart(2, '0') }} / 06</span>
        </figcaption>
      </figure>
      <div class="showcase-caption" aria-live="polite">
        <h3>{{ t.showcase.scenes[activeScene].title }}</h3>
        <p>{{ t.showcase.scenes[activeScene].description }}</p>
      </div>
    </section>

    <section id="features" class="features-section light-section">
      <div class="container">
        <div class="section-heading dark-heading reveal">
          <span class="section-label">{{ t.features.label }}</span>
          <h2>{{ t.features.title }}</h2>
          <p>{{ t.features.lead }}</p>
        </div>
        <div class="feature-grid">
          <article
            v-for="(feature, index) in t.features.items"
            :key="index"
            class="feature-card reveal"
          >
            <div class="feature-number">{{ String(index + 1).padStart(2, '0') }}</div>
            <span class="feature-code">{{ feature.code }}</span>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
            <small>{{ feature.detail }}</small>
            <div class="feature-corner" aria-hidden="true"></div>
          </article>
        </div>
      </div>
    </section>

    <section class="workflow-section">
      <div class="container">
        <div class="section-heading reveal">
          <span class="section-label">{{ t.workflow.label }}</span>
          <h2>{{ t.workflow.title }}</h2>
        </div>
        <div class="workflow-track">
          <article v-for="step in t.workflow.steps" :key="step.number" class="workflow-step reveal">
            <div class="workflow-number">{{ step.number }}</div>
            <div class="workflow-node"><i></i></div>
            <div class="workflow-copy">
              <span>{{ step.output }}</span>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="system" class="architecture-section">
      <div class="architecture-grid-bg" aria-hidden="true"></div>
      <div class="container architecture-layout">
        <div class="section-heading reveal">
          <span class="section-label">{{ t.architecture.label }}</span>
          <h2>{{ t.architecture.title }}</h2>
          <p>{{ t.architecture.lead }}</p>
        </div>
        <div class="stack-flow reveal">
          <div v-for="(item, index) in t.architecture.stack" :key="item.name" class="stack-node">
            <span>0{{ index + 1 }}</span
            ><strong>{{ item.name }}</strong
            ><small>{{ item.detail }}</small
            ><i v-if="index < t.architecture.stack.length - 1"></i>
          </div>
        </div>
        <div class="contract-panel reveal">
          <div class="contract-visual" aria-hidden="true">
            <span class="contract-core">Z</span><i class="beam beam-a"></i
            ><i class="beam beam-b"></i><i class="beam beam-c"></i
            ><b class="contract-endpoint endpoint-a">TS</b
            ><b class="contract-endpoint endpoint-b">HTTP</b
            ><b class="contract-endpoint endpoint-c">OAS</b>
          </div>
          <div>
            <span class="section-label">RUNTIME CONTRACT</span>
            <h3>{{ t.architecture.contractTitle }}</h3>
            <p>{{ t.architecture.contractText }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="audience-section light-section">
      <div class="container">
        <div class="section-heading dark-heading reveal">
          <span class="section-label">{{ t.audience.label }}</span>
          <h2>{{ t.audience.title }}</h2>
        </div>
        <div class="audience-grid">
          <article class="audience-card reveal">
            <span>01 / IDEA → PRODUCT</span>
            <h3>{{ t.audience.makersTitle }}</h3>
            <p>{{ t.audience.makersText }}</p>
            <div class="audience-glyph maker-glyph" aria-hidden="true"><i></i><i></i><i></i></div>
          </article>
          <article class="audience-card is-dark reveal">
            <span>02 / SYSTEM → SCALE</span>
            <h3>{{ t.audience.developersTitle }}</h3>
            <p>{{ t.audience.developersText }}</p>
            <div class="audience-glyph developer-glyph" aria-hidden="true">
              <i></i><i></i><i></i>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="start" class="start-section light-section">
      <div class="container start-layout">
        <div class="section-heading dark-heading reveal">
          <span class="section-label">{{ t.start.label }}</span>
          <h2>{{ t.start.title }}</h2>
          <p>{{ t.start.lead }}</p>
        </div>
        <div class="terminal reveal">
          <div class="terminal-top">
            <span>POWERED BY PNPM / LOCAL SETUP</span
            ><button type="button" @click="copyCommands">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="8" y="8" width="11" height="11" rx="1" />
                <path d="M16 8V5H5v11h3" /></svg
              >{{ copied ? t.start.copied : t.start.copy }}
            </button>
          </div>
          <pre><code>{{ commands }}</code></pre>
          <div class="terminal-status">LOCAL DEVELOPMENT / localhost:5173</div>
        </div>
        <aside class="boundaries reveal">
          <span class="section-label">REALITY CHECK</span>
          <h3>{{ t.start.boundariesTitle }}</h3>
          <ul>
            <li v-for="boundary in t.start.boundaries" :key="boundary">
              <i></i><span>{{ boundary }}</span>
            </li>
          </ul>
        </aside>
      </div>
    </section>

    <section class="closing-section">
      <div class="closing-orbit" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="container closing-content reveal">
        <span class="section-label">{{ t.closing.label }}</span>
        <h2>{{ t.closing.title }}</h2>
        <p>{{ t.closing.lead }}</p>
        <a
          class="button button-primary closing-button"
          :href="GITHUB_URL"
          target="_blank"
          rel="noreferrer"
          ><span>{{ t.closing.github }}</span
          ><i aria-hidden="true">↗</i></a
        >
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="brand-lockup">
        <BrandMark /><span><strong>CYBER</strong><small>AI FORGE</small></span>
      </div>
      <p>{{ t.closing.creator }}</p>
      <a href="#top">{{ t.closing.backTop }} ↑</a>
    </div>
  </footer>
</template>

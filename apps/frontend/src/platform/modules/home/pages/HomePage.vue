<template>
  <section class="home-page" :aria-label="t('home.overview.label')">
    <article class="hero-panel">
      <PlatformArtwork class="hero-art" />
      <div class="hero-topline">
        <a
          class="hero-brand-link"
          :href="appConfig.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="t('shared.brand.githubLabel')"
        >
          <CyberLogo :show-descriptor="false" tone="light" />
        </a>
        <span class="hero-kicker"><i />{{ t('home.hero.kicker') }}</span>
        <span class="hero-status"><i />{{ t('home.hero.status') }}</span>
      </div>
      <div class="hero-content">
        <div class="hero-copy">
          <h1>{{ t('home.hero.lineOne') }}<br />{{ t('home.hero.lineTwo') }}</h1>
          <p>{{ t('home.hero.description', { name: appConfig.fullName }) }}</p>
        </div>
        <div class="hero-index">
          <small>{{ t('home.hero.systemIndex') }}</small>
          <b>{{ String(navigation.flatItems.length).padStart(2, '0') }}</b>
          <span>{{ t('home.hero.activeNodes') }}</span>
        </div>
      </div>
      <div class="hero-footer">
        <span class="hero-footer__note">{{ todayLabel }} · {{ t('home.hero.statusDetail') }}</span>
        <div class="hero-footer__actions">
          <div class="hero-notes">
            <span><b>01</b>{{ t('home.hero.stat.structure') }}</span>
            <span><b>02</b>{{ t('home.hero.stat.contract') }}</span>
            <span><b>03</b>{{ t('home.hero.stat.foundation') }}</span>
          </div>
          <a
            class="hero-github-link"
            :href="appConfig.githubUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AppIcon name="external" />
            <span>{{ t('home.hero.github') }}</span>
          </a>
        </div>
      </div>
    </article>

    <section class="insight-section" :aria-label="t('home.pillars.title')">
      <div class="section-lead">
        <span>{{ t('home.pillars.label') }}</span>
        <h2>{{ t('home.pillars.title') }}</h2>
      </div>
      <div class="insight-grid">
        <article v-for="pillar in pillars" :key="pillar.id" class="insight-card">
          <div class="insight-card__topline">
            <span class="insight-card__index">{{ pillar.index }}</span>
            <span class="insight-card__icon"><AppIcon :name="pillar.icon" /></span>
          </div>
          <h3>{{ t(pillar.titleKey) }}</h3>
          <p>{{ t(pillar.descriptionKey) }}</p>
        </article>
      </div>
    </section>

    <section class="access-section" :aria-label="t('home.access.title')">
      <div class="section-heading">
        <div>
          <span>{{ t('home.access.label') }}</span>
          <h2>{{ t('home.access.title') }}</h2>
        </div>
        <p>{{ t('home.access.description') }}</p>
      </div>
      <div v-if="quickEntries.length" class="module-grid">
        <template v-for="item in quickEntries" :key="item.id">
          <RouterLink v-if="item.type === 'menu'" :to="item.path" class="module-card">
            <span class="module-card__icon"><AppIcon :name="item.icon" /></span>
            <span class="module-card__arrow">↗</span>
            <b>{{ resolveLocalizedLabel(navigationLabel(item)) }}</b>
            <small>{{ item.path }}</small>
          </RouterLink>
          <a
            v-else
            :href="item.externalUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="module-card"
          >
            <span class="module-card__icon"><AppIcon :name="item.icon || 'external'" /></span>
            <span class="module-card__arrow">↗</span>
            <b>{{ resolveLocalizedLabel(navigationLabel(item)) }}</b>
            <small>{{ t('home.cards.externalResource') }}</small>
          </a>
        </template>
      </div>
      <div v-else class="access-empty">
        <span class="access-empty__icon"><AppIcon name="layers" /></span>
        <div>
          <b>{{ t('home.access.emptyTitle') }}</b>
          <p>{{ t('home.access.emptyDescription') }}</p>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '@/foundation/components/AppIcon.vue'
import PlatformArtwork from '@/foundation/components/platform/PlatformArtwork.vue'
import { useRoute } from 'vue-router'
import CyberLogo from '@/foundation/components/platform/PlatformLogo.vue'
import { usePlatformConfig } from '@/foundation/platform/platform'
import { useLocalization } from '@/foundation/modules/localization/localization'
import { navigationLabel } from '@/foundation/modules/navigation/navigation.labels'
import { useNavigationStore } from '@/foundation/modules/navigation/navigation.store'

const navigation = useNavigationStore()
const route = useRoute()
const { formatDateTime, resolveLocalizedLabel, t } = useLocalization()
const appConfig = usePlatformConfig()
// 快捷入口取当前用户前四个可访问页面或外链，目录和首页自身不重复展示。
const quickEntries = computed(() =>
  navigation.flatItems
    .filter(
      (item) =>
        (item.type === 'menu' && item.path !== '/' && item.path !== route.path) ||
        item.type === 'button',
    )
    .slice(0, 4),
)
const todayLabel = computed(() =>
  formatDateTime(new Date(), {
    weekday: 'long',
    month: 'short',
    day: '2-digit',
  }).toUpperCase(),
)
const pillars = [
  {
    id: 'structure',
    index: '01',
    icon: 'layers',
    titleKey: 'home.pillars.structure.title',
    descriptionKey: 'home.pillars.structure.description',
  },
  {
    id: 'contract',
    index: '02',
    icon: 'link',
    titleKey: 'home.pillars.contract.title',
    descriptionKey: 'home.pillars.contract.description',
  },
  {
    id: 'evolution',
    index: '03',
    icon: 'activity',
    titleKey: 'home.pillars.evolution.title',
    descriptionKey: 'home.pillars.evolution.description',
  },
] as const
</script>

<style lang="scss" scoped>
.home-page {
  max-width: 1480px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.hero-panel {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 440px;
  padding: 32px 36px;
  color: var(--hero-foreground);
  background: #0e1115;
  border: 1px solid #30363f;
  border-radius: 6px;
}
.hero-art {
  position: absolute;
  z-index: -1;
  right: -4%;
  top: 0;
  width: 58%;
  height: 100%;
}
.hero-topline {
  display: flex;
  align-items: center;
  gap: 24px;
}
.hero-brand-link {
  --cyber-logo-mark-size: 28px;
  --cyber-logo-wordmark-size: 14px;
}
.hero-kicker {
  color: #a5adb8;
  font: 10px var(--font-mono);
  letter-spacing: 0.12em;
}
.hero-status {
  display: none;
}
.hero-content {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 40px 0;
}
.hero-copy {
  max-width: 56%;
}
.hero-copy h1 {
  font-size: clamp(28px, 3vw, 46px);
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.045em;
  margin: 0 0 20px;
}
.hero-copy p {
  max-width: 420px;
  color: #a5adb8;
  font-size: 13px;
  line-height: 1.9;
  margin: 0;
}
.hero-index {
  display: none;
}
.hero-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid #30363f;
}
.hero-footer__note {
  color: #a5adb8;
  font: 10px var(--font-mono);
}
.hero-notes {
  display: none;
}
.hero-github-link {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--brand-accent);
  font-size: 12px;
}
.access-section {
  order: 1;
}
.insight-section {
  order: 2;
}
.section-heading,
.section-lead {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 24px;
  margin-bottom: 20px;
}
.section-heading span,
.section-lead > span {
  color: var(--muted);
  font: 10px var(--font-mono);
  letter-spacing: 0.12em;
}
.section-heading h2,
.section-lead h2 {
  margin: 8px 0 0;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.03em;
}
.section-heading p {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
}
.module-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border: 1px solid var(--line);
  border-radius: 6px;
  overflow: hidden;
}
.module-card {
  display: grid;
  position: relative;
  gap: 12px;
  min-width: 0;
  padding: 24px;
  background: var(--surface);
  border-right: 1px solid var(--line);
  text-decoration: none;
  transition: background 0.2s;
}
.module-card:last-child {
  border-right: 0;
}
.module-card:hover {
  background: var(--primary-mist);
}
.module-card__icon {
  color: var(--primary);
  margin-bottom: 12px;
}
.module-card__arrow {
  position: absolute;
  right: 24px;
  top: 24px;
  color: var(--muted);
}
.module-card b {
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
}
.module-card small {
  color: var(--muted);
  font: 11px var(--font-mono);
  overflow-wrap: anywhere;
}
.insight-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;
}
.insight-card {
  border-top: 1px solid var(--line);
  padding: 20px 0;
}
.insight-card__topline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--muted);
  font: 11px var(--font-mono);
}
.insight-card h3 {
  margin: 20px 0 12px;
  font-weight: 500;
  font-size: 15px;
}
.insight-card p {
  margin: 0;
  font-size: 12px;
  line-height: 1.9;
  color: var(--muted);
}
.access-empty {
  display: flex;
  gap: 20px;
  padding: 32px;
  border: 1px solid var(--line);
  color: var(--muted);
}
.access-empty p {
  font-size: 13px;
}
@media (max-width: 1100px) {
  .hero-kicker {
    display: none;
  }
  .module-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .module-card:nth-child(2) {
    border-right: 0;
  }
  .module-card:nth-child(-n + 2) {
    border-bottom: 1px solid var(--line);
  }
}
@media (max-width: 639px) {
  .hero-panel {
    padding: 24px;
    min-height: 500px;
  }
  .hero-copy {
    max-width: 100%;
  }
  .hero-content {
    padding-bottom: 160px;
  }
  .hero-art {
    top: auto;
    bottom: 30px;
    height: 240px;
    width: 100%;
    right: -18%;
    opacity: 0.7;
  }
  .hero-footer {
    align-items: start;
  }
  .hero-footer__note {
    max-width: 50%;
    line-height: 1.8;
  }
  .hero-kicker {
    display: none;
  }
  .insight-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .section-heading {
    align-items: start;
    flex-direction: column;
    gap: 12px;
  }
  .module-card {
    padding: 20px;
  }
  .module-card__arrow {
    top: 20px;
    right: 20px;
  }
}
</style>

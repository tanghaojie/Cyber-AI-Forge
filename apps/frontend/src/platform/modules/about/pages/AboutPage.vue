<template>
  <main class="about-page" :aria-label="t('about.pageLabel')">
    <section class="about-hero">
      <div class="about-hero__grid" aria-hidden="true" />
      <div class="about-hero__orb about-hero__orb--large" aria-hidden="true" />
      <div class="about-hero__orb about-hero__orb--small" aria-hidden="true" />
      <div class="about-hero__rail about-hero__rail--one" aria-hidden="true" />
      <div class="about-hero__rail about-hero__rail--two" aria-hidden="true" />

      <header class="about-hero__topline">
        <a
          class="about-brand-link"
          :href="appConfig.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="t('shared.brand.githubLabel')"
        >
          <CyberLogo tone="light" :show-descriptor="false" />
        </a>
        <span class="about-hero__code">SYS / ABOUT / 01</span>
      </header>

      <div class="about-hero__body">
        <div class="about-hero__copy">
          <p class="about-eyebrow"><i />{{ t('about.hero.kicker') }}</p>
          <h1>
            {{ t('about.hero.titleOne') }}<br /><em>{{ t('about.hero.titleTwo') }}</em>
          </h1>
          <p class="about-hero__description">{{ t('about.hero.description') }}</p>
          <div class="about-hero__actions">
            <a
              class="about-button about-button--primary"
              :href="appConfig.githubUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{{ t('about.hero.github') }}</span>
              <AppIcon name="external" />
            </a>
            <RouterLink class="about-button about-button--quiet" to="/">
              <AppIcon name="home" />
              <span>{{ t('about.hero.backHome') }}</span>
            </RouterLink>
          </div>
        </div>

        <PlatformArtwork class="about-art" />
      </div>

      <footer class="about-hero__footer">
        <span><i />{{ t('about.hero.systemReady') }}</span>
        <span>{{ t('about.hero.productLabel') }}</span>
        <span>{{ t('about.hero.creator') }}</span>
      </footer>
    </section>

    <section class="about-section about-principles">
      <div class="about-section__intro">
        <p class="about-section__eyebrow">{{ t('about.principles.eyebrow') }}</p>
        <h2>{{ t('about.principles.title') }}</h2>
        <p>{{ t('about.principles.description') }}</p>
      </div>
      <div class="principle-grid">
        <article v-for="principle in principles" :key="principle.id" class="principle-card">
          <div class="principle-card__topline">
            <span>{{ principle.index }}</span>
            <AppIcon :name="principle.icon" />
          </div>
          <h3>{{ t(principle.title) }}</h3>
          <p>{{ t(principle.detail) }}</p>
          <div class="principle-card__line" aria-hidden="true" />
        </article>
      </div>
    </section>

    <section class="about-section audience-section">
      <div class="section-heading">
        <div>
          <p class="about-section__eyebrow">{{ t('about.audience.eyebrow') }}</p>
          <h2>{{ t('about.audience.title') }}</h2>
        </div>
        <p>{{ t('about.audience.description') }}</p>
      </div>
      <div class="audience-layout">
        <div class="audience-card-grid">
          <article v-for="audience in audiences" :key="audience.id" class="audience-card">
            <div class="audience-card__icon"><AppIcon :name="audience.icon" /></div>
            <div>
              <p class="audience-card__label">{{ t(audience.label) }}</p>
              <h3>{{ t(audience.title) }}</h3>
              <p>{{ t(audience.detail) }}</p>
            </div>
          </article>
        </div>
        <aside class="audience-aside">
          <span class="flow-signal"><i />{{ t('about.audience.noteLabel') }}</span>
          <strong>{{ t('about.audience.noteTitle') }}</strong>
          <p>{{ t('about.audience.noteDetail') }}</p>
        </aside>
      </div>
      <div class="scenario-heading">
        <div>
          <p class="about-section__eyebrow">{{ t('about.scenarios.eyebrow') }}</p>
          <h3>{{ t('about.scenarios.title') }}</h3>
        </div>
        <span>{{ t('about.scenarios.count') }}</span>
      </div>
      <div class="scenario-grid">
        <article v-for="scenario in scenarios" :key="scenario.id" class="scenario-card">
          <span class="scenario-card__index">{{ scenario.index }}</span>
          <h4>{{ t(scenario.title) }}</h4>
          <p>{{ t(scenario.detail) }}</p>
        </article>
      </div>
    </section>

    <section class="about-section comparison-section">
      <div class="section-heading section-heading--split">
        <div>
          <p class="about-section__eyebrow">{{ t('about.comparison.eyebrow') }}</p>
          <h2>{{ t('about.comparison.title') }}</h2>
        </div>
        <p>{{ t('about.comparison.description') }}</p>
      </div>
      <div class="comparison-table-wrap">
        <table class="comparison-table">
          <thead>
            <tr>
              <th scope="col">{{ t('about.comparison.dimension') }}</th>
              <th scope="col">{{ t('about.comparison.zero') }}</th>
              <th scope="col" class="comparison-table__featured">
                {{ t('about.comparison.cyber') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in comparisonRows" :key="row.id">
              <th scope="row">{{ t(row.label) }}</th>
              <td>{{ t(row.zero) }}</td>
              <td class="comparison-table__featured">{{ t(row.cyber) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <blockquote class="comparison-quote">{{ t('about.comparison.quote') }}</blockquote>
    </section>

    <section class="about-section blueprint-section">
      <div class="section-heading section-heading--split">
        <div>
          <p class="about-section__eyebrow">{{ t('about.blueprint.eyebrow') }}</p>
          <h2>{{ t('about.blueprint.title') }}</h2>
        </div>
        <p>{{ t('about.blueprint.description') }}</p>
      </div>
      <div class="blueprint-flow">
        <div class="blueprint-flow__aside">
          <span class="flow-signal"><i />01 / INPUT</span>
          <strong>{{ t('about.blueprint.human') }}</strong>
          <small>{{ t('about.blueprint.ai') }}</small>
        </div>
        <div class="blueprint-flow__layers">
          <div v-for="layer in layers" :key="layer.id" class="blueprint-layer">
            <span class="blueprint-layer__index">{{ layer.index }}</span>
            <span class="blueprint-layer__name">{{ t(layer.label) }}</span>
            <span class="blueprint-layer__bar"><i /></span>
            <span class="blueprint-layer__tech">{{ t(layer.tech) }}</span>
          </div>
        </div>
        <div class="blueprint-flow__aside blueprint-flow__aside--end">
          <span class="flow-signal"><i />05 / OUTPUT</span>
          <strong>{{ t('about.blueprint.database') }}</strong>
          <small>{{ t('about.blueprint.backend') }}</small>
        </div>
      </div>
    </section>

    <section class="about-section stack-section">
      <div class="section-heading">
        <div>
          <p class="about-section__eyebrow">{{ t('about.stack.eyebrow') }}</p>
          <h2>{{ t('about.stack.title') }}</h2>
        </div>
        <p>{{ t('about.stack.description') }}</p>
      </div>
      <div class="stack-grid">
        <article v-for="item in stack" :key="item.id" class="stack-card">
          <span class="stack-card__icon"><AppIcon :name="item.icon" /></span>
          <div>
            <h3>{{ t(item.title) }}</h3>
            <p>{{ t(item.detail) }}</p>
          </div>
          <span class="stack-card__arrow">↗</span>
        </article>
      </div>
    </section>

    <section class="about-cta">
      <div class="about-cta__mesh" aria-hidden="true" />
      <div class="about-cta__copy">
        <p class="about-section__eyebrow">{{ t('about.cta.eyebrow') }}</p>
        <h2>{{ t('about.cta.title') }}</h2>
        <p>{{ t('about.cta.description') }}</p>
      </div>
      <a
        class="about-button about-button--primary about-cta__button"
        :href="appConfig.githubUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>{{ t('about.cta.github') }}</span>
        <AppIcon name="external" />
      </a>
    </section>

    <footer class="about-footer">
      <CyberLogo tone="dark" :show-descriptor="false" />
      <span>{{ t('about.footer.creator') }}</span>
      <a :href="appConfig.githubUrl" target="_blank" rel="noopener noreferrer">
        GitHub <AppIcon name="external" />
      </a>
    </footer>
  </main>
</template>

<script setup lang="ts">
import PlatformArtwork from '@/foundation/components/platform/PlatformArtwork.vue'
import AppIcon from '@/foundation/components/AppIcon.vue'
import CyberLogo from '@/foundation/components/platform/PlatformLogo.vue'
import { usePlatformConfig } from '@/foundation/platform/platform'
import { useLocalization } from '@/foundation/modules/localization/localization'

const { t } = useLocalization()
const appConfig = usePlatformConfig()

const principles = [
  {
    id: 'structure',
    index: '01',
    icon: 'layers',
    title: 'about.principles.structure.title',
    detail: 'about.principles.structure.detail',
  },
  {
    id: 'contract',
    index: '02',
    icon: 'link',
    title: 'about.principles.contract.title',
    detail: 'about.principles.contract.detail',
  },
  {
    id: 'context',
    index: '03',
    icon: 'book',
    title: 'about.principles.context.title',
    detail: 'about.principles.context.detail',
  },
  {
    id: 'fullstack',
    index: '04',
    icon: 'activity',
    title: 'about.principles.fullstack.title',
    detail: 'about.principles.fullstack.detail',
  },
  {
    id: 'foundation',
    index: '05',
    icon: 'shield',
    title: 'about.principles.foundation.title',
    detail: 'about.principles.foundation.detail',
  },
] as const

const audiences = [
  {
    id: 'maker',
    icon: 'user',
    label: 'about.audience.maker.label',
    title: 'about.audience.maker.title',
    detail: 'about.audience.maker.detail',
  },
  {
    id: 'developer',
    icon: 'wrench',
    label: 'about.audience.developer.label',
    title: 'about.audience.developer.title',
    detail: 'about.audience.developer.detail',
  },
] as const

const scenarios = [
  {
    id: 'internal',
    index: '01',
    title: 'about.scenarios.internal.title',
    detail: 'about.scenarios.internal.detail',
  },
  {
    id: 'crm',
    index: '02',
    title: 'about.scenarios.crm.title',
    detail: 'about.scenarios.crm.detail',
  },
  {
    id: 'operations',
    index: '03',
    title: 'about.scenarios.operations.title',
    detail: 'about.scenarios.operations.detail',
  },
  {
    id: 'content',
    index: '04',
    title: 'about.scenarios.content.title',
    detail: 'about.scenarios.content.detail',
  },
  {
    id: 'project',
    index: '05',
    title: 'about.scenarios.project.title',
    detail: 'about.scenarios.project.detail',
  },
  {
    id: 'knowledge',
    index: '06',
    title: 'about.scenarios.knowledge.title',
    detail: 'about.scenarios.knowledge.detail',
  },
  {
    id: 'saas',
    index: '07',
    title: 'about.scenarios.saas.title',
    detail: 'about.scenarios.saas.detail',
  },
  {
    id: 'prototype',
    index: '08',
    title: 'about.scenarios.prototype.title',
    detail: 'about.scenarios.prototype.detail',
  },
] as const

const comparisonRows = [
  {
    id: 'startingPoint',
    label: 'about.comparison.row.startingPoint.label',
    zero: 'about.comparison.row.startingPoint.zero',
    cyber: 'about.comparison.row.startingPoint.cyber',
  },
  {
    id: 'context',
    label: 'about.comparison.row.context.label',
    zero: 'about.comparison.row.context.zero',
    cyber: 'about.comparison.row.context.cyber',
  },
  {
    id: 'foundation',
    label: 'about.comparison.row.foundation.label',
    zero: 'about.comparison.row.foundation.zero',
    cyber: 'about.comparison.row.foundation.cyber',
  },
  {
    id: 'location',
    label: 'about.comparison.row.location.label',
    zero: 'about.comparison.row.location.zero',
    cyber: 'about.comparison.row.location.cyber',
  },
  {
    id: 'collaboration',
    label: 'about.comparison.row.collaboration.label',
    zero: 'about.comparison.row.collaboration.zero',
    cyber: 'about.comparison.row.collaboration.cyber',
  },
  {
    id: 'outcome',
    label: 'about.comparison.row.outcome.label',
    zero: 'about.comparison.row.outcome.zero',
    cyber: 'about.comparison.row.outcome.cyber',
  },
] as const

const layers = [
  { id: 'human', index: '01', label: 'about.blueprint.layer.human', tech: 'about.blueprint.human' },
  {
    id: 'interface',
    index: '02',
    label: 'about.blueprint.layer.interface',
    tech: 'about.blueprint.frontend',
  },
  {
    id: 'contract',
    index: '03',
    label: 'about.blueprint.layer.contract',
    tech: 'about.blueprint.contract',
  },
  {
    id: 'service',
    index: '04',
    label: 'about.blueprint.layer.service',
    tech: 'about.blueprint.backend',
  },
  {
    id: 'data',
    index: '05',
    label: 'about.blueprint.layer.data',
    tech: 'about.blueprint.database',
  },
] as const

const stack = [
  {
    id: 'frontend',
    icon: 'monitor',
    title: 'about.stack.frontend',
    detail: 'about.stack.frontendDetail',
  },
  {
    id: 'backend',
    icon: 'shield',
    title: 'about.stack.backend',
    detail: 'about.stack.backendDetail',
  },
  { id: 'data', icon: 'database', title: 'about.stack.data', detail: 'about.stack.dataDetail' },
] as const
</script>

<style lang="scss" scoped>
.about-page {
  display: grid;
  gap: 64px;
  max-width: 1400px;
  margin: auto;
}
.about-hero {
  border: 1px solid #30363f;
  border-radius: 6px;
  overflow: hidden;
  padding: 32px 36px;
  background: #0e1115;
  color: #f3f1ec;
}
.about-hero__grid,
.about-hero__orb,
.about-hero__rail,
.principle-card__line,
.about-cta__mesh {
  display: none;
}
.about-hero__topline,
.about-hero__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
.about-brand-link {
  --cyber-logo-mark-size: 32px;
}
.about-hero__code,
.about-hero__footer {
  color: #a5adb8;
  font: 10px var(--font-mono);
}
.about-hero__body {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 24px;
  align-items: center;
}
.about-hero__copy {
  position: relative;
  z-index: 1;
  padding: 48px 0;
}
.about-eyebrow {
  color: var(--brand-accent);
  font: 11px var(--font-mono);
  letter-spacing: 0.1em;
}
.about-hero__copy h1 {
  font-size: clamp(32px, 3.5vw, 48px);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 1.3;
}
.about-hero__copy h1 em {
  font-style: normal;
}
.about-hero__description {
  font-size: 13px;
  line-height: 1.9;
  color: #a5adb8;
  max-width: 480px;
}
.about-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}
.about-button {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 12px 18px;
  border: 1px solid #404852;
  border-radius: 4px;
  font-size: 12px;
}
.about-button--primary {
  background: var(--brand-accent);
  border-color: var(--brand-accent);
  color: #111518;
}
.about-art {
  align-self: stretch;
  min-height: 280px;
  margin: 0 -36px 0 -20px;
}
.about-hero__footer {
  padding-top: 24px;
  border-top: 1px solid #30363f;
  flex-wrap: wrap;
}
.about-section {
  display: grid;
  gap: 28px;
}
.about-section__eyebrow,
.flow-signal {
  color: var(--primary);
  font: 10px var(--font-mono);
  letter-spacing: 0.12em;
}
.about-section h2 {
  margin: 12px 0;
  font-size: 30px;
  font-weight: 500;
  letter-spacing: -0.03em;
}
.about-section__intro > p:last-child,
.section-heading > p {
  font-size: 13px;
  line-height: 1.8;
  color: var(--muted);
  max-width: 600px;
}
.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 32px;
}
.section-heading > p {
  max-width: 420px;
}
.principle-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;
}
.principle-card {
  padding: 24px 0;
  border-top: 1px solid var(--line);
}
.principle-card__topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--muted);
  font: 11px var(--font-mono);
}
.principle-card h3 {
  font-size: 18px;
  font-weight: 500;
  margin: 24px 0 12px;
}
.principle-card p {
  font-size: 13px;
  line-height: 1.9;
  color: var(--muted);
}
.audience-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}
.audience-card-grid {
  display: grid;
  gap: 16px;
}
.audience-card {
  display: flex;
  align-items: start;
  gap: 20px;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--surface);
}
.audience-card__icon {
  color: var(--primary);
}
.audience-card__label {
  margin: 0;
  color: var(--muted);
  font: 10px var(--font-mono);
}
.audience-card h3 {
  font-size: 18px;
  font-weight: 500;
}
.audience-card div > p:last-child,
.audience-aside p {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}
.audience-aside {
  padding: 28px;
  background: var(--surface-muted);
  border: 1px solid var(--line);
  border-radius: 6px;
}
.audience-aside strong {
  display: block;
  margin: 24px 0;
  font-size: 22px;
  line-height: 1.6;
  font-weight: 500;
}
.scenario-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}
.scenario-heading h3 {
  font-size: 22px;
  font-weight: 500;
}
.scenario-heading > span {
  color: var(--muted);
  font: 11px var(--font-mono);
}
.scenario-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}
.scenario-card {
  border-top: 1px solid var(--line);
  padding: 24px 0;
}
.scenario-card__index {
  color: var(--muted);
  font: 11px var(--font-mono);
}
.scenario-card h4 {
  font-size: 15px;
  font-weight: 500;
}
.scenario-card p {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.8;
}
.comparison-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 6px;
}
.comparison-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
  text-align: left;
  background: var(--surface);
}
.comparison-table th,
.comparison-table td {
  padding: 20px 24px;
  border-bottom: 1px solid var(--line);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.7;
}
.comparison-table thead {
  background: var(--surface-muted);
}
.comparison-table td {
  color: var(--ink-soft);
}
.comparison-table__featured {
  background: var(--primary-mist);
}
.comparison-quote {
  border-left: 2px solid var(--primary);
  margin: 0;
  padding: 8px 24px;
  font-size: 18px;
  line-height: 1.8;
}
.blueprint-flow {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--surface);
}
.blueprint-flow__aside {
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
}
.blueprint-flow__aside strong {
  font-size: 16px;
  font-weight: 500;
}
.blueprint-flow__aside small {
  color: var(--muted);
  font-size: 11px;
}
.blueprint-flow__layers {
  border-inline: 1px solid var(--line);
}
.blueprint-layer {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 8px 16px;
  padding: 20px;
  border-bottom: 1px solid var(--line);
}
.blueprint-layer:last-child {
  border: 0;
}
.blueprint-layer__index {
  color: var(--muted);
  font: 10px var(--font-mono);
}
.blueprint-layer__name {
  font-size: 13px;
}
.blueprint-layer__bar {
  display: none;
}
.blueprint-layer__tech {
  grid-column: 2;
  color: var(--muted);
  font: 11px var(--font-mono);
}
.stack-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border: 1px solid var(--line);
  border-radius: 6px;
  overflow: hidden;
}
.stack-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: var(--surface);
}
.stack-card__icon {
  color: var(--primary);
}
.stack-card h3 {
  font-size: 15px;
  font-weight: 500;
  margin: 0 0 8px;
}
.stack-card p {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.7;
  margin: 0;
}
.stack-card__arrow {
  margin-left: auto;
  color: var(--muted);
}
.about-cta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  padding: 40px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--surface-muted);
}
.about-cta h2 {
  font-size: 30px;
  font-weight: 500;
  letter-spacing: -0.03em;
}
.about-cta__copy > p:last-child {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}
.about-cta__button {
  flex-shrink: 0;
  background: var(--primary);
  border-color: var(--primary);
  color: var(--primary-foreground);
}
.about-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 0;
  border-top: 1px solid var(--line);
}
.about-footer :deep(.cyber-logo) {
  --cyber-logo-mark-size: 28px;
  --cyber-logo-wordmark-size: 13px;
}
.about-footer > span,
.about-footer a {
  color: var(--muted);
  font-size: 11px;
}
.about-footer a {
  display: flex;
  align-items: center;
  gap: 8px;
}
@media (max-width: 1000px) {
  .section-heading {
    align-items: start;
    flex-direction: column;
    gap: 0;
  }
  .audience-layout {
    grid-template-columns: 1fr;
  }
  .blueprint-flow {
    grid-template-columns: 1fr;
  }
  .blueprint-flow__layers {
    border: 0;
    border-block: 1px solid var(--line);
  }
  .stack-grid {
    grid-template-columns: 1fr 1fr;
  }
  .about-hero__body {
    grid-template-columns: 1fr;
  }
  .about-art {
    height: 260px;
    margin: -40px -36px 20px;
  }
  .about-hero__copy {
    padding-bottom: 16px;
  }
}
@media (max-width: 640px) {
  .about-page {
    gap: 40px;
  }
  .about-hero {
    padding: 24px;
  }
  .about-hero__code {
    display: none;
  }
  .about-art {
    margin: 0 -24px;
  }
  .principle-grid,
  .scenario-grid,
  .stack-grid {
    grid-template-columns: 1fr;
  }
  .about-cta {
    flex-direction: column;
    align-items: start;
    padding: 24px;
  }
  .about-footer {
    flex-wrap: wrap;
  }
  .about-hero__footer span:last-child {
    display: none;
  }
}
</style>

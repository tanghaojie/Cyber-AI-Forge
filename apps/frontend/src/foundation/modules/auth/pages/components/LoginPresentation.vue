<template>
  <section class="login-presentation" :aria-label="t('auth.brand.ariaLabel')">
    <a
      :href="appConfig.githubUrl"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="t('auth.brand.githubLabel')"
      ><CyberLogo tone="light"
    /></a>
    <div class="manifesto">
      <p>{{ t('auth.manifesto.kicker') }}</p>
      <h1>{{ t('auth.manifesto.lineOne') }}<br />{{ t('auth.manifesto.lineTwo') }}</h1>
      <span>{{ t('auth.manifesto.description') }}</span>
    </div>
    <PlatformArtwork class="presentation-art" />
    <footer>
      <span>{{ appConfig.tagline }}</span
      ><CreatorCredit tone="light" />
    </footer>
  </section>
</template>
<script setup lang="ts">
import PlatformArtwork from '@/foundation/components/platform/PlatformArtwork.vue'
import CreatorCredit from '@/foundation/components/platform/PlatformCreatorCredit.vue'
import CyberLogo from '@/foundation/components/platform/PlatformLogo.vue'
import { usePlatformConfig } from '@/foundation/platform/platform'
import { useLocalization } from '@/foundation/modules/localization/localization'

const { t } = useLocalization()
const appConfig = usePlatformConfig()
</script>
<style scoped>
.login-presentation {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  overflow: hidden;
  padding: 48px 10% 32px;
  color: var(--hero-foreground);
  background: #0e1115;
}
.login-presentation > a {
  position: relative;
  z-index: 1;
  align-self: flex-start;
}
.manifesto {
  position: relative;
  z-index: 1;
  margin-top: 80px;
  max-width: 500px;
}
.manifesto p {
  font: 11px var(--font-mono);
  letter-spacing: 0.14em;
  color: var(--brand-accent);
}
.manifesto h1 {
  margin: 24px 0;
  font-size: clamp(32px, 3.1vw, 52px);
  line-height: 1.35;
  font-weight: 500;
  letter-spacing: -0.04em;
}
.manifesto > span {
  display: block;
  max-width: 400px;
  color: #a5adb8;
  font-size: 13px;
  line-height: 1.9;
}
.presentation-art {
  position: relative;
  min-height: 220px;
  flex: 1;
  margin: -20px -18% 0;
}
.login-presentation footer {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  position: relative;
  z-index: 1;
  border-top: 1px solid #30363f;
  padding-top: 24px;
  font: 10px var(--font-mono);
  color: #a5adb8;
}
@media (max-height: 800px) {
  .manifesto {
    margin-top: 40px;
  }
  .presentation-art {
    min-height: 180px;
  }
}
</style>

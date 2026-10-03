<template>
  <main class="no-access-page">
    <span class="no-access-page__code">403</span>
    <p>{{ t('errors.noAccess.kicker') }}</p>
    <h2>{{ t('errors.noAccess.title') }}</h2>
    <span>{{ t('errors.noAccess.description') }}</span>
  </main>
</template>

<script setup lang="ts">
import { useLocalization } from '@/foundation/modules/localization/localization'

const { t } = useLocalization()
</script>

<style scoped>
.no-access-page {
  display: grid;
  min-height: calc(100vh - var(--app-shell-header-height) - var(--tag-view-height));
  place-items: center;
  align-content: center;
  padding: 32px;
  text-align: center;
}

.no-access-page__code {
  color: var(--primary-deep);
  font-family: var(--font-mono);
  font-size: clamp(72px, 14vw, 144px);
  font-weight: 400;
  letter-spacing: -0.08em;
  line-height: 0.9;
}

p {
  margin: 28px 0 10px;
  color: var(--primary-deep);
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.22em;
}

h2 {
  margin: 0;
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: clamp(24px, 4vw, 38px);
}

main > span:last-child {
  max-width: 560px;
  margin-top: 16px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}
</style>

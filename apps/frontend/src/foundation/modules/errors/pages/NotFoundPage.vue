<template>
  <main class="not-found-page">
    <div class="not-found-grid" />
    <section>
      <div class="error-code"><span>4</span><i>○</i><span>4</span></div>
      <p>{{ t('errors.notFound.kicker') }}</p>
      <h1>{{ t('errors.notFound.title') }}</h1>
      <span class="description">{{ t('errors.notFound.description') }}</span>
      <code v-if="sourcePath">{{ sourcePath }}</code>
      <div class="actions">
        <el-button type="primary" size="large" @click="goHome">{{
          t('errors.notFound.home')
        }}</el-button
        ><el-button size="large" @click="goBack">{{ t('errors.notFound.back') }}</el-button>
      </div>
    </section>
    <div class="brand-corner">
      <CyberLogo :show-descriptor="false" tone="dark" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CyberLogo from '@/foundation/components/platform/PlatformLogo.vue'
import { useLocalization } from '@/foundation/modules/localization/localization'

const route = useRoute(),
  router = useRouter()
const { t } = useLocalization()
const sourcePath = computed(() => (typeof route.query.from === 'string' ? route.query.from : ''))
async function goHome(): Promise<void> {
  await router.push('/')
}
function goBack(): void {
  // 没有可返回历史时回到根入口，由守卫选择当前账号的有效落点。
  if (window.history.length > 1) {
    router.back()
  } else {
    void router.push('/')
  }
}
</script>

<style lang="scss" scoped>
.not-found-page {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 100dvh;
  padding: 80px 24px;
  background: var(--canvas);
  color: var(--ink);
  text-align: center;
}
.error-code {
  display: flex;
  justify-content: center;
  gap: 12px;
  color: var(--primary);
  font: clamp(80px, 15vw, 160px)/1 var(--font-mono);
  letter-spacing: -0.08em;
}
.error-code i {
  font-style: normal;
}
.not-found-page p {
  color: var(--muted);
  font: 11px var(--font-mono);
  letter-spacing: 0.14em;
  margin-top: 32px;
}
.not-found-page h1 {
  font-size: 32px;
  font-weight: 500;
  letter-spacing: -0.03em;
}
.description {
  display: block;
  max-width: 480px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.8;
}
.not-found-page code {
  display: block;
  overflow-wrap: anywhere;
  margin: 24px auto;
  color: var(--muted);
  font: 12px var(--font-mono);
}
.actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 32px;
}
.actions :deep(.el-button) {
  margin: 0;
}
.brand-corner {
  position: absolute;
  left: 32px;
  top: 28px;
}
.not-found-grid {
  display: none;
}
</style>

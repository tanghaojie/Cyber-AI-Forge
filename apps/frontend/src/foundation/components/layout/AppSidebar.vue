<template>
  <aside
    id="app-sidebar"
    class="app-sidebar"
    :class="{
      'app-sidebar--drawer': drawer,
      'app-sidebar--open': !drawer || open,
      'app-sidebar--without-logo': !showLogo,
    }"
  >
    <div class="sidebar-atmosphere" />
    <header v-if="showLogo" class="sidebar-brand">
      <CyberLogo class="sidebar-logo" tone="dark" />
      <button
        v-if="drawer"
        class="sidebar-close"
        type="button"
        :aria-label="t('navigation.shell.closeMenu')"
        @click="$emit('close')"
      >
        <AppIcon name="close" />
      </button>
    </header>
    <button
      v-else-if="drawer"
      class="sidebar-close sidebar-close--floating"
      type="button"
      :aria-label="t('navigation.shell.closeMenu')"
      @click="$emit('close')"
    >
      <AppIcon name="close" />
    </button>
    <nav class="sidebar-navigation" :aria-label="t('navigation.shell.mainNavigation')">
      <!-- 菜单树来自当前用户导航 Store；空态区分正在请求和确实无可用菜单。 -->
      <SidebarTree v-if="items.length" :items="items" @navigate="$emit('navigate')" />
      <div v-else class="sidebar-empty">
        <span />{{
          loading ? t('navigation.shell.loadingNavigation') : t('navigation.shell.emptyNavigation')
        }}
      </div>
    </nav>
    <footer class="sidebar-status">
      <!-- 健康状态独立于导航加载，用于提示后端进程是否仍可响应。 -->
      <span class="status-pulse" :class="status" />
      <div>
        <b v-if="status === 'ok'">{{ t('navigation.shell.statusOk') }}</b>
        <b v-else-if="status === 'loading'">{{ t('navigation.shell.statusLoading') }}</b>
        <b v-else-if="status === 'error'">{{ error ?? t('navigation.shell.statusUnknown') }}</b>
        <b v-else>{{ t('navigation.shell.statusUnknown') }}</b>
        <small v-if="timestamp">{{ formatDateTime(timestamp, { timeStyle: 'medium' }) }}</small>
      </div>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import type { NavigationMenu } from '@cyber-ai-forge/api-contract'
import AppIcon from '@/foundation/components/AppIcon.vue'
import CyberLogo from '@/foundation/components/platform/PlatformLogo.vue'
import SidebarTree from './SidebarTree.vue'
import { useHealth } from '@/foundation/modules/health/composables/useHealth'
import { useLocalization } from '@/foundation/modules/localization/localization'

withDefaults(
  defineProps<{
    items: NavigationMenu[]
    drawer?: boolean
    open?: boolean
    loading?: boolean
    showLogo?: boolean
  }>(),
  {
    drawer: false,
    open: true,
    showLogo: true,
  },
)
defineEmits<{ close: []; navigate: [] }>()

const { status, timestamp, error } = useHealth()
const { formatDateTime, t } = useLocalization()
</script>

<style lang="scss" scoped>
.app-sidebar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  width: var(--app-sidebar-width);
  height: 100dvh;
  overflow: hidden;
  flex-direction: column;
  color: var(--ink);
  background: var(--sidebar-surface);
  border-right: 1px solid var(--line);
}
.app-sidebar--drawer {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 40;
  width: min(280px, calc(100vw - 48px));
  visibility: hidden;
  transform: translateX(-100%);
  transition: transform 0.2s ease;
}
.app-sidebar--drawer.app-sidebar--open {
  visibility: visible;
  transform: translateX(0);
}
.sidebar-atmosphere {
  display: none;
}
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  height: var(--app-shell-header-height);
  flex: 0 0 var(--app-shell-header-height);
  padding: 0 22px;
  border-bottom: 1px solid var(--line);
}
.sidebar-logo {
  --cyber-logo-mark-size: 32px;
  --cyber-logo-wordmark-size: 14px;
  --cyber-logo-descriptor-size: 7px;
}
.sidebar-close {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  margin-left: auto;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: var(--surface);
  color: var(--ink);
}
.sidebar-close--floating {
  position: absolute;
  top: 16px;
  right: 16px;
}
.sidebar-navigation {
  overflow-y: auto;
  flex: 1;
  padding: 24px 12px;
}
.app-sidebar--drawer.app-sidebar--without-logo .sidebar-navigation {
  padding-top: 70px;
}
.sidebar-status {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 20px;
  padding: 22px 0;
  border-top: 1px solid var(--line);
}
.sidebar-status b {
  display: block;
  font-size: 11px;
  font-weight: 500;
  overflow-wrap: anywhere;
}
.sidebar-status small {
  display: block;
  margin-top: 6px;
  color: var(--muted);
  font: 10px var(--font-mono);
}
.status-pulse {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--success);
}
.status-pulse.loading {
  background: var(--muted);
}
.status-pulse.error {
  background: var(--danger);
}
.sidebar-empty {
  display: grid;
  min-height: 100px;
  place-items: center;
  padding: 16px;
  color: var(--muted);
  font-size: 12px;
}
</style>

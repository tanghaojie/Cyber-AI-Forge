<template>
  <div
    class="app-shell"
    :class="{
      'app-shell--sidebar': showPersistentSidebar,
      'app-shell--without-tag-view': !settings.settings.tagsView,
    }"
  >
    <button
      v-if="sidebarDrawerOpen"
      class="app-shell__scrim"
      type="button"
      :aria-label="t('navigation.shell.closeMenu')"
      @click="closeSidebarDrawer"
    />
    <AppSidebar
      v-if="showPersistentSidebar || sidebarDrawerOpen"
      :items="navigation.items"
      :drawer="!showPersistentSidebar"
      :open="sidebarDrawerOpen"
      :loading="navigation.loading"
      :show-logo="settings.settings.sidebarLogo"
      @close="closeSidebarDrawer"
      @navigate="closeSidebarDrawer"
    />
    <section class="app-shell__content">
      <AppHeader
        :title="pageTitle"
        :menu-path="pageMenuPath"
        :items="navigation.items"
        :show-top-navigation="showTopNavigation"
        :sidebar-open="sidebarIsOpen"
        :display-name="auth.user?.displayName"
        :roles="auth.user?.roles.map((role) => role.name)"
        @toggle-sidebar="toggleSidebar"
        @logout="handleLogout"
      />
      <TagView
        v-if="settings.settings.tagsView"
        :tags="localizedTags"
        :active-path="route.path"
        @navigate="handleTagNavigation"
        @close="handleCloseTag"
        @close-current="handleCloseCurrent"
        @close-others="handleCloseOthers"
        @close-all="handleCloseAll"
      />
      <AppMain />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/foundation/components/layout/AppHeader.vue'
import AppMain from '@/foundation/components/layout/AppMain.vue'
import AppSidebar from '@/foundation/components/layout/AppSidebar.vue'
import TagView from '@/foundation/modules/tag-view/TagView.vue'
import {
  clearDynamicRoutes,
  installMenuRoutes,
  isDynamicRouteName,
} from '@/foundation/router/dynamicRoutes'
import { resolveRootEntry } from '@/foundation/router/rootEntry'
import { useAuthStore } from '@/foundation/modules/auth/auth.store'
import { useNavigationStore } from '@/foundation/modules/navigation/navigation.store'
import { useSettingsStore } from '@/foundation/modules/settings/settings.store'
import { useTagViewStore } from '@/foundation/modules/tag-view/tag-view.store'
import {
  resolveLocalizedLabel,
  useLocalization,
  type LocalizedLabel,
} from '@/foundation/modules/localization/localization'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const navigation = useNavigationStore()
const settings = useSettingsStore()
const tagView = useTagViewStore()
const { t } = useLocalization()
const narrowScreen = ref(matchesNarrowScreen())
const desktopSidebarVisible = ref(true)
const sidebarDrawerOpen = ref(false)
const showPersistentSidebar = computed(
  () =>
    !narrowScreen.value &&
    settings.settings.navigationMenuStyle === 'sidebar' &&
    desktopSidebarVisible.value,
)
const showTopNavigation = computed(
  () => !narrowScreen.value && settings.settings.navigationMenuStyle === 'top',
)
const sidebarIsOpen = computed(() => showPersistentSidebar.value || sidebarDrawerOpen.value)
let narrowScreenQuery: MediaQueryList | undefined
const pageTitle = computed(() =>
  resolveLocalizedLabel(
    (route.meta.localizedTitle as LocalizedLabel | undefined) ?? {
      fallback: String(route.meta.title ?? t('navigation.shell.defaultTitle')),
    },
  ),
)
const pageMenuPath = computed(() => {
  const localizedPath = route.meta.localizedMenuPath as LocalizedLabel[] | undefined
  return localizedPath?.map(resolveLocalizedLabel).join(' / ') ?? pageTitle.value
})
const localizedTags = computed(() =>
  tagView.tags.map((tag) => {
    const localizedTitle = router.resolve(tag.path).meta.localizedTitle as
      LocalizedLabel | undefined
    return {
      ...tag,
      title: localizedTitle ? resolveLocalizedLabel(localizedTitle) : tag.title,
    }
  }),
)

watch(
  () => navigation.items,
  async function refreshRoutes(items) {
    // 菜单被后台刷新后同步替换 Router 记录，不要求用户重新登录。
    if (navigation.loaded) {
      const currentDynamicName = route.matched
        .map((record) => record.name)
        .filter(isDynamicRouteName)
        .at(-1)
      installMenuRoutes(router, items)
      if (currentDynamicName && router.hasRoute(currentDynamicName)) {
        const refreshedRoute = router.resolve({ name: currentDynamicName })
        if (refreshedRoute.path !== route.path) {
          await router.replace({ name: currentDynamicName })
        }
      } else if (currentDynamicName || (route.path === '/' && route.meta.rootEntry !== true)) {
        await router.replace(resolveRootEntry(router))
      }
    }
  },
  { deep: true },
)

onMounted(function startNarrowScreenMonitor() {
  narrowScreenQuery = window.matchMedia('(max-width: 1023px)')
  narrowScreen.value = narrowScreenQuery.matches
  narrowScreenQuery.addEventListener('change', synchronizeNarrowScreen)
})

onBeforeUnmount(function stopNarrowScreenMonitor() {
  narrowScreenQuery?.removeEventListener('change', synchronizeNarrowScreen)
})

function matchesNarrowScreen(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
}

function synchronizeNarrowScreen(event: MediaQueryListEvent): void {
  narrowScreen.value = event.matches
  if (!event.matches) {
    sidebarDrawerOpen.value = false
  }
}

watch(
  () => settings.settings.navigationMenuStyle,
  function synchronizeNavigationStyle(style) {
    if (style === 'sidebar') {
      desktopSidebarVisible.value = true
    }
    sidebarDrawerOpen.value = false
  },
)

function toggleSidebar(): void {
  if (!narrowScreen.value && settings.settings.navigationMenuStyle === 'sidebar') {
    desktopSidebarVisible.value = !desktopSidebarVisible.value
  } else {
    sidebarDrawerOpen.value = !sidebarDrawerOpen.value
  }
}

function closeSidebarDrawer(): void {
  sidebarDrawerOpen.value = false
}

watch(
  () => auth.user?.id,
  function activateTagHistory(userId) {
    if (typeof userId === 'string') {
      tagView.activate(userId)
      syncCurrentTag()
    } else {
      tagView.deactivate()
    }
  },
  { immediate: true },
)

watch(
  [() => route.path, () => pageTitle.value],
  function syncRouteTag() {
    syncCurrentTag()
  },
  { immediate: true },
)

function syncCurrentTag(): void {
  if (!auth.user) {
    return
  }
  tagView.open({ path: route.path, title: pageTitle.value })
}

async function handleTagNavigation(path: string): Promise<void> {
  if (path !== route.path) {
    await router.push(path)
  }
}

async function handleCloseTag(path: string): Promise<void> {
  const fallback = tagView.close(path)
  if (path !== route.path) {
    return
  }

  const targetPath = fallback?.path ?? '/'
  if (targetPath !== route.path) {
    await router.push(targetPath)
  }
  // 根页面关闭或重复导航不会触发路由 watcher，需要主动恢复当前页标签。
  syncCurrentTag()
}

async function handleCloseCurrent(): Promise<void> {
  await handleCloseTag(route.path)
}

function handleCloseOthers(): void {
  tagView.closeOthers(route.path)
}

async function handleCloseAll(): Promise<void> {
  tagView.closeAll()
  if (route.path !== '/') {
    await router.push('/')
  }
  syncCurrentTag()
}

async function handleLogout(): Promise<void> {
  // 退出顺序同时清理服务端会话、本地菜单和动态路由，再回到静态登录页。
  await auth.logout()
  tagView.deactivate()
  navigation.clear()
  clearDynamicRoutes()
  await router.replace('/login')
}
</script>

<style lang="scss" scoped>
.app-shell {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--canvas);
}

.app-shell--sidebar {
  --app-sidebar-width: 224px;

  display: grid;
  grid-template-columns: var(--app-sidebar-width) minmax(0, 1fr);
  align-items: start;
}

.app-shell--without-tag-view {
  --tag-view-height: 0px;
}

.app-shell__scrim {
  position: fixed;
  inset: 0;
  z-index: 35;
  border: 0;
  background: color-mix(in srgb, var(--sidebar-surface-deep), transparent 45%);
  backdrop-filter: blur(2px);
}

.app-shell__content {
  min-width: 0;
  min-height: 100vh;
  min-height: 100dvh;
}

.app-shell--sidebar .app-shell__content {
  grid-column: 2;
  grid-row: 1;
}
</style>

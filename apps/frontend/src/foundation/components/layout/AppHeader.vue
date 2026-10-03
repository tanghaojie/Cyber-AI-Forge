<template>
  <header class="app-header">
    <div class="app-header__leading">
      <button
        class="app-header__menu-button"
        :class="{ 'app-header__menu-button--open': sidebarOpen }"
        type="button"
        :aria-label="sidebarOpen ? t('navigation.shell.closeMenu') : t('navigation.shell.openMenu')"
        aria-controls="app-sidebar"
        :aria-expanded="sidebarOpen"
        @click="$emit('toggle-sidebar')"
      >
        <AppIcon name="panel" />
      </button>
      <div class="app-header__title-group">
        <p class="app-header__menu-path">{{ menuPath }}</p>
        <h1 class="app-header__title">{{ title }}</h1>
      </div>
    </div>

    <TopNavigation v-if="showTopNavigation" :items="items" />

    <div class="app-header__actions">
      <LanguageSwitcher compact />
      <el-dropdown trigger="click" @command="handleCommand">
        <button class="app-header__user" type="button">
          <span class="app-header__avatar">{{ initials }}</span>
          <span class="app-header__user-copy">
            <b>{{ displayName }}</b>
            <small>{{ roleNames }}</small>
          </span>
          <ArrowDown class="app-header__user-arrow" />
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="settings">
              <Setting class="app-header__dropdown-icon" />
              {{ t('settings.dropdown.open') }}
            </el-dropdown-item>
            <el-dropdown-item command="profile">
              <User class="app-header__dropdown-icon" />
              {{ t('users.views.profile') }}
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <SwitchButton class="app-header__dropdown-icon" />
              {{ t('navigation.shell.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <SettingsDialog v-model="settingsOpen" />
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowDown, Setting, SwitchButton, User } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import type { NavigationMenu } from '@cyber-ai-forge/api-contract'
import AppIcon from '@/foundation/components/AppIcon.vue'
import TopNavigation from '@/foundation/components/layout/TopNavigation.vue'
import LanguageSwitcher from '@/foundation/modules/localization/LanguageSwitcher.vue'
import { useLocalization } from '@/foundation/modules/localization/localization'
import SettingsDialog from '@/foundation/modules/settings/SettingsDialog.vue'

const props = defineProps<{
  title: string
  menuPath: string
  items: NavigationMenu[]
  showTopNavigation: boolean
  sidebarOpen: boolean
  displayName?: string
  roles?: string[]
}>()

const emit = defineEmits<{ 'toggle-sidebar': []; logout: [] }>()

const { t } = useLocalization()
const router = useRouter()
const initials = computed(() => props.displayName?.slice(0, 1).toUpperCase() ?? 'A')
const roleNames = computed(
  () => props.roles?.filter(Boolean).join('、') || t('navigation.shell.defaultRole'),
)
const settingsOpen = ref(false)

async function handleCommand(command: string) {
  if (command === 'settings') {
    settingsOpen.value = true
  } else if (command === 'profile') {
    await router.push({ name: 'personal-profile' })
  } else if (command === 'logout') {
    emit('logout')
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  width: 100%;
  height: var(--app-shell-header-height);
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 40px;
  border-bottom: 1px solid var(--line);
  background: var(--canvas);
}
.app-header__leading,
.app-header__actions,
.app-header__user {
  display: flex;
  align-items: center;
}
.app-header__leading {
  min-width: 0;
  gap: 16px;
}
.app-header__actions {
  flex-shrink: 0;
  gap: 12px;
}
.app-header__menu-button {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border: 1px solid var(--line);
  border-radius: 4px;
  color: var(--ink-soft);
  background: transparent;
}
.app-header__menu-button:hover,
.app-header__menu-button--open {
  color: var(--primary);
  background: var(--primary-mist);
}
.app-header__title-group {
  min-width: 0;
}
.app-header__menu-path {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
}
.app-header__title {
  margin: 3px 0 0;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.app-header__user {
  gap: 10px;
  padding: 4px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--ink);
  text-align: left;
}
.app-header__user:hover {
  background: var(--surface-muted);
}
.app-header__avatar {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: var(--surface);
  color: var(--primary);
  font-size: 13px;
}
.app-header__user-copy b,
.app-header__user-copy small {
  display: block;
  max-width: 128px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.app-header__user-copy b {
  font-size: 12px;
  font-weight: 500;
}
.app-header__user-copy small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 10px;
}
.app-header__user-arrow,
.app-header__dropdown-icon {
  width: 14px;
  height: 14px;
}
.app-header__dropdown-icon {
  margin-right: 8px;
}
.app-header__user-arrow {
  color: var(--muted);
}
@media (max-width: 1023px) {
  .top-navigation {
    display: none;
  }
  .app-header {
    padding: 0 24px;
  }
}
@media (max-width: 639px) {
  .app-header {
    padding: 0 16px;
    gap: 8px;
  }
  .app-header__user-copy,
  .app-header__user-arrow,
  .app-header__menu-path {
    display: none;
  }
  .app-header__actions {
    gap: 4px;
  }
}
</style>

<template>
  <nav v-if="depth === 0" class="top-navigation" :aria-label="t('navigation.shell.mainNavigation')">
    <ul class="top-navigation__list top-navigation__list--root">
      <li
        v-for="item in displayItems"
        :key="item.id"
        class="top-navigation__item"
        :class="{ 'top-navigation__item--has-children': hasChildren(item) }"
      >
        <RouterLink v-if="item.type === 'menu'" :to="item.path" class="top-navigation__trigger">
          <AppIcon :name="item.icon || 'menu'" class="top-navigation__icon" />
          <span>{{ resolveLocalizedLabel(navigationLabel(item)) }}</span>
          <AppIcon v-if="hasChildren(item)" name="chevron-down" class="top-navigation__chevron" />
        </RouterLink>
        <a
          v-else-if="item.type === 'button'"
          :href="item.externalUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="top-navigation__trigger"
        >
          <AppIcon :name="item.icon || 'external'" class="top-navigation__icon" />
          <span>{{ resolveLocalizedLabel(navigationLabel(item)) }}</span>
          <AppIcon v-if="hasChildren(item)" name="chevron-down" class="top-navigation__chevron" />
        </a>
        <button
          v-else
          type="button"
          class="top-navigation__trigger"
          :aria-expanded="hasChildren(item)"
          :aria-haspopup="hasChildren(item) ? 'menu' : undefined"
        >
          <AppIcon :name="item.icon || 'layers'" class="top-navigation__icon" />
          <span>{{ resolveLocalizedLabel(navigationLabel(item)) }}</span>
          <AppIcon v-if="hasChildren(item)" name="chevron-down" class="top-navigation__chevron" />
        </button>
        <TopNavigation v-if="hasChildren(item)" :items="item.children" :depth="depth + 1" />
      </li>
    </ul>
  </nav>
  <ul v-else class="top-navigation__list top-navigation__list--submenu" role="menu">
    <li
      v-for="item in displayItems"
      :key="item.id"
      class="top-navigation__item"
      :class="{ 'top-navigation__item--has-children': hasChildren(item) }"
      role="none"
    >
      <RouterLink
        v-if="item.type === 'menu'"
        :to="item.path"
        class="top-navigation__trigger"
        role="menuitem"
      >
        <AppIcon :name="item.icon || 'menu'" class="top-navigation__icon" />
        <span>{{ resolveLocalizedLabel(navigationLabel(item)) }}</span>
        <AppIcon v-if="hasChildren(item)" name="chevron-right" class="top-navigation__chevron" />
      </RouterLink>
      <a
        v-else-if="item.type === 'button'"
        :href="item.externalUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="top-navigation__trigger"
        role="menuitem"
      >
        <AppIcon :name="item.icon || 'external'" class="top-navigation__icon" />
        <span>{{ resolveLocalizedLabel(navigationLabel(item)) }}</span>
        <AppIcon v-if="hasChildren(item)" name="chevron-right" class="top-navigation__chevron" />
      </a>
      <button
        v-else
        type="button"
        class="top-navigation__trigger"
        role="menuitem"
        :aria-expanded="hasChildren(item)"
        :aria-haspopup="hasChildren(item) ? 'menu' : undefined"
      >
        <AppIcon :name="item.icon || 'layers'" class="top-navigation__icon" />
        <span>{{ resolveLocalizedLabel(navigationLabel(item)) }}</span>
        <AppIcon v-if="hasChildren(item)" name="chevron-right" class="top-navigation__chevron" />
      </button>
      <TopNavigation v-if="hasChildren(item)" :items="item.children" :depth="depth + 1" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NavigationMenu } from '@cyber-ai-forge/api-contract'
import AppIcon from '@/foundation/components/AppIcon.vue'
import { useLocalization } from '@/foundation/modules/localization/localization'
import { navigationLabel } from '@/foundation/modules/navigation/navigation.labels'

defineOptions({ name: 'TopNavigation' })

const props = withDefaults(defineProps<{ items: NavigationMenu[]; depth?: number }>(), {
  depth: 0,
})

const { resolveLocalizedLabel, t } = useLocalization()
const displayItems = computed(() =>
  props.items.filter((item) => item.type !== 'directory' || item.children.length > 0),
)

function hasChildren(item: NavigationMenu): boolean {
  return item.children.length > 0
}
</script>

<style lang="scss" scoped>
.top-navigation {
  min-width: 0;
  flex: 1 1 auto;
}

.top-navigation__list {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
}

.top-navigation__list--root {
  align-items: center;
  gap: 4px;
}

.top-navigation__item {
  position: relative;
}

.top-navigation__trigger {
  display: flex;
  min-width: 0;
  min-height: 40px;
  align-items: center;
  gap: 8px;
  padding: 0 11px;
  border: 0;
  border-radius: 4px;
  color: var(--ink-soft);
  background: transparent;
  font: inherit;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  transition:
    color 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;

  &:hover,
  &:focus-visible,
  &.router-link-active:not(.top-navigation__trigger--home),
  &.top-navigation__trigger--home.router-link-exact-active {
    outline: 0;
    color: var(--primary-deep);
    background: var(--primary-mist);
  }

  &:focus-visible {
    box-shadow: none;
  }
}

.top-navigation__icon {
  width: 15px;
  height: 15px;
  flex: 0 0 auto;
}

.top-navigation__chevron {
  width: 13px;
  height: 13px;
  flex: 0 0 auto;
  margin-left: 1px;
  opacity: 0.58;
  transition: transform 0.18s ease;
}

.top-navigation__list--submenu {
  position: absolute;
  z-index: 30;
  top: calc(100% - 2px);
  left: 0;
  display: grid;
  width: max-content;
  min-width: 216px;
  max-width: min(300px, calc(100vw - 32px));
  gap: 2px;
  padding: 8px;
  border: 1px solid color-mix(in srgb, var(--line), transparent 10%);
  border-radius: 4px;
  background: color-mix(in srgb, var(--surface), transparent 3%);
  box-shadow: none;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-4px);
  transition:
    opacity 0.16s ease,
    transform 0.16s ease,
    visibility 0s linear 0.16s;
  visibility: hidden;
}

.top-navigation__list--submenu .top-navigation__trigger {
  width: 100%;
  min-height: 42px;
  justify-content: flex-start;
  padding: 0 10px;
  border-radius: 4px;
}

.top-navigation__list--submenu .top-navigation__chevron {
  margin-left: auto;
}

.top-navigation__list--submenu .top-navigation__list--submenu {
  top: -8px;
  left: calc(100% - 4px);
  transform: translateX(-4px);
}

.top-navigation__item:hover > .top-navigation__list--submenu,
.top-navigation__item:focus-within > .top-navigation__list--submenu {
  opacity: 1;
  pointer-events: auto;
  transform: translate(0, 0);
  transition-delay: 0s;
  visibility: visible;
}

.top-navigation__item:hover > .top-navigation__trigger .top-navigation__chevron,
.top-navigation__item:focus-within > .top-navigation__trigger .top-navigation__chevron {
  transform: rotate(180deg);
}

.top-navigation__list--submenu
  .top-navigation__item:hover
  > .top-navigation__trigger
  .top-navigation__chevron,
.top-navigation__list--submenu
  .top-navigation__item:focus-within
  > .top-navigation__trigger
  .top-navigation__chevron {
  transform: rotate(0deg) translateX(2px);
}
</style>

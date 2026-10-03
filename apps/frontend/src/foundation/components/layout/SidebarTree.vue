<template>
  <ul class="sidebar-tree" :class="{ 'sidebar-tree--nested': depth > 0 }">
    <li v-for="item in items" :key="item.id">
      <button
        v-if="item.type === 'directory' && item.children.length"
        class="sidebar-directory"
        type="button"
        :style="indentStyle"
        :aria-expanded="expanded[item.id] !== false"
        @click="toggle(item.id)"
      >
        <span class="sidebar-node-icon"><AppIcon :name="item.icon || 'layers'" /></span>
        <span class="sidebar-node-copy">
          <b>{{ resolveLocalizedLabel(navigationLabel(item)) }}</b>
          <small>{{ t('navigation.shell.childCount', { count: item.children.length }) }}</small>
        </span>
        <AppIcon
          name="chevron-down"
          class="directory-chevron"
          :class="{ 'directory-chevron--closed': expanded[item.id] === false }"
        />
      </button>
      <RouterLink
        v-else-if="item.type === 'menu'"
        :to="item.path"
        class="sidebar-link"
        :style="indentStyle"
        @click="$emit('navigate')"
      >
        <span class="sidebar-node-icon"><AppIcon :name="item.icon || 'menu'" /></span>
        <span class="sidebar-node-copy">
          <b>{{ resolveLocalizedLabel(navigationLabel(item)) }}</b>
          <small>{{ item.path }}</small>
        </span>
      </RouterLink>
      <a
        v-else-if="item.type === 'button'"
        :href="item.externalUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="sidebar-link"
        :style="indentStyle"
        @click="$emit('navigate')"
      >
        <span class="sidebar-node-icon"><AppIcon :name="item.icon || 'external'" /></span>
        <span class="sidebar-node-copy">
          <b>{{ resolveLocalizedLabel(navigationLabel(item)) }}</b>
          <small>{{ t('navigation.shell.externalLink') }}</small>
        </span>
        <AppIcon name="external" class="external-icon" />
      </a>
      <!-- 目录递归复用本组件，depth 同时驱动视觉缩进。 -->
      <SidebarTree
        v-if="item.type === 'directory' && item.children.length && expanded[item.id] !== false"
        :items="item.children"
        :depth="depth + 1"
        @navigate="$emit('navigate')"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { EntityId, NavigationMenu } from '@cyber-ai-forge/api-contract'
import AppIcon from '@/foundation/components/AppIcon.vue'
import { navigationLabel } from '@/foundation/modules/navigation/navigation.labels'
import { useLocalization } from '@/foundation/modules/localization/localization'

const props = withDefaults(defineProps<{ items: NavigationMenu[]; depth?: number }>(), { depth: 0 })
defineEmits<{ navigate: [] }>()

const { resolveLocalizedLabel, t } = useLocalization()

const expanded = reactive<Record<EntityId, boolean>>({})

const indentStyle = computed(() => ({ paddingLeft: `${14 + props.depth * 14}px` }))

function toggle(id: EntityId): void {
  expanded[id] = expanded[id] === false
}
</script>

<style lang="scss" scoped>
.sidebar-tree {
  display: grid;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.sidebar-tree--nested {
  margin: 4px 0 16px;
}
.sidebar-directory,
.sidebar-link {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 44px;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border: 0;
  border-radius: 4px;
  color: var(--ink-soft);
  background: transparent;
  text-align: left;
  text-decoration: none;
  transition:
    background 0.15s,
    color 0.15s;
}
.sidebar-link:hover,
.sidebar-directory:hover {
  background: var(--surface-muted);
  color: var(--ink);
}
.sidebar-link.router-link-active {
  color: var(--primary);
  background: var(--primary-mist);
}
.sidebar-link.router-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 2px;
  background: var(--primary);
}
.sidebar-directory {
  color: var(--muted);
  margin-top: 8px;
}
.sidebar-node-icon {
  display: grid;
  place-items: center;
  flex: 0 0 18px;
}
.sidebar-node-copy {
  min-width: 0;
  flex: 1;
}
.sidebar-node-copy b {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.sidebar-node-copy small {
  display: none;
}
.sidebar-directory .sidebar-node-copy b {
  font-size: 11px;
  letter-spacing: 0.08em;
}
.directory-chevron,
.external-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}
.directory-chevron--closed {
  transform: rotate(-90deg);
}
</style>

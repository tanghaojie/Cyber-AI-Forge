<template>
  <nav class="tag-view" :aria-label="t('tag-view.history.label')">
    <div ref="historyRef" class="tag-view__history">
      <div
        v-for="tag in tags"
        :key="tag.path"
        class="tag-view__item"
        :class="{ 'tag-view__item--active': tag.path === activePath }"
      >
        <button
          class="tag-view__link"
          type="button"
          :title="tag.title"
          :aria-current="tag.path === activePath ? 'page' : undefined"
          @click="$emit('navigate', tag.path)"
        >
          <span class="tag-view__marker" aria-hidden="true" />
          <span class="tag-view__title">{{ tag.title }}</span>
        </button>
        <button
          class="tag-view__close"
          type="button"
          :aria-label="t('tag-view.close.label', { title: tag.title })"
          @click="$emit('close', tag.path)"
        >
          <Close />
        </button>
      </div>
    </div>

    <div class="tag-view__actions">
      <el-dropdown trigger="click" @command="handleCommand">
        <button
          class="tag-view__action-button"
          type="button"
          :aria-label="t('tag-view.actions.label')"
        >
          <span>{{ t('tag-view.actions.label') }}</span>
          <ArrowDown />
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="close-current" :disabled="!hasCurrent">
              {{ t('tag-view.actions.closeCurrent') }}
            </el-dropdown-item>
            <el-dropdown-item command="close-others" :disabled="!hasCurrent || tags.length <= 1">
              {{ t('tag-view.actions.closeOthers') }}
            </el-dropdown-item>
            <el-dropdown-item command="close-all" :disabled="tags.length === 0">
              {{ t('tag-view.actions.closeAll') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { ArrowDown, Close } from '@element-plus/icons-vue'
import type { TagViewItem } from './tag-view.store'
import { useLocalization } from '@/foundation/modules/localization/localization'

const props = defineProps<{
  tags: readonly TagViewItem[]
  activePath: string
}>()

const emit = defineEmits<{
  navigate: [path: string]
  close: [path: string]
  'close-current': []
  'close-others': []
  'close-all': []
}>()

const historyRef = ref<HTMLElement>()
const { t } = useLocalization()
const hasCurrent = computed(() => props.tags.some((tag) => tag.path === props.activePath))

watch(
  [() => props.activePath, () => props.tags.length],
  async function revealActiveTag() {
    await nextTick()
    historyRef.value
      ?.querySelector<HTMLElement>('[aria-current="page"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  },
  { flush: 'post', immediate: true },
)

function handleCommand(command: string): void {
  if (command === 'close-current') {
    emit('close-current')
  } else if (command === 'close-others') {
    emit('close-others')
  } else if (command === 'close-all') {
    emit('close-all')
  }
}
</script>

<style lang="scss" scoped>
.tag-view {
  position: sticky;
  top: var(--app-shell-header-height);
  z-index: 19;
  display: flex;
  height: var(--tag-view-height);
  border-bottom: 1px solid var(--line);
  background: var(--canvas);
  padding: 0 40px;
}
.tag-view__history {
  display: flex;
  align-items: stretch;
  gap: 24px;
  overflow-x: auto;
  scrollbar-width: none;
  min-width: 0;
  flex: 1;
}
.tag-view__item {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  border-bottom: 2px solid transparent;
  color: var(--muted);
}
.tag-view__item--active {
  border-bottom-color: var(--primary);
  color: var(--ink);
}
.tag-view__link {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 12px;
  white-space: nowrap;
}
.tag-view__marker {
  display: none;
}
.tag-view__title {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tag-view__close {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 0;
  margin-left: 4px;
  border-radius: 4px;
  background: transparent;
  color: var(--muted);
}
.tag-view__close:hover {
  color: var(--danger);
  background: var(--surface-muted);
}
.tag-view__close svg,
.tag-view__action-button svg {
  width: 12px;
  height: 12px;
}
.tag-view__actions {
  display: flex;
  align-items: center;
  margin-left: 16px;
}
.tag-view__action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 0;
  background: transparent;
  color: var(--ink-soft);
  font-size: 11px;
}
@media (max-width: 639px) {
  .tag-view {
    padding: 0 16px;
  }
  .tag-view__actions span {
    display: none;
  }
}
</style>

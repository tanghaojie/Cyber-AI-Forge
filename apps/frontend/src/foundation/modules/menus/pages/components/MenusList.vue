<template>
  <div class="surface-card">
    <div class="resource-toolbar">
      <el-input
        v-model="keyword"
        clearable
        :prefix-icon="Search"
        :placeholder="t('menus.list.searchPlaceholder')"
        size="large"
      />
      <span>{{ t('menus.list.total', { count: records.length }) }}</span>
    </div>
    <el-alert
      v-if="errorMessage"
      class="mx-5 mt-4 !w-auto"
      :title="errorMessage"
      type="error"
      show-icon
      :closable="false"
    />
    <!-- Element Plus 直接消费 buildMenuTree 生成的 children 结构。 -->
    <el-table
      v-loading="loading"
      :data="treeRecords"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children' }"
      :empty-text="t('menus.list.empty')"
    >
      <el-table-column :label="t('menus.fields.name')" min-width="220">
        <template #default="{ row }">
          <div class="menu-name">
            <span class="menu-icon">
              <AppIcon :name="row.icon || fallbackIcon(row.type)" />
            </span>
            <b>{{ row.name }}</b>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('menus.fields.type')" width="110">
        <template #default="{ row }">
          <el-tag :type="tagType(row.type)" effect="light" round>
            {{ typeLabel(row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('menus.fields.target')" min-width="230">
        <template #default="{ row }">
          <code v-if="row.type === 'menu'" class="code-chip">
            {{ row.path }} · {{ row.component }}
          </code>
          <a
            v-else-if="row.type === 'button'"
            class="external-target"
            :href="row.externalUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ row.externalUrl }} ↗
          </a>
          <code v-else class="code-chip">{{ row.path || t('menus.list.pendingRoute') }}</code>
        </template>
      </el-table-column>
      <el-table-column prop="sortOrder" :label="t('menus.fields.order')" width="80" />
      <el-table-column :label="t('menus.fields.permission')" min-width="170">
        <template #default="{ row }">
          <code v-if="row.requiredPermissionKey" class="code-chip">
            {{ row.requiredPermissionKey }}
          </code>
          <span v-else class="table-muted">{{ t('menus.list.unrestricted') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('menus.fields.status')" width="90">
        <template #default="{ row }">
          <span class="status-label" :class="{ 'is-enabled': row.enabled }">{{
            row.enabled ? t('shared.state.enabled') : t('shared.state.disabled')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('menus.fields.actions')" width="150" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="row.type === 'directory'"
            circle
            text
            type="primary"
            :aria-label="t('shared.actions.add')"
            :icon="Plus"
            :title="t('menus.list.addChild')"
            @click="emit('create', row.id)"
          />
          <el-button
            circle
            text
            :aria-label="t('shared.actions.edit')"
            :icon="EditPen"
            @click="emit('edit', row)"
          />
          <el-button
            circle
            text
            type="danger"
            :aria-label="t('shared.actions.delete')"
            :icon="Delete"
            @click="remove(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <footer class="resource-footer">
      <span class="table-muted">{{ t('menus.list.footer') }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Delete, EditPen, Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { EntityId, MenuSummary } from '@cyber-ai-forge/api-contract'
import AppIcon from '@/foundation/components/AppIcon.vue'
import { useNavigationStore } from '@/foundation/modules/navigation/navigation.store'
import { buildMenuTree, type MenuTreeRecord } from '@/foundation/modules/menus/menu-tree'
import { deleteMenu, listAllMenus } from '@/foundation/modules/menus/menus.api'
import { useLocalization } from '@/foundation/modules/localization/localization'

type MenuType = MenuSummary['type']

const emit = defineEmits<{
  create: [parentId: EntityId]
  edit: [menu: MenuSummary]
  loaded: [records: MenuSummary[]]
}>()

const records = ref<MenuSummary[]>([])
const keyword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const navigation = useNavigationStore()
const { t } = useLocalization()
const treeRecords = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  if (!query) {
    return buildMenuTree(records.value)
  }
  const byId = new Map(records.value.map((record) => [record.id, record]))
  const visibleIds = new Set<EntityId>()
  // 搜索命中子节点时补齐祖先目录，保持结果仍是一棵可理解的树。
  for (const record of records.value) {
    if (!record.name.toLowerCase().includes(query)) {
      continue
    }
    visibleIds.add(record.id)
    let currentParentId = record.parentId
    while (currentParentId !== null && !visibleIds.has(currentParentId)) {
      visibleIds.add(currentParentId)
      currentParentId = byId.get(currentParentId)?.parentId ?? null
    }
  }
  return buildMenuTree(records.value.filter((record) => visibleIds.has(record.id)))
})

async function load(): Promise<void> {
  // 管理树一次加载全部节点，避免分页切断父子关系。
  loading.value = true
  errorMessage.value = ''
  try {
    records.value = await listAllMenus()
  } catch (error) {
    records.value = []
    errorMessage.value = error instanceof Error ? error.message : t('menus.errors.loadFailed')
  } finally {
    loading.value = false
    // 同步父页面的弹窗选项；失败时用空数组清除旧快照。
    emit('loaded', records.value)
  }
}

async function remove(menu: MenuTreeRecord): Promise<void> {
  try {
    await ElMessageBox.confirm(
      t('menus.confirm.deleteMessage', { name: menu.name }),
      t('menus.confirm.deleteTitle'),
      {
        type: 'warning',
        confirmButtonText: t('shared.actions.delete'),
        cancelButtonText: t('shared.actions.cancel'),
      },
    )
    const result = await deleteMenu(menu.id)
    if (result.status !== 0) {
      throw new Error(t('menus.errors.deleteFailed'))
    }
    ElMessage.success(t('menus.messages.deleted'))
    await load()
    // 菜单写入后强制刷新当前用户导航，应用壳会据此替换动态路由。
    await navigation.load(true)
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      errorMessage.value = error instanceof Error ? error.message : t('menus.errors.deleteFailed')
    }
  }
}

function typeLabel(type: MenuType): string {
  if (type === 'directory') {
    return t('menus.types.directory')
  }
  if (type === 'button') {
    return t('menus.types.external')
  }
  return t('menus.types.menu')
}

function tagType(type: MenuType): 'success' | 'warning' | 'info' {
  return type === 'menu' ? 'success' : type === 'button' ? 'warning' : 'info'
}

function fallbackIcon(type: MenuType): string {
  return type === 'directory' ? 'layers' : type === 'button' ? 'external' : 'menu'
}

// 供父页面在菜单弹窗保存后刷新管理树。
defineExpose({ reload: load })
onMounted(load)
</script>

<style lang="scss" scoped>
:deep(.el-table) {
  .el-table__row {
    .cell {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }
}

.menu-name {
  display: flex;
  align-items: center;
  gap: 11px;
}

.menu-name b {
  display: block;
  color: var(--ink);
  font-size: 13px;
}

.menu-icon {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 11px;
  color: var(--primary-deep);
  background: var(--primary-mist);
}

.external-target {
  display: block;
  max-width: 280px;
  overflow: hidden;
  color: var(--primary-deep);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

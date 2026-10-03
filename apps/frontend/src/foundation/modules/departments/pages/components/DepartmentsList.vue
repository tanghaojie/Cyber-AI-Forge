<template>
  <div class="surface-card">
    <div class="resource-toolbar">
      <el-input
        v-model="keyword"
        clearable
        :prefix-icon="Search"
        :placeholder="t('departments.list.searchPlaceholder')"
        size="large"
      />
      <span>{{ t('departments.list.total', { count: records.length }) }}</span>
    </div>
    <el-alert
      v-if="errorMessage"
      class="mx-5 mt-4 !w-auto"
      :title="errorMessage"
      type="error"
      show-icon
      :closable="false"
    />
    <div class="organization-layout" v-loading="loading">
      <nav class="organization-tree" :aria-label="t('departments.views.departments')">
        <el-tree
          :data="visibleTree"
          node-key="id"
          :props="{ label: 'name', children: 'children' }"
          default-expand-all
          highlight-current
          :current-node-key="selected?.id"
          :expand-on-click-node="false"
          :empty-text="t('departments.list.empty')"
          @node-click="selectDepartment"
          ><template #default="{ data }"
            ><span class="department-node"
              ><span>{{ data.name }}</span
              ><small v-if="!data.enabled">{{ t('shared.state.disabled') }}</small></span
            ></template
          ></el-tree
        >
      </nav>
      <article v-if="selected" class="organization-detail">
        <header>
          <div>
            <p>{{ t('departments.page.kicker') }}</p>
            <h3>{{ selected.name }}</h3>
          </div>
          <el-tag :type="selected.enabled ? 'success' : 'info'">{{
            selected.enabled ? t('shared.state.enabled') : t('shared.state.disabled')
          }}</el-tag>
        </header>
        <dl>
          <dt>{{ t('departments.fields.parent') }}</dt>
          <dd>{{ parentName(selected.parentId) }}</dd>
          <dt>{{ t('departments.fields.order') }}</dt>
          <dd>{{ selected.sortOrder }}</dd>
        </dl>
        <footer>
          <el-button type="primary" :icon="EditPen" @click="emit('edit', selected)">{{
            t('shared.actions.edit')
          }}</el-button
          ><el-button :icon="Plus" @click="emit('create', selected.id)">{{
            t('departments.page.add')
          }}</el-button
          ><el-button text type="danger" :icon="Delete" @click="remove(selected)">{{
            t('shared.actions.delete')
          }}</el-button>
        </footer>
      </article>
      <el-empty v-else :description="t('departments.list.empty')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Delete, EditPen, Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { DepartmentSummary, EntityId } from '@cyber-ai-forge/api-contract'
import { deleteDepartment, listDepartments } from '@/foundation/modules/departments/departments.api'
import { buildDepartmentTree, filterDepartmentTree } from '../department-tree'
import { useLocalization } from '@/foundation/modules/localization/localization'

const emit = defineEmits<{
  create: [parentId: EntityId]
  edit: [department: DepartmentSummary]
  loaded: [records: DepartmentSummary[]]
}>()
const records = ref<DepartmentSummary[]>([])
const selectedId = ref<EntityId | null>(null)
const selected = computed(() => records.value.find((item) => item.id === selectedId.value))
function selectDepartment(department: DepartmentSummary): void {
  selectedId.value = department.id
}
const keyword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const { t } = useLocalization()
const departmentTree = computed(() => buildDepartmentTree(records.value))
// 部门数量通常较小，搜索在完整树快照上即时执行并保留命中节点的层级上下文。
const visibleTree = computed(() => filterDepartmentTree(departmentTree.value, keyword.value))

function parentName(parentId: EntityId | null): string {
  return parentId === null
    ? t('departments.root')
    : (records.value.find((row) => row.id === parentId)?.name ??
        t('departments.unknown', { id: parentId }))
}

async function load(): Promise<void> {
  loading.value = true
  errorMessage.value = ''
  try {
    records.value = await listDepartments()
    if (!records.value.some((item) => item.id === selectedId.value)) {
      selectedId.value = records.value[0]?.id ?? null
    }
  } catch (error) {
    records.value = []
    errorMessage.value = error instanceof Error ? error.message : t('departments.errors.loadFailed')
  } finally {
    loading.value = false
    // 无论成功或失败都同步父页面，避免弹窗继续使用上一次加载的父节点列表。
    emit('loaded', records.value)
  }
}

async function remove(department: DepartmentSummary): Promise<void> {
  try {
    await ElMessageBox.confirm(
      t('departments.confirm.deleteMessage', { name: department.name }),
      t('departments.confirm.deleteTitle'),
      {
        type: 'warning',
        confirmButtonText: t('shared.actions.delete'),
        cancelButtonText: t('shared.actions.cancel'),
      },
    )
    const result = await deleteDepartment(department.id)
    if (result.status !== 0) {
      throw new Error(t('departments.errors.deleteFailed'))
    }
    ElMessage.success(t('departments.messages.deleted'))
    await load()
  } catch (error) {
    // 取消或关闭确认框属于正常交互，不覆盖当前页面错误状态。
    if (error !== 'cancel' && error !== 'close') {
      errorMessage.value =
        error instanceof Error ? error.message : t('departments.errors.deleteFailed')
    }
  }
}

// 供父页面在部门弹窗保存后刷新全量记录。
defineExpose({ reload: load })
onMounted(load)
</script>

<style scoped>
.organization-layout {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(0, 2fr);
  min-height: 440px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--surface);
  overflow: hidden;
}
.organization-tree {
  padding: 24px 16px;
  border-right: 1px solid var(--line);
  overflow: auto;
}
.organization-tree :deep(.el-tree) {
  background: transparent;
}
.organization-tree :deep(.el-tree-node__content) {
  height: 44px;
  border-radius: 4px;
}
.department-node {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}
.department-node small {
  color: var(--muted);
  font-size: 10px;
}
.organization-detail {
  padding: 32px;
}
.organization-detail header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.organization-detail header p {
  font: 10px var(--font-mono);
  letter-spacing: 0.1em;
  color: var(--muted);
}
.organization-detail h3 {
  margin: 12px 0;
  font-size: 26px;
  font-weight: 500;
}
.organization-detail dl {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 24px;
  margin: 32px 0;
  padding: 24px 0;
  border-block: 1px solid var(--line);
  font-size: 13px;
}
.organization-detail dt {
  color: var(--muted);
}
.organization-detail dd {
  margin: 0;
}
.organization-detail footer {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.organization-detail footer :deep(.el-button) {
  margin: 0;
}
@media (max-width: 800px) {
  .organization-layout {
    grid-template-columns: 1fr;
  }
  .organization-tree {
    max-height: 300px;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
  .organization-detail {
    padding: 24px;
  }
}
</style>

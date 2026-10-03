<template>
  <div class="surface-card">
    <!-- 列表组件拥有搜索、分页、删除确认和重新加载状态。 -->
    <div class="resource-toolbar">
      <el-input
        v-model="keyword"
        clearable
        :prefix-icon="Search"
        :placeholder="t('users.list.searchPlaceholder')"
        size="large"
        @keyup.enter="search"
        @clear="search"
      />
      <span>
        {{ t('users.list.total', { count: total }) }}
      </span>
    </div>
    <el-alert
      v-if="errorMessage"
      class="mx-5 mt-4 !w-auto"
      :title="errorMessage"
      type="error"
      show-icon
      :closable="false"
    />
    <el-table
      class="users-desktop"
      v-loading="loading"
      :data="records"
      row-key="id"
      :empty-text="t('users.list.empty')"
    >
      <el-table-column :label="t('users.fields.identity')" min-width="190">
        <template #default="{ row }"
          ><div class="user-identity">
            <span class="user-avatar">{{ row.displayName.slice(0, 1).toUpperCase() }}</span>
            <div>
              <b>{{ row.displayName }}</b
              ><small>{{ row.username }}</small>
            </div>
          </div></template
        >
      </el-table-column>
      <el-table-column prop="email" :label="t('users.fields.email')" min-width="190" />
      <el-table-column :label="t('users.fields.roles')" min-width="180">
        <template #default="{ row }">
          <div class="flex flex-wrap gap-1.5">
            <el-tag v-for="roleId in row.roleIds" :key="roleId" effect="plain" type="info">
              {{ roleName(roleId) }}
            </el-tag>
            <span v-if="!row.roleIds.length" class="table-muted">{{
              t('users.list.unassigned')
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('users.fields.organization')" min-width="180"
        ><template #default="{ row }"
          ><div class="user-identity">
            <div>
              <b>{{ departmentName(row.primaryDepartmentId) }}</b
              ><small>{{
                row.positionIds.map(positionName).join(' / ') || t('users.list.unassigned')
              }}</small>
            </div>
          </div></template
        ></el-table-column
      >
      <el-table-column :label="t('users.fields.status')" width="100">
        <template #default="{ row }">
          <span class="status-label" :class="{ 'is-enabled': row.enabled }">{{
            row.enabled ? t('shared.state.enabled') : t('shared.state.disabled')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('users.fields.updatedAt')" min-width="150">
        <template #default="{ row }">
          <span class="table-muted">{{ formatDate(row.updatedAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('users.fields.actions')" width="112" fixed="right">
        <template #default="{ row }">
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
    <div class="users-mobile" v-loading="loading">
      <article v-for="row in records" :key="row.id" class="user-record">
        <header>
          <div class="user-identity">
            <span class="user-avatar">{{ row.displayName.slice(0, 1).toUpperCase() }}</span>
            <div>
              <b>{{ row.displayName }}</b
              ><small>{{ row.username }}</small>
            </div>
          </div>
          <span class="status-label" :class="{ 'is-enabled': row.enabled }">{{
            row.enabled ? t('shared.state.enabled') : t('shared.state.disabled')
          }}</span>
        </header>
        <dl>
          <dt>{{ t('users.fields.email') }}</dt>
          <dd>{{ row.email }}</dd>
          <dt>{{ t('users.fields.roles') }}</dt>
          <dd>{{ row.roleIds.map(roleName).join(' / ') || t('users.list.unassigned') }}</dd>
          <dt>{{ t('users.fields.primaryDepartment') }}</dt>
          <dd>{{ departmentName(row.primaryDepartmentId) }}</dd>
          <dt>{{ t('users.fields.positions') }}</dt>
          <dd>{{ row.positionIds.map(positionName).join(' / ') || t('users.list.unassigned') }}</dd>
          <dt>{{ t('users.fields.updatedAt') }}</dt>
          <dd>{{ formatDate(row.updatedAt) }}</dd>
        </dl>
        <footer>
          <el-button @click="emit('edit', row)">{{ t('shared.actions.edit') }}</el-button
          ><el-button text type="danger" @click="remove(row)">{{
            t('shared.actions.delete')
          }}</el-button>
        </footer>
      </article>
      <el-empty v-if="!records.length && !loading" :description="t('users.list.empty')" />
    </div>
    <footer class="resource-footer">
      <el-pagination
        v-model:current-page="pageNum"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        background
        @current-change="load"
      />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, EditPen, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { DepartmentOption, EntityId, UserSummary } from '@cyber-ai-forge/api-contract'
import type { PositionOption } from '@/foundation/modules/positions/positions.api'
import type { RoleOption } from '@/foundation/modules/roles/roles.api'
import { deleteUser, listUsers } from '@/foundation/modules/users/users.api'
import { useLocalization } from '@/foundation/modules/localization/localization'

const props = defineProps<{
  roleOptions: RoleOption[]
  departmentOptions: DepartmentOption[]
  positionOptions: PositionOption[]
}>()
const emit = defineEmits<{
  edit: [user: UserSummary]
}>()

const records = ref<UserSummary[]>([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = 10
const keyword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const { formatDateTime, t } = useLocalization()

async function load(): Promise<void> {
  // 每次请求先清空旧错误；失败时清空陈旧列表，避免把旧数据误认为最新结果。
  loading.value = true
  errorMessage.value = ''
  try {
    const result = await listUsers(pageNum.value, pageSize, keyword.value)
    if (result.status !== 0) {
      throw new Error(t('users.errors.loadFailed'))
    }
    records.value = result.list
    total.value = result.total
  } catch (error) {
    records.value = []
    total.value = 0
    errorMessage.value = error instanceof Error ? error.message : t('users.errors.loadFailed')
  } finally {
    loading.value = false
  }
}

function search(): void {
  pageNum.value = 1
  void load()
}

function roleName(id: EntityId): string {
  return (
    props.roleOptions.find((role) => role.id === id)?.name ?? t('users.list.unknownRole', { id })
  )
}

function departmentName(id: EntityId): string {
  return (
    props.departmentOptions.find((department) => department.id === id)?.name ??
    t('users.list.unknownDepartment', { id })
  )
}

function positionName(id: EntityId): string {
  return (
    props.positionOptions.find((position) => position.id === id)?.name ??
    t('users.list.unknownPosition', { id })
  )
}

async function remove(user: UserSummary): Promise<void> {
  try {
    await ElMessageBox.confirm(
      t('users.confirm.deleteMessage', { name: user.displayName }),
      t('users.confirm.deleteTitle'),
      {
        type: 'warning',
        confirmButtonText: t('shared.actions.delete'),
        cancelButtonText: t('shared.actions.cancel'),
      },
    )
    const result = await deleteUser(user.id)
    if (result.status !== 0) {
      throw new Error(t('users.errors.deleteFailed'))
    }
    ElMessage.success(t('users.messages.deleted'))
    await load()
  } catch (error) {
    // Element Plus 用 cancel/close 字符串表示用户主动放弃，不应显示为删除错误。
    if (error !== 'cancel' && error !== 'close') {
      errorMessage.value = error instanceof Error ? error.message : t('users.errors.deleteFailed')
    }
  }
}

function formatDate(value: string): string {
  return formatDateTime(value)
}

// 父页面在弹窗保存后通过 reload 刷新当前页。
defineExpose({ reload: load })
onMounted(load)
</script>

<style scoped>
.user-identity {
  display: flex;
  align-items: center;
  gap: 12px;
}
.user-avatar {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  background: var(--surface-muted);
  border: 1px solid var(--line);
  border-radius: 4px;
  color: var(--ink-soft);
  font-size: 12px;
}
.user-identity b,
.user-identity small {
  display: block;
}
.user-identity b {
  font-weight: 500;
}
.user-identity small {
  font: 11px var(--font-mono);
  color: var(--muted);
  margin-top: 4px;
}
.users-mobile {
  display: none;
}
@media (max-width: 680px) {
  .users-desktop {
    display: none;
  }
  .users-mobile {
    display: grid;
    gap: 12px;
  }
  .user-record {
    padding: 20px;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: var(--surface);
  }
  .user-record header,
  .user-record footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }
  .user-record dl {
    display: grid;
    grid-template-columns: 90px minmax(0, 1fr);
    gap: 12px;
    font-size: 12px;
    padding: 20px 0;
    border-block: 1px solid var(--line);
  }
  .user-record dt {
    color: var(--muted);
  }
  .user-record dd {
    margin: 0;
    overflow-wrap: anywhere;
  }
}
</style>

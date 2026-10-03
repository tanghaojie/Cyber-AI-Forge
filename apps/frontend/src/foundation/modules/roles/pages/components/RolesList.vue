<template>
  <div class="surface-card">
    <!-- 列表组件拥有搜索、分页和删除确认状态。 -->
    <div class="resource-toolbar">
      <el-input
        v-model="keyword"
        clearable
        :prefix-icon="Search"
        :placeholder="t('roles.list.searchPlaceholder')"
        size="large"
        @keyup.enter="search"
        @clear="search"
      />
      <span>{{ t('roles.list.total', { count: total }) }}</span>
    </div>
    <el-alert
      v-if="errorMessage"
      class="mx-5 mt-4 !w-auto"
      :title="errorMessage"
      type="error"
      show-icon
      :closable="false"
    />
    <div class="roles-layout" v-loading="loading">
      <div class="role-directory" role="group" :aria-label="t('roles.views.roles')">
        <button
          v-for="row in records"
          :key="row.id"
          type="button"
          :class="{ 'is-selected': selected?.id === row.id }"
          :aria-pressed="selected?.id === row.id"
          @click="selectedId = row.id"
        >
          <span class="role-directory__name"
            >{{ row.name
            }}<span
              :class="['role-dot', { 'is-enabled': row.enabled }]"
              :title="row.enabled ? t('shared.state.enabled') : t('shared.state.disabled')" /></span
          ><span class="role-directory__description">{{ row.description || '—' }}</span></button
        ><el-empty v-if="!records.length && !loading" :description="t('roles.list.empty')" />
      </div>
      <article v-if="selected" class="role-detail">
        <header>
          <div>
            <p>{{ t('roles.page.kicker') }}</p>
            <h3>{{ selected.name }}</h3>
            <span>{{ selected.description || '—' }}</span>
          </div>
          <el-tag :type="selected.enabled ? 'success' : 'info'">{{
            selected.enabled ? t('shared.state.enabled') : t('shared.state.disabled')
          }}</el-tag>
        </header>
        <div class="role-detail__actions">
          <span>{{ t('roles.fields.updatedAt') }} · {{ formatDate(selected.updatedAt) }}</span
          ><el-button :icon="EditPen" @click="emit('edit', selected)">{{
            t('shared.actions.edit')
          }}</el-button
          ><el-button text type="danger" :icon="Delete" @click="remove(selected)">{{
            t('shared.actions.delete')
          }}</el-button>
        </div>
        <el-alert
          v-if="accessError"
          :title="accessError"
          type="error"
          show-icon
          :closable="false"
        />
        <div v-loading="accessLoading" class="role-access">
          <el-tabs v-model="detailTab"
            ><el-tab-pane name="permissions" :label="t('roles.editor.permissions')"
              ><ul v-if="selectedAccess?.permissionKeys.length" class="permission-list">
                <li v-for="key in selectedAccess.permissionKeys" :key="key">
                  <span>{{
                    resolveLocalizedLabel({
                      key: `authorization.permissions.${key}`,
                      fallback: key,
                    })
                  }}</span
                  ><code>{{ key }}</code>
                </li>
              </ul>
              <el-empty
                v-else-if="selectedAccess"
                :description="t('roles.detail.noPermissions')"
                :image-size="48" /></el-tab-pane
            ><el-tab-pane name="scope" :label="t('roles.editor.scope')"
              ><ul v-if="selectedAccess?.dataPolicies.length" class="permission-list">
                <li v-for="(policy, index) in selectedAccess.dataPolicies" :key="index">
                  <span
                    >{{
                      resolveLocalizedLabel({
                        key: `authorization.resources.${policy.resourceKey}`,
                        fallback: policy.resourceKey,
                      })
                    }}
                    / {{ t(`authorization.actions.${policy.action}`) }}</span
                  ><span>{{ t(`authorization.scopes.${policy.scopeType}`) }}</span>
                </li>
              </ul>
              <el-empty
                v-else-if="selectedAccess"
                :description="t('authorization.editor.empty')"
                :image-size="48"
              />
              <p class="table-muted">{{ t('roles.detail.scopeHint') }}</p></el-tab-pane
            ></el-tabs
          >
        </div>
      </article>
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
import { computed, onMounted, ref, watch } from 'vue'
import { Delete, EditPen, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSubjectAccess } from '@/foundation/modules/authorization/authorization.api'
import type { EntityId, SubjectAccessRequest, RoleSummary } from '@cyber-ai-forge/api-contract'
import { deleteRole, listRoles } from '@/foundation/modules/roles/roles.api'
import { useLocalization } from '@/foundation/modules/localization/localization'

const emit = defineEmits<{
  edit: [role: RoleSummary]
}>()

const records = ref<RoleSummary[]>([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = 10
const keyword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const { formatDateTime, resolveLocalizedLabel, t } = useLocalization()
const selectedId = ref<EntityId | null>(null)
const selected = computed(() => records.value.find((row) => row.id === selectedId.value))
const detailTab = ref('permissions')
const selectedAccess = ref<SubjectAccessRequest | null>(null)
const accessLoading = ref(false)
const accessError = ref('')
let accessRequest = 0
watch(selected, async function loadSelectedAccess(role) {
  const request = ++accessRequest
  selectedAccess.value = null
  accessError.value = ''
  accessLoading.value = Boolean(role)
  if (!role) {
    return
  }
  try {
    const access = await getSubjectAccess('role', role.id)
    if (request === accessRequest) {
      selectedAccess.value = access
    }
  } catch (error) {
    if (request === accessRequest) {
      accessError.value =
        error instanceof Error ? error.message : t('roles.errors.accessLoadFailed')
    }
  } finally {
    if (request === accessRequest) {
      accessLoading.value = false
    }
  }
})

async function load(): Promise<void> {
  // 请求失败时清空旧记录，避免用户把过期列表误当成本次搜索结果。
  loading.value = true
  errorMessage.value = ''
  try {
    const result = await listRoles(pageNum.value, pageSize, keyword.value)
    if (result.status !== 0) {
      throw new Error(t('roles.errors.loadFailed'))
    }
    records.value = result.list
    if (!records.value.some((row) => row.id === selectedId.value)) {
      selectedId.value = records.value[0]?.id ?? null
    }
    total.value = result.total
  } catch (error) {
    records.value = []
    total.value = 0
    errorMessage.value = error instanceof Error ? error.message : t('roles.errors.loadFailed')
  } finally {
    loading.value = false
  }
}

function search(): void {
  pageNum.value = 1
  void load()
}

async function remove(role: RoleSummary): Promise<void> {
  try {
    await ElMessageBox.confirm(
      t('roles.confirm.deleteMessage', { name: role.name }),
      t('roles.confirm.deleteTitle'),
      {
        type: 'warning',
        confirmButtonText: t('shared.actions.delete'),
        cancelButtonText: t('shared.actions.cancel'),
      },
    )
    const result = await deleteRole(role.id)
    if (result.status !== 0) {
      throw new Error(t('roles.errors.deleteFailed'))
    }
    ElMessage.success(t('roles.messages.deleted'))
    await load()
  } catch (error) {
    // 用户关闭确认框不是业务错误，不显示失败提示。
    if (error !== 'cancel' && error !== 'close') {
      errorMessage.value = error instanceof Error ? error.message : t('roles.errors.deleteFailed')
    }
  }
}

function formatDate(value: string): string {
  return formatDateTime(value)
}

// 供父页面在弹窗保存后刷新列表。
defineExpose({ reload: load })
onMounted(load)
</script>

<style scoped>
.roles-layout {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(0, 2.6fr);
  border: 1px solid var(--line);
  border-radius: 6px;
  overflow: hidden;
  background: var(--surface);
  min-height: 460px;
}
.role-directory {
  border-right: 1px solid var(--line);
  padding: 12px;
}
.role-directory > button {
  display: block;
  width: 100%;
  padding: 20px 16px;
  text-align: left;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: var(--ink);
}
.role-directory > button:hover {
  background: var(--surface-muted);
}
.role-directory > button.is-selected {
  background: var(--primary-mist);
  border-color: var(--line);
}
.role-directory__name {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 14px;
}
.role-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--muted);
  flex-shrink: 0;
}
.role-dot.is-enabled {
  background: var(--success);
}
.role-directory__description {
  display: block;
  margin-top: 8px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.7;
}
.role-detail {
  padding: 32px;
  min-width: 0;
}
.role-detail header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.role-detail header p {
  margin: 0;
  color: var(--muted);
  font: 10px var(--font-mono);
  letter-spacing: 0.1em;
}
.role-detail h3 {
  margin: 12px 0;
  font-size: 28px;
  font-weight: 500;
}
.role-detail header div > span {
  color: var(--muted);
  font-size: 13px;
}
.role-detail__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 24px 0;
  flex-wrap: wrap;
}
.role-detail__actions > span {
  margin-right: auto;
  font-size: 11px;
  color: var(--muted);
}
.role-access {
  min-height: 200px;
}
.permission-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.permission-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
  font-size: 13px;
}
.permission-list code {
  color: var(--muted);
  font: 11px var(--font-mono);
  overflow-wrap: anywhere;
}
@media (max-width: 850px) {
  .roles-layout {
    grid-template-columns: 1fr;
  }
  .role-directory {
    display: flex;
    overflow-x: auto;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
  .role-directory > button {
    width: 200px;
    flex-shrink: 0;
  }
  .role-detail {
    padding: 24px;
  }
  .role-detail__actions > span {
    width: 100%;
    margin-bottom: 8px;
  }
  .permission-list li {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>

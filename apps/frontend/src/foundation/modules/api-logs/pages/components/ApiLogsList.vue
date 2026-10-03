<template>
  <div class="surface-card api-log-card">
    <form class="api-log-filters prism-log-filters" @submit.prevent="search">
      <el-form-item :label="t('api-logs.filters.occurredAt')">
        <el-date-picker
          v-model="filters.occurredRange"
          type="datetimerange"
          range-separator="—"
          :start-placeholder="t('api-logs.filters.occurredAtPlaceholder')"
          :end-placeholder="t('api-logs.filters.occurredAtPlaceholder')"
          class="!w-full"
        />
      </el-form-item>
      <el-form-item :label="t('api-logs.filters.actorUsername')">
        <el-input
          v-model.trim="filters.actorUsername"
          clearable
          :placeholder="t('api-logs.filters.actorUsernamePlaceholder')"
        />
      </el-form-item>
      <el-form-item :label="t('api-logs.filters.method')">
        <el-select
          v-model="filters.method"
          clearable
          filterable
          allow-create
          default-first-option
          :placeholder="t('api-logs.filters.methodPlaceholder')"
        >
          <el-option v-for="method in methods" :key="method" :label="method" :value="method" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('api-logs.filters.routePattern')">
        <el-input
          v-model.trim="filters.routePattern"
          clearable
          :placeholder="t('api-logs.filters.routePatternPlaceholder')"
        />
      </el-form-item>
      <el-form-item :label="t('api-logs.filters.httpStatus')">
        <el-input-number
          v-model="filters.httpStatus"
          :min="100"
          :max="599"
          :controls="false"
          :placeholder="t('api-logs.filters.httpStatusPlaceholder')"
          class="!w-full"
        />
      </el-form-item>
      <el-form-item :label="t('api-logs.filters.retention')">
        <el-segmented v-model="filters.retention" :options="retentionOptions" class="!w-full" />
      </el-form-item>
      <div class="filter-actions">
        <el-button native-type="submit" type="primary" :icon="Search" :loading="loading">
          {{ t('api-logs.actions.query') }}
        </el-button>
        <el-button @click="reset">{{ t('api-logs.actions.reset') }}</el-button>
      </div>
    </form>

    <div class="resource-toolbar api-log-toolbar">
      <span>{{ t('api-logs.list.total', { count: total }) }}</span>
      <el-button text :icon="Refresh" :loading="loading" @click="load">
        {{ t('api-logs.actions.refresh') }}
      </el-button>
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
      v-loading="loading"
      :data="records"
      row-key="id"
      :empty-text="t('api-logs.list.empty')"
    >
      <el-table-column :label="t('api-logs.list.occurredAt')" min-width="172">
        <template #default="{ row }">
          <span class="table-muted">{{ formatDateTime(row.occurredAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('api-logs.list.actor')" min-width="135">
        <template #default="{ row }">
          <span>{{ row.actorUsername || t('api-logs.list.system') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('api-logs.list.request')" min-width="270">
        <template #default="{ row }">
          <div class="request-cell">
            <el-tag effect="plain" size="small">{{ row.method }}</el-tag>
            <code class="code-chip">{{ row.routePattern }}</code>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('api-logs.list.status')" min-width="150">
        <template #default="{ row }">
          <div class="status-stack">
            <el-tag size="small" :type="httpStatusType(row.httpStatus)">{{
              row.httpStatus
            }}</el-tag>
            <span class="table-muted">{{ businessStatusLabel(row.businessStatus) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('api-logs.list.duration')" width="104" align="right">
        <template #default="{ row }">
          <span class="duration-value">{{ formatDuration(row.durationMs) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('api-logs.list.retention')" min-width="144">
        <template #default="{ row }">
          <el-tag v-if="!row.expiresAt" type="warning" effect="light" round>
            {{ t('api-logs.list.permanent') }}
          </el-tag>
          <span v-else class="table-muted">
            {{ t('api-logs.list.expiresAt', { time: formatDateTime(row.expiresAt) }) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="t('api-logs.list.actions')" width="84" fixed="right">
        <template #default="{ row }">
          <el-button
            circle
            text
            :icon="View"
            :title="t('api-logs.actions.details')"
            :aria-label="t('api-logs.actions.details')"
            @click="openDetails(row)"
          />
        </template>
      </el-table-column>
    </el-table>
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

  <ApiLogDetailDrawer v-if="selectedLog" v-model="detailOpen" :log="selectedLog" />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Refresh, Search, View } from '@element-plus/icons-vue'
import type { ApiLogItem, ApiLogQuery } from '@cyber-ai-forge/api-contract'
import { listApiLogs } from '@/foundation/modules/api-logs/api-logs.api'
import { useLocalization } from '@/foundation/modules/localization/localization'
import ApiLogDetailDrawer from './ApiLogDetailDrawer.vue'

type RetentionFilter = '' | 'permanent' | 'temporary'

interface ApiLogFilters {
  actorUsername: string
  method: string
  routePattern: string
  httpStatus: number | undefined
  retention: RetentionFilter
  occurredRange: [Date, Date] | null
}

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
const records = ref<ApiLogItem[]>([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = 10
const loading = ref(false)
const errorMessage = ref('')
const selectedLog = ref<ApiLogItem | null>(null)
const detailOpen = ref(false)
const filters = reactive<ApiLogFilters>({
  actorUsername: '',
  method: '',
  routePattern: '',
  httpStatus: undefined,
  retention: '',
  occurredRange: null,
})
const { currentLocale, formatDateTime, t } = useLocalization()
const retentionOptions = computed(() => [
  { label: t('api-logs.filters.retentionAll'), value: '' },
  { label: t('api-logs.filters.retentionPermanent'), value: 'permanent' },
  { label: t('api-logs.filters.retentionTemporary'), value: 'temporary' },
])

function query(): ApiLogQuery {
  const occurredRange = filters.occurredRange
  return {
    pageNum: pageNum.value,
    pageSize,
    ...(filters.actorUsername ? { actorUsername: filters.actorUsername } : {}),
    ...(filters.method ? { method: filters.method } : {}),
    ...(filters.routePattern ? { routePattern: filters.routePattern } : {}),
    ...(filters.httpStatus === undefined ? {} : { httpStatus: filters.httpStatus }),
    ...(filters.retention ? { retention: filters.retention } : {}),
    ...(occurredRange ? { occurredFrom: occurredRange[0].toISOString() } : {}),
    ...(occurredRange ? { occurredTo: occurredRange[1].toISOString() } : {}),
  }
}

async function load(): Promise<void> {
  loading.value = true
  errorMessage.value = ''
  try {
    const result = await listApiLogs(query())
    if (result.status !== 0) {
      throw new Error(result.err || t('api-logs.errors.loadFailed'))
    }
    records.value = result.list
    total.value = result.total
  } catch (error) {
    records.value = []
    total.value = 0
    errorMessage.value = error instanceof Error ? error.message : t('api-logs.errors.loadFailed')
  } finally {
    loading.value = false
  }
}

function search(): void {
  pageNum.value = 1
  void load()
}

function reset(): void {
  Object.assign(filters, {
    actorUsername: '',
    method: '',
    routePattern: '',
    httpStatus: undefined,
    retention: '',
    occurredRange: null,
  })
  pageNum.value = 1
  void load()
}

function openDetails(log: ApiLogItem): void {
  selectedLog.value = log
  detailOpen.value = true
}

function httpStatusType(status: number): 'success' | 'warning' | 'danger' | 'info' {
  if (status >= 500) {
    return 'danger'
  }
  if (status >= 400) {
    return 'warning'
  }
  if (status >= 200 && status < 300) {
    return 'success'
  }
  return 'info'
}

function businessStatusLabel(status: number | null): string {
  if (status === null) {
    return t('api-logs.list.businessStatusNone')
  }
  if (status === 0) {
    return t('api-logs.list.businessStatusSuccess')
  }
  return t('api-logs.list.businessStatusValue', { status })
}

function formatDuration(durationMs: number): string {
  return `${new Intl.NumberFormat(currentLocale.value).format(durationMs)} ms`
}

onMounted(load)
</script>

<style lang="scss" scoped>
.api-log-card {
  overflow: visible;
}

.api-log-filters {
  display: grid;
  grid-template-columns: minmax(270px, 1.6fr) repeat(3, minmax(150px, 1fr));
  gap: 0 16px;
  padding: 20px 20px 4px;
  border-bottom: 1px solid var(--line);
  background:
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--primary-mist), transparent 30%),
      transparent 58%
    ),
    var(--surface-muted);
}

.api-log-filters :deep(.el-form-item) {
  margin-bottom: 16px;
}

.api-log-filters :deep(.el-form-item__label) {
  color: var(--muted);
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.045em;
}

.filter-actions {
  display: flex;
  grid-column: 1 / -1;
  justify-content: flex-end;
  gap: 9px;
  margin-top: -2px;
  margin-bottom: 16px;
}

.api-log-toolbar {
  min-height: 60px;
  padding-top: 8px;
  padding-bottom: 8px;
}

.request-cell,
.status-stack {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
}

.status-stack {
  align-items: flex-start;
  flex-direction: column;
  gap: 4px;
}

.request-cell .code-chip {
  flex: 1;
}

.duration-value {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 750;
  white-space: nowrap;
}

@media (max-width: 1080px) {
  .api-log-filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .api-log-filters {
    grid-template-columns: 1fr;
    padding: 18px 16px 2px;
  }

  .filter-actions {
    justify-content: stretch;
  }

  .filter-actions .el-button {
    flex: 1;
  }
}
.prism-log-filters {
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--surface);
  margin-bottom: 20px;
}
</style>

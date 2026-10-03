<template>
  <el-drawer
    v-model="drawerOpen"
    :title="t('api-logs.detail.title')"
    direction="rtl"
    size="min(600px, 100vw)"
    append-to-body
  >
    <dl class="log-detail-grid">
      <div class="log-detail-wide">
        <dt>{{ t('api-logs.detail.requestId') }}</dt>
        <dd class="request-id-value">
          <code class="code-chip">{{ log.requestId }}</code>
          <el-button text size="small" @click="copyRequestId">
            {{ t('api-logs.actions.copy') }}
          </el-button>
        </dd>
      </div>
      <div>
        <dt>{{ t('api-logs.detail.actorUsername') }}</dt>
        <dd>{{ log.actorUsername || t('api-logs.list.system') }}</dd>
      </div>
      <div>
        <dt>{{ t('api-logs.detail.actorUserId') }}</dt>
        <dd>{{ log.actorUserId ?? t('api-logs.detail.none') }}</dd>
      </div>
      <div class="log-detail-wide">
        <dt>{{ t('api-logs.detail.occurredAt') }}</dt>
        <dd>{{ formatDateTime(log.occurredAt) }}</dd>
      </div>
      <div>
        <dt>{{ t('api-logs.detail.method') }}</dt>
        <dd>
          <el-tag effect="plain">{{ log.method }}</el-tag>
        </dd>
      </div>
      <div>
        <dt>{{ t('api-logs.detail.httpStatus') }}</dt>
        <dd>
          <el-tag :type="httpStatusType(log.httpStatus)">{{ log.httpStatus }}</el-tag>
        </dd>
      </div>
      <div class="log-detail-wide">
        <dt>{{ t('api-logs.detail.routePattern') }}</dt>
        <dd>
          <code class="code-chip">{{ log.routePattern }}</code>
        </dd>
      </div>
      <div>
        <dt>{{ t('api-logs.detail.businessStatus') }}</dt>
        <dd>{{ businessStatusLabel(log.businessStatus) }}</dd>
      </div>
      <div>
        <dt>{{ t('api-logs.detail.duration') }}</dt>
        <dd>{{ formatDuration(log.durationMs) }}</dd>
      </div>
      <div>
        <dt>{{ t('api-logs.detail.retention') }}</dt>
        <dd>
          {{
            log.expiresAt ? t('api-logs.filters.retentionTemporary') : t('api-logs.list.permanent')
          }}
        </dd>
      </div>
      <div>
        <dt>{{ t('api-logs.detail.expiresAt') }}</dt>
        <dd>{{ log.expiresAt ? formatDateTime(log.expiresAt) : t('api-logs.detail.none') }}</dd>
      </div>
    </dl>
  </el-drawer>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { ApiLogItem } from '@cyber-ai-forge/api-contract'
import { useLocalization } from '@/foundation/modules/localization/localization'

const { log } = defineProps<{ log: ApiLogItem }>()
const drawerOpen = defineModel<boolean>({ required: true })
const { currentLocale, formatDateTime, t } = useLocalization()

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

async function copyRequestId(): Promise<void> {
  try {
    await navigator.clipboard.writeText(log.requestId)
    ElMessage.success(t('api-logs.messages.copied'))
  } catch {
    ElMessage.error(t('api-logs.errors.copyFailed'))
  }
}
</script>

<style lang="scss" scoped>
.log-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px 18px;
  margin: 0;
}

.log-detail-grid div {
  min-width: 0;
}

.log-detail-wide {
  grid-column: 1 / -1;
}

dt {
  margin-bottom: 7px;
  color: var(--muted);
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

dd {
  margin: 0;
  color: var(--ink);
  font-size: 13px;
  overflow-wrap: anywhere;
}

.request-id-value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.request-id-value .code-chip {
  flex: 1;
}

@media (max-width: 420px) {
  .log-detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>

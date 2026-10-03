<template>
  <section class="management-page positions-page" aria-labelledby="positions-title">
    <header class="position-hero">
      <div class="position-hero__copy">
        <span class="position-hero__kicker">{{ t('positions.page.kicker') }}</span>
        <h1 id="positions-title">{{ t('positions.page.title') }}</h1>
        <p>{{ t('positions.page.description') }}</p>
      </div>
      <div class="position-hero__signal">
        <span class="position-hero__signal-dot" aria-hidden="true" />
        <strong>{{ activeCount }}</strong>
        <span>{{ t('positions.page.activeLabel') }}</span>
      </div>
      <el-button
        type="primary"
        :aria-label="t('shared.actions.add')"
        :icon="Plus"
        size="large"
        @click="openCreate"
      >
        {{ t('positions.page.add') }}
      </el-button>
    </header>

    <PositionsList
      ref="positionsList"
      :department-options="departmentOptions"
      @edit="openEdit"
      @active-count="activeCount = $event"
    />
    <PositionDialog
      v-model="dialogOpen"
      :position="editingPosition"
      :department-options="departmentOptions"
      @saved="refreshList"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { DepartmentOption, PositionSummary } from '@cyber-ai-forge/api-contract'
import { listDepartmentOptions } from '@/foundation/modules/departments/departments.api'
import PositionDialog from './components/PositionDialog.vue'
import PositionsList from './components/PositionsList.vue'
import { useLocalization } from '@/foundation/modules/localization/localization'

const { t } = useLocalization()
const positionsList = ref<InstanceType<typeof PositionsList> | null>(null)
const departmentOptions = ref<DepartmentOption[]>([])
const editingPosition = ref<PositionSummary | null>(null)
const dialogOpen = ref(false)
const activeCount = ref(0)

function openCreate(): void {
  editingPosition.value = null
  dialogOpen.value = true
}

function openEdit(position: PositionSummary): void {
  editingPosition.value = position
  dialogOpen.value = true
}

async function refreshList(): Promise<void> {
  await positionsList.value?.reload()
}

onMounted(async function loadDepartmentOptions() {
  try {
    departmentOptions.value = await listDepartmentOptions()
  } catch {
    departmentOptions.value = []
  }
})
</script>

<style lang="scss" scoped>
.position-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.position-hero__kicker {
  font: 11px var(--font-mono);
  color: var(--primary);
  letter-spacing: 0.12em;
}
.position-hero h1 {
  margin: 8px 0;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: -0.03em;
}
.position-hero p {
  color: var(--muted);
  font-size: 14px;
  margin: 0;
}
.position-hero__signal {
  display: grid;
  gap: 4px;
  margin-left: auto;
  padding-left: 24px;
  border-left: 1px solid var(--line);
}
.position-hero__signal strong {
  font: 24px var(--font-mono);
}
.position-hero__signal > span {
  font-size: 11px;
  color: var(--muted);
}
.position-hero__signal-dot {
  display: none;
}
@media (max-width: 800px) {
  .position-hero {
    flex-wrap: wrap;
  }
  .position-hero__signal {
    display: none;
  }
}
</style>

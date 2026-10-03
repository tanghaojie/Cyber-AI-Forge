<template>
  <section class="management-page" aria-labelledby="departments-title">
    <header class="page-intro">
      <div>
        <p>{{ t('departments.page.kicker') }}</p>
        <h2 id="departments-title">{{ t('departments.views.departments') }}</h2>
        <span>{{ t('departments.page.description') }}</span>
      </div>
      <el-button
        type="primary"
        :aria-label="t('shared.actions.add')"
        :icon="Plus"
        size="large"
        @click="openCreate(null)"
      >
        {{ t('departments.page.add') }}
      </el-button>
    </header>
    <!-- 列表把最新全量记录回传给页面，弹窗据此生成父部门选项。 -->
    <DepartmentsList
      ref="departmentsList"
      @create="openCreate"
      @edit="openEdit"
      @loaded="records = $event"
    />
    <DepartmentDialog
      v-model="dialogOpen"
      :department="editingDepartment"
      :parent-id="parentId"
      :records="records"
      @saved="refreshList"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { DepartmentSummary, EntityId } from '@cyber-ai-forge/api-contract'
import DepartmentDialog from './components/DepartmentDialog.vue'
import DepartmentsList from './components/DepartmentsList.vue'
import { useLocalization } from '@/foundation/modules/localization/localization'

const { t } = useLocalization()
const departmentsList = ref<InstanceType<typeof DepartmentsList> | null>(null)
const records = ref<DepartmentSummary[]>([])
const editingDepartment = ref<DepartmentSummary | null>(null)
const parentId = ref<EntityId | null>(null)
const dialogOpen = ref(false)

function openCreate(selectedParentId: EntityId | null): void {
  // 从某行“新增子部门”进入时预选该行作为父节点；页头新增则传 0。
  editingDepartment.value = null
  parentId.value = selectedParentId
  dialogOpen.value = true
}

function openEdit(department: DepartmentSummary): void {
  editingDepartment.value = department
  parentId.value = department.parentId
  dialogOpen.value = true
}

async function refreshList(): Promise<void> {
  await departmentsList.value?.reload()
}
</script>

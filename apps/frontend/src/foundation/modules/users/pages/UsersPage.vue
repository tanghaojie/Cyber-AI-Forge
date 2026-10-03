<template>
  <section class="management-page" aria-labelledby="users-title">
    <header class="page-intro">
      <div>
        <p>{{ t('users.page.kicker') }}</p>
        <h2 id="users-title">{{ t('users.views.users') }}</h2>
        <span>{{ t('users.page.description') }}</span>
      </div>
      <el-button
        type="primary"
        :aria-label="t('shared.actions.add')"
        :icon="Plus"
        size="large"
        @click="openCreate"
      >
        {{ t('users.page.add') }}
      </el-button>
    </header>

    <!-- 页面负责协调选项、列表和弹窗；分页与表单细节留在子组件内部。 -->
    <UsersList
      ref="usersList"
      :role-options="roleOptions"
      :department-options="departmentOptions"
      :position-options="positionOptions"
      @edit="openEdit"
    />
    <UserDialog
      v-model="dialogOpen"
      :user="editingUser"
      :role-options="roleOptions"
      :department-options="departmentOptions"
      :position-options="positionOptions"
      @saved="refreshList"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { DepartmentOption, UserSummary } from '@cyber-ai-forge/api-contract'
import { listDepartmentOptions } from '@/foundation/modules/departments/departments.api'
import {
  listPositionOptions,
  type PositionOption,
} from '@/foundation/modules/positions/positions.api'
import { listRoleOptions, type RoleOption } from '@/foundation/modules/roles/roles.api'
import UserDialog from './components/UserDialog.vue'
import UsersList from './components/UsersList.vue'
import { useLocalization } from '@/foundation/modules/localization/localization'

const { t } = useLocalization()
const usersList = ref<InstanceType<typeof UsersList> | null>(null)
const roleOptions = ref<RoleOption[]>([])
const departmentOptions = ref<DepartmentOption[]>([])
const positionOptions = ref<PositionOption[]>([])
const editingUser = ref<UserSummary | null>(null)
const dialogOpen = ref(false)

function openCreate(): void {
  editingUser.value = null
  dialogOpen.value = true
}

function openEdit(user: UserSummary): void {
  editingUser.value = user
  dialogOpen.value = true
}

async function refreshList(): Promise<void> {
  await usersList.value?.reload()
}

onMounted(async function loadOptions() {
  // 两组选项互不依赖，并行加载且允许其中一组失败后页面仍可展示用户列表。
  const [roles, departments, positions] = await Promise.allSettled([
    listRoleOptions(),
    listDepartmentOptions(),
    listPositionOptions(),
  ])
  roleOptions.value = roles.status === 'fulfilled' ? roles.value : []
  departmentOptions.value = departments.status === 'fulfilled' ? departments.value : []
  positionOptions.value = positions.status === 'fulfilled' ? positions.value : []
})
</script>

<template>
  <section class="management-page" aria-labelledby="roles-title">
    <header class="page-intro">
      <div>
        <p>{{ t('roles.page.kicker') }}</p>
        <h2 id="roles-title">{{ t('roles.views.roles') }}</h2>
        <span>{{ t('roles.page.description') }}</span>
      </div>
      <el-button
        type="primary"
        :aria-label="t('shared.actions.add')"
        :icon="Plus"
        size="large"
        @click="openCreate"
      >
        {{ t('roles.page.add') }}
      </el-button>
    </header>

    <!-- 页面只协调列表和弹窗；保存后通过公开 reload 刷新当前分页。 -->
    <RolesList ref="rolesList" @edit="openEdit" />
    <RoleDialog v-model="dialogOpen" :role="editingRole" @saved="refreshList" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { RoleSummary } from '@cyber-ai-forge/api-contract'
import RoleDialog from './components/RoleDialog.vue'
import RolesList from './components/RolesList.vue'
import { useLocalization } from '@/foundation/modules/localization/localization'

const { t } = useLocalization()
const rolesList = ref<InstanceType<typeof RolesList> | null>(null)
const editingRole = ref<RoleSummary | null>(null)
const dialogOpen = ref(false)

function openCreate(): void {
  editingRole.value = null
  dialogOpen.value = true
}

function openEdit(role: RoleSummary): void {
  editingRole.value = role
  dialogOpen.value = true
}

async function refreshList(): Promise<void> {
  await rolesList.value?.reload()
}
</script>

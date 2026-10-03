<template>
  <section class="management-page" aria-labelledby="menus-title">
    <header class="page-intro">
      <div>
        <p>{{ t('menus.page.kicker') }}</p>
        <h2 id="menus-title">{{ t('menus.views.menus') }}</h2>
        <span>{{ t('menus.page.description') }}</span>
      </div>
      <el-button
        type="primary"
        :aria-label="t('shared.actions.add')"
        :icon="Plus"
        size="large"
        @click="openCreate(null)"
      >
        {{ t('menus.page.add') }}
      </el-button>
    </header>

    <!-- 列表回传全量菜单，弹窗用同一快照生成可选父目录。 -->
    <MenusList ref="menusList" @create="openCreate" @edit="openEdit" @loaded="records = $event" />
    <MenuDialog
      v-model="dialogOpen"
      :menu="editingMenu"
      :parent-id="parentId"
      :records="records"
      @saved="refreshList"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { EntityId, MenuSummary } from '@cyber-ai-forge/api-contract'
import MenuDialog from './components/MenuDialog.vue'
import MenusList from './components/MenusList.vue'
import { useLocalization } from '@/foundation/modules/localization/localization'

const { t } = useLocalization()
const menusList = ref<InstanceType<typeof MenusList> | null>(null)
const records = ref<MenuSummary[]>([])
const editingMenu = ref<MenuSummary | null>(null)
const parentId = ref<EntityId | null>(null)
const dialogOpen = ref(false)

function openCreate(selectedParentId: EntityId | null): void {
  // 从目录行新增时预选父目录，页头新增传入 0 创建根节点。
  editingMenu.value = null
  parentId.value = selectedParentId
  dialogOpen.value = true
}

function openEdit(menu: MenuSummary): void {
  editingMenu.value = menu
  parentId.value = menu.parentId
  dialogOpen.value = true
}

async function refreshList(): Promise<void> {
  await menusList.value?.reload()
}
</script>

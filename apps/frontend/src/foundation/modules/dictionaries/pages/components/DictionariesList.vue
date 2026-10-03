<template>
  <div class="surface-card">
    <!-- 列表组件拥有搜索、分页和删除确认状态。 -->
    <div class="resource-toolbar">
      <el-input
        v-model="keyword"
        clearable
        :prefix-icon="Search"
        :placeholder="t('dictionaries.list.searchPlaceholder')"
        size="large"
        @keyup.enter="search"
        @clear="search"
      />
      <span>{{ t('dictionaries.list.total', { count: total }) }}</span>
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
      :empty-text="t('dictionaries.list.empty')"
    >
      <el-table-column prop="type" :label="t('dictionaries.fields.type')" min-width="180">
        <template #default="{ row }">
          <code class="code-chip">{{ row.type }}</code>
        </template>
      </el-table-column>
      <el-table-column prop="label" :label="t('dictionaries.fields.label')" min-width="150" />
      <el-table-column prop="value" :label="t('dictionaries.fields.value')" min-width="170"
        ><template #default="{ row }"
          ><code class="code-chip">{{ row.value }}</code></template
        ></el-table-column
      >
      <el-table-column
        prop="remark"
        :label="t('dictionaries.fields.remark')"
        min-width="220"
        show-overflow-tooltip
      />
      <el-table-column prop="sortOrder" :label="t('dictionaries.fields.order')" width="80" />
      <el-table-column :label="t('dictionaries.fields.status')" width="100">
        <template #default="{ row }">
          <span class="status-label" :class="{ 'is-enabled': row.enabled }">{{
            row.enabled ? t('shared.state.enabled') : t('shared.state.disabled')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('dictionaries.fields.actions')" width="112" fixed="right">
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
import type { DictionarySummary } from '@cyber-ai-forge/api-contract'
import {
  deleteDictionary,
  listDictionaries,
} from '@/foundation/modules/dictionaries/dictionaries.api'
import { useLocalization } from '@/foundation/modules/localization/localization'

const emit = defineEmits<{
  edit: [dictionary: DictionarySummary]
}>()

const records = ref<DictionarySummary[]>([])
const total = ref(0)
const pageNum = ref(1)
const pageSize = 10
const keyword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const { t } = useLocalization()

async function load(): Promise<void> {
  // 加载失败时清空旧页，避免用户把过期字典项误认为本次查询结果。
  loading.value = true
  errorMessage.value = ''
  try {
    const result = await listDictionaries(pageNum.value, pageSize, keyword.value)
    if (result.status !== 0) {
      throw new Error(t('dictionaries.errors.loadFailed'))
    }
    records.value = result.list
    total.value = result.total
  } catch (error) {
    records.value = []
    total.value = 0
    errorMessage.value =
      error instanceof Error ? error.message : t('dictionaries.errors.loadFailed')
  } finally {
    loading.value = false
  }
}

function search(): void {
  pageNum.value = 1
  void load()
}

async function remove(dictionary: DictionarySummary): Promise<void> {
  try {
    await ElMessageBox.confirm(
      t('dictionaries.confirm.deleteMessage', { name: dictionary.label }),
      t('dictionaries.confirm.deleteTitle'),
      {
        type: 'warning',
        confirmButtonText: t('shared.actions.delete'),
        cancelButtonText: t('shared.actions.cancel'),
      },
    )
    const result = await deleteDictionary(dictionary.id)
    if (result.status !== 0) {
      throw new Error(t('dictionaries.errors.deleteFailed'))
    }
    ElMessage.success(t('dictionaries.messages.deleted'))
    await load()
  } catch (error) {
    // 用户主动关闭确认框不是删除失败。
    if (error !== 'cancel' && error !== 'close') {
      errorMessage.value =
        error instanceof Error ? error.message : t('dictionaries.errors.deleteFailed')
    }
  }
}

// 供父页面在弹窗保存后刷新当前分页。
defineExpose({ reload: load })
onMounted(load)
</script>

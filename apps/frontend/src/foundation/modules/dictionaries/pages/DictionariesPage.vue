<template>
  <section class="management-page" aria-labelledby="dictionaries-title">
    <header class="page-intro">
      <div>
        <p>{{ t('dictionaries.page.kicker') }}</p>
        <h2 id="dictionaries-title">{{ t('dictionaries.views.dictionaries') }}</h2>
        <span>{{ t('dictionaries.page.description') }}</span>
      </div>
      <el-button
        type="primary"
        :aria-label="t('shared.actions.add')"
        :icon="Plus"
        size="large"
        @click="openCreate"
      >
        {{ t('dictionaries.page.add') }}
      </el-button>
    </header>

    <!-- 页面协调列表和弹窗，保存完成后由列表公开方法刷新当前分页。 -->
    <DictionariesList ref="dictionariesList" @edit="openEdit" />
    <DictionaryDialog v-model="dialogOpen" :dictionary="editingDictionary" @saved="refreshList" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { DictionarySummary } from '@cyber-ai-forge/api-contract'
import DictionariesList from './components/DictionariesList.vue'
import DictionaryDialog from './components/DictionaryDialog.vue'
import { useLocalization } from '@/foundation/modules/localization/localization'

const { t } = useLocalization()
const dictionariesList = ref<InstanceType<typeof DictionariesList> | null>(null)
const editingDictionary = ref<DictionarySummary | null>(null)
const dialogOpen = ref(false)

function openCreate(): void {
  editingDictionary.value = null
  dialogOpen.value = true
}

function openEdit(dictionary: DictionarySummary): void {
  editingDictionary.value = dictionary
  dialogOpen.value = true
}

async function refreshList(): Promise<void> {
  await dictionariesList.value?.reload()
}
</script>

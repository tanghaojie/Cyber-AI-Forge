<template>
  <el-drawer
    v-model="dialogOpen"
    :title="dictionary ? t('dictionaries.dialog.editTitle') : t('dictionaries.dialog.createTitle')"
    size="min(696px, 100vw)"
    :close-on-click-modal="false"
    :close-on-press-escape="!saving"
    :show-close="!saving"
  >
    <el-form :disabled="saving" label-position="top" @submit.prevent="submit">
      <div class="form-columns">
        <el-form-item :label="t('dictionaries.fields.type')" required>
          <el-input
            v-model.trim="form.type"
            :placeholder="t('dictionaries.dialog.typePlaceholder')"
          />
        </el-form-item>
        <el-form-item :label="t('dictionaries.fields.label')" required>
          <el-input
            v-model.trim="form.label"
            :placeholder="t('dictionaries.dialog.labelPlaceholder')"
          />
        </el-form-item>
        <el-form-item :label="t('dictionaries.fields.value')" required>
          <el-input
            v-model.trim="form.value"
            :placeholder="t('dictionaries.dialog.valuePlaceholder')"
          />
        </el-form-item>
        <el-form-item :label="t('dictionaries.fields.order')">
          <el-input-number v-model="form.sortOrder" :min="0" :max="9999" class="!w-full" />
        </el-form-item>
        <el-form-item :label="t('dictionaries.fields.remark')" class="sm:col-span-2">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            :placeholder="t('dictionaries.dialog.remarkPlaceholder')"
          />
        </el-form-item>
        <el-form-item :label="t('dictionaries.fields.status')" class="sm:col-span-2">
          <el-switch
            v-model="form.enabled"
            :active-text="t('shared.state.enabled')"
            :inactive-text="t('shared.state.disabled')"
          />
        </el-form-item>
      </div>
      <el-alert v-if="formError" :title="formError" type="error" show-icon :closable="false" />
      <div class="dialog-actions">
        <el-button @click="dialogOpen = false">{{ t('shared.actions.cancel') }}</el-button>
        <el-button native-type="submit" type="primary" :loading="saving">{{
          t('dictionaries.dialog.save')
        }}</el-button>
      </div>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { DictionaryRequest, DictionarySummary } from '@cyber-ai-forge/api-contract'
import {
  createDictionary,
  updateDictionary,
} from '@/foundation/modules/dictionaries/dictionaries.api'
import { useLocalization } from '@/foundation/modules/localization/localization'

const props = defineProps<{
  dictionary: DictionarySummary | null
}>()
const emit = defineEmits<{
  saved: []
}>()
const dialogOpen = defineModel<boolean>({ required: true })

const saving = ref(false)
const formError = ref('')
const { t } = useLocalization()
const form = reactive<DictionaryRequest>({
  type: '',
  label: '',
  value: '',
  sortOrder: 0,
  enabled: true,
  remark: '',
})

function resetForm(): void {
  // 每次打开都从当前字典重新填充，新增模式则恢复完整默认值。
  Object.assign(
    form,
    props.dictionary
      ? {
          type: props.dictionary.type,
          label: props.dictionary.label,
          value: props.dictionary.value,
          sortOrder: props.dictionary.sortOrder,
          enabled: props.dictionary.enabled,
          remark: props.dictionary.remark,
        }
      : { type: '', label: '', value: '', sortOrder: 0, enabled: true, remark: '' },
  )
  formError.value = ''
}

async function submit(): Promise<void> {
  saving.value = true
  formError.value = ''
  try {
    if (!form.type || !form.label || !form.value) {
      throw new Error(t('dictionaries.errors.invalidForm'))
    }
    // 复制响应式对象为普通契约载荷，避免把 Vue 代理传到 API 层。
    const payload: DictionaryRequest = { ...form }
    const result = props.dictionary
      ? await updateDictionary(props.dictionary.id, payload)
      : await createDictionary(payload)
    if (result.status !== 0) {
      throw new Error(t('dictionaries.errors.saveFailed'))
    }
    dialogOpen.value = false
    ElMessage.success(t('dictionaries.messages.saved'))
    emit('saved')
  } catch (error) {
    formError.value = error instanceof Error ? error.message : t('dictionaries.errors.saveFailed')
  } finally {
    saving.value = false
  }
}

watch(dialogOpen, function initializeForm(open) {
  // 关闭时保留画面状态，只有再次打开才重置，避免关闭动画期间字段跳变。
  if (open) {
    resetForm()
  }
})
</script>

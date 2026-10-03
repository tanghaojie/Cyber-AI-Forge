<template>
  <el-drawer
    v-model="dialogOpen"
    :title="position ? t('positions.dialog.editTitle') : t('positions.dialog.createTitle')"
    size="min(696px, 100vw)"
    :close-on-click-modal="false"
    :close-on-press-escape="!saving"
    :show-close="!saving"
  >
    <el-form :disabled="saving" label-position="top" @submit.prevent="submit">
      <div class="form-columns">
        <el-form-item :label="t('positions.fields.department')" required>
          <el-select
            v-model="form.departmentId"
            class="w-full"
            filterable
            :placeholder="t('positions.dialog.departmentPlaceholder')"
          >
            <el-option
              v-for="department in departmentOptions"
              :key="department.id"
              :label="department.name"
              :value="department.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('positions.fields.name')" required>
          <el-input v-model.trim="form.name" :placeholder="t('positions.dialog.namePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('positions.fields.description')" class="sm:col-span-2">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            :placeholder="t('positions.dialog.descriptionPlaceholder')"
          />
        </el-form-item>
        <el-form-item :label="t('positions.fields.order')">
          <el-input-number v-model="form.sortOrder" :min="0" :max="9999" class="w-full" />
        </el-form-item>
        <el-form-item :label="t('positions.fields.status')">
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
        <el-button native-type="submit" type="primary" :loading="saving">
          {{ t('positions.dialog.save') }}
        </el-button>
      </div>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type {
  DepartmentOption,
  EntityId,
  PositionRequest,
  PositionSummary,
} from '@cyber-ai-forge/api-contract'
import { createPosition, updatePosition } from '@/foundation/modules/positions/positions.api'
import { useLocalization } from '@/foundation/modules/localization/localization'

const props = defineProps<{
  position: PositionSummary | null
  departmentOptions: DepartmentOption[]
}>()
const emit = defineEmits<{ saved: [] }>()
const dialogOpen = defineModel<boolean>({ required: true })
const { t } = useLocalization()
const saving = ref(false)
const formError = ref('')
const form = reactive<{
  departmentId: EntityId | null
  name: string
  description: string
  sortOrder: number
  enabled: boolean
}>({
  departmentId: null,
  name: '',
  description: '',
  sortOrder: 10,
  enabled: true,
})

function resetForm(): void {
  Object.assign(
    form,
    props.position
      ? {
          departmentId: props.position.departmentId,
          name: props.position.name,
          description: props.position.description,
          sortOrder: props.position.sortOrder,
          enabled: props.position.enabled,
        }
      : {
          departmentId: props.departmentOptions[0]?.id ?? null,
          name: '',
          description: '',
          sortOrder: 10,
          enabled: true,
        },
  )
  formError.value = ''
}

async function submit(): Promise<void> {
  saving.value = true
  formError.value = ''
  try {
    if (!form.departmentId || !form.name) {
      throw new Error(t('positions.errors.invalidForm'))
    }
    const payload: PositionRequest = { ...form, departmentId: form.departmentId }
    const result = props.position
      ? await updatePosition(props.position.id, payload)
      : await createPosition(payload)
    if (result.status !== 0) {
      throw new Error(t('positions.errors.saveFailed'))
    }
    dialogOpen.value = false
    ElMessage.success(t('positions.messages.saved'))
    emit('saved')
  } catch (error) {
    formError.value = error instanceof Error ? error.message : t('positions.errors.saveFailed')
  } finally {
    saving.value = false
  }
}

watch(dialogOpen, function initializeForm(open) {
  if (open) {
    resetForm()
  }
})
</script>

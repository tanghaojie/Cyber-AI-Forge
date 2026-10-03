<template>
  <el-drawer
    v-model="dialogOpen"
    :title="department ? t('departments.dialog.editTitle') : t('departments.dialog.createTitle')"
    size="min(696px, 100vw)"
    :close-on-click-modal="false"
    :close-on-press-escape="!saving"
    :show-close="!saving"
  >
    <el-form :disabled="saving" label-position="top" @submit.prevent="submit">
      <div class="form-columns">
        <el-form-item :label="t('departments.fields.name')" required>
          <el-input
            v-model.trim="form.name"
            :placeholder="t('departments.dialog.namePlaceholder')"
          />
        </el-form-item>
        <el-form-item :label="t('departments.fields.parent')">
          <el-tree-select
            v-model="form.parentId"
            class="w-full"
            :data="parentTreeOptions"
            node-key="value"
            check-strictly
            default-expand-all
            filterable
          />
        </el-form-item>
        <el-form-item :label="t('departments.fields.order')">
          <el-input-number v-model="form.sortOrder" :min="0" :max="9999" class="!w-full" />
        </el-form-item>
        <el-form-item :label="t('departments.fields.status')" class="sm:col-span-2">
          <el-switch
            v-model="form.enabled"
            :active-text="t('shared.state.enabled')"
            :inactive-text="t('shared.state.disabled')"
          />
        </el-form-item>
      </div>
      <!-- 部门策略允许向下级继承，基本资料保存成功后再整体替换策略。 -->
      <DataPolicyEditor v-model="access.dataPolicies" allow-inheritance />
      <el-alert v-if="formError" :title="formError" type="error" show-icon :closable="false" />
      <div class="dialog-actions">
        <el-button @click="dialogOpen = false">{{ t('shared.actions.cancel') }}</el-button>
        <el-button native-type="submit" type="primary" :loading="saving" :disabled="!accessReady">
          {{ t('departments.dialog.save') }}
        </el-button>
      </div>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type {
  DepartmentRequest,
  DepartmentSummary,
  EntityId,
  SubjectAccessRequest,
} from '@cyber-ai-forge/api-contract'
import DataPolicyEditor from '@/foundation/modules/authorization/components/DataPolicyEditor.vue'
import {
  getSubjectAccess,
  replaceSubjectAccess,
} from '@/foundation/modules/authorization/authorization.api'
import {
  createDepartment,
  updateDepartment,
} from '@/foundation/modules/departments/departments.api'
import {
  buildDepartmentTree,
  collectDepartmentSubtreeIds,
  toDepartmentTreeOptions,
  type DepartmentTreeOption,
} from '../department-tree'
import { useLocalization } from '@/foundation/modules/localization/localization'

const props = defineProps<{
  department: DepartmentSummary | null
  parentId: EntityId | null
  records: DepartmentSummary[]
}>()
const emit = defineEmits<{ saved: [] }>()
const dialogOpen = defineModel<boolean>({ required: true })
const saving = ref(false)
const accessReady = ref(true)
const formError = ref('')
const { t } = useLocalization()
const form = reactive<DepartmentRequest>({
  parentId: null,
  name: '',
  sortOrder: 0,
  enabled: true,
})
const access = reactive<SubjectAccessRequest>({ permissionKeys: [], dataPolicies: [] })
const parentTreeOptions = computed<DepartmentTreeOption[]>(() => {
  const excludedIds = props.department
    ? collectDepartmentSubtreeIds(props.records, props.department.id)
    : new Set<EntityId>()
  const children = toDepartmentTreeOptions(buildDepartmentTree(props.records, excludedIds))
  return [
    { value: null, label: t('departments.root'), ...(children.length > 0 ? { children } : {}) },
  ]
})

function resetForm(): void {
  Object.assign(
    form,
    props.department
      ? {
          parentId: props.department.parentId,
          name: props.department.name,
          sortOrder: props.department.sortOrder,
          enabled: props.department.enabled,
        }
      : { parentId: props.parentId, name: '', sortOrder: 0, enabled: true },
  )
  Object.assign(access, { permissionKeys: [], dataPolicies: [] })
  formError.value = ''
}

async function submit(): Promise<void> {
  saving.value = true
  formError.value = ''
  try {
    if (!form.name) {
      throw new Error(t('departments.errors.invalidForm'))
    }
    const result = props.department
      ? await updateDepartment(props.department.id, { ...form })
      : await createDepartment({ ...form })
    if (result.status !== 0) {
      throw new Error(t('departments.errors.saveFailed'))
    }
    const departmentId = props.department?.id ?? result.data?.id
    if (!departmentId) {
      throw new Error(t('departments.errors.missingId'))
    }
    // 新建部门取得主体 ID 后，才能保存以该部门为授权主体的数据规则。
    const accessResult = await replaceSubjectAccess('department', departmentId, {
      permissionKeys: [],
      dataPolicies: access.dataPolicies.map((policy) => ({
        ...policy,
        departmentIds: [...policy.departmentIds],
      })),
    })
    if (accessResult.status !== 0) {
      throw new Error(t('departments.errors.accessSaveFailed'))
    }
    dialogOpen.value = false
    ElMessage.success(t('departments.messages.saved'))
    emit('saved')
  } catch (error) {
    formError.value = error instanceof Error ? error.message : t('departments.errors.saveFailed')
  } finally {
    saving.value = false
  }
}

watch(dialogOpen, async function initializeForm(open) {
  if (!open) {
    return
  }
  resetForm()
  if (props.department) {
    // 策略加载完成前禁止提交，避免空配置覆盖已有部门继承规则。
    accessReady.value = false
    try {
      const loaded = await getSubjectAccess('department', props.department.id)
      access.dataPolicies = loaded.dataPolicies.map((policy) => ({
        ...policy,
        departmentIds: [...policy.departmentIds],
      }))
    } catch (error) {
      formError.value =
        error instanceof Error ? error.message : t('departments.errors.accessLoadFailed')
    } finally {
      accessReady.value = !formError.value
    }
  } else {
    accessReady.value = true
  }
})
</script>

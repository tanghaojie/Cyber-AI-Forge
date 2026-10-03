<template>
  <el-drawer
    v-model="dialogOpen"
    :title="user ? t('users.dialog.editTitle') : t('users.dialog.createTitle')"
    size="min(696px, 100vw)"
    :close-on-click-modal="false"
    :close-on-press-escape="!saving"
    :show-close="!saving"
  >
    <el-form :disabled="saving" label-position="top" @submit.prevent="submit">
      <el-tabs v-model="editorTab"
        ><el-tab-pane name="identity" :label="t('users.editor.identity')"
          ><div class="form-columns">
            <el-form-item :label="t('users.fields.username')" required>
              <el-input
                v-model.trim="form.username"
                :disabled="Boolean(user || savedEntityId)"
                :placeholder="t('users.dialog.usernamePlaceholder')"
              />
            </el-form-item>
            <el-form-item :label="t('users.fields.displayName')" required>
              <el-input
                v-model.trim="form.displayName"
                :placeholder="t('users.dialog.displayNamePlaceholder')"
              />
            </el-form-item>
            <el-form-item :label="t('users.fields.email')" required>
              <el-input
                v-model.trim="form.email"
                type="email"
                :placeholder="t('users.dialog.emailPlaceholder')"
              />
            </el-form-item>
            <el-form-item
              :label="user ? t('users.fields.newPassword') : t('users.fields.password')"
              :required="!user && !savedEntityId"
            >
              <el-input
                v-model="form.password"
                type="password"
                show-password
                :placeholder="t('users.dialog.passwordPlaceholder')"
              />
            </el-form-item>
            <el-form-item :label="t('users.fields.roles')" class="sm:col-span-2">
              <el-select
                v-model="form.roleIds"
                multiple
                class="w-full"
                :placeholder="t('users.dialog.rolesPlaceholder')"
              >
                <el-option
                  v-for="role in roleOptions"
                  :key="role.id"
                  :label="role.name"
                  :value="role.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('users.fields.departments')" class="sm:col-span-2" required>
              <el-select
                v-model="form.departmentIds"
                multiple
                filterable
                class="w-full"
                :placeholder="t('users.dialog.departmentsPlaceholder')"
              >
                <el-option
                  v-for="department in departmentOptions"
                  :key="department.id"
                  :label="department.name"
                  :value="department.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('users.fields.positions')" class="sm:col-span-2">
              <el-select
                v-model="form.positionIds"
                multiple
                filterable
                class="w-full"
                :placeholder="t('users.dialog.positionsPlaceholder')"
              >
                <el-option
                  v-for="position in selectedPositions"
                  :key="position.id"
                  :label="positionLabel(position)"
                  :value="position.id"
                />
              </el-select>
              <small class="field-hint">{{ t('users.dialog.positionsHint') }}</small>
            </el-form-item>
            <el-form-item
              :label="t('users.fields.primaryDepartment')"
              class="sm:col-span-2"
              required
            >
              <el-select
                v-model="form.primaryDepartmentId"
                class="w-full"
                :placeholder="t('users.dialog.primaryDepartmentPlaceholder')"
              >
                <el-option
                  v-for="department in selectedDepartments"
                  :key="department.id"
                  :label="department.name"
                  :value="department.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('users.fields.status')" class="sm:col-span-2">
              <el-switch
                v-model="form.enabled"
                :active-text="t('shared.state.enabled')"
                :inactive-text="t('shared.state.disabled')"
              />
            </el-form-item></div></el-tab-pane
        ><el-tab-pane name="scope" :label="t('users.editor.scope')">
          <!-- 用户基本资料和直接数据策略分属两个后端写入，但在一个弹窗中连续提交。 -->
          <DataPolicyEditor v-model="access.dataPolicies" /></el-tab-pane
      ></el-tabs>
      <el-alert v-if="formError" :title="formError" type="error" show-icon :closable="false" />
      <div class="dialog-actions">
        <el-button @click="dialogOpen = false">{{ t('shared.actions.cancel') }}</el-button>
        <el-button native-type="submit" type="primary" :loading="saving" :disabled="!accessReady">
          {{ t('users.dialog.save') }}
        </el-button>
      </div>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type {
  DepartmentOption,
  EntityId,
  PositionOption,
  SubjectAccessRequest,
  UserCreate,
  UserSummary,
  UserUpdate,
} from '@cyber-ai-forge/api-contract'
import DataPolicyEditor from '@/foundation/modules/authorization/components/DataPolicyEditor.vue'
import {
  getSubjectAccess,
  replaceSubjectAccess,
} from '@/foundation/modules/authorization/authorization.api'
import type { RoleOption } from '@/foundation/modules/roles/roles.api'
import type { PositionOption as PositionOptionType } from '@/foundation/modules/positions/positions.api'
import { createUser, updateUser } from '@/foundation/modules/users/users.api'
import { useLocalization } from '@/foundation/modules/localization/localization'

const props = defineProps<{
  user: UserSummary | null
  roleOptions: RoleOption[]
  departmentOptions: DepartmentOption[]
  positionOptions: PositionOptionType[]
}>()
const emit = defineEmits<{
  saved: []
}>()
const dialogOpen = defineModel<boolean>({ required: true })

const editorTab = ref('identity')
const saving = ref(false)
const accessReady = ref(true)
const formError = ref('')
const savedEntityId = ref<EntityId | null>(null)
const { t } = useLocalization()
const form = reactive({
  username: '',
  displayName: '',
  email: '',
  password: '',
  roleIds: [] as EntityId[],
  departmentIds: [] as EntityId[],
  positionIds: [] as EntityId[],
  primaryDepartmentId: null as EntityId | null,
  enabled: true,
})
const access = reactive<SubjectAccessRequest>({ permissionKeys: [], dataPolicies: [] })
// 主部门候选始终限制在已选所属部门内，避免构造契约不允许的组合。
const selectedDepartments = computed(() =>
  props.departmentOptions.filter((department) => form.departmentIds.includes(department.id)),
)
const selectedPositions = computed<PositionOption[]>(() =>
  props.positionOptions.filter((position) => form.departmentIds.includes(position.departmentId)),
)

function positionLabel(position: PositionOption): string {
  const department = props.departmentOptions.find((item) => item.id === position.departmentId)
  return department ? `${department.name} / ${position.name}` : position.name
}

function resetForm(): void {
  editorTab.value = 'identity'
  savedEntityId.value = null
  // 每次打开都从 props 重新构造数组，避免编辑过程直接修改列表中的用户对象。
  Object.assign(
    form,
    props.user
      ? {
          username: props.user.username,
          displayName: props.user.displayName,
          email: props.user.email,
          password: '',
          roleIds: [...props.user.roleIds],
          departmentIds: [...props.user.departmentIds],
          positionIds: [...props.user.positionIds],
          primaryDepartmentId: props.user.primaryDepartmentId,
          enabled: props.user.enabled,
        }
      : {
          username: '',
          displayName: '',
          email: '',
          password: '',
          roleIds: [],
          departmentIds: props.departmentOptions[0] ? [props.departmentOptions[0].id] : [],
          positionIds: [],
          primaryDepartmentId: props.departmentOptions[0]?.id ?? null,
          enabled: true,
        },
  )
  Object.assign(access, { permissionKeys: [], dataPolicies: [] })
  formError.value = ''
}

async function submit(): Promise<void> {
  saving.value = true
  formError.value = ''
  try {
    if (
      !form.displayName ||
      !form.email ||
      (!props.user && !savedEntityId.value && (!form.username || form.password.length < 8))
    ) {
      throw new Error(t('users.errors.invalidForm'))
    }
    if (
      form.primaryDepartmentId === null ||
      form.departmentIds.length === 0 ||
      !form.departmentIds.includes(form.primaryDepartmentId)
    ) {
      throw new Error(t('users.errors.invalidDepartment'))
    }
    const entityId = savedEntityId.value ?? props.user?.id
    const result = entityId
      ? await updateUser(entityId, {
          displayName: form.displayName,
          email: form.email,
          ...(form.password ? { password: form.password } : {}),
          roleIds: form.roleIds,
          positionIds: form.positionIds,
          departmentIds: form.departmentIds,
          primaryDepartmentId: form.primaryDepartmentId,
          enabled: form.enabled,
        } satisfies UserUpdate)
      : await createUser({
          username: form.username,
          displayName: form.displayName,
          email: form.email,
          password: form.password,
          roleIds: form.roleIds,
          positionIds: form.positionIds,
          departmentIds: form.departmentIds,
          primaryDepartmentId: form.primaryDepartmentId,
          enabled: form.enabled,
        } satisfies UserCreate)
    if (result.status !== 0) {
      throw new Error(t('users.errors.saveFailed'))
    }
    const userId = savedEntityId.value ?? props.user?.id ?? result.data?.id
    if (!userId) {
      throw new Error(t('users.errors.missingId'))
    }
    // 只有用户主记录保存成功后才有主体 ID，可继续整体替换其直接数据策略。
    savedEntityId.value = userId
    form.password = ''
    const accessResult = await replaceSubjectAccess('user', userId, {
      permissionKeys: [],
      dataPolicies: access.dataPolicies.map((policy) => ({
        ...policy,
        departmentIds: [...policy.departmentIds],
      })),
    })
    if (accessResult.status !== 0) {
      throw new Error(t('users.errors.accessSaveFailed'))
    }
    dialogOpen.value = false
    ElMessage.success(t('users.messages.saved'))
    emit('saved')
  } catch (error) {
    formError.value = error instanceof Error ? error.message : t('users.errors.saveFailed')
  } finally {
    saving.value = false
  }
}

watch(dialogOpen, async function initializeForm(open) {
  if (open) {
    resetForm()
    if (props.user) {
      // 编辑模式必须等直接策略读取完成后才允许保存，防止空数组覆盖已有策略。
      accessReady.value = false
      try {
        const loaded = await getSubjectAccess('user', props.user.id)
        access.dataPolicies = loaded.dataPolicies.map((policy) => ({
          ...policy,
          departmentIds: [...policy.departmentIds],
        }))
      } catch (error) {
        formError.value =
          error instanceof Error ? error.message : t('users.errors.accessLoadFailed')
      } finally {
        accessReady.value = !formError.value
      }
    } else {
      accessReady.value = true
    }
  }
})

watch(
  () => form.departmentIds,
  function keepPrimaryDepartmentValid(departmentIds) {
    // 删除当前主部门时自动选择剩余第一项；无所属部门则回到占位 0 等待校验。
    if (form.primaryDepartmentId === null || !departmentIds.includes(form.primaryDepartmentId)) {
      form.primaryDepartmentId = departmentIds[0] ?? null
    }
  },
  { deep: true },
)

watch(
  [() => form.departmentIds, () => props.positionOptions],
  function keepPositionsInsideDepartments() {
    const validPositionIds = new Set(selectedPositions.value.map((position) => position.id))
    form.positionIds = form.positionIds.filter((positionId) => validPositionIds.has(positionId))
  },
  { deep: true },
)
</script>

<style scoped lang="scss">
.field-hint {
  display: block;
  margin-top: 5px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  line-height: 1.5;
}
</style>

<template>
  <el-drawer
    v-model="dialogOpen"
    :title="role ? t('roles.dialog.editTitle') : t('roles.dialog.createTitle')"
    size="min(696px, 100vw)"
    :close-on-click-modal="false"
    :close-on-press-escape="!saving"
    :show-close="!saving"
  >
    <el-form :disabled="saving" label-position="top" @submit.prevent="submit">
      <el-tabs v-model="editorTab"
        ><el-tab-pane name="identity" :label="t('roles.editor.identity')"
          ><div class="form-columns">
            <el-form-item :label="t('roles.fields.name')" class="sm:col-span-2" required>
              <el-input v-model.trim="form.name" :placeholder="t('roles.dialog.namePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('roles.fields.description')" class="sm:col-span-2">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="3"
                :placeholder="t('roles.dialog.descriptionPlaceholder')"
              />
            </el-form-item>
            <el-form-item :label="t('roles.fields.status')" class="sm:col-span-2">
              <el-switch
                v-model="form.enabled"
                :active-text="t('shared.state.enabled')"
                :inactive-text="t('shared.state.disabled')"
              />
            </el-form-item></div></el-tab-pane
        ><el-tab-pane name="permissions" :label="t('roles.editor.permissions')">
          <el-form-item :label="t('roles.fields.permissions')" class="sm:col-span-2">
            <el-checkbox-group v-model="access.permissionKeys" class="permission-grid">
              <el-checkbox
                v-for="permission in permissions"
                :key="permission.key"
                :value="permission.key"
                border
              >
                <span>{{ permissionLabel(permission) }}</span>
                <small>{{ permission.key }}</small>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item> </el-tab-pane
        ><el-tab-pane name="scope" :label="t('roles.editor.scope')">
          <!-- 角色基本资料、功能权限和数据策略在一次用户操作中分两步写入后端。 -->
          <DataPolicyEditor v-model="access.dataPolicies" /></el-tab-pane
      ></el-tabs>
      <el-alert v-if="formError" :title="formError" type="error" show-icon :closable="false" />
      <div class="dialog-actions">
        <el-button @click="dialogOpen = false">{{ t('shared.actions.cancel') }}</el-button>
        <el-button native-type="submit" type="primary" :loading="saving" :disabled="!accessReady">
          {{ t('roles.dialog.save') }}
        </el-button>
      </div>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type {
  EntityId,
  PermissionSummary,
  RoleRequest,
  RoleSummary,
  SubjectAccessRequest,
} from '@cyber-ai-forge/api-contract'
import DataPolicyEditor from '@/foundation/modules/authorization/components/DataPolicyEditor.vue'
import {
  getSubjectAccess,
  listAuthorizationPermissions,
  replaceSubjectAccess,
} from '@/foundation/modules/authorization/authorization.api'
import { createRole, updateRole } from '@/foundation/modules/roles/roles.api'
import { useLocalization } from '@/foundation/modules/localization/localization'

const props = defineProps<{
  role: RoleSummary | null
}>()
const emit = defineEmits<{
  saved: []
}>()
const dialogOpen = defineModel<boolean>({ required: true })

const permissions = ref<PermissionSummary[]>([])
const editorTab = ref('identity')
const saving = ref(false)
const accessReady = ref(true)
const formError = ref('')
const savedEntityId = ref<EntityId | null>(null)
const { resolveLocalizedLabel, t } = useLocalization()
const form = reactive<RoleRequest>({
  name: '',
  description: '',
  enabled: true,
})
const access = reactive<SubjectAccessRequest>({ permissionKeys: [], dataPolicies: [] })

function permissionLabel(permission: PermissionSummary): string {
  return resolveLocalizedLabel({
    key: `authorization.permissions.${permission.key}`,
    fallback: permission.name,
  })
}

function resetForm(): void {
  editorTab.value = 'identity'
  savedEntityId.value = null
  // 复制权限数组和策略对象，避免弹窗编辑过程污染列表或上次打开的状态。
  Object.assign(
    form,
    props.role
      ? {
          name: props.role.name,
          description: props.role.description,
          enabled: props.role.enabled,
        }
      : { name: '', description: '', enabled: true },
  )
  Object.assign(access, { permissionKeys: [], dataPolicies: [] })
  formError.value = ''
}

async function submit(): Promise<void> {
  saving.value = true
  formError.value = ''
  try {
    if (!form.name) {
      throw new Error(t('roles.errors.invalidForm'))
    }
    const payload: RoleRequest = { ...form }
    const entityId = savedEntityId.value ?? props.role?.id
    const result = entityId ? await updateRole(entityId, payload) : await createRole(payload)
    if (result.status !== 0) {
      throw new Error(t('roles.errors.saveFailed'))
    }
    const roleId = savedEntityId.value ?? props.role?.id ?? result.data?.id
    if (!roleId) {
      throw new Error(t('roles.errors.missingId'))
    }
    // 新建角色取得主体 ID 后，才能整体替换该角色的功能权限和数据策略。
    savedEntityId.value = roleId
    const accessResult = await replaceSubjectAccess('role', roleId, {
      permissionKeys: [...access.permissionKeys],
      dataPolicies: access.dataPolicies.map((policy) => ({
        ...policy,
        departmentIds: [...policy.departmentIds],
      })),
    })
    if (accessResult.status !== 0) {
      throw new Error(t('roles.errors.accessSaveFailed'))
    }
    dialogOpen.value = false
    ElMessage.success(t('roles.messages.saved'))
    emit('saved')
  } catch (error) {
    formError.value = error instanceof Error ? error.message : t('roles.errors.saveFailed')
  } finally {
    saving.value = false
  }
}

watch(dialogOpen, async function initializeForm(open) {
  if (open) {
    resetForm()
    if (props.role) {
      // 加载完成前禁止保存，防止空权限覆盖服务端已有配置。
      accessReady.value = false
      try {
        const loaded = await getSubjectAccess('role', props.role.id)
        access.permissionKeys = [...loaded.permissionKeys]
        access.dataPolicies = loaded.dataPolicies.map((policy) => ({
          ...policy,
          departmentIds: [...policy.departmentIds],
        }))
      } catch (error) {
        formError.value =
          error instanceof Error ? error.message : t('roles.errors.accessLoadFailed')
      } finally {
        accessReady.value = !formError.value
      }
    } else {
      accessReady.value = true
    }
  }
})

onMounted(async function loadPermissionOptions() {
  try {
    // 权限目录是只读元数据；加载失败时保留空列表，错误会在保存或后续重试中体现。
    permissions.value = await listAuthorizationPermissions()
  } catch {
    permissions.value = []
  }
})
</script>

<style lang="scss" scoped>
.permission-grid {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr;
  gap: 0;
  border-top: 1px solid var(--line);
}
.permission-grid .el-checkbox {
  width: 100%;
  height: auto;
  min-height: 64px;
  margin: 0;
  padding: 14px 16px;
  border: 0;
  border-bottom: 1px solid var(--line);
  border-radius: 0;
}
.permission-grid span,
.permission-grid small {
  display: block;
}
.permission-grid small {
  margin-top: 4px;
  color: var(--muted);
  font: 11px var(--font-mono);
}
</style>

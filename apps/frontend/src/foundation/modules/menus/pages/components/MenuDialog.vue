<template>
  <el-drawer
    v-model="dialogOpen"
    :title="menu ? t('menus.dialog.editTitle') : t('menus.dialog.createTitle')"
    size="min(696px, 100vw)"
    :close-on-click-modal="false"
    :close-on-press-escape="!saving"
    :show-close="!saving"
  >
    <el-form :disabled="saving" label-position="top" @submit.prevent="submit">
      <div class="form-columns">
        <el-form-item :label="t('menus.fields.name')" required>
          <el-input v-model.trim="form.name" :placeholder="t('menus.dialog.namePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('menus.fields.parent')">
          <el-select v-model="form.parentId" class="w-full">
            <el-option :label="t('menus.dialog.root')" :value="null" />
            <el-option
              v-for="directory in directoryOptions"
              :key="directory.id"
              :label="directory.name"
              :value="directory.id"
              :disabled="directory.id === menu?.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('menus.fields.type')" required>
          <el-segmented v-model="form.type" :options="typeOptions" class="w-full" />
        </el-form-item>
        <el-form-item :label="t('menus.fields.icon')" required>
          <el-select
            v-model="form.icon"
            class="w-full"
            clearable
            filterable
            :placeholder="t('menus.dialog.iconPlaceholder')"
          >
            <el-option
              v-for="option in iconOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            >
              <span class="icon-option">
                <AppIcon :name="option.value" />
                <span>{{ option.label }}</span>
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 节点类型决定互斥字段：站内节点使用路由/布局，外链只使用 URL。 -->
        <el-form-item v-if="form.type !== 'button'" :label="t('menus.fields.layout')">
          <el-select
            v-model="form.layout"
            class="w-full"
            :placeholder="t('menus.dialog.layoutPlaceholder')"
          >
            <el-option :label="t('menus.dialog.defaultLayout')" value="" />
            <el-option
              v-for="(data, key) in layoutRegistry"
              :key="key"
              :label="data.label"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('menus.fields.order')">
          <el-input-number v-model="form.sortOrder" :min="0" :max="9999" class="!w-full" />
        </el-form-item>
        <el-form-item :label="t('menus.fields.permission')">
          <el-select
            v-model="form.requiredPermissionKey"
            class="w-full"
            clearable
            :placeholder="t('menus.dialog.permissionPlaceholder')"
          >
            <el-option
              v-for="permission in permissions"
              :key="permission.key"
              :label="`${permissionLabel(permission)} · ${permission.key}`"
              :value="permission.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type !== 'button'" :label="t('menus.fields.route')" required>
          <el-input v-model.trim="form.path" :placeholder="routePlaceholder" />
          <small class="route-hint">{{ routeHint }}</small>
        </el-form-item>
        <el-form-item v-if="form.type === 'menu'" :label="t('menus.fields.component')" required>
          <el-select
            v-model="form.component"
            class="w-full"
            :placeholder="t('menus.dialog.componentPlaceholder')"
          >
            <el-option
              v-for="(data, key) of viewRegistry"
              :key="key"
              :label="resolveLocalizedLabel(data.label)"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.type === 'button'"
          :label="t('menus.fields.externalUrl')"
          required
          class="sm:col-span-2"
        >
          <el-input
            v-model.trim="form.externalUrl"
            :placeholder="t('menus.dialog.externalUrlPlaceholder')"
          />
        </el-form-item>
        <el-form-item :label="t('menus.fields.status')" class="sm:col-span-2">
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
          t('menus.dialog.save')
        }}</el-button>
      </div>
    </el-form>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type {
  EntityId,
  MenuRequest,
  MenuSummary,
  PermissionSummary,
} from '@cyber-ai-forge/api-contract'
import { listAuthorizationPermissions } from '@/foundation/modules/authorization/authorization.api'
import AppIcon from '@/foundation/components/AppIcon.vue'
import { menuPathError } from '@/foundation/modules/menus/menu-form'
import { createMenu, updateMenu } from '@/foundation/modules/menus/menus.api'
import { useNavigationStore } from '@/foundation/modules/navigation/navigation.store'
import { viewRegistry } from '@/foundation/shared/routing/view-registry'
import { iconOptions } from '@/foundation/shared/icons/icon-registry'
import { layoutRegistry } from '@/foundation/shared/routing/layout-registry'
import { useLocalization } from '@/foundation/modules/localization/localization'

type MenuType = MenuSummary['type']
interface MenuForm {
  parentId: EntityId | null
  name: string
  path: string
  component: string
  layout: string
  externalUrl: string
  icon: string
  sortOrder: number
  type: MenuType
  enabled: boolean
  requiredPermissionKey: string | null
}

const props = defineProps<{
  menu: MenuSummary | null
  parentId: EntityId | null
  records: MenuSummary[]
}>()
const emit = defineEmits<{
  saved: []
}>()
const dialogOpen = defineModel<boolean>({ required: true })

const saving = ref(false)
const formError = ref('')
const navigation = useNavigationStore()
const permissions = ref<PermissionSummary[]>([])
const { resolveLocalizedLabel, t } = useLocalization()
const form = reactive<MenuForm>({
  parentId: null,
  name: '',
  path: '',
  component: '',
  layout: '',
  externalUrl: '',
  icon: '',
  sortOrder: 0,
  type: 'menu',
  enabled: true,
  requiredPermissionKey: null,
})
const typeOptions = computed(() => [
  { label: t('menus.types.directory'), value: 'directory' },
  { label: t('menus.types.menu'), value: 'menu' },
  { label: t('menus.types.button'), value: 'button' },
])
// 只有目录能成为父节点；当前节点先在前端禁用，后端再负责完整的环检测。
const directoryOptions = computed(() =>
  props.records.filter((record) => record.type === 'directory'),
)
const routePlaceholder = computed(() =>
  form.parentId === null
    ? t('menus.dialog.rootRoutePlaceholder')
    : t('menus.dialog.childRoutePlaceholder'),
)
const routeHint = computed(() =>
  form.parentId === null ? t('menus.dialog.rootRouteHint') : t('menus.dialog.childRouteHint'),
)

function permissionLabel(permission: PermissionSummary): string {
  return resolveLocalizedLabel({
    key: `authorization.permissions.${permission.key}`,
    fallback: permission.name,
  })
}

function resetForm(): void {
  // 每次打开从传入菜单重建表单，避免类型切换留下上一次编辑的字段。
  if (props.menu) {
    Object.assign(form, {
      parentId: props.menu.parentId,
      name: props.menu.name,
      path: props.menu.path,
      component: props.menu.component,
      layout: props.menu.layout,
      externalUrl: props.menu.externalUrl,
      icon: props.menu.icon,
      sortOrder: props.menu.sortOrder,
      type: props.menu.type,
      enabled: props.menu.enabled,
      requiredPermissionKey: props.menu.requiredPermissionKey ?? null,
    })
  } else {
    Object.assign(form, {
      parentId: props.parentId,
      name: '',
      path: '',
      component: '',
      layout: '',
      externalUrl: '',
      icon: '',
      sortOrder: 0,
      type: 'menu',
      enabled: true,
      requiredPermissionKey: null,
    })
  }
  formError.value = ''
}

function payload(): MenuRequest {
  // 按 discriminated union 只发送当前类型允许的字段，并显式清空互斥字段。
  const common = {
    parentId: form.parentId,
    name: form.name,
    icon: form.icon,
    sortOrder: form.sortOrder,
    enabled: form.enabled,
    requiredPermissionKey: form.requiredPermissionKey,
  }
  if (form.type === 'directory') {
    return {
      ...common,
      type: 'directory',
      path: form.path,
      component: '',
      layout: form.layout,
      externalUrl: '',
    }
  }
  if (form.type === 'button') {
    return {
      ...common,
      type: 'button',
      path: '',
      component: '',
      layout: '',
      externalUrl: form.externalUrl,
    }
  }
  return {
    ...common,
    type: 'menu',
    path: form.path,
    component: form.component,
    layout: form.layout,
    externalUrl: '',
  }
}

async function submit(): Promise<void> {
  saving.value = true
  formError.value = ''
  try {
    if (!form.name) {
      throw new Error(t('menus.errors.nameRequired'))
    }
    if (!form.icon) {
      throw new Error(t('menus.errors.iconRequired'))
    }
    const pathError = menuPathError(form.type, form.parentId, form.path)
    if (pathError) {
      throw new Error(pathError)
    }
    if (form.type === 'menu' && !form.component) {
      throw new Error(t('menus.errors.componentRequired'))
    }
    if (form.type === 'button' && !/^https?:\/\//i.test(form.externalUrl)) {
      throw new Error(t('menus.errors.externalUrlInvalid'))
    }
    const result = props.menu
      ? await updateMenu(props.menu.id, payload())
      : await createMenu(payload())
    if (result.status !== 0) {
      throw new Error(t('menus.errors.saveFailed'))
    }
    dialogOpen.value = false
    ElMessage.success(t('menus.messages.saved'))
    emit('saved')
    // 刷新导航 Store，使新路径、权限键或启用状态立即反映到侧栏和动态路由。
    await navigation.load(true)
  } catch (error) {
    formError.value = error instanceof Error ? error.message : t('menus.errors.saveFailed')
  } finally {
    saving.value = false
  }
}

watch(dialogOpen, function initializeForm(open) {
  if (open) {
    resetForm()
  }
})

watch(
  () => form.type,
  function clearUnusedFields(type) {
    // 类型切换时同步清理不可见字段，避免旧值被 payload() 意外带回。
    if (type === 'button') {
      form.path = ''
      form.component = ''
    }
    if (type === 'directory') {
      form.component = ''
    }
    if (type !== 'button') {
      form.externalUrl = ''
    }
    if (type === 'button') {
      form.layout = ''
    }
  },
)

onMounted(async function loadPermissionOptions() {
  try {
    // 菜单权限选择只允许引用后端当前登记且启用的权限键。
    permissions.value = await listAuthorizationPermissions()
  } catch {
    permissions.value = []
  }
})
</script>

<style lang="scss" scoped>
.icon-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-option .icon {
  width: 17px;
  height: 17px;
  color: var(--primary-deep);
}

.route-hint {
  display: block;
  margin-top: 7px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.5;
}
</style>

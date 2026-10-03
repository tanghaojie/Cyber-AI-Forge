<template>
  <section class="policy-editor">
    <!-- 每一行描述一个资源、动作和允许范围；同主体命中的规则由后端按并集合并。 -->
    <header>
      <div>
        <strong>{{ t('authorization.editor.title') }}</strong>
        <span>{{ t('authorization.editor.description') }}</span>
      </div>
      <el-button
        size="small"
        :aria-label="t('shared.actions.add')"
        :icon="Plus"
        @click="addPolicy"
        >{{ t('authorization.editor.addRule') }}</el-button
      >
    </header>
    <el-alert v-if="loadError" :title="loadError" type="error" show-icon :closable="false" />

    <el-empty
      v-if="!model.length"
      :description="t('authorization.editor.empty')"
      :image-size="52"
    />
    <div v-for="(policy, index) in model" :key="index" class="policy-row">
      <el-select
        v-model="policy.resourceKey"
        :placeholder="t('authorization.editor.resource')"
        @change="normalizePolicy(policy)"
      >
        <el-option
          v-for="resource in resources"
          :key="resource.key"
          :label="resourceLabel(resource)"
          :value="resource.key"
        />
      </el-select>
      <el-select
        v-model="policy.action"
        :placeholder="t('authorization.editor.action')"
        @change="normalizePolicy(policy)"
      >
        <el-option
          v-for="action in actionsFor(policy.resourceKey)"
          :key="action"
          :label="actionLabel(action)"
          :value="action"
        />
      </el-select>
      <el-select
        v-model="policy.scopeType"
        :placeholder="t('authorization.editor.scope')"
        @change="normalizePolicy(policy)"
      >
        <el-option
          v-for="scope in scopesFor(policy.resourceKey, policy.action)"
          :key="scope"
          :label="scopeLabel(scope)"
          :value="scope"
        />
      </el-select>
      <el-button
        text
        type="danger"
        :aria-label="t('shared.actions.delete')"
        :icon="Delete"
        @click="removePolicy(index)"
      />

      <el-select
        v-if="policy.scopeType === 'custom_departments'"
        v-model="policy.departmentIds"
        class="department-picker"
        multiple
        filterable
        :placeholder="t('authorization.editor.department')"
      >
        <el-option
          v-for="department in departments"
          :key="department.id"
          :label="department.name"
          :value="department.id"
        />
      </el-select>
      <el-checkbox
        v-if="policy.scopeType === 'custom_departments'"
        v-model="policy.includeDescendants"
      >
        {{ t('authorization.editor.includeDescendants') }}
      </el-checkbox>
      <el-checkbox v-if="allowInheritance" v-model="policy.inheritToChildren">
        {{ t('authorization.editor.inheritToChildren') }}
      </el-checkbox>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import type {
  DataPolicyInput,
  DataResourceDefinition,
  DataScopeType,
  DepartmentOption,
} from '@cyber-ai-forge/api-contract'
import { listDataResources } from '@/foundation/modules/authorization/authorization.api'
import { listDepartmentOptions } from '@/foundation/modules/departments/departments.api'
import { useLocalization } from '@/foundation/modules/localization/localization'

defineProps<{ allowInheritance?: boolean }>()
const model = defineModel<DataPolicyInput[]>({ required: true })
const resources = ref<DataResourceDefinition[]>([])
const departments = ref<DepartmentOption[]>([])
const loadError = ref('')
const { resolveLocalizedLabel, t } = useLocalization()

function actionLabel(action: string): string {
  return t(`authorization.actions.${action}`)
}

function scopeLabel(scope: DataScopeType): string {
  return t(`authorization.scopes.${scope}`)
}

function resourceLabel(resource: DataResourceDefinition): string {
  return resolveLocalizedLabel({
    key: `authorization.resources.${resource.key}`,
    fallback: resource.name,
  })
}

function actionsFor(resourceKey: string): string[] {
  return resources.value.find((resource) => resource.key === resourceKey)?.actions ?? []
}

function scopesFor(resourceKey: string, action: string): DataScopeType[] {
  const scopes = resources.value.find((resource) => resource.key === resourceKey)?.scopeTypes ?? []
  // self 表示已有记录的所有者，创建新记录时没有可用于判定的目标所有者。
  return action === 'create' ? scopes.filter((scope) => scope !== 'self') : scopes
}

function normalizePolicy(policy: DataPolicyInput): void {
  // 上游选择变化后立即修正下游动作、范围和部门字段，保持模型接近合法状态。
  const actions = actionsFor(policy.resourceKey)
  const scopes = scopesFor(policy.resourceKey, policy.action)
  if (!actions.includes(policy.action)) {
    policy.action = actions[0] ?? 'read'
  }
  if (!scopes.includes(policy.scopeType)) {
    policy.scopeType = scopes[0] ?? 'self'
  }
  if (policy.scopeType !== 'custom_departments') {
    policy.departmentIds = []
    policy.includeDescendants = false
  }
}

function addPolicy(): void {
  const resource = resources.value[0]
  model.value.push({
    resourceKey: resource?.key ?? 'users',
    action: resource?.actions[0] ?? 'read',
    scopeType: resource?.scopeTypes[0] ?? 'self',
    inheritToChildren: false,
    departmentIds: [],
    includeDescendants: false,
  })
}

function removePolicy(index: number): void {
  model.value.splice(index, 1)
}

onMounted(async function loadOptions() {
  try {
    // 资源目录和部门选项互不依赖，但编辑器必须同时具备二者才能完整配置策略。
    const [resourceOptions, departmentOptions] = await Promise.all([
      listDataResources(),
      listDepartmentOptions(),
    ])
    resources.value = resourceOptions
    departments.value = departmentOptions
  } catch (error) {
    loadError.value =
      error instanceof Error ? error.message : t('authorization.errors.policyOptionsLoadFailed')
  }
})
</script>

<style lang="scss" scoped>
.policy-editor {
  display: grid;
  gap: 20px;
  padding: 20px 0;
}
.policy-editor header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 16px;
}
.policy-editor header div {
  display: grid;
  gap: 8px;
}
.policy-editor header strong {
  font-size: 15px;
  font-weight: 500;
}
.policy-editor header span {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.7;
}
.policy-row {
  display: grid;
  grid-template-columns: minmax(100px, 1fr) 100px minmax(130px, 1fr) auto;
  gap: 12px;
  padding: 20px 16px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: var(--surface-muted);
}
.department-picker {
  grid-column: 1 / 4;
}
@media (max-width: 680px) {
  .policy-row {
    grid-template-columns: 1fr;
  }
  .department-picker {
    grid-column: auto;
  }
  .policy-editor header {
    flex-wrap: wrap;
  }
}
</style>

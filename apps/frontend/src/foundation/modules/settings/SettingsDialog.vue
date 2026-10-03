<template>
  <el-drawer
    v-model="visible"
    class="system-settings-dialog"
    size="min(696px, 100vw)"
    append-to-body
    :close-on-click-modal="false"
  >
    <template #header>
      <div class="settings-dialog__header">
        <div class="settings-dialog__header-icon"><Setting /></div>
        <div>
          <p>{{ t('settings.dialog.eyebrow') }}</p>
          <h2>{{ t('settings.dialog.title') }}</h2>
          <span>{{ t('settings.dialog.description') }}</span>
        </div>
      </div>
    </template>

    <div class="settings-dialog__content">
      <section
        class="settings-section settings-section--foundation"
        aria-labelledby="layout-heading"
      >
        <div class="settings-section__heading">
          <div>
            <span>{{ t('settings.section.foundationCode') }}</span>
            <h3 id="layout-heading">{{ t('settings.section.foundationTitle') }}</h3>
          </div>
          <small>{{ t('settings.section.foundationDescription') }}</small>
        </div>

        <div class="settings-layout-grid">
          <div class="settings-field">
            <span class="settings-field__label">{{
              t('settings.fields.navigationMenuStyle')
            }}</span>
            <div
              class="settings-style-options"
              role="radiogroup"
              :aria-label="t('settings.fields.navigationMenuStyle')"
            >
              <button
                v-for="option in navigationStyles"
                :key="option.value"
                class="settings-style-option"
                :class="{
                  'settings-style-option--active':
                    settingsStore.settings.navigationMenuStyle === option.value,
                }"
                type="button"
                role="radio"
                :aria-checked="settingsStore.settings.navigationMenuStyle === option.value"
                @click="updateSettings({ navigationMenuStyle: option.value })"
              >
                <span class="settings-style-option__preview" :class="`is-${option.value}`">
                  <i /><i /><i />
                </span>
                <b>{{ option.label }}</b>
                <small>{{ option.description }}</small>
              </button>
            </div>
          </div>

          <div class="settings-field">
            <span class="settings-field__label">{{ t('settings.fields.themeColor') }}</span>
            <div
              class="settings-theme-options"
              role="radiogroup"
              :aria-label="t('settings.fields.themeColor')"
            >
              <button
                v-for="option in themeColors"
                :key="option.value"
                class="settings-theme-option"
                :class="{
                  'settings-theme-option--active':
                    settingsStore.settings.themeColor === option.value,
                }"
                type="button"
                role="radio"
                :aria-checked="settingsStore.settings.themeColor === option.value"
                @click="updateSettings({ themeColor: option.value })"
              >
                <span
                  class="settings-theme-option__swatch"
                  :style="{
                    '--theme-swatch': option.color,
                    '--theme-swatch-dark': option.darkColor,
                  }"
                />
                <span>{{ option.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="settings-section" aria-labelledby="experience-heading">
        <div class="settings-section__heading">
          <div>
            <span>{{ t('settings.section.experienceCode') }}</span>
            <h3 id="experience-heading">{{ t('settings.section.experienceTitle') }}</h3>
          </div>
        </div>

        <div class="settings-switch-list">
          <label v-for="option in switchOptions" :key="option.key" class="settings-switch-row">
            <span class="settings-switch-row__icon"><component :is="option.icon" /></span>
            <span class="settings-switch-row__copy">
              <b>{{ option.label }}</b>
              <small>{{ option.description }}</small>
            </span>
            <el-switch
              :model-value="settingsStore.settings[option.key]"
              @update:model-value="updateSwitchSetting(option.key, $event)"
            />
          </label>
        </div>
      </section>

      <p class="settings-dialog__notice"><span />{{ t('settings.notice') }}</p>
    </div>

    <template #footer>
      <div class="settings-dialog__footer">
        <button class="settings-dialog__reset" type="button" @click="restoreDefaults">
          <RefreshLeft />{{ t('shared.actions.reset') }}
        </button>
        <el-button text @click="handleCancel">{{ t('shared.actions.cancel') }}</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  CollectionTag,
  Connection,
  Moon,
  OfficeBuilding,
  RefreshLeft,
  Setting,
} from '@element-plus/icons-vue'
import { useLocalization } from '@/foundation/modules/localization/localization'
import {
  useSettingsStore,
  type NavigationMenuStyle,
  type SystemSettings,
  type ThemeColor,
} from './settings.store'
import { THEME_COLOR_OPTIONS } from './settings.theme'

interface NavigationStyleOption {
  value: NavigationMenuStyle
  label: string
  description: string
}

interface ThemeColorOption {
  value: ThemeColor
  label: string
  color: string
  darkColor: string
}

type SwitchSettingKey = 'darkMode' | 'tagsView' | 'sidebarLogo' | 'dynamicTitle'

interface SwitchOption {
  key: SwitchSettingKey
  label: string
  description: string
  icon: typeof Moon
}

const visible = defineModel<boolean>({ default: false })
const settingsStore = useSettingsStore()
const { t } = useLocalization()
const navigationStyles = computed<readonly NavigationStyleOption[]>(() => [
  {
    value: 'sidebar',
    label: t('settings.navigation.sidebar.label'),
    description: t('settings.navigation.sidebar.description'),
  },
  {
    value: 'top',
    label: t('settings.navigation.top.label'),
    description: t('settings.navigation.top.description'),
  },
])
const themeColors = computed<readonly ThemeColorOption[]>(() => [
  ...THEME_COLOR_OPTIONS.map(function createThemeOption(option) {
    return {
      ...option,
      label: t(`settings.theme.${option.value}`),
    }
  }),
])
const switchOptions = computed<readonly SwitchOption[]>(() => [
  {
    key: 'darkMode',
    label: t('settings.preferences.darkMode.label'),
    description: t('settings.preferences.darkMode.description'),
    icon: Moon,
  },
  {
    key: 'tagsView',
    label: t('settings.preferences.tagsView.label'),
    description: t('settings.preferences.tagsView.description'),
    icon: CollectionTag,
  },
  {
    key: 'sidebarLogo',
    label: t('settings.preferences.sidebarLogo.label'),
    description: t('settings.preferences.sidebarLogo.description'),
    icon: OfficeBuilding,
  },
  {
    key: 'dynamicTitle',
    label: t('settings.preferences.dynamicTitle.label'),
    description: t('settings.preferences.dynamicTitle.description'),
    icon: Connection,
  },
])

function handleCancel(): void {
  visible.value = false
}

function updateSettings(value: Partial<SystemSettings>): void {
  settingsStore.save({ ...settingsStore.settings, ...value })
}

function updateSwitchSetting(key: SwitchSettingKey, value: boolean | string | number): void {
  if (typeof value !== 'boolean') {
    return
  }

  updateSettings({ [key]: value })
}

function restoreDefaults(): void {
  settingsStore.reset()
}
</script>

<style lang="scss" scoped>
.settings-dialog__header {
  display: flex;
  align-items: center;
  gap: 16px;
}
.settings-dialog__header-icon {
  display: none;
}
.settings-dialog__header p {
  margin: 0;
  color: var(--primary);
  font: 10px var(--font-mono);
  letter-spacing: 0.12em;
}
.settings-dialog__header h2 {
  font-size: 26px;
  font-weight: 500;
  margin: 8px 0;
}
.settings-dialog__header span {
  font-size: 12px;
  color: var(--muted);
}
.settings-dialog__content {
  display: grid;
  gap: 28px;
}
.settings-section {
  padding: 0;
}
.settings-section__heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}
.settings-section__heading span {
  font: 10px var(--font-mono);
  color: var(--primary);
  letter-spacing: 0.1em;
}
.settings-section__heading h3 {
  margin: 8px 0 0;
  font-size: 17px;
  font-weight: 500;
}
.settings-section__heading small {
  max-width: 45%;
  font-size: 11px;
  color: var(--muted);
}
.settings-layout-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
  margin-top: 24px;
}
.settings-field__label {
  display: block;
  font-size: 12px;
  margin-bottom: 12px;
  color: var(--ink-soft);
}
.settings-style-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.settings-style-option {
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: var(--surface);
  color: var(--ink-soft);
  text-align: left;
}
.settings-style-option--active {
  border-color: var(--primary);
  background: var(--primary-mist);
}
.settings-style-option b {
  display: block;
  margin: 12px 0 4px;
  font-size: 12px;
  font-weight: 500;
}
.settings-style-option small {
  font-size: 11px;
  color: var(--muted);
}
.settings-style-option__preview {
  display: grid;
  height: 64px;
  gap: 4px;
  padding: 6px;
  border: 1px solid var(--line);
  border-radius: 3px;
  background: var(--surface);
}
.settings-style-option__preview i {
  display: block;
  background: var(--surface-muted);
  border-radius: 2px;
}
.settings-style-option__preview.is-sidebar {
  grid-template-columns: 25% 1fr;
  grid-template-rows: 1fr 1fr;
}
.settings-style-option__preview.is-sidebar i:first-child {
  grid-row: 1/3;
  background: var(--primary);
}
.settings-style-option__preview.is-top {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 25% 1fr;
}
.settings-style-option__preview.is-top i:first-child {
  grid-column: 1/3;
  background: var(--primary);
}
.settings-theme-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.settings-theme-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: var(--surface);
  color: var(--ink-soft);
  font-size: 12px;
}
.settings-theme-option--active {
  border-color: var(--primary);
  background: var(--primary-mist);
  color: var(--primary);
}
.settings-theme-option__swatch {
  position: relative;
  display: block;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 3px;
  overflow: hidden;
  background: var(--theme-swatch);
}
.settings-theme-option__swatch::after {
  content: '';
  position: absolute;
  inset: 0 0 0 50%;
  background: var(--theme-swatch-dark);
}
.settings-switch-list {
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 12px;
}
.settings-switch-row {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
}
.settings-switch-row__icon {
  display: grid;
  place-items: center;
  color: var(--muted);
}
.settings-switch-row__icon svg {
  width: 18px;
  height: 18px;
}
.settings-switch-row__copy b {
  display: block;
  font-size: 13px;
  font-weight: 500;
}
.settings-switch-row__copy small {
  display: block;
  margin-top: 4px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.6;
}
.settings-dialog__notice {
  margin: 0;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.8;
}
.settings-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.settings-dialog__reset {
  display: flex;
  gap: 8px;
  align-items: center;
  background: transparent;
  border: 0;
  color: var(--muted);
  font-size: 12px;
}
.settings-dialog__reset svg {
  width: 16px;
  height: 16px;
}
@media (max-width: 600px) {
  .settings-section__heading {
    align-items: start;
    flex-direction: column;
    gap: 8px;
  }
  .settings-section__heading small {
    max-width: 100%;
  }
  .settings-theme-options {
    grid-template-columns: 1fr 1fr;
  }
}
</style>

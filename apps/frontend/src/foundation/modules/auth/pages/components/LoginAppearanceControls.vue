<template>
  <el-popover
    v-model:visible="visible"
    :width="320"
    placement="bottom-end"
    trigger="click"
    popper-class="login-appearance-popover"
  >
    <template #reference>
      <button
        class="login-appearance-trigger"
        type="button"
        :aria-label="t('settings.appearance.open')"
        :aria-expanded="visible"
        aria-haspopup="dialog"
      >
        <span
          class="login-appearance-trigger__swatch"
          :style="{
            '--appearance-swatch': selectedTheme.color,
            '--appearance-swatch-dark': selectedTheme.darkColor,
          }"
          aria-hidden="true"
        />
        <span class="login-appearance-trigger__label">{{ t('settings.appearance.open') }}</span>
        <component
          :is="settingsStore.settings.darkMode ? Moon : Sunny"
          class="login-appearance-trigger__icon"
          aria-hidden="true"
        />
      </button>
    </template>

    <div class="login-appearance-panel" role="dialog" :aria-label="t('settings.appearance.title')">
      <div class="login-appearance-panel__heading">
        <span>{{ t('settings.appearance.eyebrow') }}</span>
        <h2>{{ t('settings.appearance.title') }}</h2>
        <p>{{ t('settings.appearance.description') }}</p>
      </div>

      <div class="login-appearance-panel__mode">
        <span class="login-appearance-panel__mode-icon" aria-hidden="true">
          <Moon />
        </span>
        <span class="login-appearance-panel__mode-copy">
          <b>{{ t('settings.preferences.darkMode.label') }}</b>
          <small>{{ t('settings.preferences.darkMode.description') }}</small>
        </span>
        <el-switch
          :model-value="settingsStore.settings.darkMode"
          :aria-label="t('settings.preferences.darkMode.label')"
          @update:model-value="updateDarkMode"
        />
      </div>

      <div class="login-appearance-panel__themes">
        <span class="login-appearance-panel__label">{{ t('settings.fields.themeColor') }}</span>
        <div
          class="login-appearance-panel__theme-grid"
          role="radiogroup"
          :aria-label="t('settings.fields.themeColor')"
        >
          <button
            v-for="option in themeColors"
            :key="option.value"
            class="login-appearance-theme"
            :class="{
              'login-appearance-theme--active': option.value === settingsStore.settings.themeColor,
            }"
            type="button"
            role="radio"
            :aria-checked="option.value === settingsStore.settings.themeColor"
            :aria-label="option.label"
            @click="updateTheme(option.value)"
          >
            <span
              class="login-appearance-theme__swatch"
              :style="{
                '--appearance-swatch': option.color,
                '--appearance-swatch-dark': option.darkColor,
              }"
              aria-hidden="true"
            />
            <span>{{ option.label }}</span>
            <span class="login-appearance-theme__check" aria-hidden="true">✓</span>
          </button>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useLocalization } from '@/foundation/modules/localization/localization'
import { useSettingsStore, type ThemeColor } from '@/foundation/modules/settings/settings.store'
import { THEME_COLOR_OPTIONS } from '@/foundation/modules/settings/settings.theme'

interface ThemeOption {
  value: ThemeColor
  label: string
  color: string
  darkColor: string
}

const visible = ref(false)
const settingsStore = useSettingsStore()
const { t } = useLocalization()
const themeColors = computed<readonly ThemeOption[]>(() =>
  THEME_COLOR_OPTIONS.map(function createThemeOption(option) {
    return {
      ...option,
      label: t(`settings.theme.${option.value}`),
    }
  }),
)
const selectedTheme = computed<ThemeOption>(
  () =>
    themeColors.value.find(function findSelectedTheme(option) {
      return option.value === settingsStore.settings.themeColor
    }) ?? themeColors.value[0],
)

function updateDarkMode(value: boolean | string | number): void {
  if (typeof value !== 'boolean') {
    return
  }

  settingsStore.save({ ...settingsStore.settings, darkMode: value })
}

function updateTheme(themeColor: ThemeColor): void {
  settingsStore.save({ ...settingsStore.settings, themeColor })
}
</script>

<style lang="scss">
.login-appearance-popover {
  --appearance-ink: var(--ink);
  --appearance-muted: var(--muted);
  --appearance-line: var(--line);
  --appearance-panel: var(--surface);

  padding: 0 !important;
  overflow: hidden;
  border: 1px solid var(--appearance-line) !important;
  border-radius: 18px !important;
  background: var(--appearance-panel) !important;
  box-shadow: none;
}

.login-appearance-panel {
  display: grid;
  gap: 17px;
  padding: 18px;
  color: var(--appearance-ink);
}

.login-appearance-panel__heading {
  display: grid;
  gap: 4px;

  span {
    color: var(--primary-deep);
    font-size: 8px;
    font-weight: 500;
    letter-spacing: 0.16em;
  }

  h2,
  p {
    margin: 0;
  }

  h2 {
    font-family: var(--font-display);
    font-size: 20px;
    letter-spacing: -0.035em;
  }

  p {
    color: var(--appearance-muted);
    font-size: 10px;
    line-height: 1.5;
  }
}

.login-appearance-panel__mode {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid color-mix(in srgb, var(--primary), transparent 72%);
  border-radius: 4px;
  background: var(--primary-mist);
}

.login-appearance-panel__mode-icon {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 4px;
  color: var(--primary-deep);
  background: color-mix(in srgb, var(--surface), transparent 18%);

  svg {
    width: 16px;
    height: 16px;
  }
}

.login-appearance-panel__mode-copy {
  min-width: 0;

  b,
  small {
    display: block;
  }

  b {
    color: var(--appearance-ink);
    font-size: 11px;
  }

  small {
    overflow: hidden;
    margin-top: 2px;
    color: var(--appearance-muted);
    font-size: 9px;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.login-appearance-panel__themes {
  display: grid;
  gap: 9px;
}

.login-appearance-panel__label {
  color: var(--appearance-ink);
  font-size: 11px;
  font-weight: 500;
}

.login-appearance-panel__theme-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
}

.login-appearance-theme {
  position: relative;
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 6px;
  padding: 8px 7px;
  border: 1px solid transparent;
  border-radius: 4px;
  color: var(--appearance-muted);
  background: transparent;
  font-size: 9px;
  text-align: left;
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;

  &:hover {
    color: var(--appearance-ink);
    background: color-mix(in srgb, var(--surface-muted), transparent 18%);
    transform: translateY(-1px);
  }

  &:focus-visible,
  &--active {
    outline: 2px solid color-mix(in srgb, var(--primary), transparent 25%);
    outline-offset: 1px;
  }

  &--active {
    border-color: var(--primary);
    color: var(--appearance-ink);
    background: var(--surface-muted);
  }
}

.login-appearance-theme__swatch,
.login-appearance-trigger__swatch {
  position: relative;
  overflow: hidden;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--appearance-swatch);

  &::after {
    position: absolute;
    inset: 0 0 0 50%;
    background: var(--appearance-swatch-dark);
    content: '';
  }
}

.login-appearance-theme__swatch {
  width: 15px;
  height: 15px;
  box-shadow: none;
}

.login-appearance-theme > span:nth-child(2) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.login-appearance-theme__check {
  display: none;
  margin-left: auto;
  color: var(--primary-deep);
  font-size: 11px;
  font-weight: 500;
}

.login-appearance-theme--active .login-appearance-theme__check {
  display: inline;
}

.login-appearance-trigger {
  display: inline-flex;
  height: 36px;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border: 1px solid var(--line);
  border-radius: 4px;
  color: var(--muted);
  background: color-mix(in srgb, var(--surface), transparent 22%);
  box-shadow: none;
  font-size: 10px;
  font-weight: 500;
  transition:
    color 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease,
    transform 0.18s ease;

  &:hover {
    color: var(--primary-dark);
    border-color: color-mix(in srgb, var(--primary), var(--line) 48%);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-deep);
    outline-offset: 2px;
  }
}

.login-appearance-trigger__swatch {
  width: 15px;
  height: 15px;
  box-shadow: none;
}

.login-appearance-trigger__label {
  white-space: nowrap;
}

.login-appearance-trigger__icon {
  width: 15px;
  height: 15px;
  color: var(--primary-deep);
}

@media (max-width: 479px) {
  .login-appearance-trigger {
    width: 36px;
    justify-content: center;
    padding: 0;
  }

  .login-appearance-trigger__label {
    display: none;
  }
}
</style>

<template>
  <div
    class="language-switcher"
    :class="[`language-switcher--${surface}`, { 'language-switcher--compact': compact }]"
    role="group"
    :aria-label="t('localization.switcher.label')"
  >
    <button
      v-for="option in supportedLocales"
      :key="option.code"
      class="language-switcher__option"
      type="button"
      :class="{ 'language-switcher__option--active': option.code === currentLocale }"
      :aria-label="t(`localization.switcher.${option.code}`)"
      :aria-pressed="option.code === currentLocale"
      @click="setLocale(option.code)"
    >
      <span class="language-switcher__short">{{ option.shortLabel }}</span>
      <span class="language-switcher__name">{{ option.nativeLabel }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLocalization } from './localization'

withDefaults(
  defineProps<{
    surface?: 'dark' | 'light'
    compact?: boolean
  }>(),
  {
    surface: 'light',
    compact: false,
  },
)

const { currentLocale, supportedLocales, setLocale, t } = useLocalization()
</script>

<style lang="scss" scoped>
.language-switcher {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: color-mix(in srgb, var(--surface), transparent 22%);
  box-shadow: none;
}

.language-switcher__option {
  display: flex;
  min-width: 62px;
  height: 30px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 9px;
  border: 0;
  border-radius: 4px;
  color: var(--muted);
  background: transparent;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.025em;
  transition:
    color 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;

  &:hover {
    color: var(--primary-dark);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-deep);
    outline-offset: 2px;
  }
}

.language-switcher__option--active {
  color: var(--primary-foreground);
  background: var(--primary);
  box-shadow: none;
}

.language-switcher__short {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 500;
}

.language-switcher__name {
  white-space: nowrap;
}

.language-switcher--dark {
  border-color: color-mix(in srgb, var(--hero-foreground), transparent 86%);
  background: color-mix(in srgb, var(--brand-surface-end), transparent 38%);
  box-shadow: none;

  .language-switcher__option {
    color: var(--hero-meta);

    &:hover {
      color: var(--hero-foreground);
    }
  }

  .language-switcher__option--active {
    color: var(--primary-foreground);
  }
}

.language-switcher--compact {
  .language-switcher__option {
    min-width: 38px;
    padding: 0 8px;
  }

  .language-switcher__name {
    display: none;
  }
}

@media (max-width: 479px) {
  .language-switcher:not(.language-switcher--compact) {
    .language-switcher__option {
      min-width: 42px;
    }

    .language-switcher__name {
      display: none;
    }
  }
}
</style>

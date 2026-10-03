/** Shared identifiers remain compatible with persisted Foundation preferences. */
export const THEME_COLORS = ['jade', 'civic', 'monochrome', 'azure', 'violet', 'amber'] as const
export type ThemeColor = (typeof THEME_COLORS)[number]
export interface ThemeColorOption {
  value: ThemeColor
  color: string
  darkColor: string
}
export const THEME_COLOR_OPTIONS: readonly ThemeColorOption[] = THEME_COLORS.map(
  function themeOption(value) {
    return { value, color: `var(--theme-${value}-light)`, darkColor: `var(--theme-${value}-dark)` }
  },
)

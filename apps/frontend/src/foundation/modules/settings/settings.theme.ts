import { THEME_COLORS, type ThemeColor } from '@cyber-ai-forge/design-tokens'
export {
  THEME_COLORS,
  THEME_COLOR_OPTIONS,
  type ThemeColor,
  type ThemeColorOption,
} from '@cyber-ai-forge/design-tokens'

const LEGACY_THEME_COLORS: Readonly<Record<string, ThemeColor>> = {
  aurora: 'jade',
  ocean: 'azure',
  violet: 'violet',
  sunset: 'amber',
}

export function normalizeThemeColor(value: unknown): ThemeColor | undefined {
  if (typeof value !== 'string') {
    return
  }

  if (THEME_COLORS.includes(value as ThemeColor)) {
    return value as ThemeColor
  }

  return LEGACY_THEME_COLORS[value]
}

import type { App } from 'vue'
import artwork from '@/platform/assets/prism-structure.png'
import { runtimeConfig } from '@/config/runtime.config'
import PlatformCreatorCredit from '@/platform/brand/CreatorCredit.vue'
import PlatformLogo from '@/platform/brand/CyberLogo.vue'
import { registerLocalizationResources } from '@/foundation/modules/localization/localization'
import { installPlatformDefinition } from '@/foundation/platform/platform'
import { registerViewModules } from '@/foundation/shared/routing/view-registry'

const platformLocalizationResources = import.meta.glob('@/platform/modules/**/*.locales.ts', {
  eager: true,
})
const platformViewModules = import.meta.glob('@/platform/modules/**/registerViews.ts', {
  eager: true,
})

export function installPlatform(app: App): void {
  installPlatformDefinition(app, {
    config: runtimeConfig.platform,
    brand: {
      logo: PlatformLogo,
      artwork,
      creatorCredit: PlatformCreatorCredit,
    },
  })
  registerLocalizationResources(platformLocalizationResources)
  registerViewModules(platformViewModules)
}

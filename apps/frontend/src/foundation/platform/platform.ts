import type { App, Component, InjectionKey } from 'vue'
import { inject } from 'vue'

export interface PlatformConfig {
  name: string
  fullName: string
  tagline: string
  githubUrl: string
  creatorName: string
  creatorFullName: string
  storagePrefix: string
}

export interface PlatformDefinition {
  config: Readonly<PlatformConfig>
  brand: {
    artwork?: string
    logo: Component
    creatorCredit: Component
  }
}

const platformDefinitionKey: InjectionKey<PlatformDefinition> = Symbol('platform-definition')
let configuredPlatform: Readonly<PlatformConfig> | undefined

export function configurePlatform(config: Readonly<PlatformConfig>): void {
  configuredPlatform = config
}

export function getPlatformConfig(): Readonly<PlatformConfig> {
  if (!configuredPlatform) {
    throw new Error('Platform config must be registered before Foundation starts')
  }
  return configuredPlatform
}

export function platformStorageKey(key: string): string {
  return `${getPlatformConfig().storagePrefix}_${key}`
}

export function installPlatformDefinition(app: App, definition: PlatformDefinition): void {
  configurePlatform(definition.config)
  app.provide(platformDefinitionKey, definition)
}

export function usePlatformDefinition(): PlatformDefinition {
  const definition = inject(platformDefinitionKey)
  if (!definition) {
    throw new Error('Platform definition must be installed before mounting the application')
  }
  return definition
}

export function usePlatformConfig(): Readonly<PlatformConfig> {
  return usePlatformDefinition().config
}

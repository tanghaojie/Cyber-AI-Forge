<script setup lang="ts">
import apiLogsScreenshot from '../assets/design-previews/api-logs.png'
import homeScreenshot from '../assets/design-previews/home.png'
import menusScreenshot from '../assets/design-previews/menus.png'
import rolesScreenshot from '../assets/design-previews/roles.png'
import settingsScreenshot from '../assets/design-previews/settings.png'
import usersScreenshot from '../assets/design-previews/users.png'
import type { SceneContent } from '../content'

defineProps<{
  scene: SceneContent
}>()

const screenshots: Record<SceneContent['kind'], string> = {
  home: homeScreenshot,
  users: usersScreenshot,
  roles: rolesScreenshot,
  navigation: menusScreenshot,
  logs: apiLogsScreenshot,
  settings: settingsScreenshot,
}
</script>

<template>
  <div class="product-scene" :data-kind="scene.kind" aria-hidden="true">
    <img
      class="product-screenshot"
      :src="screenshots[scene.kind]"
      alt=""
      decoding="async"
      loading="lazy"
      width="3200"
      height="2000"
      draggable="false"
    />
  </div>
</template>

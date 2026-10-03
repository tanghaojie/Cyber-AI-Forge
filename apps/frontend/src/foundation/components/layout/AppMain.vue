<template>
  <main class="app-main">
    <!-- 以 route.path 作为 key，切换地址时重建页面并播放离场/入场过渡。 -->
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>
</template>

<style lang="scss" scoped>
.app-main {
  min-width: 0;
  min-height: calc(100vh - var(--app-shell-header-height) - var(--tag-view-height));
  min-height: calc(100dvh - var(--app-shell-header-height) - var(--tag-view-height));
  overflow-x: clip;
  padding: 20px 16px;
}

@media (min-width: 640px) {
  .app-main {
    padding: 28px;
  }
}

@media (min-width: 1024px) {
  .app-main {
    padding: 40px 48px;
  }
}
</style>

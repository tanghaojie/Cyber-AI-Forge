<template>
  <main class="login-page">
    <LoginPresentation />
    <LoginInteraction />
  </main>
</template>

<script setup lang="ts">
import LoginInteraction from './components/LoginInteraction.vue'
import LoginPresentation from './components/LoginPresentation.vue'
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
  background: var(--canvas);
}

@media (max-width: 900px) {
  .login-page :deep(.login-presentation) {
    display: none;
  }
  .login-page {
    grid-template-columns: 1fr;
  }
}
</style>

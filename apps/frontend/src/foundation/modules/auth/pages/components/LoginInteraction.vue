<template>
  <section class="login-interaction">
    <div class="login-toolbar">
      <LanguageSwitcher />
      <LoginAppearanceControls />
    </div>
    <div class="login-shell">
      <div class="mobile-brand">
        <a
          class="mobile-brand__link"
          :href="appConfig.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="t('auth.brand.githubLabel')"
        >
          <CyberLogo :show-descriptor="false" tone="dark" />
        </a>
      </div>
      <div class="login-context">
        <span><i />{{ t('auth.login.accessMode') }}</span>
        <b>{{ t('auth.login.environment') }}</b>
      </div>
      <form class="login-card" @submit.prevent="handleSubmit">
        <div class="form-head">
          <p>{{ t('auth.login.kicker') }}</p>
          <h2>{{ t('auth.login.title', { name: appConfig.name }) }}</h2>
          <span>{{ t('auth.login.subtitle', { name: appConfig.fullName }) }}</span>
        </div>
        <div class="login-fields">
          <label class="login-field">
            <span>{{ t('auth.login.username') }}</span>
            <el-input
              v-model.trim="username"
              size="large"
              autocomplete="username"
              :placeholder="t('auth.login.usernamePlaceholder')"
            />
          </label>
          <label class="login-field">
            <span
              >{{ t('auth.login.password') }}
              <small>{{ t('auth.login.passwordHint') }}</small></span
            >
            <el-input
              v-model="password"
              size="large"
              type="password"
              show-password
              autocomplete="current-password"
              :placeholder="t('auth.login.passwordPlaceholder')"
            />
          </label>
        </div>
        <el-alert v-if="error" :title="error" type="error" show-icon :closable="false" />
        <el-button
          native-type="submit"
          type="primary"
          size="large"
          :loading="auth.busy"
          class="login-submit"
        >
          {{ t('auth.login.submit') }} <span aria-hidden="true">↗</span>
        </el-button>
        <div class="login-card__footer">
          <p class="login-hint">
            <span>{{ t('auth.login.initialAccount') }}</span>
            <b>admin</b><i>/</i><b>Admin@123456</b>
            <small>{{ t('auth.login.initialAccountNote') }}</small>
          </p>
          <p class="security-note"><i />{{ t('auth.login.securityNote') }}</p>
        </div>
      </form>
      <CreatorCredit class="mobile-credit" tone="dark" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CreatorCredit from '@/foundation/components/platform/PlatformCreatorCredit.vue'
import CyberLogo from '@/foundation/components/platform/PlatformLogo.vue'
import { usePlatformConfig } from '@/foundation/platform/platform'
import { useAuthStore } from '@/foundation/modules/auth/auth.store'
import LanguageSwitcher from '@/foundation/modules/localization/LanguageSwitcher.vue'
import { useLocalization } from '@/foundation/modules/localization/localization'
import LoginAppearanceControls from './LoginAppearanceControls.vue'

const auth = useAuthStore()
const appConfig = usePlatformConfig()
const route = useRoute()
const router = useRouter()
const { t } = useLocalization()
const username = ref('admin')
const password = ref('Admin@123456')
const error = ref('')

async function handleSubmit(): Promise<void> {
  error.value = ''
  const message = await auth.login(username.value, password.value)
  if (message) {
    error.value = message
    return
  }

  // 守卫把原目标写入 redirect，登录成功后回到用户最初请求的页面。
  const destination = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  await router.replace(destination)
}
</script>

<style lang="scss" scoped>
.login-interaction {
  position: relative;
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 100px 10% 56px;
  background: var(--canvas);
}
.login-shell {
  width: min(100%, 400px);
}
.login-toolbar {
  position: absolute;
  top: 32px;
  right: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.login-context {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
  color: var(--muted);
  font: 10px var(--font-mono);
  letter-spacing: 0.05em;
}
.login-context b {
  font-weight: 400;
}
.login-card {
  display: grid;
  gap: 28px;
}
.form-head p {
  margin: 0 0 20px;
  color: var(--primary);
  font: 11px var(--font-mono);
  letter-spacing: 0.16em;
}
.form-head h2 {
  margin: 0 0 16px;
  color: var(--ink);
  font-size: 34px;
  line-height: 1.3;
  font-weight: 500;
  letter-spacing: -0.04em;
}
.form-head > span {
  display: block;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
}
.login-fields {
  display: grid;
  gap: 24px;
}
.login-field {
  display: grid;
  gap: 10px;
}
.login-field > span {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--ink);
}
.login-field small {
  font-size: 11px;
  color: var(--muted);
}
.login-field :deep(.el-input__wrapper) {
  min-height: 48px;
  background: var(--surface);
}
.login-submit {
  width: 100%;
  height: 48px;
  margin: 4px 0 0;
}
.login-submit :deep(span) {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.login-submit :deep(span span) {
  width: auto;
}
.login-card__footer {
  padding-top: 20px;
  border-top: 1px solid var(--line);
}
.login-hint {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 11px;
  color: var(--muted);
  line-height: 1.7;
}
.login-hint b {
  color: var(--ink-soft);
  font: 11px var(--font-mono);
}
.login-hint i {
  font-style: normal;
}
.login-hint small {
  width: 100%;
  font-size: 11px;
}
.security-note {
  color: var(--muted);
  font-size: 11px;
}
.mobile-brand,
.mobile-credit {
  display: none;
}
@media (max-width: 900px) {
  .login-interaction {
    padding: 100px 24px 40px;
  }
  .mobile-brand {
    display: block;
    margin-bottom: 40px;
  }
  .mobile-credit {
    display: block;
    margin-top: 40px;
  }
  .login-toolbar {
    right: 20px;
    top: 20px;
  }
}
</style>

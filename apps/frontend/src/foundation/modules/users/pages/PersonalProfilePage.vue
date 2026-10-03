<template>
  <section class="profile-page" :aria-label="t('users.profile.ariaLabel')">
    <header class="profile-page__hero">
      <div class="profile-page__identity-mark">{{ initials }}</div>
      <div>
        <p>{{ t('users.profile.kicker') }}</p>
        <h2>{{ t('users.profile.title') }}</h2>
        <span>{{ t('users.profile.description') }}</span>
      </div>
      <div class="profile-page__account">
        <small>{{ t('users.fields.username') }}</small>
        <b>{{ profile.username || '—' }}</b>
      </div>
    </header>

    <div class="profile-page__grid">
      <article class="profile-card">
        <div class="profile-card__heading">
          <div>
            <p>{{ t('users.profile.identityKicker') }}</p>
            <h3>{{ t('users.profile.identityTitle') }}</h3>
          </div>
          <span class="profile-card__signal" />
        </div>
        <el-form label-position="top" @submit.prevent="saveProfile">
          <el-form-item :label="t('users.fields.displayName')" required>
            <el-input
              v-model.trim="profile.displayName"
              :placeholder="t('users.dialog.displayNamePlaceholder')"
              maxlength="80"
              show-word-limit
            />
          </el-form-item>
          <el-form-item :label="t('users.fields.email')" required>
            <el-input
              v-model.trim="profile.email"
              type="email"
              :placeholder="t('users.dialog.emailPlaceholder')"
              maxlength="160"
            />
          </el-form-item>
          <el-button type="primary" native-type="submit" :loading="savingProfile">
            {{ t('users.profile.saveProfile') }}
          </el-button>
        </el-form>
      </article>

      <article class="profile-card profile-card--security">
        <div class="profile-card__heading">
          <div>
            <p>{{ t('users.profile.securityKicker') }}</p>
            <h3>{{ t('users.profile.securityTitle') }}</h3>
          </div>
          <span class="profile-card__lock">#</span>
        </div>
        <p class="profile-card__hint">{{ t('users.profile.passwordHint') }}</p>
        <el-form label-position="top" @submit.prevent="savePassword">
          <el-form-item :label="t('users.profile.currentPassword')" required>
            <el-input
              v-model="password.currentPassword"
              type="password"
              show-password
              autocomplete="current-password"
              :placeholder="t('users.profile.currentPasswordPlaceholder')"
            />
          </el-form-item>
          <el-form-item :label="t('users.profile.newPassword')" required>
            <el-input
              v-model="password.newPassword"
              type="password"
              show-password
              autocomplete="new-password"
              :placeholder="t('users.dialog.passwordPlaceholder')"
            />
          </el-form-item>
          <el-form-item :label="t('users.profile.confirmPassword')" required>
            <el-input
              v-model="password.confirmPassword"
              type="password"
              show-password
              autocomplete="new-password"
              :placeholder="t('users.profile.confirmPasswordPlaceholder')"
            />
          </el-form-item>
          <el-button type="primary" native-type="submit" :loading="savingPassword">
            {{ t('users.profile.changePassword') }}
          </el-button>
        </el-form>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { clearDynamicRoutes } from '@/foundation/router/dynamicRoutes'
import { useAuthStore } from '@/foundation/modules/auth/auth.store'
import { useNavigationStore } from '@/foundation/modules/navigation/navigation.store'
import { useTagViewStore } from '@/foundation/modules/tag-view/tag-view.store'
import { useLocalization } from '@/foundation/modules/localization/localization'
import { getPersonalProfile, updatePersonalPassword, updatePersonalProfile } from '../users.api'

const router = useRouter()
const auth = useAuthStore()
const navigation = useNavigationStore()
const tagView = useTagViewStore()
const { t } = useLocalization()
const profile = reactive({ username: '', displayName: '', email: '' })
const password = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const savingProfile = ref(false)
const savingPassword = ref(false)
const initials = computed(() => profile.displayName.slice(0, 1).toUpperCase() || 'A')

onMounted(function loadProfile() {
  void loadPersonalProfile()
})

async function loadPersonalProfile(): Promise<void> {
  const response = await getPersonalProfile()
  if (response.status !== 0 || !response.data) {
    ElMessage.error(response.err ?? t('users.profile.errors.loadFailed'))
    return
  }
  profile.username = response.data.username
  profile.displayName = response.data.displayName
  profile.email = response.data.email
}

async function saveProfile(): Promise<void> {
  if (!profile.displayName || !profile.email) {
    ElMessage.error(t('users.profile.errors.invalidProfile'))
    return
  }
  savingProfile.value = true
  try {
    const response = await updatePersonalProfile({
      displayName: profile.displayName,
      email: profile.email,
    })
    if (response.status !== 0 || !response.data) {
      ElMessage.error(response.err ?? t('users.profile.errors.saveFailed'))
      return
    }
    profile.displayName = response.data.displayName
    profile.email = response.data.email
    auth.updateDisplayName(response.data.displayName)
    ElMessage.success(t('users.profile.messages.profileSaved'))
  } finally {
    savingProfile.value = false
  }
}

async function savePassword(): Promise<void> {
  if (password.newPassword.length < 8) {
    ElMessage.error(t('users.profile.errors.invalidPassword'))
    return
  }
  if (password.newPassword !== password.confirmPassword) {
    ElMessage.error(t('users.profile.errors.passwordMismatch'))
    return
  }
  savingPassword.value = true
  try {
    const response = await updatePersonalPassword({
      currentPassword: password.currentPassword,
      newPassword: password.newPassword,
    })
    if ('err' in response) {
      ElMessage.error(
        response.status === 2000 ? t('users.profile.errors.invalidCurrentPassword') : response.err,
      )
      return
    }
    auth.clearSession()
    navigation.clear()
    tagView.deactivate()
    clearDynamicRoutes()
    ElMessage.success(t('users.profile.messages.passwordSaved'))
    await router.replace({ name: 'login' })
  } finally {
    savingPassword.value = false
  }
}
</script>

<style lang="scss" scoped>
.profile-page {
  max-width: 1200px;
  margin: auto;
}
.profile-page__hero {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
}
.profile-page__identity-mark {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--primary);
  background: var(--surface);
  font-size: 28px;
}
.profile-page__hero p {
  margin: 0;
  color: var(--primary);
  font: 11px var(--font-mono);
  letter-spacing: 0.1em;
}
.profile-page__hero h2 {
  margin: 8px 0;
  font-size: 32px;
  font-weight: 500;
}
.profile-page__hero span {
  color: var(--muted);
  font-size: 13px;
}
.profile-page__account {
  margin-left: auto;
  display: grid;
  gap: 8px;
}
.profile-page__account small {
  color: var(--muted);
}
.profile-page__account b {
  font: 13px var(--font-mono);
}
.profile-page__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  align-items: start;
}
.profile-card {
  padding: 32px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--surface);
}
.profile-card__heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line);
}
.profile-card__heading p {
  margin: 0;
  color: var(--muted);
  font: 10px var(--font-mono);
  letter-spacing: 0.1em;
}
.profile-card__heading h3 {
  margin: 10px 0 0;
  font-size: 20px;
  font-weight: 500;
}
.profile-card__signal,
.profile-card__lock {
  display: none;
}
.profile-card__hint {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.8;
  margin-bottom: 24px;
}
@media (max-width: 800px) {
  .profile-page__grid {
    grid-template-columns: 1fr;
  }
  .profile-page__account {
    display: none;
  }
  .profile-page__identity-mark {
    display: none;
  }
  .profile-card {
    padding: 24px;
  }
}
</style>

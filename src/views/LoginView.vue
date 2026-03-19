<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Lock, User, Eye, EyeOff, LogIn, ShieldCheck, Mail, AlertCircle, ArrowRight } from 'lucide-vue-next'
import { authApi } from '../api'
import { useAuthStore } from '../store/auth'
import { getFullVersion } from '../version'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { t, locale } = useI18n()

// Force logout immediately when visiting the login page to clear any stale state
authStore.logout()

// ─── Form State ───────────────────────────────────────────────
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const redirectUrl = ref('')

// ─── Forgot Password State ────────────────────────────────────
const showForgotModal = ref(false)
const resetEmail = ref('')
const isResetting = ref(false)
const resetError = ref('')
const resetSuccess = ref('')

function closeForgotModal() {
  showForgotModal.value = false
  resetEmail.value = ''
  resetError.value = ''
  resetSuccess.value = ''
}

async function handleForgotPassword() {
  resetError.value = ''
  resetSuccess.value = ''

  if (!resetEmail.value.trim()) {
    resetError.value = t('register.errorReq', 'Email is required')
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(resetEmail.value)) {
    resetError.value = t('register.errorEmailFormat', 'Invalid email format')
    return
  }

  isResetting.value = true

  try {
    const response = await authApi.forgotPassword({ email: resetEmail.value })
    const { code, message } = response.data

    if (String(code) === '200' || String(code) === '0' || String(code) === '0000') {
      resetSuccess.value = t('login.resetSuccess')
      setTimeout(() => closeForgotModal(), 3000)
    } else {
      if (message && message.includes('PWD_RESET_LIMIT_EXCEEDED')) {
        resetError.value = t('errors.pwdResetLimitExceeded')
      } else if (message && message.includes('USER_NOT_FOUND')) {
        resetError.value = t('errors.userNotFound')
      } else {
        resetError.value = message || t('login.errorGen')
      }
    }
  } catch (err: any) {
    const msg = err.response?.data?.message || ''
    if (msg.includes('PWD_RESET_LIMIT_EXCEEDED')) {
      resetError.value = t('errors.pwdResetLimitExceeded')
    } else if (msg.includes('USER_NOT_FOUND')) {
      resetError.value = t('errors.userNotFound')
    } else {
      resetError.value = msg || t('login.errorGen')
    }
  } finally {
    isResetting.value = false
  }
}

// ─── Read redirect param on mount ─────────────────────────────
onMounted(() => {
  const redirect = route.query.redirect as string | undefined
  if (redirect) {
    redirectUrl.value = redirect
  }
})

// ─── Login Handler ────────────────────────────────────────────
async function handleLogin() {
  errorMessage.value = ''

  if (!username.value.trim() || !password.value.trim()) {
    errorMessage.value = t('login.errorReq')
    return
  }

  isLoading.value = true

  try {
    const response = await authApi.login(username.value, password.value)
    const { code, message, data } = response.data

    if (String(code) !== '200' && String(code) !== '0' && String(code) !== '0000') {
      errorMessage.value = message || 'Login failed. Please try again.'
      return
    }

    // Store credentials in Pinia + localStorage
    const primaryRole = data.role || 'USER'
    authStore.login(data.token, data.userId, data.username || username.value, primaryRole, data.roles || [], data.language || '', data.isTempPassword || 0)
    
    // Apply user preferred language globally
    if (data.language) {
      locale.value = data.language
    }

    // OTP 一次性密碼檢查：如果是臨時密碼，強制導向 Profile 修改密碼
    if (authStore.isTempPassword) {
      // 如果有 SSO redirect，先暫存，等改完密碼再跳轉
      if (redirectUrl.value) {
        localStorage.setItem('pending_sso_redirect', redirectUrl.value)
      }
      router.push({ name: 'Profile' })
    } else {
      // SSO redirect logic
      if (redirectUrl.value) {
        // 跨域或跨專案跳轉，使用原生 window.location.href 並結合 URL 解構
        const targetUrl = new URL(redirectUrl.value, window.location.origin)
        targetUrl.searchParams.set('token', data.token)
        window.location.href = targetUrl.toString()
      } else {
        // No external redirect → go to App Launcher
        router.push({ name: 'Welcome' })
      }
    }
  } catch (err: any) {
    if (err.response?.data?.message) {
      errorMessage.value = err.response.data.message
    } else if (err.message) {
      errorMessage.value = err.message
    } else {
      errorMessage.value = t('login.errorGen')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background-color: var(--body-bg)">

    <!-- Login Card -->
    <div class="w-full max-w-md">
      <div
        class="rounded-xl p-8 sm:p-10 transition-colors duration-200"
        style="background-color: var(--card-bg); border: 1px solid var(--card-border)"
      >

        <!-- Header / Branding -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500 shrink-0 mb-4">
            <ShieldCheck class="w-6 h-6 text-white" :stroke-width="1.75" />
          </div>
          <h1 class="text-xl font-bold leading-tight" style="color: var(--body-text)">{{ $t('login.title') }}</h1>
          <p class="text-xs mt-1" style="color: var(--sidebar-text)">{{ $t('login.subtitle') }}</p>
          <div
            v-if="redirectUrl"
            class="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
            style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2)"
          >
            <LogIn class="w-3.5 h-3.5 text-emerald-400" />
            <span class="text-emerald-400 truncate max-w-[240px]">{{ $t('login.redirect', { url: redirectUrl }) }}</span>
          </div>
        </div>

        <!-- Error Message -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="errorMessage"
            class="mb-5 p-3 rounded-lg text-sm flex items-start gap-2"
            style="background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #f87171"
          >
            <span class="shrink-0 mt-0.5">⚠</span>
            <span>{{ errorMessage }}</span>
          </div>
        </Transition>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-5" id="login-form">

          <!-- Username or Email -->
          <div class="space-y-1.5">
            <label for="username" class="block text-xs font-medium" style="color: var(--sidebar-text)">{{ $t('login.usernameOrEmail') }}</label>
            <div class="relative">
              <User class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color: var(--sidebar-text)" :stroke-width="1.75" />
              <input
                id="username"
                v-model="username"
                type="text"
                autocomplete="username"
                :placeholder="$t('login.usernamePlh')"
                class="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                style="background-color: var(--input-bg); border: 1px solid var(--input-border); color: var(--body-text)"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="space-y-1.5">
            <div class="flex justify-between items-center mb-1.5">
              <label for="password" class="block text-xs font-medium" style="color: var(--sidebar-text)">{{ $t('login.password') }}</label>
              <button type="button" @click="showForgotModal = true" tabindex="-1" class="text-xs font-medium hover:underline focus:outline-none" style="color: #10b981;">
                {{ $t('login.forgotPassword') }}
              </button>
            </div>
            <div class="relative">
              <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color: var(--sidebar-text)" :stroke-width="1.75" />
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                :placeholder="$t('login.passwordPlh')"
                class="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                style="background-color: var(--input-bg); border: 1px solid var(--input-border); color: var(--body-text)"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150 cursor-pointer"
                style="color: var(--sidebar-text)"
                tabindex="-1"
              >
                <Eye v-if="!showPassword" class="w-4 h-4" :stroke-width="1.75" />
                <EyeOff v-else class="w-4 h-4" :stroke-width="1.75" />
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            id="login-button"
            type="submit"
            :disabled="isLoading"
            class="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg v-if="isLoading" class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <LogIn v-else class="w-4 h-4" :stroke-width="2" />
            <span>{{ isLoading ? $t('login.signingIn') : $t('login.signin') }}</span>
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-8 pt-5 text-center space-y-2" style="border-top: 1px solid var(--card-border)">
          <p class="text-xs" style="color: var(--sidebar-text)">
            {{ $t('login.noAccount') }}
            <router-link
              :to="{ name: 'Register' }"
              class="font-medium transition-colors hover:underline"
              style="color: var(--body-text)"
            >
              {{ $t('login.createAccount') }}
            </router-link>
          </p>
          <p class="text-xs" style="color: var(--sidebar-text)" v-html="$t('login.securedBy', { name: '<span class=&quot;font-medium&quot; style=&quot;color: var(--body-text)&quot;>Login Utils</span>' })" />
          <p class="text-[10px] mt-2 font-mono tracking-wider" style="color: var(--sidebar-text); opacity: 0.5">{{ getFullVersion() }}</p>
        </div>
      </div>
    </div>

    <!-- ─── Forgot Password Modal ──────────────────────────────── -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showForgotModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style="background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px);">
          
          <div 
            class="w-full max-w-sm rounded-xl overflow-hidden shadow-2xl transition-all"
            style="background-color: var(--card-bg); border: 1px solid var(--card-border)"
          >
            <!-- Header -->
            <div class="px-6 py-5 border-b" style="border-color: var(--card-border)">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Mail class="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 class="text-base font-semibold" style="color: var(--body-text)">{{ $t('login.resetPasswordTitle') }}</h3>
                  <p class="text-xs mt-0.5" style="color: var(--sidebar-text)">{{ $t('login.resetPasswordDesc') }}</p>
                </div>
              </div>
            </div>

            <!-- Body (Form) -->
            <form @submit.prevent="handleForgotPassword" class="p-6 space-y-4">
              
              <!-- Alerts -->
              <div v-if="resetError" class="p-3 rounded-lg text-xs flex items-start gap-2 text-red-500 bg-red-500/10 border border-red-500/20">
                <AlertCircle class="w-4 h-4 shrink-0 mt-0.5" />
                <span>{{ resetError }}</span>
              </div>
              <div v-if="resetSuccess" class="p-3 rounded-lg text-xs flex items-center gap-2 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
                <ShieldCheck class="w-4 h-4 shrink-0" />
                <span>{{ resetSuccess }}</span>
              </div>

              <!-- Email Field -->
              <div class="space-y-1.5">
                <label class="block text-xs font-medium" style="color: var(--sidebar-text)">{{ $t('register.email') }}</label>
                <div class="relative">
                  <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color: var(--sidebar-text)" />
                  <input
                    v-model="resetEmail"
                    type="email"
                    :placeholder="$t('register.emailPlh')"
                    class="w-full pl-9 pr-3 py-2 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    style="background-color: var(--input-bg); border: 1px solid var(--input-border); color: var(--body-text)"
                  />
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 pt-4 border-t mt-6" style="border-color: var(--card-border)">
                <button
                  type="button"
                  @click="closeForgotModal"
                  class="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors border"
                  style="color: var(--body-text); border-color: var(--input-border); background-color: var(--input-bg)"
                  :disabled="isResetting"
                >
                  {{ $t('profile.password.cancelBtn') }}
                </button>
                <button
                  type="submit"
                  class="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  :disabled="isResetting || !!resetSuccess"
                >
                  <svg v-if="isResetting" class="animate-spin -ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <ArrowRight v-else class="w-4 h-4" />
                  {{ isResetting ? $t('profile.password.savingBtn') : $t('login.sendNewPassword') }}
                </button>
              </div>

            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

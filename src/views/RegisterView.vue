<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { UserPlus, User, Lock, Eye, EyeOff, Mail, Phone, SmilePlus, ArrowLeft, Globe } from 'lucide-vue-next'
import { authApi } from '../api'

const router = useRouter()
const { t, locale } = useI18n()

// ─── Form State ───────────────────────────────────────────────
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const languagePref = ref(locale.value as string)
const nickname = ref('')
const email = ref('')
const phone = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// ─── Register Handler ─────────────────────────────────────────
async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!username.value.trim() || !password.value.trim()) {
    errorMessage.value = t('register.errorReq')
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = t('register.errorLen')
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = t('register.errorMatch')
    return
  }

  isLoading.value = true

  try {
    const response = await authApi.register({
      username: username.value,
      password: password.value,
      language: languagePref.value,
      nickname: nickname.value || undefined,
      email: email.value || undefined,
      phone: phone.value || undefined,
    })

    const { code, message } = response.data

    if (String(code) !== '200' && String(code) !== '0' && String(code) !== '0000') {
      errorMessage.value = message || 'Registration failed. Please try again.'
      return
    }


    successMessage.value = t('register.success')
    setTimeout(() => {
      router.push({ name: 'Login' })
    }, 1500)
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
  <div class="min-h-screen flex items-center justify-center px-4 py-8" style="background-color: var(--body-bg)">

    <!-- Register Card -->
    <div class="w-full max-w-md">
      <div
        class="rounded-xl p-8 sm:p-10 transition-colors duration-200"
        style="background-color: var(--card-bg); border: 1px solid var(--card-border)"
      >

        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-violet-500 shrink-0 mb-4">
            <UserPlus class="w-6 h-6 text-white" :stroke-width="1.75" />
          </div>
          <h1 class="text-xl font-bold leading-tight" style="color: var(--body-text)">{{ $t('register.title') }}</h1>
          <p class="text-xs mt-1" style="color: var(--sidebar-text)">{{ $t('register.subtitle') }}</p>
        </div>

        <!-- Success Message -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div
            v-if="successMessage"
            class="mb-5 p-3 rounded-lg text-sm flex items-start gap-2"
            style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: #34d399"
          >
            <span class="shrink-0 mt-0.5">✓</span>
            <span>{{ successMessage }}</span>
          </div>
        </Transition>

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
        <form @submit.prevent="handleRegister" class="space-y-4" id="register-form">

          <!-- Username -->
          <div class="space-y-1.5">
            <label for="reg-username" class="block text-xs font-medium" style="color: var(--sidebar-text)">{{ $t('register.usernameReq') }}</label>
            <div class="relative">
              <User class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color: var(--sidebar-text)" :stroke-width="1.75" />
              <input
                id="reg-username"
                v-model="username"
                type="text"
                autocomplete="username"
                :placeholder="$t('register.usernamePlh')"
                class="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                style="background-color: var(--input-bg); border: 1px solid var(--input-border); color: var(--body-text)"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="space-y-1.5">
            <label for="reg-password" class="block text-xs font-medium" style="color: var(--sidebar-text)">{{ $t('register.passwordReq') }}</label>
            <div class="relative">
              <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color: var(--sidebar-text)" :stroke-width="1.75" />
              <input
                id="reg-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                :placeholder="$t('register.passwordPlh')"
                class="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
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

          <!-- Confirm Password -->
          <div class="space-y-1.5">
            <label for="reg-confirm" class="block text-xs font-medium" style="color: var(--sidebar-text)">{{ $t('register.confirmReq') }}</label>
            <div class="relative">
              <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color: var(--sidebar-text)" :stroke-width="1.75" />
              <input
                id="reg-confirm"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                :placeholder="$t('register.confirmPlh')"
                class="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                style="background-color: var(--input-bg); border: 1px solid var(--input-border); color: var(--body-text)"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150 cursor-pointer"
                style="color: var(--sidebar-text)"
                tabindex="-1"
              >
                <Eye v-if="!showConfirmPassword" class="w-4 h-4" :stroke-width="1.75" />
                <EyeOff v-else class="w-4 h-4" :stroke-width="1.75" />
              </button>
            </div>
          </div>

          <!-- Language Preference -->
          <div class="space-y-1.5">
            <label for="reg-lang" class="block text-xs font-medium" style="color: var(--sidebar-text)">{{ $t('register.language') }}</label>
            <div class="relative">
              <Globe class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color: var(--sidebar-text)" :stroke-width="1.75" />
              <select
                id="reg-lang"
                v-model="languagePref"
                class="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50 appearance-none cursor-pointer"
                style="background-color: var(--input-bg); border: 1px solid var(--input-border); color: var(--body-text)"
              >
                <option value="zh-TW">繁體中文 (zh-TW)</option>
                <option value="en">English (en)</option>
                <option value="ja">日本語 (ja)</option>
                <option value="ko">한국어 (ko)</option>
              </select>
            </div>
          </div>

          <!-- Divider -->
          <div class="pt-1">
            <p class="text-xs font-medium" style="color: var(--sidebar-text)">{{ $t('register.optional') }}</p>
          </div>

          <!-- Nickname -->
          <div class="space-y-1.5">
            <label for="reg-nickname" class="block text-xs font-medium" style="color: var(--sidebar-text)">{{ $t('register.nickname') }}</label>
            <div class="relative">
              <SmilePlus class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color: var(--sidebar-text)" :stroke-width="1.75" />
              <input
                id="reg-nickname"
                v-model="nickname"
                type="text"
                :placeholder="$t('register.nicknamePlh')"
                class="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                style="background-color: var(--input-bg); border: 1px solid var(--input-border); color: var(--body-text)"
              />
            </div>
          </div>

          <!-- Email -->
          <div class="space-y-1.5">
            <label for="reg-email" class="block text-xs font-medium" style="color: var(--sidebar-text)">{{ $t('register.email') }}</label>
            <div class="relative">
              <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color: var(--sidebar-text)" :stroke-width="1.75" />
              <input
                id="reg-email"
                v-model="email"
                type="email"
                :placeholder="$t('register.emailPlh')"
                class="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                style="background-color: var(--input-bg); border: 1px solid var(--input-border); color: var(--body-text)"
              />
            </div>
          </div>

          <!-- Phone -->
          <div class="space-y-1.5">
            <label for="reg-phone" class="block text-xs font-medium" style="color: var(--sidebar-text)">{{ $t('register.phone') }}</label>
            <div class="relative">
              <Phone class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color: var(--sidebar-text)" :stroke-width="1.75" />
              <input
                id="reg-phone"
                v-model="phone"
                type="tel"
                :placeholder="$t('register.phonePlh')"
                class="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                style="background-color: var(--input-bg); border: 1px solid var(--input-border); color: var(--body-text)"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <button
            id="register-button"
            type="submit"
            :disabled="isLoading"
            class="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg v-if="isLoading" class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <UserPlus v-else class="w-4 h-4" :stroke-width="2" />
            <span>{{ isLoading ? $t('register.creatingBtn') : $t('register.createBtn') }}</span>
          </button>
        </form>

        <div class="mt-8 pt-5 text-center" style="border-top: 1px solid var(--card-border)">
          <p class="text-xs" style="color: var(--sidebar-text)">
            {{ $t('register.hasAccount') }}
            <router-link
              :to="{ name: 'Login' }"
              class="font-medium transition-colors hover:underline"
              style="color: var(--body-text)"
            >
              <ArrowLeft class="w-3 h-3 inline -mt-0.5" /> {{ $t('register.backLogin') }}
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

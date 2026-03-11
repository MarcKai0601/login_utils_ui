<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Lock, User, Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-vue-next'
import { authApi } from '../api'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// ─── Form State ───────────────────────────────────────────────
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const redirectUrl = ref('')

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
    errorMessage.value = 'Please enter both username and password.'
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
    authStore.login(data.token, data.userId, primaryRole, data.roles || [])

    // SSO redirect logic
    if (redirectUrl.value) {
      const separator = redirectUrl.value.includes('?') ? '&' : '?'
      window.location.href = `${redirectUrl.value}${separator}token=${data.token}`
    } else {
      // No external redirect → go to App Launcher
      router.push({ name: 'Welcome' })
    }
  } catch (err: any) {
    if (err.response?.data?.message) {
      errorMessage.value = err.response.data.message
    } else if (err.message) {
      errorMessage.value = err.message
    } else {
      errorMessage.value = 'An unexpected error occurred. Please try again.'
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
          <h1 class="text-xl font-bold leading-tight" style="color: var(--body-text)">Login Utils</h1>
          <p class="text-xs mt-1" style="color: var(--sidebar-text)">Identity Provider — SSO Gateway</p>
          <div
            v-if="redirectUrl"
            class="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
            style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2)"
          >
            <LogIn class="w-3.5 h-3.5 text-emerald-400" />
            <span class="text-emerald-400 truncate max-w-[240px]">Redirect → {{ redirectUrl }}</span>
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

          <!-- Username -->
          <div class="space-y-1.5">
            <label for="username" class="block text-xs font-medium" style="color: var(--sidebar-text)">Username</label>
            <div class="relative">
              <User class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color: var(--sidebar-text)" :stroke-width="1.75" />
              <input
                id="username"
                v-model="username"
                type="text"
                autocomplete="username"
                placeholder="Enter your username"
                class="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                style="background-color: var(--input-bg); border: 1px solid var(--input-border); color: var(--body-text)"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="space-y-1.5">
            <label for="password" class="block text-xs font-medium" style="color: var(--sidebar-text)">Password</label>
            <div class="relative">
              <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color: var(--sidebar-text)" :stroke-width="1.75" />
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Enter your password"
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
            <span>{{ isLoading ? 'Signing in…' : 'Sign In' }}</span>
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-8 pt-5 text-center space-y-2" style="border-top: 1px solid var(--card-border)">
          <p class="text-xs" style="color: var(--sidebar-text)">
            Don't have an account?
            <router-link
              :to="{ name: 'Register' }"
              class="font-medium transition-colors hover:underline"
              style="color: var(--body-text)"
            >
              Create Account
            </router-link>
          </p>
          <p class="text-xs" style="color: var(--sidebar-text)">
            Secured by <span style="color: var(--body-text)" class="font-medium">Login Utils</span> · Identity Provider
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

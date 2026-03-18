<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { authApi } from '../api'
import { User, ShieldCheck, Fingerprint, BadgeCheck, KeyRound, Eye, EyeOff, Lock, AlertCircle } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

// ─── Modal State ──────────────────────────────────────────────
const showPasswordModal = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showOldPwd = ref(false)
const showNewPwd = ref(false)
const showConfirmPwd = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// ─── Reset State ──────────────────────────────────────────────
function closePasswordModal() {
  showPasswordModal.value = false
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  errorMessage.value = ''
  successMessage.value = ''
  showOldPwd.value = false
  showNewPwd.value = false
  showConfirmPwd.value = false
}

// ─── Submit Handler ───────────────────────────────────────────
async function handleChangePassword() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    errorMessage.value = 'All fields are required' // Will be replaced by i18n
    return
  }
  if (newPassword.value.length < 6) {
    errorMessage.value = 'New password must be at least 6 characters'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  isSubmitting.value = true
  try {
    const res = await authApi.updatePassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value
    })
    
    if (String(res.data.code) === '200' || String(res.data.code) === '0' || String(res.data.code) === '0000') {
      successMessage.value = 'Password changed successfully'
      setTimeout(() => {
        closePasswordModal()
        authStore.logout()
        router.push('/login')
        setTimeout(() => alert('Password changed successfully. Please login again.'), 100)
      }, 1000)
    } else {
      errorMessage.value = res.data.message || 'Failed to update password'
    }
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Server error while updating password'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex-1 p-6 md:p-10 overflow-auto" style="background-color: var(--body-bg)">

    <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight" style="color: var(--body-text)">{{ $t('profile.title') }}</h1>
        <p class="text-sm mt-1" style="color: var(--sidebar-text)">{{ $t('profile.subtitle') }}</p>
      </div>
      <button 
        @click="showPasswordModal = true"
        class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm self-start sm:self-auto"
      >
        <KeyRound class="w-4 h-4" />
        {{ $t('profile.password.changeBtn') }}
      </button>
    </div>

    <div class="grid gap-6 md:grid-cols-2 max-w-4xl">

      <div
        class="rounded-xl p-6 transition-colors duration-200"
        style="background-color: var(--card-bg); border: 1px solid var(--card-border)"
      >
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <User class="w-5 h-5 text-emerald-400" :stroke-width="1.75" />
          </div>
          <div>
            <h2 class="text-sm font-semibold" style="color: var(--body-text)">{{ $t('profile.accountInfo') }}</h2>
            <p class="text-xs" style="color: var(--sidebar-text)">{{ $t('profile.accountDesc') }}</p>
          </div>
        </div>

        <div class="space-y-4">
          <div
            class="flex items-center gap-3 p-3 rounded-lg"
            style="background-color: var(--input-bg); border: 1px solid var(--card-border)"
          >
            <User class="w-4 h-4 shrink-0" style="color: var(--sidebar-text)" :stroke-width="1.75" />
            <div>
              <p class="text-xs uppercase tracking-wider" style="color: var(--sidebar-text)">{{ $t('profile.username') }}</p>
              <p class="text-sm font-medium" style="color: var(--body-text)">{{ authStore.username || 'N/A' }}</p>
            </div>
          </div>

          <div
            class="flex items-center gap-3 p-3 rounded-lg"
            style="background-color: var(--input-bg); border: 1px solid var(--card-border)"
          >
            <Fingerprint class="w-4 h-4 shrink-0" style="color: var(--sidebar-text)" :stroke-width="1.75" />
            <div>
              <p class="text-xs uppercase tracking-wider" style="color: var(--sidebar-text)">{{ $t('profile.userId') }}</p>
              <p class="text-sm font-medium" style="color: var(--body-text)">{{ authStore.userId || '—' }}</p>
            </div>
          </div>

          <div
            class="flex items-center gap-3 p-3 rounded-lg"
            style="background-color: var(--input-bg); border: 1px solid var(--card-border)"
          >
            <BadgeCheck class="w-4 h-4 shrink-0" style="color: var(--sidebar-text)" :stroke-width="1.75" />
            <div>
              <p class="text-xs uppercase tracking-wider" style="color: var(--sidebar-text)">{{ $t('profile.status') }}</p>
              <p class="text-sm font-medium text-emerald-400">{{ $t('profile.active') }}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="rounded-xl p-6 transition-colors duration-200 md:col-span-2"
        style="background-color: var(--card-bg); border: 1px solid var(--card-border)"
      >
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <ShieldCheck class="w-5 h-5 text-amber-400" :stroke-width="1.75" />
          </div>
          <div>
            <h2 class="text-sm font-semibold" style="color: var(--body-text)">{{ $t('profile.rbacRole') }}</h2>
            <p class="text-xs" style="color: var(--sidebar-text)">{{ $t('profile.rbacDesc') }}</p>
          </div>
        </div>

        <div v-if="authStore.role" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div
            class="p-3 rounded-lg flex items-center gap-3"
            style="background-color: var(--input-bg); border: 1px solid var(--card-border)"
          >
            <ShieldCheck class="w-4 h-4 shrink-0 text-emerald-400" :stroke-width="1.75" />
            <div>
              <p class="text-sm font-medium" style="color: var(--body-text)">{{ authStore.role }}</p>
              <p class="text-xs" style="color: var(--sidebar-text)">{{ $t('profile.primaryRole') }}</p>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-6">
          <ShieldCheck class="w-8 h-8 mx-auto mb-2" style="color: var(--sidebar-text); opacity: 0.4" :stroke-width="1.5" />
          <p class="text-sm" style="color: var(--sidebar-text)">{{ $t('profile.noRole') }}</p>
          <p class="text-xs mt-1" style="color: var(--sidebar-text); opacity: 0.6">{{ $t('profile.contactAdmin') }}</p>
        </div>
      </div>
    </div>

    <!-- ─── Change Password Modal ──────────────────────────────── -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style="background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px);">
          
          <div 
            class="w-full max-w-sm rounded-xl overflow-hidden shadow-2xl transition-all"
            style="background-color: var(--card-bg); border: 1px solid var(--card-border)"
          >
            <!-- Header -->
            <div class="px-6 py-5 border-b" style="border-color: var(--card-border)">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Lock class="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 class="text-base font-semibold" style="color: var(--body-text)">{{ $t('profile.password.modalTitle') }}</h3>
                  <p class="text-xs mt-0.5" style="color: var(--sidebar-text)">{{ $t('profile.password.modalDesc') }}</p>
                </div>
              </div>
            </div>

            <!-- Body (Form) -->
            <form @submit.prevent="handleChangePassword" class="p-6 space-y-4">
              
              <!-- Alerts -->
              <div v-if="errorMessage" class="p-3 rounded-lg text-xs flex items-start gap-2 text-red-500 bg-red-500/10 border border-red-500/20">
                <AlertCircle class="w-4 h-4 shrink-0 mt-0.5" />
                <span>{{ errorMessage.includes('Required') || errorMessage.includes('required') ? $t('profile.password.errRequired') : (errorMessage.includes('match') ? $t('profile.password.errMatch') : (errorMessage.includes('6') ? $t('profile.password.errLength') : errorMessage)) }}</span>
              </div>
              <div v-if="successMessage" class="p-3 rounded-lg text-xs flex items-center gap-2 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20">
                <ShieldCheck class="w-4 h-4 shrink-0" />
                <span>{{ $t('profile.password.successMsg') }}</span>
              </div>

              <!-- Old Password -->
              <div class="space-y-1.5">
                <label class="block text-xs font-medium" style="color: var(--sidebar-text)">{{ $t('profile.password.oldLabel') }}</label>
                <div class="relative">
                  <input
                    v-model="oldPassword"
                    :type="showOldPwd ? 'text' : 'password'"
                    :placeholder="$t('profile.password.oldPlh')"
                    class="w-full px-3 py-2 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    style="background-color: var(--input-bg); border: 1px solid var(--input-border); color: var(--body-text)"
                  />
                  <button type="button" @click="showOldPwd = !showOldPwd" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style="color: var(--sidebar-text)">
                    <Eye v-if="!showOldPwd" class="w-4 h-4" />
                    <EyeOff v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- New Password -->
              <div class="space-y-1.5">
                <label class="block text-xs font-medium" style="color: var(--sidebar-text)">{{ $t('profile.password.newLabel') }}</label>
                <div class="relative">
                  <input
                    v-model="newPassword"
                    :type="showNewPwd ? 'text' : 'password'"
                    :placeholder="$t('profile.password.newPlh')"
                    class="w-full px-3 py-2 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    style="background-color: var(--input-bg); border: 1px solid var(--input-border); color: var(--body-text)"
                  />
                  <button type="button" @click="showNewPwd = !showNewPwd" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style="color: var(--sidebar-text)">
                    <Eye v-if="!showNewPwd" class="w-4 h-4" />
                    <EyeOff v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="space-y-1.5">
                <label class="block text-xs font-medium" style="color: var(--sidebar-text)">{{ $t('profile.password.confirmLabel') }}</label>
                <div class="relative">
                  <input
                    v-model="confirmPassword"
                    :type="showConfirmPwd ? 'text' : 'password'"
                    :placeholder="$t('profile.password.confirmPlh')"
                    class="w-full px-3 py-2 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    style="background-color: var(--input-bg); border: 1px solid var(--input-border); color: var(--body-text)"
                  />
                  <button type="button" @click="showConfirmPwd = !showConfirmPwd" class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style="color: var(--sidebar-text)">
                    <Eye v-if="!showConfirmPwd" class="w-4 h-4" />
                    <EyeOff v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 pt-4 border-t mt-6" style="border-color: var(--card-border)">
                <button
                  type="button"
                  @click="closePasswordModal"
                  class="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors border"
                  style="color: var(--body-text); border-color: var(--input-border); background-color: var(--input-bg)"
                  :disabled="isSubmitting"
                >
                  {{ $t('profile.password.cancelBtn') }}
                </button>
                <button
                  type="submit"
                  class="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  :disabled="isSubmitting"
                >
                  <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  {{ isSubmitting ? $t('profile.password.savingBtn') : $t('profile.password.submitBtn') }}
                </button>
              </div>

            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
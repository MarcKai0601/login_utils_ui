<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { CheckCircle, LogOut, User, ShieldCheck } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background-color: var(--body-bg)">

    <!-- Card -->
    <div class="w-full max-w-lg">
      <div
        class="rounded-xl p-8 sm:p-10 text-center transition-colors duration-200"
        style="background-color: var(--card-bg); border: 1px solid var(--card-border)"
      >

        <!-- Success icon -->
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
          style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2)"
        >
          <CheckCircle class="w-8 h-8 text-emerald-400" :stroke-width="1.5" />
        </div>

        <h1 class="text-2xl font-bold tracking-tight mb-2" style="color: var(--body-text)">Welcome!</h1>
        <p class="text-sm mb-8" style="color: var(--sidebar-text)">You have successfully signed in to Login Utils.</p>

        <!-- User Info -->
        <div
          class="rounded-lg p-5 mb-8 space-y-3 text-left"
          style="background-color: var(--input-bg); border: 1px solid var(--card-border)"
        >
          <div class="flex items-center gap-3">
            <User class="w-5 h-5 shrink-0" style="color: var(--sidebar-text)" :stroke-width="1.75" />
            <div>
              <p class="text-xs uppercase tracking-wider" style="color: var(--sidebar-text)">User ID</p>
              <p class="text-sm font-medium" style="color: var(--body-text)">{{ authStore.userId || '—' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <ShieldCheck class="w-5 h-5 shrink-0" style="color: var(--sidebar-text)" :stroke-width="1.75" />
            <div>
              <p class="text-xs uppercase tracking-wider" style="color: var(--sidebar-text)">Token</p>
              <p class="text-sm font-mono truncate max-w-[320px]" style="color: var(--body-text)">{{ authStore.token ? authStore.token.slice(0, 32) + '…' : '—' }}</p>
            </div>
          </div>
        </div>

        <!-- Logout Button -->
        <button
          id="logout-button"
          @click="handleLogout"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer"
          style="background-color: var(--input-bg); border: 1px solid var(--card-border); color: var(--sidebar-text)"
          @mouseenter="($event.currentTarget as HTMLElement).style.color = 'var(--body-text)'"
          @mouseleave="($event.currentTarget as HTMLElement).style.color = 'var(--sidebar-text)'"
        >
          <LogOut class="w-4 h-4" :stroke-width="2" />
          <span>Sign Out</span>
        </button>

        <!-- Footer -->
        <div class="mt-8 pt-5" style="border-top: 1px solid var(--card-border)">
          <p class="text-xs" style="color: var(--sidebar-text)">
            Secured by <span style="color: var(--body-text)" class="font-medium">Login Utils</span> · Identity Provider
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

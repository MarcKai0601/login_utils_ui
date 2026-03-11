<script setup lang="ts">
import { useAuthStore } from '../store/auth'
import { User, ShieldCheck, Fingerprint, BadgeCheck } from 'lucide-vue-next'

const authStore = useAuthStore()
</script>

<template>
  <div class="flex-1 p-6 md:p-10 overflow-auto" style="background-color: var(--body-bg)">

    <div class="mb-8">
      <h1 class="text-2xl font-bold tracking-tight" style="color: var(--body-text)">{{ $t('profile.title') }}</h1>
      <p class="text-sm mt-1" style="color: var(--sidebar-text)">{{ $t('profile.subtitle') }}</p>
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
  </div>
</template>
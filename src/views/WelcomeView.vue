<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import {
  Landmark, ShieldCheck, LayoutDashboard,
  ExternalLink, Grid3x3, LogOut
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

// ─── App Registry ─────────────────────────────────────────────
// Maps systemCode → app metadata. Add new entries as systems grow.
interface AppEntry {
  systemCode: string
  name: string
  description: string
  icon: any
  color: string          // Tailwind-compatible class prefix
  bgGradient: string     // CSS gradient for card accent
  url: string            // Empty string = internal route
  internalRoute?: string // Vue Router named route
}

const APP_REGISTRY: AppEntry[] = [
  {
    systemCode: 'FAS',
    name: 'Fund Allocation System',
    description: 'Portfolio management & fund distribution platform',
    icon: Landmark,
    color: 'amber',
    bgGradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.05))',
    url: 'http://localhost:3000',
  },
  {
    systemCode: 'MGR',
    name: 'Login Utils MGR',
    description: 'User & role management console',
    icon: ShieldCheck,
    color: 'violet',
    bgGradient: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(109,40,217,0.05))',
    url: 'http://localhost:8081',
  },
  {
    systemCode: 'SUPER_ADMIN',
    name: 'Admin Dashboard',
    description: 'System overview & service monitoring',
    icon: LayoutDashboard,
    color: 'emerald',
    bgGradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.05))',
    url: '',
    internalRoute: 'Dashboard',
  },
]

// ─── Derive visible apps from user roles ──────────────────────
const userSystemCodes = computed(() => {
  const codes = new Set<string>()
  // From roles array
  authStore.roles.forEach((r) => codes.add(r.systemCode))
  // Also include primary role (e.g. SUPER_ADMIN)
  if (authStore.role) codes.add(authStore.role)
  return codes
})

const visibleApps = computed(() =>
  APP_REGISTRY.filter((app) => userSystemCodes.value.has(app.systemCode))
)

// ─── Card colour helpers ──────────────────────────────────────
const iconColorMap: Record<string, string> = {
  amber: '#f59e0b',
  violet: '#8b5cf6',
  emerald: '#10b981',
}

const iconBgMap: Record<string, string> = {
  amber: 'rgba(245, 158, 11, 0.1)',
  violet: 'rgba(139, 92, 246, 0.1)',
  emerald: 'rgba(16, 185, 129, 0.1)',
}

// ─── Navigate ─────────────────────────────────────────────────
function launchApp(app: AppEntry) {
  if (app.internalRoute) {
    router.push({ name: app.internalRoute })
  } else {
    const separator = app.url.includes('?') ? '&' : '?'
    window.location.href = `${app.url}${separator}token=${authStore.token}`
  }
}

function handleLogout() {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <div class="min-h-screen px-4 py-12 md:py-20" style="background-color: var(--body-bg)">
    <div class="max-w-5xl mx-auto">

      <!-- Page Header -->
      <div class="text-center mb-12">
        <div
          class="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
          style="background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.08)); border: 1px solid rgba(16,185,129,0.2)"
        >
          <Grid3x3 class="w-7 h-7 text-emerald-400" :stroke-width="1.5" />
        </div>
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight mb-2" style="color: var(--body-text)">
          App Launcher
        </h1>
        <p class="text-sm" style="color: var(--sidebar-text)">
          Welcome back, <span class="font-medium" style="color: var(--body-text)">{{ authStore.userId || 'User' }}</span>
          · Select a system to continue
        </p>
      </div>

      <!-- App Grid -->
      <div
        v-if="visibleApps.length > 0"
        class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <button
          v-for="app in visibleApps"
          :key="app.systemCode"
          :id="`app-card-${app.systemCode.toLowerCase()}`"
          @click="launchApp(app)"
          class="group relative rounded-xl p-6 text-left transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          :style="{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
          }"
          @mouseenter="(e: MouseEvent) => {
            const el = e.currentTarget as HTMLElement
            el.style.background = app.bgGradient
            el.style.borderColor = iconColorMap[app.color] + '33'
            el.style.transform = 'translateY(-2px)'
            el.style.boxShadow = `0 8px 24px ${iconColorMap[app.color]}15`
          }"
          @mouseleave="(e: MouseEvent) => {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'var(--card-bg)'
            el.style.borderColor = 'var(--card-border)'
            el.style.transform = 'translateY(0)'
            el.style.boxShadow = 'none'
          }"
        >
          <!-- Icon -->
          <div
            class="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
            :style="{ backgroundColor: iconBgMap[app.color] }"
          >
            <component
              :is="app.icon"
              class="w-5 h-5"
              :style="{ color: iconColorMap[app.color] }"
              :stroke-width="1.75"
            />
          </div>

          <!-- Title -->
          <h3 class="text-sm font-semibold mb-1" style="color: var(--body-text)">
            {{ app.name }}
          </h3>

          <!-- Description -->
          <p class="text-xs leading-relaxed mb-4" style="color: var(--sidebar-text)">
            {{ app.description }}
          </p>

          <!-- Launch indicator -->
          <div class="flex items-center gap-1.5 text-xs font-medium" :style="{ color: iconColorMap[app.color] }">
            <span>{{ app.internalRoute ? 'Open' : 'Launch' }}</span>
            <ExternalLink class="w-3 h-3" :stroke-width="2" />
          </div>
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="rounded-xl p-12 text-center"
        style="background-color: var(--card-bg); border: 1px solid var(--card-border)"
      >
        <Grid3x3
          class="w-10 h-10 mx-auto mb-3"
          style="color: var(--sidebar-text); opacity: 0.3"
          :stroke-width="1.5"
        />
        <p class="text-sm font-medium mb-1" style="color: var(--body-text)">No applications available</p>
        <p class="text-xs" style="color: var(--sidebar-text)">
          Contact your administrator to assign system access.
        </p>
      </div>

      <!-- Footer -->
      <div class="mt-12 flex items-center justify-between">
        <p class="text-xs" style="color: var(--sidebar-text)">
          Secured by <span class="font-medium" style="color: var(--body-text)">Login Utils</span> · Identity Provider
        </p>
        <button
          id="welcome-logout-button"
          @click="handleLogout"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors duration-200 cursor-pointer"
          style="color: var(--sidebar-text)"
          @mouseenter="($event.currentTarget as HTMLElement).style.color = '#f87171'"
          @mouseleave="($event.currentTarget as HTMLElement).style.color = 'var(--sidebar-text)'"
        >
          <LogOut class="w-3.5 h-3.5" :stroke-width="2" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  </div>
</template>

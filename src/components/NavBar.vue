<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { LayoutDashboard, UserCircle, LogOut, ShieldCheck } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push({ name: 'Login' })
}

const navItems = [
  { name: 'Dashboard', routeName: 'Dashboard', icon: LayoutDashboard },
  { name: 'Profile', routeName: 'Profile', icon: UserCircle },
]
</script>

<template>
  <nav
    class="sticky top-0 z-40 flex items-center justify-between px-6 py-3 transition-colors duration-200"
    style="background-color: var(--card-bg); border-bottom: 1px solid var(--card-border)"
  >
    <!-- Left: Logo + Nav -->
    <div class="flex items-center gap-6">
      <!-- Logo -->
      <router-link :to="{ name: 'Dashboard' }" class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
          <ShieldCheck class="w-4.5 h-4.5 text-white" :stroke-width="2" />
        </div>
        <div class="hidden sm:block">
          <p class="text-sm font-bold leading-tight" style="color: var(--body-text)">Login Utils</p>
          <p class="text-[10px] leading-tight" style="color: var(--sidebar-text)">Identity Provider</p>
        </div>
      </router-link>

      <!-- Nav Links -->
      <div class="flex items-center gap-1">
        <router-link
          v-for="item in navItems"
          :key="item.routeName"
          :to="{ name: item.routeName }"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200"
          :style="{
            backgroundColor: route.name === item.routeName ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
            color: route.name === item.routeName ? '#34d399' : 'var(--sidebar-text)',
            fontWeight: route.name === item.routeName ? '500' : '400',
          }"
          @mouseenter="(e: MouseEvent) => {
            if (route.name !== item.routeName) {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--input-bg)';
              (e.currentTarget as HTMLElement).style.color = 'var(--body-text)';
            }
          }"
          @mouseleave="(e: MouseEvent) => {
            if (route.name !== item.routeName) {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'var(--sidebar-text)';
            }
          }"
        >
          <component :is="item.icon" class="w-4 h-4 shrink-0" :stroke-width="1.75" />
          <span class="hidden sm:inline">{{ item.name }}</span>
        </router-link>
      </div>
    </div>

    <!-- Right: User + Logout -->
    <div class="flex items-center gap-3">
      <span class="text-xs hidden sm:inline" style="color: var(--sidebar-text)">
        {{ authStore.userId || 'User' }}
      </span>
      <button
        id="nav-logout-button"
        @click="handleLogout"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 cursor-pointer"
        style="color: var(--sidebar-text)"
        @mouseenter="($event.currentTarget as HTMLElement).style.color = '#f87171'"
        @mouseleave="($event.currentTarget as HTMLElement).style.color = 'var(--sidebar-text)'"
      >
        <LogOut class="w-4 h-4" :stroke-width="1.75" />
        <span class="hidden sm:inline">Logout</span>
      </button>
    </div>
  </nav>
</template>

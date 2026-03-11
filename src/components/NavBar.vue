<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { useI18n } from 'vue-i18n'
import { LayoutDashboard, UserCircle, LogOut, ShieldCheck, Grid3x3, Globe } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push({ name: 'Login' })
}

const { t, locale } = useI18n()

// Language Selector Logic
const supportedLocales = [
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' }
]

function switchLanguage(code: string) {
  locale.value = code
}

// Build nav items dynamically based on role
const navItems = computed(() => {
  const items = [
    { name: t('nav.apps'), routeName: 'Welcome', icon: Grid3x3 },
    { name: t('nav.profile'), routeName: 'Profile', icon: UserCircle },
  ]
  if (authStore.isSuperAdmin) {
    items.push({ name: t('nav.dashboard'), routeName: 'Dashboard', icon: LayoutDashboard })
  }
  return items
})
</script>

<template>
  <nav
    class="sticky top-0 z-40 flex items-center justify-between px-6 py-3 transition-colors duration-200"
    style="background-color: var(--card-bg); border-bottom: 1px solid var(--card-border)"
  >
    <!-- Left: Logo + Nav -->
    <div class="flex items-center gap-6">
      <!-- Logo -->
      <router-link :to="{ name: 'Welcome' }" class="flex items-center gap-2.5">
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

    <!-- Right: Language + User + Logout -->
    <div class="flex items-center gap-1 sm:gap-3">
      <!-- Language Switcher -->
      <div class="relative group mr-2">
        <button
          class="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm transition-colors duration-200 cursor-pointer"
          style="color: var(--sidebar-text)"
          @mouseenter="($event.currentTarget as HTMLElement).style.color = 'var(--body-text)'"
          @mouseleave="($event.currentTarget as HTMLElement).style.color = 'var(--sidebar-text)'"
        >
          <Globe class="w-4 h-4" :stroke-width="1.75" />
          <span class="text-xs font-medium uppercase">{{ locale.split('-')[0] }}</span>
        </button>
        <!-- Dropdown Menu -->
        <div 
          class="absolute right-0 top-full mt-1 w-32 py-1.5 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg"
          style="background-color: var(--card-bg); border: 1px solid var(--card-border)"
        >
          <button
            v-for="lang in supportedLocales"
            :key="lang.code"
            @click="switchLanguage(lang.code)"
            class="w-full text-left px-3 py-1.5 text-xs transition-colors duration-150"
            :style="{
              color: locale === lang.code ? '#10b981' : 'var(--body-text)',
              backgroundColor: locale === lang.code ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              fontWeight: locale === lang.code ? '500' : '400'
            }"
            @mouseenter="(e: MouseEvent) => {
              if (locale !== lang.code) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--input-bg)';
            }"
            @mouseleave="(e: MouseEvent) => {
              if (locale !== lang.code) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            }"
          >
            {{ lang.label }}
          </button>
        </div>
      </div>

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
        <span class="hidden sm:inline">{{ $t('nav.logout') }}</span>
      </button>
    </div>
  </nav>
</template>

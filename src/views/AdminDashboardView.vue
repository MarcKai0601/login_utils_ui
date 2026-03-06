<script setup lang="ts">
import { useAuthStore } from '../store/auth'
import {
  LayoutDashboard, ShieldCheck, KeyRound, Server,
  UserPlus, UserCircle, Activity, Database
} from 'lucide-vue-next'

const authStore = useAuthStore()
</script>

<template>
  <div class="flex-1 p-6 md:p-10 overflow-auto" style="background-color: var(--body-bg)">

    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold tracking-tight" style="color: var(--body-text)">Dashboard</h1>
      <p class="text-sm mt-1" style="color: var(--sidebar-text)">Login Utils — Identity Provider Management Console</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8 max-w-6xl">

      <div
        class="rounded-xl p-5 transition-colors duration-200"
        style="background-color: var(--card-bg); border: 1px solid var(--card-border)"
      >
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-medium uppercase tracking-wider" style="color: var(--sidebar-text)">Service</p>
          <Server class="w-4 h-4" style="color: var(--sidebar-text)" :stroke-width="1.75" />
        </div>
        <p class="text-lg font-bold text-emerald-400">Online</p>
        <p class="text-xs mt-1" style="color: var(--sidebar-text)">Identity Provider v2.0</p>
      </div>

      <div
        class="rounded-xl p-5 transition-colors duration-200"
        style="background-color: var(--card-bg); border: 1px solid var(--card-border)"
      >
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-medium uppercase tracking-wider" style="color: var(--sidebar-text)">Auth</p>
          <KeyRound class="w-4 h-4" style="color: var(--sidebar-text)" :stroke-width="1.75" />
        </div>
        <p class="text-lg font-bold" style="color: var(--body-text)">JWT + Redis</p>
        <p class="text-xs mt-1" style="color: var(--sidebar-text)">Token mechanism</p>
      </div>

      <div
        class="rounded-xl p-5 transition-colors duration-200"
        style="background-color: var(--card-bg); border: 1px solid var(--card-border)"
      >
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-medium uppercase tracking-wider" style="color: var(--sidebar-text)">RBAC</p>
          <ShieldCheck class="w-4 h-4" style="color: var(--sidebar-text)" :stroke-width="1.75" />
        </div>
        <p class="text-lg font-bold" style="color: var(--body-text)">{{ authStore.roles.length }}</p>
        <p class="text-xs mt-1" style="color: var(--sidebar-text)">Assigned roles</p>
      </div>

      <div
        class="rounded-xl p-5 transition-colors duration-200"
        style="background-color: var(--card-bg); border: 1px solid var(--card-border)"
      >
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-medium uppercase tracking-wider" style="color: var(--sidebar-text)">Session</p>
          <Activity class="w-4 h-4" style="color: var(--sidebar-text)" :stroke-width="1.75" />
        </div>
        <p class="text-lg font-bold text-emerald-400">Active</p>
        <p class="text-xs mt-1 font-mono truncate max-w-[180px]" style="color: var(--sidebar-text)">
          {{ authStore.token ? authStore.token.slice(0, 16) + '…' : '—' }}
        </p>
      </div>
    </div>

    <!-- Quick Actions + System Info -->
    <div class="grid gap-6 md:grid-cols-2 max-w-6xl">

      <!-- Quick Actions -->
      <div
        class="rounded-xl p-6 transition-colors duration-200"
        style="background-color: var(--card-bg); border: 1px solid var(--card-border)"
      >
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <LayoutDashboard class="w-5 h-5 text-emerald-400" :stroke-width="1.75" />
          </div>
          <div>
            <h2 class="text-sm font-semibold" style="color: var(--body-text)">Quick Actions</h2>
            <p class="text-xs" style="color: var(--sidebar-text)">Common management operations</p>
          </div>
        </div>

        <div class="space-y-2">
          <router-link
            :to="{ name: 'Register' }"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors duration-200"
            style="background-color: var(--input-bg); border: 1px solid var(--card-border); color: var(--body-text)"
            @mouseenter="($event.currentTarget as HTMLElement).style.borderColor = 'var(--input-border)'"
            @mouseleave="($event.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'"
          >
            <UserPlus class="w-4 h-4 text-violet-400 shrink-0" :stroke-width="1.75" />
            <div>
              <p class="font-medium">Add New User</p>
              <p class="text-xs" style="color: var(--sidebar-text)">Register a new identity account</p>
            </div>
          </router-link>

          <router-link
            :to="{ name: 'Profile' }"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors duration-200"
            style="background-color: var(--input-bg); border: 1px solid var(--card-border); color: var(--body-text)"
            @mouseenter="($event.currentTarget as HTMLElement).style.borderColor = 'var(--input-border)'"
            @mouseleave="($event.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'"
          >
            <UserCircle class="w-4 h-4 text-emerald-400 shrink-0" :stroke-width="1.75" />
            <div>
              <p class="font-medium">View Profile</p>
              <p class="text-xs" style="color: var(--sidebar-text)">Check your account and role information</p>
            </div>
          </router-link>
        </div>
      </div>

      <!-- System Architecture -->
      <div
        class="rounded-xl p-6 transition-colors duration-200"
        style="background-color: var(--card-bg); border: 1px solid var(--card-border)"
      >
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
            <Database class="w-5 h-5 text-violet-400" :stroke-width="1.75" />
          </div>
          <div>
            <h2 class="text-sm font-semibold" style="color: var(--body-text)">System Architecture</h2>
            <p class="text-xs" style="color: var(--sidebar-text)">Microservice topology</p>
          </div>
        </div>

        <div class="space-y-3">
          <div
            class="flex items-center justify-between p-3 rounded-lg"
            style="background-color: var(--input-bg); border: 1px solid var(--card-border)"
          >
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span class="text-sm" style="color: var(--body-text)">Login Utils UI</span>
            </div>
            <span class="text-xs font-mono" style="color: var(--sidebar-text)">Vue 3 + Vite</span>
          </div>

          <div
            class="flex items-center justify-between p-3 rounded-lg"
            style="background-color: var(--input-bg); border: 1px solid var(--card-border)"
          >
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-violet-400"></div>
              <span class="text-sm" style="color: var(--body-text)">Login Utils Backend</span>
            </div>
            <span class="text-xs font-mono" style="color: var(--sidebar-text)">Spring Boot</span>
          </div>

          <div
            class="flex items-center justify-between p-3 rounded-lg"
            style="background-color: var(--input-bg); border: 1px solid var(--card-border)"
          >
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-amber-400"></div>
              <span class="text-sm" style="color: var(--body-text)">Fund Allocation System</span>
            </div>
            <span class="text-xs font-mono" style="color: var(--sidebar-text)">Next.js + FastAPI</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ThemeToggle from './components/ThemeToggle.vue'
import NavBar from './components/NavBar.vue'
import { useThemeStore } from './store/theme'
import { useAuthStore } from './store/auth'

// Initialise theme store — applies saved theme class to <html> immediately
useThemeStore()

const route = useRoute()
const authStore = useAuthStore()

// Show NavBar only on authenticated pages (not login/register)
const showNavBar = computed(() => {
  const publicPages = ['Login', 'Register']
  return authStore.isAuthenticated && !publicPages.includes(route.name as string)
})
</script>

<template>
  <NavBar v-if="showNavBar" />
  <router-view />
  <ThemeToggle />
</template>

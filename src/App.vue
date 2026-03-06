<script setup lang="ts">
import ThemeToggle from './components/ThemeToggle.vue'
import { useThemeStore } from './store/theme'

// Initialise theme store — applies saved theme class to <html> immediately
useThemeStore()
</script>

<template>
  <router-view />
  <ThemeToggle />
</template>

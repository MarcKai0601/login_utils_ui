<script setup lang="ts">
import { useThemeStore } from '../store/theme'
import { Sun, Moon } from 'lucide-vue-next'

const themeStore = useThemeStore()
</script>

<template>
  <button
    id="theme-toggle"
    @click="themeStore.toggleTheme()"
    :title="themeStore.theme === 'dark' ? '切換淺色模式' : '切換深色模式'"
    class="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 cursor-pointer hover:scale-110"
    :style="{
      backgroundColor: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      color: 'var(--body-text)',
    }"
  >
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 rotate-90 scale-50"
      enter-to-class="opacity-100 rotate-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 rotate-0 scale-100"
      leave-to-class="opacity-0 -rotate-90 scale-50"
      mode="out-in"
    >
      <Sun
        v-if="themeStore.theme === 'dark'"
        class="w-5 h-5 text-amber-400"
        :stroke-width="1.75"
      />
      <Moon
        v-else
        class="w-5 h-5 text-indigo-400"
        :stroke-width="1.75"
      />
    </Transition>
  </button>
</template>

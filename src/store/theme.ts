import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'dark' | 'light'

export const useThemeStore = defineStore('theme', () => {
    // ─── State ────────────────────────────────────────────────────
    const theme = ref<Theme>(
        (localStorage.getItem('theme') as Theme) || 'dark'
    )

    // ─── Apply class to <html> ────────────────────────────────────
    function applyTheme(t: Theme) {
        const root = document.documentElement
        root.classList.remove('dark', 'light')
        root.classList.add(t)
    }

    // Apply on initialisation
    applyTheme(theme.value)

    // Keep in sync when reactive value changes
    watch(theme, (newTheme) => {
        applyTheme(newTheme)
        localStorage.setItem('theme', newTheme)
    })

    // ─── Actions ──────────────────────────────────────────────────
    function toggleTheme() {
        theme.value = theme.value === 'dark' ? 'light' : 'dark'
    }

    function setTheme(t: Theme) {
        theme.value = t
    }

    return {
        theme,
        toggleTheme,
        setTheme,
    }
})

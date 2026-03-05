import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface RoleInfo {
    roleId: number
    roleName: string
    systemCode: string
}

export const useAuthStore = defineStore('auth', () => {
    // --------------- State ---------------
    const token = ref<string>(localStorage.getItem('token') || '')
    const userId = ref<string>(localStorage.getItem('userId') || '')
    const roles = ref<RoleInfo[]>(JSON.parse(localStorage.getItem('roles') || '[]'))

    // --------------- Getters ---------------
    const isAuthenticated = computed(() => !!token.value)

    // --------------- Actions ---------------
    function login(newToken: string, newUserId: string | number, newRoles: RoleInfo[] = []) {
        token.value = newToken
        userId.value = String(newUserId)
        roles.value = newRoles

        localStorage.setItem('token', newToken)
        localStorage.setItem('userId', String(newUserId))
        localStorage.setItem('roles', JSON.stringify(newRoles))
    }

    function logout() {
        token.value = ''
        userId.value = ''
        roles.value = []

        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('roles')
    }

    return {
        token,
        userId,
        roles,
        isAuthenticated,
        login,
        logout,
    }
})

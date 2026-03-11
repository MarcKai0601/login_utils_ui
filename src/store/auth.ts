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
    const role = ref<string>(localStorage.getItem('role') || '')
    const roles = ref<RoleInfo[]>(JSON.parse(localStorage.getItem('roles') || '[]'))

    // --------------- Getters ---------------
    const isAuthenticated = computed(() => !!token.value)
    const isSuperAdmin = computed(() => role.value === 'SUPER_ADMIN')

    // --------------- Actions ---------------
    function login(newToken: string, newUserId: string | number, newRole: string = 'USER', newRoles: RoleInfo[] = []) {
        token.value = newToken
        userId.value = String(newUserId)
        role.value = newRole
        roles.value = newRoles

        localStorage.setItem('token', newToken)
        localStorage.setItem('userId', String(newUserId))
        localStorage.setItem('role', newRole)
        localStorage.setItem('roles', JSON.stringify(newRoles))
    }

    function logout() {
        token.value = ''
        userId.value = ''
        role.value = ''
        roles.value = []

        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('role')
        localStorage.removeItem('roles')
    }

    return {
        token,
        userId,
        role,
        roles,
        isAuthenticated,
        isSuperAdmin,
        login,
        logout,
    }
})

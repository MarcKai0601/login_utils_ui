// src/version.ts

// Version format: MAJOR.MINOR.PATCH
export const APP_VERSION = '1.0.0'

// A brief description of this release
export const DESCRIPTION = 'App Store UX, i18n & Security Hardening'

export function getFullVersion(): string {

    return `v${APP_VERSION}`
}
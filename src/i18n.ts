import { createI18n } from 'vue-i18n'
import zhTW from './locales/zh-TW.json'
import en from './locales/en.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'

const messages = {
    'zh-TW': zhTW,
    en: en,
    ja: ja,
    ko: ko,
}

const SUPPORTED_LOCALES = ['zh-TW', 'en', 'ja', 'ko']

function getBrowserLocale(): string {
    const userLang = navigator.language || (navigator as any).userLanguage

    // Exact match
    if (SUPPORTED_LOCALES.includes(userLang)) {
        return userLang
    }

    // Language code match (e.g. 'en-US' -> 'en')
    const langCode = userLang.split('-')[0]
    if (SUPPORTED_LOCALES.includes(langCode)) {
        return langCode
    }

    // Default fallback
    return 'zh-TW'
}

const i18n = createI18n({
    legacy: false,           // Use Composition API
    locale: getBrowserLocale(),
    fallbackLocale: 'zh-TW',
    messages,
})

export default i18n

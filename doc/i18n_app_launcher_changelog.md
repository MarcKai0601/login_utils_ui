# Vue i18n 導入與 App Launcher 優化 — 修改紀錄

> **日期**：2026-03-11
> **目的**：全站導入多國語系 (zh-TW, en, ja, ko) 並優化 App Launcher 內部卡片結構。

---

## 修改項目清單

| 類別 | 檔案 | 修改說明 |
| --- | --- | --- |
| **套件** | `package.json` | 新增 `vue-i18n@9` |
| **國際化** | `src/locales/*.json` | [NEW] 建立簡潔的 `zh-TW`、`en`、`ja`、`ko` 翻譯檔 |
| **國際化** | `src/i18n.ts` | [NEW] 初始化 i18n，實作 `navigator.language` 自動偵測與回退到 `zh-TW` 的邏輯 |
| **全域** | `src/main.ts` | 引入並掛載 `app.use(i18n)` |
| **導覽列** | `src/components/NavBar.vue` | 新增 **Language Switcher (語系切換下拉選單)**，支援即時切換。將原先 NavBar 文字改為 `$t(...)` |
| **頁面翻譯**| `src/views/LoginView.vue` | 抽離登入表單文字（包含佔位符 placeholder）替換為 `$t(...)` |
| **頁面翻譯**| `src/views/RegisterView.vue` | 抽離註冊表單文字替換為 `$t(...)` |
| **App Launcher** | `src/views/WelcomeView.vue` | <br>- 抽離 Welcome 開場白與空狀態提示為 `$t(...)`<br>- 修改 `APP_REGISTRY`，移除 `MGR` 外部卡片。<br>- **新增 `Profile` 卡片** (導向 `/profile`)，所有人可見。<br>- **新增 `Admin Dashboard` 卡片** (導向 `/`)，設定為內部路由跳轉。 |

---

## 架構說明

### Vue i18n 結構
在 `src/locales/` 中，定義了扁平化有組織的結構，例如：
```json
{
  "nav": { ... },
  "login": { ... },
  "register": { ... },
  "welcome": { ... },
  "apps": { "fas": {...}, "profile": {...}, "admin": {...} }
}
```

### App Launcher 卡片邏輯
原本外部的 MGR 被移除，取而代之加入了系統內置功能。透過設定 `internalRoute`，點擊這些卡片時會觸發 `router.push({ name: app.internalRoute })` 而非修改 `window.location.href`：
1. **FAS 資金分配系統**: 外部跳轉 (附加 `?token=`)
2. **Profile 個人資料設定**: 內部路由 `/profile`（所有人都有）
3. **Admin Dashboard 系統後台管理**: 內部路由 `/`（僅擁有 `SUPER_ADMIN` 權限者可見）

# Profile 頁面安全性與多國語系升級 — 修改紀錄

> **日期**：2026-03-11
> **目的**：為了消除將 JWT Token 明碼展示於畫面的資安風險，並全面落實系統的國際化 (i18n) 支援，對 `ProfileView.vue` 進行了畫面重構與語系抽象化處理。

---

## 修正與異動項目清單

| 類別 | 檔案 | 修改說明 |
| --- | --- | --- |
| **資安漏洞修復** | `src/views/ProfileView.vue` | 澈底移除了原本介面中用來顯示 `Session Token` / `BEARER TOKEN` 的整塊 `<div class="bg-white rounded-xl...">` 卡片，不留任何顯示原始 Token 的痕跡以確保安全性。 |
| **i18n 介面替換** | `src/views/ProfileView.vue` | 將元件樣板內的靜態英文字串全數移除，導入 Vue i18n 機制。所有標題與欄位名稱（包含 `Profile`, `Account Information`, `Username`, `User ID`, `Status`, `RBAC Role` 等等）皆已替換成動態的 `{{ $t('profile.xxx') }}` 語法。 |
| **多國語系檔擴充** | `src/locales/*.json` | 於 `zh-TW`, `en`, `ja`, `ko` 四份 JSON 語系設定檔中，新增了 `"profile": { ... }` 區塊，建立了 13 個金鑰（如 `title`, `subtitle`, `username`, `status`, `rbacRole`...等等），確保在四種語言互相切換時，Profile 頁面均能無縫顯示對應文案。 |

---

## 預期效果與檢驗方式
1. **安全性驗證**：進入首頁後點擊進入 Profile 頁面，原本左下角的 Session Token 卡片已經完全消失，其餘排版依然保持整齊的 Grid / CSS 設定。
2. **語系切換驗證**：在 NavBar 點擊右上角的語言切換下拉選單，Profile 頁面的所有靜態文字將即刻變換為該語言（繁體中文、英文、日文、韓文），沒有任何寫死的遺漏文字。

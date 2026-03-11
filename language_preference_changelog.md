# 使用者偏好語系功能 (Language Preference) — 修改紀錄

> **日期**：2026-03-11
> **目的**：在註冊頁面提供語系選擇，並於登入後自動依據後端資料切換全站語系介面。

---

## 修改項目清單

| 類別 | 檔案 | 修改說明 |
| --- | --- | --- |
| **API 型別** | `src/api/index.ts` | 於 `LoginResponseData` 與 `RegisterRequestData` 介面中新增可選的 `language` 欄位以對接後端 API。 |
| **狀態管理** | `src/store/auth.ts` | - 於 state 中新增 `language` 並與 `localStorage` 進行雙向綁定。<br>- 更新 `login()` action，支援接收並儲存 `language` 參數。<br>- 更新 `logout()` action 以清除語系暫存。 |
| **在地化語系** | `src/locales/*.json` | 於 `zh-TW.json`, `en.json`, `ja.json`, `ko.json` 檔案中的 `register` 區塊，新增 `"language"` 的翻譯對應字串 (例如「語言偏好 (選填)」)。 |
| **登入頁面**| `src/views/LoginView.vue` | - 在取得 API 回傳之使用者資料後，將 `data.language` 傳入 `authStore.login()`。<br>- 同步引入 `useI18n`，若偵測到回傳含有 `language` 偏好，立即透過 `locale.value = data.language` 切換介面語系。 |
| **註冊頁面**| `src/views/RegisterView.vue` | - 新增 `languagePref` 變數綁定使用者的選擇，預設值初始化為當前瀏覽器偵測語系 (`locale.value`)。<br>- 於表單中新增下拉選單 `<select>`，讓使用者手動切換四種支援語言。<br>- 在發送 `authApi.register` 請求時，將該選項一併附加至 Payload 中。 |

---

## 功能測試與驗證項目
1. **註冊流程**：進入 `/register`，檢查「語言偏好 (選填)」欄位是否預設呈現對應的瀏覽器語系，並測是否能正常選取。
2. **登入流程**：使用帶有 `language` 偏好設定的帳號登入，確認登入成功後，`NavBar` 下拉選單與頁面文字是否能瞬間無縫切換。

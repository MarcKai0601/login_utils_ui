# 忘記密碼與 Email 註冊功能 — 修改紀錄

> **日期**：2026-03-19
> **目的**：配合後端升級，提供「以 Email 為主」的身分驗證機制。註冊時強制綁定 Email，並於登入頁提供「忘記密碼 (發送新密碼至信箱)」的功能。

---

## 異動項目清單

| 類別 | 檔案 | 修改說明 |
| --- | --- | --- |
| **API 介面** | `src/api/index.ts` | 1. 於 `RegisterRequestData` 新增 `email: string` (必填)。<br>2. 新增 `forgotPassword` 呼叫 `POST /api/v1/auth/forgot-password`。 |
| **註冊頁** | `src/views/RegisterView.vue` | 1. 新增 **Email** 輸入框 (加上正則表達式驗證與必填防護)。<br>2. 攔截 API 回傳的 `EMAIL_ALREADY_EXISTS`，並透過 i18n 轉譯顯示友善錯誤。 |
| **登入頁** | `src/views/LoginView.vue` | 1. **Username or Email**：帳號欄位 Label 更新，支援 Email 輸入。<br>2. **Forgot Password?** 按鈕：加在密碼輸入框上方。<br>3. **Reset Password Modal**：實作一個優雅的彈出視窗，輸入信箱即可發送重設密碼請求。<br>4. **錯誤攔截**：捕捉 `USER_NOT_FOUND` (找不到信箱) 與 `PWD_RESET_LIMIT_EXCEEDED` (次數限制，30天上限3次)，顯示友善警語。 |
| **多國語系** | `src/locales/*.json` | 對 `zh-TW`, `en`, `ja`, `ko` 四個語系檔補充上述所有新 UI 元素與後端錯誤碼之轉譯文本（`errors.*`, `login.resetPassword*` 等）。 |

---

## 防護機制說明 (Security)
* **API 頻率限制 (Rate Limiting)**：忘記密碼功能受限於 **30天內最多重設3次**。超過時 UI 會自動捕捉 `PWD_RESET_LIMIT_EXCEEDED` 錯誤，要求使用者聯絡客服或稍候再試。
* **無縫跨界**：與先前的 SSO `window.location.href` 重導邏輯和 Auth 全局攔截器完美相容。

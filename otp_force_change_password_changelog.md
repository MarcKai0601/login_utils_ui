# OTP 一次性密碼強制改密碼機制 — 前端修改紀錄

> **日期**：2026-03-19
> **目的**：配合後端 `is_temp_password` flag，在前端實作「登入後強制修改密碼」的完整流程，確保 OTP 一次性密碼使用者在改密碼前無法操作系統。

---

## 異動項目清單

| 類別 | 檔案 | 修改說明 |
| --- | --- | --- |
| **API 型別** | `src/api/index.ts` | `LoginResponseData` 新增 `is_temp_password?: number` 欄位。 |
| **Pinia 狀態** | `src/store/auth.ts` | 新增 `isTempPassword` 響應式狀態，與 `localStorage` 同步。`login()` action 接受第7個參數。`logout()` 一併清除。 |
| **登入邏輯** | `src/views/LoginView.vue` | 登入成功後檢查 `is_temp_password` flag：<br>- 若為 `1`：強制導向 Profile 頁面。<br>- 若有 SSO redirect，先暫存至 `localStorage('pending_sso_redirect')` 待修改密碼後再跳轉。 |
| **路由守衛** | `src/router/index.ts` | 新增 OTP 守衛 (規則 #2)：`isTempPassword` 為 `true` 時，僅允許存取 `Profile` 和 `Login`，其餘路由強制導向 Profile。 |
| **個人資料** | `src/views/ProfileView.vue` | - `onMounted` 自動彈出密碼修改 Modal。<br>- Modal **不允許關閉**（`closePasswordModal` 被攔截）。<br>- 頁面頂部顯示 **琥珀色 OTP 警告橫幅**。<br>- 改密碼成功後：清除 `isTempPassword` → 檢查暫存 SSO redirect → 跳轉或登出。 |
| **多國語系** | `src/locales/*.json` | 四國語系新增 `profile.otpWarningTitle` 與 `profile.otpWarningDesc`。 |

---

## 流程圖

```
[使用者忘記密碼]
    ↓
[收到 OTP Email]
    ↓
[用 OTP 登入] → API 回傳 is_temp_password = 1
    ↓
[LoginView 攔截] → 暫存 SSO redirect → 強制導向 /profile
    ↓
[ProfileView] → 自動彈出密碼修改 Modal (不可關閉)
    ↓              ↑ (顯示琥珀色 OTP 警告橫幅)
    ↓
[修改密碼成功] → 清除 isTempPassword 旗標
    ↓
[有暫存 SSO?] ─── 是 → 跳轉回外部系統
              └── 否 → 登出重新登入
```

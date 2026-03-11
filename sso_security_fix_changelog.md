# SSO 安全性修補 — 修改紀錄

> **日期**：2026-03-11
> **目的**：修補 SSO 的兩項安全性漏洞，包含登出不完全導致舊 Session 殘留，以及缺乏全局路由守衛使得特定頁面可能繞過驗證。

---

## 修正項目清單

| 類別 | 檔案 | 修改說明 |
| --- | --- | --- |
| **強制登出機制** | `src/views/LoginView.vue` | 於 Vue `<script setup>` 頂層無條件引入並呼叫 **`authStore.logout()`**。確保所有抵達 `/login` 的使用者（無論是點擊登出回來，或者是手動輸入網址，甚至瀏覽器上一頁返回），舊有的 `localStorage` Token 與 Pinia 的暫存狀態都會被絕對且乾淨地清除。 |
| **全域路由守衛** | `src/router/index.ts` | - 棄用了原先部分依賴 `meta.requiresAuth` 的單點防護。<br>- 引入了全域排除名單 `publicPages = ['/login', '/register']`，所有不在名單上的 `to.path` 均視為 `authRequired`。<br>- 在 `router.beforeEach` 內只要是需要登入的頁面且 `!authStore.token` 為真，就無條件防護並 `next('/login')`。<br>- 同時也完整保留了針對 `meta.requiresSuperAdmin` 的權限覆核邏輯。 |

---

## 預期達成效果
1. **防禦力升級**：系統將預設採用「白名單制 (Default-Deny)」，除了明訂的 `/login` 與 `/register`，未來新增的「所有頁面」都會自動受到保護，不會再遺漏 `meta` 標籤而造成漏洞。
2. **Session 安全**：解決與外部系統跳轉時，可能會發生舊的使用者狀態滯留在本機的問題。只要看到登入畫面，系統狀態就保證是清空的。

# Axios 全域 401 攔截器優化 — 修改紀錄

> **日期**：2026-03-12
> **目的**：解決當後端 Redis Token 已經過期失效，但前端 `localStorage` 仍殘留舊 Token 時，Vue Router 的前置防護無法識別失效 Token 而誤判放行的問題。透過 Axios 回應攔截器 (Response Interceptor) 在遇到 401 Unauthorized 時主動並強制登出使用者以確保系統安全。

---

## 異動項目清單

| 類別 | 檔案 | 修改說明 |
| --- | --- | --- |
| **全域請求攔截** | `src/api/index.ts` | 調整了 `apiClient.interceptors.response.use` 中錯誤處理 (Error Handler) 的 401 邏輯：<br><br>1. **狀態清除**：當偵測到回傳 `status === 401` 時，呼叫 `authStore.logout()` 徹底清除 Pinia 以及 localStorage 內已經不具有效力的錯誤 Token 與帳號資訊。<br>2. **逾期提示**：加入了原生的 `alert('登入已逾期，請重新登入...')` 用來提醒使用者當前 Session 已中斷（可配合未來導入的 Toast/UI 元件進行升級替換）。<br>3. **強制重導向**：將原先的 `router.push('/login')` **改為原生的 `window.location.href = '/login'`**。這麼做除了可以強制中輟整個單頁應用 (SPA) 正在跑的殘餘非同步流，還能讓頁面與 Vue 實體完全重新載入並初始化，確保跳轉至 `/login` 時狀態是 100% 乾淨的。 |

---

## 預期達成效果
只要有任何 API (包含首頁加載時自動觸發的驗證或資料獲取) 收到了後端的 401 拒絕存取，前端就會立刻出現「登入已逾期」的提示，並強制回到登入頁。不再發生因為 Token 未清空導致卡在 WelcomeView 但畫面無資料的狀況了。

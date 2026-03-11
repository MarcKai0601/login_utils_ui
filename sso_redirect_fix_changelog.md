# SSO 跨系統跳轉邏輯修正 — 修改紀錄

> **日期**：2026-03-11
> **目的**：修正 `LoginView.vue` 登入成功處理外部 `redirect` 參數時，因為字串相加導致參數不斷疊加甚至無法正確路由到其他前端專案 (例如 React 專案) 的問題。

---

## 修改項目

| 類別 | 檔案 | 修改說明 |
| --- | --- | --- |
| **跳轉邏輯** | `src/views/LoginView.vue` | - **移除了原先脆弱的字串拼接** (`redirectUrl.value.includes('?') ? '&' : '?'`)。<br>- **導入原生 `URL` 物件解析**：利用 `new URL(redirectUrl.value, window.location.origin)` 將字串轉換為正規網址，能自動相容絕對路徑 (`http://...`) 或是帶有根目錄的相對路徑。<br>- **安全的參數安插**：改用 `targetUrl.searchParams.set('token', data.token)` 寫入 Token，這能防止網址重複出現同名 Token 參數不斷疊加造成黑洞。<br>- **強制原生換頁**：最後藉由賦值 `window.location.href = targetUrl.toString()` 來觸發瀏覽器級別的跨域導航，捨棄了在外部跳轉時仰賴（且不適用）的 Vue Router 虛擬路由流。 |

---

## 期望效果與驗證方法
1. 若從外部系統 (如 `http://localhost:3000`) 請求保護頁面而被引導至 SSO (例如 `http://localhost:5174/login?redirect=http://localhost:3000`)。
2. 在 SSO 介面登入成功後。
3. 頁面將會被強制且乾淨地**直接換頁導向** `http://localhost:3000/?token=abc123xxx`，不會發生在原網址重複疊加 Token 或停留在 SSO 子系統內的問題。

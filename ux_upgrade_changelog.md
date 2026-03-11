# App Store UX 體驗升級 — 修改紀錄

> **日期**：2026-03-11
> **目的**：優化登入後的系統大廳 (`WelcomeView`) UX，轉換為具有擴充彈性的「應用程式商店」模式，並調整導覽列以顯示使用者名稱來提升親切感。

---

## 狀態與 API 資料流修改

| 類別 | 檔案 | 修改說明 |
| --- | --- | --- |
| **API** | `src/api/index.ts` | 於 `LoginResponseData` 介面中新增可選欄位 `username?: string`。 |
| **狀態管理** | `src/store/auth.ts` | - 於 state 中新增 `username` 並與 `localStorage` 進行綁定。<br>- 更新 `login()` action，將 `username` 作為第三個參數傳入並持久化。<br>- 在 `logout()` action 補上清除 `username` 相關暫存。 |
| **登入邏輯** | `src/views/LoginView.vue` | 登入成功時，不再只寫入 `userId`，同時也將 API 回傳的 `data.username` (或登入表單輸入的 `username.value`) 傳入 `authStore.login()` 內。 |

---

## UI 元件與視圖升級

| 類別 | 檔案 | 修改說明 |
| --- | --- | --- |
| **導覽列** | `src/components/NavBar.vue` | 替換原先顯示的 `authStore.userId` 為 `authStore.username` (若無值則 Fallback 顯示 'User')。 |
| **系統大廳** | `src/views/WelcomeView.vue` | <ul class="list-disc pl-5"><li>**標題文案**：將副標題 `{{ authStore.userId || 'User' }}` 抽換為 `{{ authStore.username || 'User' }}`。</li><li>**權限解析重構**：原先會利用 `filter` 隱藏無權限的系統卡片。現在改以 `map` 操作走訪 `APP_REGISTRY`，並給所有系統附加 `hasAccess: boolean` 屬性 (`allAppsWithAccess`)。</li><li>**九宮格動態樣式**：<br>- 擁有權限：維持原本的彩色主題、浮動位移、陰影效果，並保留「開啟 (Launch / Open)」按鈕。<br>- 無權限：將卡片加上 `opacity-70 grayscale cursor-default`，並且透過事件攔截，關閉滑鼠 Hover 動畫。<br>- 無權限按鈕：更換圖示為底線鎖頭 (`Lock`)，文字改為「申請開通 (Request Access)」。</li><li>**API 預留**：新增 `requestAccess(systemCode)` 處理函式，目前以 `alert()` 方式提示「已送出權限申請」，供未來與後端 API 串接審核流。</li></ul> |

---

## 驗收重點
1. **導覽列顯示**：成功登入後，右上角的使用者資訊應從生硬的數字/ID，變更為註冊時填寫的帳號名稱。
2. **App Store 卡片渲染**：若使用非超級管理員帳號 (`USER`) 登入，`FAS` 等未獲授權的外部系統不應消失，而是呈現灰黑鎖定狀態。點擊「申請開通」不會執行跳轉，而是跳出彈窗提示。

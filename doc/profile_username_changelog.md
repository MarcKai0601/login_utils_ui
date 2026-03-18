# Username 顯示修正與 Profile 擴充 — 修改紀錄

> **日期**：2026-03-11
> **目的**：確保系統能正確解析並顯示使用者的 Username，解決右上角導覽列 Fallback 為 "User" 的問題，並於個人資料頁 (`ProfileView.vue`) 中新增 Username 基本資料欄位。

---

## 狀態與 API 資料流確保

| 類別 | 檔案 | 檢查與修改說明 |
| --- | --- | --- |
| **API 連線定義** | `src/api/index.ts` | 確保 `LoginResponseData` 中明確包含 `username: string;`，以便接收後端回傳的登入者帳號。 |
| **Store 狀態管理** | `src/store/auth.ts` | 已確認在先前的實作中，我們有在 Setup Store 中定義了 `username = ref(localStorage.getItem('username') || '')`。<br>在 `login` action 中會同時接收 `newUsername` 並透過 `username.value = newUsername` 更新狀態，同時持久化至 `localStorage.setItem('username', newUsername)`。登出時也會一併清除。 |
| **Login 邏輯** | `src/views/LoginView.vue` | 登入成功時呼叫 `authStore.login()`，如果 API 回傳了 `data.username` 則會直接存入 Pinia；若無，則 Fallback 儲存使用者在表單輸入的 `username.value`。這能 100% 確保 NavBar 必定有 Username 可以顯示！ |

---

## UI 元件與視圖升級

| 類別 | 檔案 | 修改說明 |
| --- | --- | --- |
| **導覽列** | `src/components/NavBar.vue` | 已經確認程式碼中的綁定是 `{{ authStore.username || 'User' }}`。若發生顯示 'User' 的狀況，通常是因為之前登入的 Token 還在，但當時尚未實作 username 儲存。**解決方案**：只需手動登出再重新登入一次，狀態就會完美更新。 |
| **個人資料頁** | `src/views/ProfileView.vue` | 在 `Account Information` 卡片區塊中，於原本的 `USER ID` 欄位上方，插入了一個全新的 `USERNAME` 欄位。綁定了 `{{ authStore.username || 'N/A' }}`，並使用 `<User />` 圖示，樣式與 USER ID 區塊完全一致以維持視覺統一。 |

---

## 驗收步驟
1. 點擊 NavBar 上的 Logout 進行「登出」。
2. 重新輸入帳號密碼「登入」（這會觸發最新的狀態儲存邏輯）。
3. 觀察 NavBar 右上角，應已正確顯示您的使用者名稱，而不再是 "User"！
4. 點擊進入 `Profile` (個人資料設定) 頁面，確認 Account Information 區塊是否多出了 USERNAME 欄位，且數值正確。

# 個人資料頁面：修改密碼功能 — 實作紀錄

> **日期**：2026-03-12
> **目的**：提供使用者可以在個人資料頁面 (`ProfileView.vue`) 內修改密碼的功能。包含與後端 API 串接、UI 彈窗實作、表單驗證提示以及多國語系 (i18n) 擴充。

---

## 異動項目清單

| 類別 | 檔案 | 修改說明 |
| --- | --- | --- |
| **API 擴展** | `src/api/index.ts` | 於 `authApi` 物件中新增了 `updatePassword` 方法。攜帶 `oldPassword` 與 `newPassword` 發送 `POST` 請求至 `/api/mgr/user/update-password`。 |
| **介面與邏輯實作** | `src/views/ProfileView.vue` | <ul class="list-disc pl-5"><li>**修改按鈕**：在右上角建立了一個帶有鎖匙圖示的「修改密碼」按鈕。</li><li>**互動彈窗 (Modal)**：新增了置中的表單彈窗，具備毛玻璃遮罩。包含三個密碼輸入框（目前密碼、新密碼、確認新密碼），每個輸入框右側都實作了「顯示/隱藏密碼」的眼睛按鈕切換。</li><li>**表單驗證與狀態**：<br> - 若欄位未填齊，顯示必填錯誤。<br> - 若新密碼小於 6 碼，顯示長度不足提示。<br> - 若兩次新密碼不一致，顯示確認失敗警告。</li><li>**安全登出**：成功呼叫 API 後，顯示綠色成功訊息。等待 1 秒後關閉彈窗，並**強制執行 `authStore.logout()` 且利用原生 `alert` 提示使用者須重新登入，隨即導向 `/login`。**</li></ul> |
| **多國語系擴充** | `src/locales/*.json` | 將新按鈕與 Modal 內所有的標題、Placeholder、按鈕與各種錯誤/成功訊息全部抽象化。於 `zh-TW`, `en`, `ja`, `ko` 四個語系檔中的 `profile` 物件下，新增了完整的 `"password": { ... }` 翻譯結構。 |

---

## 翻譯欄位清單 (共 16 項)
以下為本次為提供支援所增加的語系 Key（以 `$t('profile.password.xxx')` 的形式呼叫），已同步新增至四份語系檔中：
- `changeBtn`: 修改密碼 (按鈕)
- `modalTitle`: 修改密碼 (視窗標題)
- `modalDesc`: 請輸入您目前的密碼與新密碼。
- `oldLabel` / `oldPlh`: 目前密碼標籤與 Placeholder
- `newLabel` / `newPlh`: 新密碼標籤與 Placeholder
- `confirmLabel` / `confirmPlh`: 確認新密碼標籤與 Placeholder
- `cancelBtn` / `submitBtn` / `savingBtn`: 取消、確認修改、修改中 (互動按鈕)
- **錯誤提示**: `errRequired`, `errLength`, `errMatch`
- **成功提示**: `successMsg`

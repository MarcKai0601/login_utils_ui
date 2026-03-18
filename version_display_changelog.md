# 前端版本號建置 — 修改紀錄

> **日期**：2026-03-18
> **目的**：統一前端版本號管理。參照 Fund-Allocation-System 的 `lib/version.ts` 風格，採用扁平常數匯出。同時串接後端 `GET /api/v1/system/version` API，在導覽列同時顯示前端與後端的版本號（僅版本號，不帶日期）。

---

## 異動項目清單

| 類別 | 檔案 | 修改說明 |
| --- | --- | --- |
| **版本常數** | `src/version.ts` | 採用 FAS 風格的扁平匯出（`APP_VERSION`, `DESCRIPTION`, `getFullVersion()`），不含日期欄位。 |
| **API 擴充** | `src/api/index.ts` | 新增 `systemApi.getVersion()` 方法，發送 `GET /api/v1/system/version` 請求，回傳後端的版本號。 |
| **導覽列** | `src/components/NavBar.vue` | - 在 `onMounted` 時非同步呼叫 `systemApi.getVersion()` 取得後端版本。<br>- 在左上角 Logo 下方顯示兩個版本徽章：<br>  ✅ **FE 徽章**（翡翠綠漸層）：`FE v1.0.0`<br>  ✅ **BE 徽章**（靛藍漸層）：`BE vX.X.X`（僅在 API 回應成功時顯示）。 |
| **登入頁** | `src/views/LoginView.vue` | 底部 footer 以低透明度等寬字體顯示前端版本號。 |

---

## 使用方式
- **前端版本號**：修改 `src/version.ts` 中的 `APP_VERSION`。
- **後端版本號**：修改後端 `application.properties` 的 `system.mgr.version` 屬性，前端會自動從 API 讀取。

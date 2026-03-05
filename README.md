# Login Utils UI — SSO 登入前端

> **login-utils** 微服務專屬的 SSO (Single Sign-On) 統一登入頁面，作為 Identity Provider 的前端入口。

---

## 📌 專案定位

本專案在整體微服務生態系統中扮演 **Identity Provider 前端**角色：

```
┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
│   業務系統 (FAS)       │      │  Login Utils UI       │      │  Login Utils Backend  │
│   localhost:3000      │◄────▶│  localhost:5173       │─────▶│  localhost:8080       │
│                      │      │  (本專案)              │      │  (Java / Spring Boot)  │
│  Fund Allocation     │      │  Vue 3 + Vite         │      │  JWT Token 簽發        │
│  System              │      │  SSO Login Page       │      │  帳號驗證              │
└──────────────────────┘      └──────────────────────┘      └──────────────────────┘
```

### SSO 登入流程

```
1. 使用者訪問業務系統 (FAS) → 發現未登入
2. 業務系統 Redirect → http://localhost:5173/login?redirect=http://localhost:3000
3. 使用者在 Login Utils UI 輸入帳號密碼
4. 前端呼叫 POST /api/login → 取得 JWT Token
5. 前端將 Token 存入 Pinia + localStorage
6. Redirect 回業務系統 → http://localhost:3000?token=<jwt>
7. 業務系統收到 Token → 驗證後允許存取
```

---

## 🛠 技術棧

| 類別 | 技術 | 選擇理由 |
|---|---|---|
| **核心框架** | Vue 3 + TypeScript | Composition API + `<script setup>` 語法糖，型別安全 |
| **建置工具** | Vite | 極速 HMR，原生 ESM 支援 |
| **路由** | Vue Router 4 | SPA 路由 + 導航守衛 |
| **狀態管理** | Pinia | 輕量且型別友好，取代 Vuex |
| **HTTP** | Axios | 攔截器機制完善，自動帶 Token |
| **樣式** | Tailwind CSS | 與 FAS 前端統一的 Utility-First 方法 |
| **圖標** | lucide-vue-next | 與 FAS 的 lucide-react 同一套圖標庫 |

---

## 📁 專案結構

```
src/
├── main.ts              # 應用程式進入點：註冊 Pinia、Vue Router
├── App.vue              # 根元件：<router-view />
├── style.css            # 全域樣式：CSS 變數主題系統（與 FAS 一致）
│
├── api/
│   └── index.ts         # Axios 實例 + 攔截器 + authApi
│
├── store/
│   └── auth.ts          # Pinia Auth Store（token / userId / roles）
│
├── router/
│   └── index.ts         # 路由定義 + 認證守衛
│
├── views/
│   ├── LoginView.vue    # SSO 登入頁面（核心）
│   └── WelcomeView.vue  # 登入成功歡迎頁
│
└── components/          # 可擴充元件目錄
```

---

## 💡 開發思路與設計決策

### 1. 為什麼獨立前端而非嵌入後端？

login-utils 是一個 **跨業務系統的 Identity Provider**，不屬於任何單一業務系統。獨立前端可以：
- 被多個業務系統共用同一個登入入口
- 獨立部署、獨立版本控制
- 前後端完全解耦，後端只需提供 REST API

### 2. CSS 變數主題系統（與 FAS 對齊）

為了讓使用者在 Login Utils 和 Fund Allocation System 之間切換時有一致的視覺體驗，我們採用了與 FAS **完全相同的 CSS 變數命名**：

```css
--body-bg      /* 頁面背景 */
--card-bg      /* 卡片背景 */
--card-border  /* 卡片邊框 */
--input-bg     /* 輸入框背景 */
--input-border /* 輸入框邊框 */
--sidebar-text /* 次要文字 */
```

主色調統一使用 **Emerald-500** (`#10b981`)，與 FAS 的按鈕、圖標積極色一致。

### 3. Axios 攔截器設計

- **Request**：自動從 Pinia 讀取 Token → 注入 `Authorization: Bearer <token>`
- **Response**：攔截 401 → 自動執行 `logout()` → 導向 `/login`

這讓業務邏輯完全不需要關心認證狀態，與 FAS 的攔截器模式一模一樣。

### 4. SSO Redirect 安全考量

登入成功後，Token 以 Query Parameter 傳回業務系統：

```
http://localhost:3000?token=<jwt>
```

> ⚠️ **生產環境建議**：應改為 POST + HttpOnly Cookie 或 Authorization Code Flow，避免 Token 出現在 URL / 瀏覽器歷史記錄中。目前簡化流程適用於內部開發環境。

### 5. localStorage 持久化策略

Pinia Store 初始化時自動從 `localStorage` 讀取 Token，避免頁面重新整理後狀態遺失。Logout 時同步清除 State 和 localStorage。

---

## 🚀 快速開始

### 安裝與啟動

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 生產建置
npm run build
```

### 環境變數

```env
# .env
VITE_API_URL=http://localhost:8080
```

| 變數 | 說明 | 預設值 |
|---|---|---|
| `VITE_API_URL` | Java 後端 API 根路徑 | `http://localhost:8080` |

---

## 🔗 後端 API 對接

| 項目 | 說明 |
|---|---|
| **端點** | `POST /api/login` |
| **Request Body** | `{ "username": "string", "password": "string" }` |
| **Response** | `{ "code": "200", "message": null, "data": { "token": "jwt...", "userId": 1 } }` |
| **Response Header** | `Authorization: Bearer <token>` |
| **後端 Repository** | [MarcKai0601/login_utils](https://github.com/MarcKai0601/login_utils/tree/antigravity) |

---

## 🌐 關聯專案

| 專案 | 角色 | 技術 |
|---|---|---|
| [login-utils](https://github.com/MarcKai0601/login_utils) | Identity Provider (Backend) | Java / Spring Boot / MyBatis |
| **login-utils-ui (本專案)** | Identity Provider (Frontend) | Vue 3 / Vite / TypeScript |
| [Fund-Allocation-System](https://github.com/MarcKai0601/Fund-Allocation-System) | 業務系統 | Next.js / FastAPI / PostgreSQL |

---

## 📅 開發歷程

### v1.0 — 初始版本
- 使用 Vite + Vue 3 + TypeScript 搭建專案骨架
- 整合 Tailwind CSS、Vue Router 4、Pinia、Axios
- 實作 Pinia Auth Store（token / userId / roles + localStorage 持久化）
- 封裝 Axios 攔截器（Request Token 注入 + Response 401 處理）
- 實作 SSO 登入頁面（`?redirect=` 參數解析 → 登入成功後帶 Token 跳轉）
- 實作歡迎頁面（無 redirect 時的 fallback）
- 路由守衛（未認證 → 導向 /login）
- 風格對齊 FAS 前端：Emerald 主色、CSS 變數主題、卡片式佈局

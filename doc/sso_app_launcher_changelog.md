# SSO 跳轉邏輯 + App Launcher — 修改紀錄

> **日期**：2026-03-10
> **目的**：完善 SSO 登入跳轉邏輯，將 WelcomeView 改造為「應用程式啟動器 (App Launcher)」

---

## 背景

登入成功後的跳轉行為統一為兩種路徑：
1. **有 `?redirect=` 參數** → Token 附加為 Query String，`window.location.href` 跳轉至外部系統
2. **無 `redirect` 參數** → 導向 `/welcome` App Launcher 首頁

App Launcher 根據用戶 `roles[]` 中的 `systemCode` 動態顯示可存取的系統卡片。

---

## 修改檔案清單

### 1. `src/store/auth.ts`
| 項目 | 變更 |
|------|------|
| State | 復原 `roles: RoleInfo[]` (ref + localStorage) |
| Getter | 復原 `isSuperAdmin` (computed) |
| `login()` | 新增 `newRoles` 參數 → 寫入 state + localStorage |
| `logout()` | 清除 `roles` state + localStorage |
| Return | 導出 `roles`、`isSuperAdmin` |

### 2. `src/api/index.ts`
- `LoginResponseData` 新增 `roles: RoleInfo[]` 欄位
- Import `RoleInfo` type from `store/auth`

### 3. `src/views/LoginView.vue`
- 登入成功後傳遞 `data.roles` 給 `authStore.login()`
- **有 `redirect`** → 附帶 `?token=` 跳轉至外部系統（保留原邏輯）
- **無 `redirect`** → `router.push({ name: 'Welcome' })` 取代原本的 Dashboard/Profile 判斷

### 4. `src/router/index.ts`
- 新增 `/welcome` 路由（`name: 'Welcome'`，`requiresAuth: true`）
- Dashboard 路由保留 `requiresSuperAdmin: true`
- RBAC 守衛：角色不符時導向 Welcome（取代 Profile）

### 5. `src/views/WelcomeView.vue` **（完全重寫）**
- 內建 `APP_REGISTRY` 系統對應表：

| systemCode | 系統名稱 | URL | 跳轉方式 |
|---|---|---|---|
| `FAS` | Fund Allocation System | `http://localhost:3000` | 外部 + token |
| `MGR` | Login Utils MGR | `http://localhost:8081` | 外部 + token |
| `SUPER_ADMIN` | Admin Dashboard | 內部路由 `/` | `router.push` |

- 根據 `authStore.roles` 的 `systemCode` 過濾可見卡片
- CSS Grid 九宮格版面（`sm:grid-cols-2 lg:grid-cols-3`）
- 卡片 hover 漸變效果 + 浮起動畫
- 空狀態提示 + 登出按鈕

### 6. `src/components/NavBar.vue`
- 新增 **Apps** 導覽連結（指向 Welcome 頁面）
- Logo 點擊統一導向 `/welcome`
- Dashboard 連結僅 SUPER_ADMIN 可見

---

## 跳轉流程

```
登入成功
  ├── route.query.redirect 存在
  │     └── window.location.href = redirect + ?token=xxx
  └── 無 redirect
        └── router.push('/welcome')  → App Launcher
              ├── 點擊外部系統卡片 → window.location.href = url + ?token=xxx
              └── 點擊 Admin Dashboard → router.push('/')
```

## 路由表

| Path | Name | requiresAuth | requiresSuperAdmin | 說明 |
|------|------|:---:|:---:|------|
| `/login` | Login | ❌ | ❌ | 登入頁 |
| `/register` | Register | ❌ | ❌ | 註冊頁 |
| `/welcome` | Welcome | ✅ | ❌ | App Launcher |
| `/` | Dashboard | ✅ | ✅ | Admin Dashboard |
| `/profile` | Profile | ✅ | ❌ | 個人資料 |

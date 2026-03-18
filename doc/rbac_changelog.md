# RBAC Route Guard — 修改紀錄

> **日期**：2026-03-06  
> **目的**：根據後端登入回傳的 `role` 欄位，實作前端 RBAC 路由守衛

---

## 背景

後端登入 API (`POST /api/login`) 回傳格式更新，`response.data.data` 新增 `role` 欄位：
- `'SUPER_ADMIN'` — 超級管理員
- `'USER'` — 一般使用者

前端需攔截角色不符的頁面存取。

---

## 修改檔案清單

### 1. `src/api/index.ts`
- `LoginResponseData` 介面新增 `role: string` 欄位

### 2. `src/store/auth.ts`
| 項目 | 變更 |
|------|------|
| State | 新增 `role` (ref + localStorage) |
| Getter | 新增 `isSuperAdmin` (computed) |
| `login()` | 新增 `newRole` 參數 → 寫入 state + localStorage |
| `logout()` | 清除 `role` state + localStorage |
| Return | 導出 `role`、`isSuperAdmin` |

### 3. `src/views/LoginView.vue`
- `authStore.login(data.token, data.userId)` → `authStore.login(data.token, data.userId, data.role || '')`
- 登入後跳轉邏輯：SUPER_ADMIN → `/` (Dashboard)，其他 → `/profile`

### 4. `src/router/index.ts`
- Dashboard 路由 meta 新增 `requiresSuperAdmin: true`
- `beforeEach` 守衛新增 RBAC 檢查：
  1. 未登入 → `/login`
  2. 需要 SUPER_ADMIN 但角色不符 → `/profile`

### 5. `src/components/NavBar.vue`
- `navItems` 改為 computed，僅 SUPER_ADMIN 顯示 Dashboard 連結
- Logo 連結依角色動態指向 Dashboard 或 Profile

---

## 守衛流程

```
使用者存取頁面
  ├── requiresAuth && 未登入 → 導向 /login
  ├── requiresSuperAdmin && role !== 'SUPER_ADMIN' → 導向 /profile
  └── 通過 → 進入頁面
```

## 受影響路由

| Path | requiresAuth | requiresSuperAdmin | 說明 |
|------|:---:|:---:|------|
| `/login` | ❌ | ❌ | 登入頁 |
| `/register` | ❌ | ❌ | 註冊頁 |
| `/` | ✅ | ✅ | Dashboard（僅 SUPER_ADMIN） |
| `/profile` | ✅ | ❌ | 個人資料（所有角色） |

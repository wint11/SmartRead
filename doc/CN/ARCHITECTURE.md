# 系统架构设计

## 概述
SmartRead 是一个基于 **Next.js 16 (App Router)** 框架构建的全栈 Web 应用。它将传统的小说阅读/创作内容管理系统 (CMS) 与集成的 CTF (Capture The Flag) 环境完美结合。

## 技术栈

### 前端 (Frontend)
- **框架**: Next.js 16 (React 19)
- **语言**: TypeScript
- **样式**: Tailwind CSS v4
- **组件库**: shadcn/ui (基于 Radix UI)
- **状态管理**: React Server Components (RSC) & React Hooks
- **图标**: Lucide React
- **动画**: Framer Motion, tw-animate-css

### 后端 (Backend)
- **运行时**: Node.js (通过 Next.js Server Actions & API Routes)
- **ORM**: Prisma
- **数据库**: SQLite (开发环境) / PostgreSQL (生产环境就绪)
- **认证**: Auth.js (NextAuth v5) - Credentials Provider
- **验证**: Zod & React Hook Form

## 核心实现机制

### 1. 认证与 RBAC 流程
我们使用 **Auth.js v5 (beta)** 配合自定义 Credentials 提供商。
*   **登录**:
    1.  用户提交邮箱/密码。
    2.  `authorize` 回调通过 **Zod** 验证输入格式。
    3.  使用 `bcrypt.compare` 验证密码哈希。
*   **会话管理**:
    *   策略: **JWT** (无状态)。
    *   **角色同步**: 为了确保权限变更（如封号）即时生效，`jwt` 回调在*每次*会话检查时都会查询数据库 (`prisma.user.findUnique`) 以刷新 `token.role`。
*   **审计**: 通过 `signIn` 事件回调，异步将“LOGIN”事件记录到 `AuditLog` 表。

### 2. 中间件与日志
应用使用了自定义代理/中间件模式 (`src/proxy.ts`)。
*   **请求日志**: 每个请求都通过 `event.waitUntil` 和非阻塞 `fetch` 记录到 `/api/log`。这防止了日志记录拖慢用户响应速度。
*   **CTF 响应头**: 中间件拦截以 `/ctf` 开头的请求，并注入 `X-CTF-Flag` 响应头（挑战 #12）。

### 3. AI 预审系统
位于 `src/lib/ai-pre-review.ts`。
*   **双模式**:
    1.  **API 模式**: 如果配置了 `AI_REVIEW_ENDPOINT`，则发送 POST 请求，并强制要求 JSON 响应格式。
    2.  **启发式模式** (降级): 如果没有 API Key，则使用基于长度的算法（例如：>5000 字 = 质量分 9）来模拟 AI 判断。
*   **归一化**: 系统能处理多种布尔格式（如 "true", "passed", "通过"），确保 AI 响应解析的鲁棒性。

## 系统模块

### 1. 核心应用 (`src/app`)
应用使用 Next.js App Router 进行基于文件系统的路由管理。
- `(public)`: 首页、浏览、阅读器、搜索。
- `admin`: 系统管理的受保护路由。
- `author`: 内容创作者的受保护路由。
- `profile`: 用户设置与钱包。
- `ctf`: 隐藏的 CTF 终端界面。
- `hidden_directory`: 模拟的桌面环境 (浏览器中的操作系统)。

### 2. Server Actions (`src/app/*/actions.ts`)
我们优先使用 **Server Actions** 而非传统的 REST API 进行数据变更。
- **优势**: 类型安全、减少客户端包体积、渐进增强。
- **场景**: 登录、注册、发布章节、更新个人资料。

### 3. API 路由 (`src/app/api`)
主要用于：
- CTF 挑战 (模拟存在漏洞的端点)。
- 外部集成。
- NextAuth 认证端点 (`/api/auth`).

## 目录结构

```text
src/
├── app/                 # Next.js App Router
│   ├── admin/           # 管理员后台
│   ├── author/          # 作者工作台
│   ├── ctf/             # CTF 终端
│   ├── hidden_directory/# 模拟操作系统
│   ├── api/             # API 路由
│   └── ...              # 公共页面
├── components/          # React 组件
│   ├── ui/              # shadcn/ui 基础组件
│   └── ...              # 业务组件
├── lib/                 # 共享逻辑
│   ├── ctf/             # CTF Flag 与逻辑
│   ├── prisma.ts        # 数据库客户端
│   └── utils.ts         # 工具函数
└── prisma/              # 数据库 Schema 与迁移
```

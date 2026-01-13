# Next.js 小说平台（中文版说明）

本项目基于 [Next.js](https://nextjs.org)（由 [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) 初始化），当前实现为一个带有读者/作者/管理员体系的在线阅读与内容管理应用。

## 功能概览

- **读者侧**：浏览、搜索、书架、阅读器、个人中心等页面
- **作者侧**：作品管理、创建作品、为作品新增章节（带归属校验）
- **管理侧**：用户管理、文章审核相关页面、审计记录查看等
- **日志系统**
  - 请求日志：中间件采集请求信息，写入本地 `logs/` 按天分文件（目录会自动创建且已被 Git 忽略）
  - 审计日志：关键操作写入数据库 `AuditLog` 表

## 技术栈

- Next.js App Router（`src/app`）
- NextAuth（Credentials 登录）
- Prisma + SQLite（默认）
- Tailwind CSS + shadcn/ui（Radix UI 组件）
- Zod（表单/入参校验）
- next-themes（深色/浅色主题）

## 目录结构（简要）

```text
.
├─ prisma/                Prisma schema 与种子数据脚本
├─ public/                静态资源
├─ src/
│  ├─ app/                路由与页面（含 /api 接口）
│  │  ├─ admin/           管理后台（用户/文章/审计等）
│  │  ├─ author/          作者中心（作品/章节）
│  │  ├─ api/             API 路由（认证、日志、seed 等）
│  │  └─ ...              浏览/搜索/书架/登录/阅读等页面
│  ├─ components/         业务组件与 UI 组件
│  ├─ lib/                Prisma、日志、审计等基础能力
│  └─ types/              类型声明（含 next-auth 扩展）
└─ next.config.ts         Next.js 配置（含 CSP/安全相关 headers）
```

## 快速开始

### 1) 安装依赖

```bash
npm install
```

### 2) 配置环境变量

项目默认使用 SQLite，需提供 `DATABASE_URL`。例如在项目根目录创建 `.env`：

```bash
DATABASE_URL="file:./prisma/dev.db"
```

### 3) 初始化数据库（Prisma）

```bash
npx prisma migrate dev
```

### 4) 写入演示数据（可选）

本仓库提供了种子脚本 `prisma/seed.ts`，可用 `tsx` 直接执行：

```bash
npx tsx prisma/seed.ts
```

脚本会生成演示账号（密码均为 `123456`）：

- 超级管理员：`admin@example.com`
- 作者：`author@example.com`
- 读者：`user@example.com`

另外也提供了一个 API 形式的 seed（用于快速写入少量演示数据）：`GET /api/seed`。

### 5) 启动开发服务器

```bash
npm run dev
# 或 yarn dev / pnpm dev / bun dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

页面入口位于 `src/app/page.tsx`，编辑后会自动热更新。

## 请求日志与审计日志

- **请求日志**
  - 采集位置：`src/middleware.ts`
  - 写入位置：`src/lib/logger.ts`（写入 `logs/YYYY-MM-DD.log`）
  - 说明：`logs/` 目录会自动创建，且已在 `.gitignore` 中忽略
- **审计日志**
  - 写入方法：`src/lib/audit.ts` 的 `logAudit`
  - 存储位置：数据库表 `AuditLog`

## 项目更新与变更记录（2026-01-13）

### 1. Bug 修复

- **登录重定向**：修复超级管理员登录成功后仍停留在登录页的问题，添加显式 `redirectTo: "/"` 参数
- **后台文章审核**：修复因 session 为空导致的运行时错误
- **页脚布局**：修正页脚布局，使内容正确居中（`mx-auto px-4`）
- **作者提交作品**：修复作者提交新作品时报 `ReferenceError: logAudit is not defined`
- **类型安全**：修复作者相关 actions 中 Prisma schema 的 `uploaderId` 与 `type` 字段类型不匹配

### 2. 新增功能

- **用户管理（超级管理员）**
  - 用户列表新增操作菜单
  - 支持重置密码为默认值（`password123`）
  - 支持用户角色调整（USER、AUTHOR、ADMIN）
  - 支持封禁/解封（`ACTIVE`/`BANNED`）
  - 被封禁用户无法创建新作品
  - UI 调整：对超级管理员隐藏“文章审核”入口（仅管理员任务）

- **作者章节管理**
  - 作者新增章节的管理界面
  - 作者作品列表新增“新增章节”按钮
  - 新增章节带归属校验（只能为自己的作品新增章节）
  - 章节创建事件接入审计日志

- **请求日志系统**
  - 实现基于文件的按天请求日志（`/logs`）
  - 日志包含：时间戳、方法、URL、IP、User-Agent
  - 架构：
    - Middleware 采集请求信息
    - 异步调用内部 `/api/log` 接口写入
    - `src/lib/logger.ts` 负责落盘（例如 `logs/2026-01-13.log`）

## 了解更多

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 功能与 API
- [Learn Next.js](https://nextjs.org/learn) - 交互式学习教程
- [Next.js GitHub 仓库](https://github.com/vercel/next.js) - 欢迎反馈与贡献

## 部署到 Vercel

最简单的方式是使用 [Vercel 平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) 进行部署。

更多部署细节请参考 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying)。


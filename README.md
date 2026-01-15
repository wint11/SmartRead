# SmartRead - Intelligent Novel Reading & Creation Platform

SmartRead is a modern, full-stack online novel platform built with **Next.js 16 (App Router)**. Beyond standard reading, writing, and management features, it innovatively integrates a **CTF (Capture The Flag)** security challenge module and **AI content pre-review** mechanisms, making it a comprehensive application for entertainment, creativity, and technical exploration.

## ✨ Key Features

### 📚 Immersive Reading Experience
- **Reader View**: Focus mode, font resizing, and table of contents navigation.
- **Bookshelf**: Track reading progress and bookmark favorite novels.
- **Personalization**: Dark/Light mode support via `next-themes`.
- **Discovery**: Homepage carousel, category browsing, and search functionality.

### ✍️ Creator Center
- **Work Management**: Create new novels, edit metadata, and upload covers.
- **Chapter Creation**: Online editor with preview and publishing capabilities.
- **Security**: Strict ownership verification ensures data integrity for authors.

### 🛡️ Administration & Security
- **RBAC System**: Granular roles: Reader (USER), Author (AUTHOR), Admin (ADMIN), Super Admin (SUPER_ADMIN).
- **User Management**: Ban/Unban users, reset passwords, and modify roles.
- **Content Moderation**: Dual-audit workflows for novels and chapters.
- **Audit & Logging**:
  - **Audit Logs**: Database recording of critical actions (e.g., bans, deletions).
  - **Request Logs**: Daily file-based request logs (`/logs`) for traffic analysis.

### 🚩 CTF Security Challenges (Featured)
A complete CTF game system hidden under the `/ctf` route:
- **Terminal Simulator**: Linux-like terminal interface with file system navigation.
- **Skill Tree**: Challenges covering Web Security, Cryptography, and Reverse Engineering.
- **Mini-Games**: Easter eggs like Snake and Bomb Defusal.
- **Hidden Flags**: Clues scattered throughout the application waiting to be discovered.

### 🤖 AI Integration
- **Content Pre-review**: Automated AI quality checks and compliance scanning upon chapter submission.
- **Future-Ready**: Database schema reserved for AI scoring and intelligent recommendations.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [Prisma](https://www.prisma.io/) (ORM), SQLite (Default)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/) (Credentials Provider)
- **Validation**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **Animation**: framer-motion, tw-animate-css

## 📂 Project Structure

```text
.
├── prisma/                 # Database Schema & Migrations
├── public/                 # Static Assets
├── src/
│   ├── app/                # App Router Definitions
│   │   ├── admin/          # Admin Dashboard (Users/Audit)
│   │   ├── author/         # Author Studio (Works/Chapters)
│   │   ├── ctf/            # CTF Platform (Terminal/Games)
│   │   ├── api/            # Backend API Routes
│   │   └── ...             # Public pages (Home, Reader, etc.)
│   ├── components/         # React Components (UI/Business)
│   ├── lib/                # Utilities (Prisma, Logger, AI, Audit)
│   └── types/              # TypeScript Type Definitions
└── logs/                   # (Auto-generated) Daily Request Logs
```

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have Node.js installed (v18+ recommended).

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
The project uses SQLite by default.
```bash
# Generate Prisma Client
npx prisma generate

# Run Database Migrations
npx prisma migrate dev
```

### 4. Initialize Data (Seed)
Use the seed script to create default admin, author, and user accounts, along with sample data.
```bash
npx tsx prisma/seed.ts
```
**Default Accounts:**
- Super Admin: `admin@example.com` / `123456`
- Author: `author@example.com` / `123456`
- Reader: `user@example.com` / `123456`

### 5. Start Development Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to start.

## 📝 Latest Updates (2026-01-15)

### New Features
- **CTF Module**: Launched with terminal simulator, leaderboards, and various security challenges.
- **AI Pre-review**: Chapter submissions now undergo preliminary quality assessment via `ai-pre-review`.
- **Advanced User Management**: Super Admins can now manage roles, passwords, and account status directly from the dashboard.
- **Enhanced Logging**: Implemented file-based daily request logging for better observability.

### Improvements & Fixes
- Upgraded to **Next.js 16** and **React 19**.
- Fixed issues with login redirects, author permissions, and footer layout.
- Optimized database models with full support for AI review status.

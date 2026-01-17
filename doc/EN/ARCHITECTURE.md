# System Architecture

## Overview
SmartRead is a full-stack web application built on the **Next.js 16 (App Router)** framework. It combines a traditional content management system (CMS) for novel reading/writing with an integrated CTF (Capture The Flag) environment.

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Component Library**: shadcn/ui (Radix UI based)
- **State Management**: React Server Components (RSC) & React Hooks
- **Icons**: Lucide React
- **Animations**: Framer Motion, tw-animate-css

### Backend
- **Runtime**: Node.js (via Next.js Server Actions & API Routes)
- **ORM**: Prisma
- **Database**: SQLite (Dev) / PostgreSQL (Prod ready)
- **Authentication**: Auth.js (NextAuth v5) - Credentials Provider
- **Validation**: Zod & React Hook Form

## Core Implementation Mechanisms

### 1. Authentication & RBAC Flow
We use **Auth.js v5 (beta)** with a custom Credentials provider.
*   **Login**: 
    1.  User submits email/password.
    2.  `authorize` callback validates input via **Zod**.
    3.  Password verified using `bcrypt.compare`.
*   **Session Management**:
    *   Strategy: **JWT** (Stateless).
    *   **Role Synchronization**: To ensure instant permission revocation (e.g., banning a user), the `jwt` callback queries the database (`prisma.user.findUnique`) on *every* session check to refresh the `token.role`.
*   **Audit**: A "LOGIN" event is asynchronously logged to the `AuditLog` table via the `signIn` event callback.

### 2. Middleware & Logging
The application uses a custom proxy/middleware pattern (`src/proxy.ts`).
*   **Request Logging**: Every request is logged asynchronously using `event.waitUntil` and a non-blocking `fetch` to `/api/log`. This prevents logging from slowing down the user response.
*   **CTF Headers**: The middleware intercepts requests to `/ctf*` and injects the `X-CTF-Flag` header (Challenge #12).

### 3. AI Pre-Review System
Located in `src/lib/ai-pre-review.ts`.
*   **Dual Mode**:
    1.  **API Mode**: If `AI_REVIEW_ENDPOINT` is set, it sends a POST request with a schema-enforced JSON response format.
    2.  **Heuristic Mode** (Fallback): If no API key is present, it uses a length-based algorithm (e.g., >5000 chars = Quality Score 9) to simulate AI judgment.
*   **Normalization**: The system handles various boolean formats (e.g., "true", "passed", "通过") to ensure robust parsing of AI responses.

## System Modules

### 1. Core Application (`src/app`)
The application uses the Next.js App Router for file-system based routing.
- `(public)`: Home, Browse, Reader, Search.
- `admin`: Protected routes for system administration.
- `author`: Protected routes for content creators.
- `profile`: User settings and wallet.
- `ctf`: The hidden CTF terminal interface.
- `hidden_directory`: A simulated Desktop Environment (OS in Browser).

### 2. Server Actions (`src/app/*/actions.ts`)
We prioritize **Server Actions** over traditional REST APIs for data mutations.
- **Benefits**: Type safety, reduced client bundle size, progressive enhancement.
- **Use Cases**: Login, Registration, Publishing Chapters, Updating Profile.

### 3. API Routes (`src/app/api`)
Used primarily for:
- CTF Challenges (simulating vulnerable endpoints).
- External integrations (if any).
- NextAuth authentication endpoints (`/api/auth`).

## Directory Structure

```text
src/
├── app/                 # Next.js App Router
│   ├── admin/           # Admin Dashboard
│   ├── author/          # Author Studio
│   ├── ctf/             # CTF Terminal
│   ├── hidden_directory/# Simulated OS
│   ├── api/             # API Routes
│   └── ...              # Public Pages
├── components/          # React Components
│   ├── ui/              # shadcn/ui primitives
│   └── ...              # Feature components
├── lib/                 # Shared Logic
│   ├── ctf/             # CTF Flags & Logic
│   ├── prisma.ts        # DB Client
│   └── utils.ts         # Helpers
└── prisma/              # DB Schema & Migrations
```

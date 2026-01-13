This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Updates & Changelog (2026-01-13)

### 1. Bug Fixes
- **Login Redirect**: Fixed an issue where super admins remained on the login page after successful authentication. Added explicit `redirectTo: "/"` parameter.
- **Admin Article Review**: Fixed a runtime error in the admin article review interface caused by null session references.
- **Footer Layout**: Corrected the footer layout to ensure content is properly centered (`mx-auto px-4`).
- **Author Work Submission**: Resolved a `ReferenceError: logAudit is not defined` when authors submitted new works.
- **Type Safety**: Fixed Prisma schema type mismatches for `uploaderId` and `type` fields in author actions.

### 2. New Features
- **User Management (Super Admin)**:
  - **Enhanced UI**: Added action menu to user list.
  - **Reset Password**: Ability to reset user passwords to default (`password123`).
  - **Role Control**: Ability to change user roles (USER, AUTHOR, ADMIN).
  - **Account Status**: Implemented Ban/Unban functionality (`ACTIVE`/`BANNED` status).
  - **Access Control**: Banned users are prevented from creating new works.
  - **UI Adjustment**: Hidden "Article Audit" link for Super Admins (Admin only task).

- **Author Chapter Management**:
  - Implemented a new interface for authors to add chapters to their works.
  - Added "Add Chapter" (新增章节) button to the author's work management list.
  - Secured chapter creation with ownership verification (authors can only add chapters to their own novels).
  - Integrated audit logging for chapter creation events.

- **Request Logging System**:
  - Implemented a daily file-based logging system in `/logs`.
  - Logs include Timestamp, Method, URL, IP, and User-Agent.
  - **Architecture**:
    - Middleware captures request details.
    - Asynchronously sends data to internal `/api/log` endpoint.
    - `src/lib/logger.ts` handles physical file writing (e.g., `logs/2026-01-13.log`).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

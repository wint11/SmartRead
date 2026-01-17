# UI/UX Design

## Design Philosophy
SmartRead adopts a "Content-First" design philosophy. The interface is clean, distraction-free, and highly responsive, prioritizing the reading experience while keeping administration tools accessible but unobtrusive.

## Component Implementation Details

### 1. Reader View (Infinite Scroll)
Located in `src/components/reader-view.tsx`.
*   **Architecture**: Uses a customized virtual-list-like approach combined with manual DOM synchronization.
*   **State**: Maintains a `loadedChapters` array containing the content of previous, current, and next chapters.
*   **Infinite Loading**: 
    *   **Next**: Triggered by `IntersectionObserver` at the bottom sentinel. Appends to `loadedChapters`.
    *   **Previous**: Triggered by top sentinel. Prepends to `loadedChapters`.
*   **Scroll Synchronization**: When prepending chapters, the browser's default behavior is to jump to the top. We use `useLayoutEffect` to calculate the height difference (`newScrollHeight - prevScrollHeight`) and instantly adjust `scrollTop`, creating a seamless "scroll up" experience.

### 2. Theming System
*   **Provider**: Wraps the app in `next-themes` provider.
*   **Implementation**: Toggles a `class` (dark/light/sepia) on the `<html>` tag.
*   **Tailwind**: Components use `dark:bg-zinc-950` modifiers. The "Sepia" theme is implemented as a custom class overriding CSS variables for background and text colors.

### 3. Ghost Mode (Glitch Effect)
*   **Trigger**: A hidden counter in `ReaderView` increments on title clicks. When it hits 5, `isGhostMode` state becomes `true`.
*   **Timer Logic**: A `setInterval` runs every 250ms to check `new Date().getSeconds()`.
*   **Time Rift**: Only renders the "Portal" button if seconds are between **42** and **45**. This is a hardcoded timing window in the frontend logic.

## Key Interface Modules

### 1. Reader View (`/novel/[id]/chapter/[chapterId]`)
The core of the application.
*   **Infinite Scroll**: Automatically loads the next chapter when reaching the bottom.
*   **Contextual Menu**: Hidden by default, toggled by clicking the center of the screen.
*   **Customization**: Users can adjust font size, background color (Paper, Dark, Light), and line height.
*   **VIP Paywall**: VIP chapters show a blurred overlay with a "Unlock" button (which is part of a CTF challenge).

### 2. Author Dashboard (`/author`)
A workspace for creators.
*   **Data Grid**: Uses `shadcn/ui` Table component to list novels with status badges.
*   **Editor**: A rich-text editor (or markdown support) for writing chapters.
*   **Real-time Validation**: Forms use `zod` schema validation to provide immediate feedback on errors.

### 3. Admin Panel (`/admin`)
For platform governance.
*   **Dashboard**: Overview metrics (Total Users, Daily Active Users).
*   **Audit Queue**: A split-view interface to review pending chapters with AI suggestions highlighted.

### 4. CTF Terminal (`/ctf`)
A retro-styled hacker interface.
*   **Visuals**: Monospace font (Fira Code), CRT scanline effects, green-on-black color scheme.
*   **Interaction**: Command-line interface mimicking a Linux shell.
*   **Effects**: "Shatter" animations when solving challenges.

## Responsive Strategy
*   **Mobile First**: All layouts are built for mobile screens first, then scaled up for tablets and desktops.
*   **Navigation**:
    *   *Desktop*: Top horizontal navigation bar.
    *   *Mobile*: Bottom tab bar or hamburger menu for secondary actions.

## User Flow
1.  **Discovery**: Homepage Carousel -> Novel Detail -> Start Reading.
2.  **Creation**: Author Dashboard -> Create Novel -> Add Chapter -> Submit for Review.
3.  **Hacking**: Discover Hint -> Access `/ctf` or `/hidden_directory` -> Solve Puzzle -> Get Flag.

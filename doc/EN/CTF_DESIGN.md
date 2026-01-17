# CTF Design & Hidden Mechanics

## Concept
SmartRead is a **"Capture The Flag" (CTF) Target Platform** disguised as a fully functional novel reading site. The goal is to teach web security concepts (OWASP Top 10) in a realistic environment. Players act as "readers" who stumble upon security flaws.

## Categories
Challenges are categorized into:
*   **Web**: Frontend/Backend vulnerabilities (XSS, SQLi, IDOR, Logic Bugs).
*   **System**: Linux/Server misconfigurations (simulated).
*   **Crypto**: Encryption and encoding puzzles.
*   **Misc**: Easter eggs and logic puzzles.

## Detailed Challenge Design

### 1. The Millionaire's Club (Web / Logic)
*   **Location**: Personal Center (`/profile`) -> Wallet Card.
*   **Scenario**: The user sees a "Recharge" button that adds fake currency. There is a VIP membership costing 1,000,000 coins.
*   **Vulnerability**: **Insecure Cookie Storage**.
    *   The balance is stored in a cookie named `shop_session`.
    *   Format: `{"balance": 1000, "sign": "md5(balance + secret)"}`.
    *   The secret is weak or the verification allows "none" algorithm (logic flaw).
*   **Solution**:
    1.  Inspect cookies.
    2.  Decode the JSON.
    3.  Modify `balance` to `1000000`.
    4.  Forge the signature (or bypass if implemented).
    5.  Refresh and buy the VIP membership to reveal the flag.

### 2. The Paywall Bypass (Web / Frontend)
*   **Location**: Any "VIP" Chapter (e.g., Chapter 2 of a specific book).
*   **Scenario**: Content is blocked by a "Subscribe to read" overlay.
*   **Vulnerability**: **Client-Side Security**.
    *   The server sends the full content, but CSS sets `filter: blur(5px)` and overlays a div.
*   **Solution**:
    1.  Right-click -> Inspect Element.
    2.  Delete the overlay `div`.
    3.  Remove the `blur` class from the content container.
    4.  The flag is hidden within the text of the chapter.

### 3. Ghost Mode (Misc / Easter Egg)
*   **Location**: Reader View.
*   **Trigger**: Rapidly clicking the Chapter Title 5 times.
*   **Effect**:
    *   The UI glitches (CSS animations).
    *   A hidden chat interface appears (communicating with a "Ghost" or "Previous Hacker").
*   **Reward**: Provides hints for other challenges and a specific "Ghost Flag".

### 4. The Simulated OS (System / Web)
*   **Location**: `/hidden_directory` (Found via `robots.txt` or source map analysis).
*   **Design**: A React-based desktop environment (Windows 95/Linux style).
*   **Features**:
    *   **File Explorer**: Browse fake system files.
    *   **Terminal**: Run basic commands (`ls`, `cat`, `whoami`).
    *   **Notepad**: Read "leftover" notes from admins.
*   **Vulnerability**: **Path Traversal / Information Leakage**.
    *   Finding a file named `passwords.txt` or similar in a deep directory.
    *   Using the terminal to "exploit" a fake binary.

### 5. Time Rift (Misc / Timing)
*   **Location**: Reader View.
*   **Mechanic**: A component that checks `new Date().getSeconds()`.
*   **Trigger**: Only renders a "Portal" button when seconds are between `:42` and `:45`.
*   **Challenge**: User must be observant or inspect the React components to see the conditional rendering logic.

### 6. Terminal Interface (`/ctf`)
*   **Overview**: The central hub for submitting flags and tracking progress.
*   **Skill Tree**: Visualizes progress. Nodes unlock as flags are submitted.
*   **Commands**:
    *   `submit <flag>`: Validates flags.
    *   `hint <id>`: Spends points to get hints.
    *   `top`: Shows the leaderboard (fake or real).

## Implementation Notes
*   **Flag Format**: `flag{...}`
*   **Validation**: Flags are validated server-side via Server Actions to prevent frontend peeking of the flag database (except for frontend-only challenges).
*   **State**: User progress is saved in the database (or local storage for guest mode).

## CTF Framework Internals

### 1. Flag Registry System
The project uses a centralized registry pattern to manage flags, ensuring type safety and easy management.
- **Location**: `src/lib/ctf/flags/`
- **Structure**: Flags are split by category (`web.ts`, `system.ts`, etc.) and aggregated in `index.ts`.
- **Definition**:
  ```typescript
  export const WEB_FLAGS = {
    1: "flag{...}", // ID: Flag Content
  } as const
  ```

### 2. Submission Flow
1.  **User Input**: User types `submit <flag>` in the simulated terminal (`src/app/ctf/commands/game.ts`).
2.  **Server Action**: The client calls `verifyFlag(flag)` in `src/app/ctf/actions.ts`.
3.  **Verification**:
    *   The server normalizes the input (trim).
    *   It iterates through the `FLAGS` object values to find a match.
    *   **Security**: The flag list is never sent to the client. Only the result (Success/Fail) is returned.
4.  **State Update**:
    *   **Success**: The Flag ID is returned. Client updates `solvedFlags` state and localStorage.
    *   **Failure**: Triggers a "Bomb" mechanic (accelerates the countdown timer).

### 3. Challenge Metadata
Challenges displayed in the UI are defined separately from the flags to allow for hints and descriptions without exposing the flag itself.
- **Location**: `src/app/ctf/data/challenges.ts`
- **Fields**: `id`, `title`, `description`, `hint`, `points`, `category`.

### 4. Developer Guide: How to Add a New Flag
1.  **Define Flag**: Add a new entry to `src/lib/ctf/flags/<category>.ts`.
2.  **Create Task**: Add the challenge metadata to `src/app/ctf/data/challenges.ts`.
3.  **Implement Trigger**:
    *   **Frontend**: Add a hidden element, console log, or specific interaction in a React component.
    *   **Backend**: Add a logic check in an API route or Server Action (e.g., specific SQL injection payload).

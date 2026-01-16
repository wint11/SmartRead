# Time Rift - Design Document

## 1. Overview
**Time Rift** (Chronos Scraper) is a browser-based, retro-styled RPG/exploration mini-game embedded within the SmartRead novel reader application. It serves as a hidden "Easter egg" or meta-narrative element where players navigate a corrupted timeline to recover lost data.

**Location**: `src/app/novel/time-rift`
**Entry Point**: Accessible via a glitchy "[TIME_RIFT_DETECTED]" link in the Reader View when specific conditions are met (e.g., specific chapter or random event).

## 2. Core Concept
The player acts as a digital entity navigating a "shifting labyrinth" of time. The environment is unstable, with walls appearing and disappearing in cycles. The goal is to stabilize the sector by collecting data fragments and escaping before the timeline collapses.

### Key Features
*   **Procedural Generation**: Semi-random map generation with a guaranteed "Critical Path".
*   **Dynamic Terrain**: Walls that phase in and out of existence based on a global timer.
*   **Stealth/Chase Mechanics**: Enemies ("Time Eaters") that hunt the player.
*   **Resource Collection**: Fetch quests and collectible objectives.

## 3. Game Loop & Phases

The game state is managed via the `gamePhase` state:

1.  **EXPLORE**:
    *   **Objective**: Explore the map, talk to NPCs, and collect 3 **Data Fragments**.
    *   **Mechanics**: No time limit. Enemies spawn and patrol. Terrain shifts periodically.
    *   **Transition**: Collecting all 3 fragments triggers the `ESCAPE` phase.

2.  **ESCAPE**:
    *   **Objective**: Reach the **Exit Point** (Sector 55,55) before the timer runs out.
    *   **Mechanics**: A countdown timer (e.g., 60s) starts. Visual intensity increases (red pulsing effects).
    *   **Fail Condition**: Timer reaches 0 -> `GAME_OVER`.
    *   **Win Condition**: Reach Exit -> `WON`.

3.  **GAME_OVER**:
    *   Triggered by: Collision with Enemy, Crushed by Wall, or Time out.
    *   Action: Player must reload to retry.

4.  **WON**:
    *   Triggered by: Successfully escaping.
    *   Reward: Displays a CTF-style flag (`flag{run_lola_run_404}`).

## 4. Technical Architecture

### Component Structure
*   **`TimeRiftPage`** (`page.tsx`): Wrapper component handling metadata.
*   **`TimeRiftClient`** (`time-rift-client.tsx`): Monolithic client component containing the entire game engine.

### State Management (React Hooks)
*   `playerPos`: `{x, y}` coordinates.
*   `gamePhase`: Current state of the game loop.
*   `timePhase`: Integer (0-2) representing the current terrain cycle.
*   `enemies`: Array of enemy positions.
*   `inventory` / `collectedFrags`: Progress tracking.

### Map System
The map is a 60x60 grid defined by `getCellType(x, y, timePhase)`:
*   **Type 0 (Path)**: Walkable.
*   **Type 1 (Static Wall)**: Always blocked.
*   **Type 2 (Closed Wall)**: Blocked in current phase.
*   **Type 3 (Open Wall)**: Walkable in current phase.
*   **Type 9 (Exit)**: Win condition (only visible in ESCAPE phase).

**Generation Logic**:
*   Uses a pseudo-random seed based on coordinates `(x, y)`.
*   **Critical Path**: Ensures connectivity between Start -> NPCs -> Fragments -> Exit.
*   **Dynamic Walls**: `(x + y) % 3 === 0` pattern determines shifting walls.

## 5. Entities & AI

### Player
*   **Movement**: Grid-based (WASD / Arrows).
*   **Interaction**: 'E' key to interact with NPCs.
*   **View**: Limited field of view (Fog of War), radius = 9 cells.

### Enemies ("Time Eaters")
*   **Behavior**: Simple chase logic.
*   **Movement**: Moves every 800ms. Can pass through *Dynamic Walls* (ghost-like) but blocked by *Static Walls*.
*   **Spawn**: 3 enemies spawn randomly in safe zones away from the player.

### NPCs
*   **The Glitch**: Lore provider.
*   **Time Keeper**: Quest giver (Fetch "Alpha Key", reward "Omega Key").
*   **Interaction**: Modal dialogue system with typing effect.

## 6. UI/UX Design

### Visual Style
*   **Theme**: Cyberpunk / Matrix terminal.
*   **Colors**: Dominant Green (safe), Red (danger/enemies), Yellow (warning/items).
*   **Effects**: CRT scanlines (implied), pulsing animations, glitch text.

### HUD Elements
*   **Top Left**: Terrain Status (Stable vs Shifting).
*   **Top Center**: Current Objective / Escape Timer.
*   **Top Right**: Coordinates.
*   **Bottom Left**: Inventory Grid.
*   **Viewport**: Centered grid with "Fog of War" gradient overlay.

## 7. Future Improvements / TODOs
*   **Code Refactoring**: Extract `MapLogic`, `EnemyAI`, and `Renderer` into separate hooks/components to reduce file size of `time-rift-client.tsx`.
*   **Mobile Support**: Add on-screen D-pad for touch devices.
*   **Persistence**: Save progress/inventory to local storage or backend user profile.
*   **Sound**: Add ambient drone and sound effects for interactions/alarms.
*   **More Content**: Additional levels or procedurally infinite modes.

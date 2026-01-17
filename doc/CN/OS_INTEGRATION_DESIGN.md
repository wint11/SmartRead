# 隐藏桌面操作系统与 CTF 终端融合设计方案

## 1. 设计目标
将 `hidden_directory` (图形化桌面) 与 `ctf` (命令行终端) 的底层逻辑完全打通，实现“数据互通、状态共享”。
- **互通**: 在终端 `mkdir test`，桌面的文件管理器应实时显示 `test` 文件夹。
- **复用**: 桌面版 Terminal 直接运行 CTF 的核心命令逻辑，不再是玩具。
- **仿真**: 浏览器 (Netscape) 不再尝试加载真实互联网（会被拦截），而是加载游戏内的“内网/暗网”页面。

## 2. 核心架构：CTF 内核 (Kernel) 上移

目前的架构中，CTF 逻辑封装在 `useCtfGame` Hook 中，仅服务于 `/ctf` 页面。我们需要将其提升为共享状态。

### 2.1 状态管理改造
引入 `CTFGameProvider` (Context)，将 `useCtfGame` 的核心状态提升到应用层或通过 Props 传递。

```mermaid
graph TD
    Page[Page: /hidden_directory] --> Provider[<CTFGameProvider>]
    Provider --> Desktop[OSDesktop]
    
    Desktop --> Window1[Window: Terminal]
    Window1 --> |Use Context| Logic[CTF Logic (Commands)]
    
    Desktop --> Window2[Window: File Explorer]
    Window2 --> |Read Context| FS[File System State]
    
    Desktop --> Window3[Window: Browser]
    Window3 --> |Internal Route| Intranet[Fake Intranet Sites]
```

## 3. 模块详细设计

### 3.1 文件系统统一 (The Grand Unification)
目前存在两套文件系统：
1.  **CTF FS**: 递归对象结构，包含权限/所有者，是“真实”数据。
2.  **Desktop FS**: 数组结构，包含 UI 图标配置，是“展示”数据。

**解决方案：适配器模式 (Adapter Pattern)**
保持 CTF FS 作为**唯一数据源 (Single Source of Truth)**。
桌面端不再维护自己的 `initialFileSystem`，而是通过适配器动态渲染 CTF FS。

*   **适配器逻辑**:
    *   遍历 CTF 的 `DirectoryNode`。
    *   映射文件类型：
        *   `rwxr-xr-x` 且在 `/bin` -> 识别为 `APP` (可执行程序)。
        *   `.txt` / `.md` -> 识别为 `TEXT`。
        *   `.jpg` / `.png` -> 识别为 `IMAGE`。
    *   **特殊处理**: 桌面上的“快捷方式”（如 Netscape, Games）作为虚拟节点注入，不直接存在于 Linux 文件系统中，或者映射到 `/home/ctf/Desktop` 目录。

### 3.2 终端 (Terminal) 融合
废弃现有的 `src/app/hidden_directory/apps/terminal/index.tsx` 中的 switch-case 逻辑。

*   **新实现**:
    *   组件接收 `CTFContext`。
    *   **输入**: 绑定 `useCtfGame` 的 `processCommand` 方法。
    *   **输出**: 渲染 `useCtfGame` 的 `history` 数组。
    *   **效果**: 在桌面终端输入 `submit flag{...}`，可以直接解题并触发炸弹/特效，与全屏终端体验一致。

### 3.3 浏览器 (Netscape) 改造：内网模拟器
解决 "Blocked Content" 问题的核心是将浏览器变成游戏的一部分，而不是访问真实网络。

*   **虚拟路由表**:
    *   `http://www.google.com` -> **404 Not Found** 或 **Connection Refused** (模拟断网)。
    *   `http://internal.portal` -> 渲染组件 `<IntranetPortal />`。
    *   `http://192.168.1.5` -> 渲染组件 `<ServerAdminPanel />` (可能是某个 SQL 注入挑战的入口)。
*   **实现**:
    *   `BrowserApp` 内部维护一个 `currentUrl` 状态。
    *   根据 URL 渲染不同的 React 组件（伪造的网页），而不是使用 `iframe`。
    *   这允许我们在“网页”中埋入 React 交互逻辑（如登录表单、文件上传），直接与游戏后端交互。

## 4. 实施步骤 (Migration Plan)

1.  **Step 1: 提取内核**: 确保 `useCtfGame` 可以独立于 UI 运行，并支持传入初始状态。
2.  **Step 2: 建立上下文**: 在 `OSDesktop` 外层包裹 `CTFGameProvider`。
3.  **Step 3: 改造文件管理器**: 重写 `FileExplorerApp`，使其读取 Context 中的 `fileSystem` 而非本地常量。
4.  **Step 4: 替换终端**: 用封装了 `TerminalInterface` 的新组件替换旧的 `TerminalApp`。
5.  **Step 5: 构建内网**: 创建 1-2 个简单的“内网页面”组件，并接入浏览器。

## 5. 预期效果
用户打开桌面的终端，输入 `touch hack.txt`，然后打开桌面的文件管理器，能立即看到 `hack.txt` 文件。打开浏览器访问内部服务器，找到线索，回到终端进行渗透。体验完全无缝连接。

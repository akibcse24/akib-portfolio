

# AkibOS — Web Desktop Environment

## Overview
A web-based operating system with a KDE Plasma-inspired desktop, 3-second boot animation, and three app shortcuts that open in a built-in browser. Includes extra apps (file manager, terminal, settings, text editor).

## OS Name & Branding
- **Name**: AkibOS
- **Boot screen**: Animated logo with progress bar, completes in ~3 seconds

## Desktop Apps (Shortcuts)

| Icon | Name | URL |
|------|------|-----|
| Canvas/nodes icon | CtxNote | cn.akib.qzz.io |
| Chart/target icon | RT - Routine Tracker | rt.akib.qzz.io |
| Wallet/ledger icon | Hisabkhata | hk.akib.qzz.io |

All icons will be custom SVG — no copyrighted logos.

## Architecture

```text
src/
├── pages/Index.tsx          — Entry: boot → desktop state machine
├── components/os/
│   ├── BootScreen.tsx       — Logo animation + progress bar (3s)
│   ├── Desktop.tsx          — Wallpaper, icons grid, right-click menu
│   ├── Taskbar.tsx          — Bottom panel: start menu, clock, system tray
│   ├── StartMenu.tsx        — App launcher (KDE Plasma style)
│   ├── Window.tsx           — Draggable/resizable window container
│   ├── WindowManager.tsx    — Manages open windows, z-index, minimize/maximize
│   ├── AppBrowser.tsx       — In-OS browser with URL bar, back/forward, iframe
│   ├── AppFileManager.tsx   — Simple file browser UI
│   ├── AppTerminal.tsx      — Fake terminal with basic commands
│   ├── AppTextEditor.tsx    — Simple text editor
│   ├── AppSettings.tsx      — Theme/wallpaper settings
│   └── AppIcon.tsx          — Desktop icon component
├── hooks/
│   └── useWindowManager.ts  — Window state management hook
└── lib/
    └── os-apps.ts           — App registry (names, icons, components)
```

## Key Features

1. **Boot Screen** — AkibOS logo fades in, progress bar fills over 3s, then transitions to desktop. Auto-enters fullscreen via Fullscreen API.

2. **Desktop** — KDE Plasma aesthetic: gradient wallpaper, desktop icons in a grid, right-click context menu (change wallpaper, new folder, refresh).

3. **Taskbar** — Bottom panel with: Start/app menu button, open window tabs, system tray (volume, wifi icons), digital clock with date.

4. **Window Manager** — Windows are draggable, resizable, minimizable, maximizable, closable. Click to focus (z-index management). Minimize sends to taskbar.

5. **Built-in Browser** — URL bar, back/forward/refresh buttons, renders sites via iframe. The 3 project shortcuts open their URLs here.

6. **Extra Apps** — File Manager (mock file tree), Terminal (fake shell with `help`, `ls`, `whoami`, `clear`), Text Editor (textarea-based), Settings (wallpaper picker, theme toggle).

## Technical Details

- **State machine**: `booting` → `desktop` managed in Index.tsx
- **Fullscreen**: `document.documentElement.requestFullscreen()` called after boot completes
- **Window state**: Custom hook tracking `{id, title, x, y, width, height, minimized, maximized, zIndex}[]`
- **Dragging/resizing**: Mouse event handlers on window title bar and edges
- **Styling**: Tailwind + CSS variables for KDE Plasma look (blur effects, rounded panels, subtle shadows)
- **Icons**: Lucide icons styled as app icons with custom colors
- **Clock**: `setInterval` updating every second

## Design System Additions
- New CSS variables for OS-specific colors (panel background, window chrome, desktop gradient)
- Backdrop blur on panels and window title bars
- Custom animations: boot fade, window open/close scale, minimize slide


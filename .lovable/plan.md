

# AkibOS — Advanced Enhancements

## Planned Improvements

### 1. Right-Click Desktop Context Menu
- Right-click on desktop background shows a context menu with: Change Wallpaper, Refresh Desktop, About AkibOS
- Clicking outside or selecting an option closes it
- Styled to match KDE Plasma aesthetic (blur, dark panel)

### 2. Window Snapping (Edge Snap Zones)
- Dragging a window to the left/right edge snaps it to half-screen
- Dragging to top edge maximizes the window
- Visual preview overlay appears when dragging near edges
- Double-click title bar to maximize/restore

### 3. Notification System & System Tray
- Add a notification center in the taskbar (bell icon)
- Show welcome notification on desktop load: "Welcome to AkibOS"
- Clicking volume/wifi icons shows small popup panels (mock controls)
- Battery indicator icon in system tray

### 4. Lock Screen
- After boot, show a lock screen with the user name "Akib" and a "Login" button (no real auth)
- Animated clock display on the lock screen
- Smooth transition from lock screen to desktop

### 5. Enhanced Boot Screen
- Add scrolling terminal-style log lines behind the progress bar (e.g., "[OK] Starting kernel...", "[OK] Mounting filesystem...")
- Makes the boot feel more realistic and immersive

### 6. App Dock / Quick Launch
- Add a centered dock at the bottom (above taskbar) with pinned favorite apps — similar to KDE's floating dock or macOS dock
- Hover magnification effect on dock icons

### 7. Desktop Widget — Clock & Weather
- Floating clock/date widget on the desktop (top-right corner)
- Minimal, translucent design with current time, day, and a greeting message

### 8. Improved Window Animations
- Minimize animation: window shrinks and slides down to its taskbar button position
- Close animation: scale down + fade out before removing
- Window shadow intensifies on focus

### 9. Keyboard Shortcuts
- `Super` key toggles Start Menu
- `Alt+F4` closes focused window
- `Alt+Tab` cycles through open windows with a visual switcher overlay

### 10. Sound Effects (Optional, Subtle)
- Short boot chime when boot completes
- Subtle click sounds on window open/close (using Web Audio API, no external files)

---

## Technical Approach

| Feature | Files Modified/Created |
|---|---|
| Context Menu | `Desktop.tsx` (add right-click handler + menu component) |
| Window Snapping | `useWindowManager.ts`, `Window.tsx`, `Desktop.tsx` (snap zones overlay) |
| Notifications | New `NotificationCenter.tsx`, `Taskbar.tsx` |
| Lock Screen | New `LockScreen.tsx`, `Index.tsx` (add phase) |
| Enhanced Boot | `BootScreen.tsx` (add log lines) |
| Dock | New `Dock.tsx`, `Desktop.tsx` |
| Desktop Widget | New `DesktopWidget.tsx`, `Desktop.tsx` |
| Window Animations | `Window.tsx`, `index.css` (new keyframes) |
| Keyboard Shortcuts | `Desktop.tsx` (useEffect with keydown listener) |
| Sound Effects | `BootScreen.tsx`, `Window.tsx` (Web Audio API) |

All changes use existing tech stack (React, Tailwind, Lucide icons). No new dependencies needed.


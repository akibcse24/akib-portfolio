

# AkibOS — Fix iframe blocking, merge dock into taskbar, auto-hide taskbar

## Three Changes

### 1. Fix rt.akib.qzz.io iframe blocking
**Problem**: `rt.akib.qzz.io` sends `X-Frame-Options: DENY` or `Content-Security-Policy: frame-ancestors 'none'`, which blocks iframe embedding. This is a server-side header — it cannot be bypassed from the client.

**Solution**: Use a CORS/frame proxy. When a site refuses to load in an iframe, route it through a public proxy like `https://corsproxy.io/?url=` or alternatively detect the load failure and open the site in a new browser tab instead. The most reliable approach:
- Add an `onError` / load-failure detection in `AppBrowser.tsx`
- For known blocked sites, prepend a proxy URL **or** show a fallback UI with a "Open in new tab" button
- Update `os-apps.ts` to flag apps that need proxy or external opening

**Recommended approach**: Since proxy services can be unreliable, the cleanest solution is to detect iframe load failure and show a styled fallback page with the app's logo, description, and an "Open in New Tab" button. This is more robust than depending on a third-party proxy.

### 2. Merge Dock into Taskbar
- Remove the separate floating `Dock` component from `Desktop.tsx`
- Move the dock app icons (with hover magnification) into the center of the `Taskbar`, between the Start button and the system tray
- The window tabs move to a secondary row or are replaced by dot indicators under the dock icons when that app's window is open
- Keep the magnification hover effect on the dock icons within the taskbar

### 3. Auto-hide Taskbar when a window is maximized
- In `Desktop.tsx`, track whether any window is maximized (not minimized)
- When a window is maximized/fullscreen, the taskbar slides down off-screen with a CSS transition
- Moving the mouse to the very bottom of the screen reveals the taskbar (hover zone)
- When no windows are maximized, the taskbar stays visible normally

## Files to Change

| File | Change |
|---|---|
| `src/components/os/AppBrowser.tsx` | Add iframe error detection, show fallback UI with "Open in New Tab" for blocked sites |
| `src/lib/os-apps.ts` | Add optional `iframeBlocked` flag to OsApp for known blocked sites |
| `src/components/os/Taskbar.tsx` | Integrate dock icons with magnification into the center; accept `onLaunchApp` prop; add auto-hide logic via `hidden` prop |
| `src/components/os/Dock.tsx` | Remove (no longer needed as separate component) |
| `src/components/os/Desktop.tsx` | Remove `<Dock>`, pass `onLaunchApp` to Taskbar, compute `hasMaximizedWindow` for auto-hide, add bottom hover zone to reveal taskbar |
| `src/components/os/Window.tsx` | Update maximized height from `calc(100% - 48px)` to `100%` when taskbar is hidden |


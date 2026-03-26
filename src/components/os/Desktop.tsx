import { useState, useCallback, useEffect } from 'react';
import AppIcon from './AppIcon';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import Window from './Window';
import AppBrowser from './AppBrowser';
import AppFileManager from './AppFileManager';
import AppTerminal from './AppTerminal';
import AppTextEditor from './AppTextEditor';
import AppSettings, { wallpapers } from './AppSettings';
import Dock from './Dock';
import DesktopWidget from './DesktopWidget';
import NotificationCenter, { useNotifications } from './NotificationCenter';
import { osApps, OsApp } from '@/lib/os-apps';
import { useWindowManager } from '@/hooks/useWindowManager';
import { playClickSound } from '@/lib/sounds';

const Desktop = () => {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [snapPreview, setSnapPreview] = useState<'left' | 'right' | 'top' | null>(null);
  const { notifications, addNotification, removeNotification } = useNotifications();
  const {
    windows, openWindow, closeWindow, focusWindow,
    minimizeWindow, maximizeWindow, moveWindow, resizeWindow,
  } = useWindowManager();

  const desktopApps = osApps.filter(a => a.desktopShortcut);

  // Welcome notification
  useEffect(() => {
    const timer = setTimeout(() => addNotification('Welcome to AkibOS', 'Your desktop is ready. Enjoy!', 'success'), 800);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Super key → toggle start menu
      if (e.key === 'Meta' || e.key === 'OS') {
        e.preventDefault();
        setStartMenuOpen(prev => !prev);
      }
      // Alt+F4 → close focused window
      if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        if (windows.length > 0) {
          const topWin = [...windows].sort((a, b) => b.zIndex - a.zIndex)[0];
          if (topWin) closeWindow(topWin.id);
        }
      }
      // Alt+Tab → focus next window
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        if (windows.length > 1) {
          const sorted = [...windows].sort((a, b) => b.zIndex - a.zIndex);
          const nextWin = sorted[sorted.length - 1]; // least-focused
          focusWindow(nextWin.id);
        }
      }
      // Escape → close context menu/start menu
      if (e.key === 'Escape') {
        setContextMenu(null);
        setStartMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [windows, closeWindow, focusWindow]);

  const launchApp = useCallback((app: OsApp) => {
    playClickSound();
    if (app.type === 'browser' || app.url) {
      openWindow(app.id, app.name, app.url);
    } else {
      openWindow(app.id, app.name);
    }
  }, [openWindow]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const renderWindowContent = (win: { appId: string; url?: string }) => {
    const app = osApps.find(a => a.id === win.appId);
    if (!app) return null;

    if (app.type === 'browser' || app.url) {
      return <AppBrowser initialUrl={win.url || app.url} />;
    }

    switch (app.id) {
      case 'file-manager': return <AppFileManager />;
      case 'terminal': return <AppTerminal />;
      case 'text-editor': return <AppTextEditor />;
      case 'settings': return <AppSettings wallpaperIndex={wallpaperIndex} onWallpaperChange={setWallpaperIndex} />;
      default: return <div className="flex items-center justify-center h-full text-os-window-body-foreground text-sm">{app.name}</div>;
    }
  };

  const wp = wallpapers[wallpaperIndex];

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden select-none"
      style={{ background: `linear-gradient(135deg, hsl(${wp.from}), hsl(${wp.to}))` }}
      onContextMenu={handleContextMenu}
      onClick={() => { setContextMenu(null); setStartMenuOpen(false); }}
    >
      {/* Desktop area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Desktop widget */}
        <DesktopWidget />

        {/* Desktop icons */}
        <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
          {desktopApps.map(app => (
            <AppIcon
              key={app.id}
              name={app.name}
              iconName={app.icon}
              iconColor={app.iconColor}
              iconBg={app.iconBg}
              iconImage={app.iconImage}
              onDoubleClick={() => launchApp(app)}
            />
          ))}
        </div>

        {/* Snap preview overlay */}
        {snapPreview && (
          <div
            className="absolute z-[7999] rounded-lg transition-all duration-200"
            style={{
              background: 'hsla(217, 91%, 60%, 0.15)',
              border: '2px solid hsla(217, 91%, 60%, 0.4)',
              ...(snapPreview === 'left' ? { top: 0, left: 0, width: '50%', height: 'calc(100% - 48px)' } :
                snapPreview === 'right' ? { top: 0, right: 0, width: '50%', height: 'calc(100% - 48px)' } :
                { top: 0, left: 0, width: '100%', height: 'calc(100% - 48px)' }),
            }}
          />
        )}

        {/* Windows */}
        {windows.map(win => (
          <Window
            key={win.id}
            win={win}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => maximizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onMove={(x, y) => moveWindow(win.id, x, y)}
            onResize={(w, h) => resizeWindow(win.id, w, h)}
            onSnapPreview={setSnapPreview}
          >
            {renderWindowContent(win)}
          </Window>
        ))}

        {/* Context Menu */}
        {contextMenu && (
          <div
            className="absolute z-[9500] rounded-lg overflow-hidden animate-scale-in"
            style={{
              top: contextMenu.y,
              left: contextMenu.x,
              background: 'hsl(220, 20%, 14%)',
              border: '1px solid hsl(220, 15%, 22%)',
              backdropFilter: 'blur(20px)',
              minWidth: 180,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="w-full text-left px-4 py-2 text-xs text-os-panel-foreground hover:bg-white/10 transition-colors"
              onClick={() => { setWallpaperIndex((wallpaperIndex + 1) % wallpapers.length); setContextMenu(null); }}
            >
              Change Wallpaper
            </button>
            <button
              className="w-full text-left px-4 py-2 text-xs text-os-panel-foreground hover:bg-white/10 transition-colors"
              onClick={() => { window.location.reload(); }}
            >
              Refresh Desktop
            </button>
            <div className="h-px mx-2" style={{ background: 'hsl(220, 15%, 22%)' }} />
            <button
              className="w-full text-left px-4 py-2 text-xs text-os-panel-foreground hover:bg-white/10 transition-colors"
              onClick={() => { addNotification('About AkibOS', 'AkibOS v1.0 — A web-based desktop by Akib', 'info'); setContextMenu(null); }}
            >
              About AkibOS
            </button>
          </div>
        )}

        {/* Start Menu */}
        <StartMenu
          open={startMenuOpen}
          onClose={() => setStartMenuOpen(false)}
          onLaunchApp={launchApp}
        />

        {/* Dock */}
        <Dock onLaunchApp={(app) => { setStartMenuOpen(false); launchApp(app); }} />
      </div>

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        onWindowFocus={focusWindow}
        onStartMenuToggle={() => setStartMenuOpen(!startMenuOpen)}
        startMenuOpen={startMenuOpen}
        notifications={notifications}
        onRemoveNotification={removeNotification}
      />
    </div>
  );
};

export default Desktop;

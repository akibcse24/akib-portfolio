import { useState, useCallback } from 'react';
import AppIcon from './AppIcon';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import Window from './Window';
import AppBrowser from './AppBrowser';
import AppFileManager from './AppFileManager';
import AppTerminal from './AppTerminal';
import AppTextEditor from './AppTextEditor';
import AppSettings, { wallpapers } from './AppSettings';
import { osApps, OsApp } from '@/lib/os-apps';
import { useWindowManager } from '@/hooks/useWindowManager';

const Desktop = () => {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const {
    windows, openWindow, closeWindow, focusWindow,
    minimizeWindow, maximizeWindow, moveWindow, resizeWindow,
  } = useWindowManager();

  const desktopApps = osApps.filter(a => a.desktopShortcut);

  const launchApp = useCallback((app: OsApp) => {
    if (app.type === 'browser' || app.url) {
      openWindow(app.id, app.name, app.url);
    } else {
      openWindow(app.id, app.name);
    }
  }, [openWindow]);

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
    >
      {/* Desktop area */}
      <div className="flex-1 relative overflow-hidden">
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
          >
            {renderWindowContent(win)}
          </Window>
        ))}

        {/* Start Menu */}
        <StartMenu
          open={startMenuOpen}
          onClose={() => setStartMenuOpen(false)}
          onLaunchApp={launchApp}
        />
      </div>

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        onWindowFocus={focusWindow}
        onStartMenuToggle={() => setStartMenuOpen(!startMenuOpen)}
        startMenuOpen={startMenuOpen}
      />
    </div>
  );
};

export default Desktop;

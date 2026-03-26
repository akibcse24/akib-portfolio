import { useState, useEffect } from 'react';
import { icons } from 'lucide-react';
import { Wifi, Volume2, ChevronUp } from 'lucide-react';
import type { WindowState } from '@/hooks/useWindowManager';
import { osApps } from '@/lib/os-apps';

interface TaskbarProps {
  windows: WindowState[];
  onWindowFocus: (id: string) => void;
  onStartMenuToggle: () => void;
  startMenuOpen: boolean;
}

const Taskbar = ({ windows, onWindowFocus, onStartMenuToggle, startMenuOpen }: TaskbarProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (d: Date) => d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="h-12 flex items-center px-2 gap-1 bg-os-panel/90 backdrop-blur-xl border-t border-os-panel-border shrink-0 select-none" style={{ zIndex: 9000 }}>
      {/* Start button */}
      <button
        onClick={onStartMenuToggle}
        className={`h-8 px-3 rounded flex items-center gap-1.5 text-xs font-medium transition-colors ${startMenuOpen ? 'bg-os-accent text-white' : 'text-os-panel-foreground hover:bg-white/10'}`}
      >
        <svg width="16" height="16" viewBox="0 0 80 80" fill="none">
          <rect x="10" y="10" width="60" height="60" rx="14" stroke="currentColor" strokeWidth="4" fill="none" />
          <text x="40" y="48" textAnchor="middle" fill="currentColor" fontSize="28" fontWeight="700" fontFamily="Inter">A</text>
        </svg>
        Start
      </button>

      {/* Window tabs */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto mx-2">
        {windows.map(win => {
          const app = osApps.find(a => a.id === win.appId);
          const IconComp = app ? (icons as any)[app.icon] : null;
          return (
            <button
              key={win.id}
              onClick={() => onWindowFocus(win.id)}
              className={`h-8 px-2.5 rounded flex items-center gap-1.5 text-[11px] transition-colors shrink-0 ${win.minimized ? 'text-os-panel-foreground/50 hover:bg-white/5' : 'bg-white/10 text-os-panel-foreground hover:bg-white/15'}`}
            >
              {IconComp && <IconComp size={13} />}
              <span className="max-w-[120px] truncate">{win.title}</span>
            </button>
          );
        })}
      </div>

      {/* System tray */}
      <div className="flex items-center gap-2 text-os-panel-foreground">
        <ChevronUp size={13} className="opacity-50" />
        <Wifi size={14} className="opacity-70" />
        <Volume2 size={14} className="opacity-70" />
        <div className="text-right pl-2">
          <div className="text-[11px] font-medium">{formatTime(time)}</div>
          <div className="text-[9px] opacity-50">{formatDate(time)}</div>
        </div>
      </div>
    </div>
  );
};

export default Taskbar;

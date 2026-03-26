import { useState } from 'react';
import { Monitor, Palette, Info } from 'lucide-react';

const wallpapers = [
  { name: 'Deep Space', from: '220, 60%, 8%', to: '240, 50%, 15%' },
  { name: 'Ocean', from: '200, 60%, 10%', to: '210, 70%, 25%' },
  { name: 'Sunset', from: '350, 50%, 12%', to: '20, 60%, 20%' },
  { name: 'Forest', from: '140, 40%, 8%', to: '160, 50%, 18%' },
  { name: 'Midnight', from: '260, 50%, 6%', to: '280, 40%, 14%' },
];

interface AppSettingsProps {
  wallpaperIndex: number;
  onWallpaperChange: (index: number) => void;
}

const AppSettings = ({ wallpaperIndex, onWallpaperChange }: AppSettingsProps) => {
  const [tab, setTab] = useState<'display' | 'about'>('display');

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-44 border-r border-os-panel-border p-2 space-y-0.5 shrink-0">
        <button
          onClick={() => setTab('display')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs transition-colors ${tab === 'display' ? 'bg-os-accent text-white' : 'text-os-window-body-foreground hover:bg-white/5'}`}
        >
          <Monitor size={14} /> Display
        </button>
        <button
          onClick={() => setTab('about')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded text-xs transition-colors ${tab === 'about' ? 'bg-os-accent text-white' : 'text-os-window-body-foreground hover:bg-white/5'}`}
        >
          <Info size={14} /> About
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        {tab === 'display' && (
          <div>
            <h3 className="text-sm font-semibold text-os-window-body-foreground mb-3 flex items-center gap-2">
              <Palette size={16} /> Wallpaper
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {wallpapers.map((wp, i) => (
                <button
                  key={i}
                  onClick={() => onWallpaperChange(i)}
                  className={`h-16 rounded-lg border-2 transition-all ${i === wallpaperIndex ? 'border-os-accent shadow-lg' : 'border-transparent hover:border-white/20'}`}
                  style={{ background: `linear-gradient(135deg, hsl(${wp.from}), hsl(${wp.to}))` }}
                >
                  <span className="text-[9px] text-white/70">{wp.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {tab === 'about' && (
          <div className="space-y-3 text-os-window-body-foreground">
            <div className="flex items-center gap-3">
              <svg width="48" height="48" viewBox="0 0 80 80" fill="none">
                <defs>
                  <linearGradient id="aboutGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="hsl(217, 91%, 60%)" />
                    <stop offset="1" stopColor="hsl(260, 80%, 65%)" />
                  </linearGradient>
                </defs>
                <rect x="10" y="10" width="60" height="60" rx="14" stroke="url(#aboutGrad)" strokeWidth="2" fill="none" />
                <text x="40" y="48" textAnchor="middle" fill="url(#aboutGrad)" fontSize="24" fontWeight="700" fontFamily="Inter, sans-serif">A</text>
              </svg>
              <div>
                <h2 className="text-base font-bold">AkibOS</h2>
                <p className="text-xs opacity-60">Version 1.0.0</p>
              </div>
            </div>
            <div className="text-xs space-y-1 opacity-70">
              <p>Desktop Environment: Plasma Web</p>
              <p>Kernel: Browser Engine</p>
              <p>Architecture: WebAssembly-compatible</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { wallpapers };
export default AppSettings;

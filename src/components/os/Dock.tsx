import { useState } from 'react';
import { icons } from 'lucide-react';
import { osApps, OsApp } from '@/lib/os-apps';

interface DockProps {
  onLaunchApp: (app: OsApp) => void;
}

const dockAppIds = ['ctxnote', 'routine-tracker', 'hisabkhata', 'browser', 'file-manager', 'terminal'];

const Dock = ({ onLaunchApp }: DockProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const dockApps = dockAppIds.map(id => osApps.find(a => a.id === id)!).filter(Boolean);

  const getScale = (index: number) => {
    if (hoveredIndex === null) return 1;
    const dist = Math.abs(index - hoveredIndex);
    if (dist === 0) return 1.4;
    if (dist === 1) return 1.2;
    if (dist === 2) return 1.05;
    return 1;
  };

  return (
    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-[8000]">
      <div
        className="flex items-end gap-1 px-3 py-2 rounded-2xl"
        style={{
          background: 'hsla(220, 20%, 14%, 0.85)',
          border: '1px solid hsla(220, 15%, 25%, 0.6)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px hsla(0, 0%, 0%, 0.4)',
        }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {dockApps.map((app, i) => {
          const IconComp = (icons as any)[app.icon];
          const scale = getScale(i);
          return (
            <button
              key={app.id}
              className="flex flex-col items-center gap-0.5 transition-transform duration-150 ease-out origin-bottom"
              style={{ transform: `scale(${scale})` }}
              onMouseEnter={() => setHoveredIndex(i)}
              onClick={() => onLaunchApp(app)}
              title={app.name}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: app.iconBg }}
              >
                {app.iconImage ? (
                  <img src={app.iconImage} alt={app.name} className="w-6 h-6 rounded object-cover" />
                ) : IconComp ? (
                  <IconComp size={20} color={app.iconColor} />
                ) : null}
              </div>
              {hoveredIndex === i && (
                <span className="text-[9px] text-os-panel-foreground/80 whitespace-nowrap absolute -top-5 bg-os-panel/90 px-1.5 py-0.5 rounded text-center">
                  {app.name}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dock;

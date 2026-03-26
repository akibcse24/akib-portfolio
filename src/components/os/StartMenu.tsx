import { icons } from 'lucide-react';
import { osApps, OsApp } from '@/lib/os-apps';

interface StartMenuProps {
  open: boolean;
  onClose: () => void;
  onLaunchApp: (app: OsApp) => void;
}

const StartMenu = ({ open, onClose, onLaunchApp }: StartMenuProps) => {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[8998]" onClick={onClose} />
      <div
        className="absolute bottom-12 left-2 w-72 rounded-xl overflow-hidden shadow-2xl animate-slide-up z-[8999] border border-os-panel-border"
        style={{ background: 'hsl(220, 20%, 12%)', backdropFilter: 'blur(20px)' }}
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-sm font-semibold" style={{ color: 'hsl(210, 20%, 92%)' }}>Applications</h3>
        </div>

        {/* App list */}
        <div className="px-2 pb-3 space-y-0.5">
          {osApps.map(app => {
            const IconComp = (icons as any)[app.icon];
            return (
              <button
                key={app.id}
                onClick={() => { onLaunchApp(app); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/8 transition-colors group"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                  style={{ background: app.iconBg }}
                >
                  {IconComp && <IconComp size={18} color={app.iconColor} />}
                </div>
                <div className="text-left">
                  <div className="text-xs font-medium" style={{ color: 'hsl(210, 20%, 92%)' }}>{app.name}</div>
                  {app.description && (
                    <div className="text-[10px]" style={{ color: 'hsl(220, 15%, 50%)' }}>{app.description}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-os-panel-border px-4 py-2.5 flex items-center justify-between">
          <span className="text-[10px]" style={{ color: 'hsl(220, 15%, 40%)' }}>AkibOS v1.0</span>
        </div>
      </div>
    </>
  );
};

export default StartMenu;

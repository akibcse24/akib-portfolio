import { useRef, useCallback, useState } from 'react';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';
import type { WindowState } from '@/hooks/useWindowManager';

interface WindowProps {
  win: WindowState;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (w: number, h: number) => void;
}

const Window = ({ win, children, onClose, onMinimize, onMaximize, onFocus, onMove, onResize }: WindowProps) => {
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; winW: number; winH: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDownDrag = useCallback((e: React.MouseEvent) => {
    if (win.maximized) return;
    e.preventDefault();
    onFocus();
    dragRef.current = { startX: e.clientX, startY: e.clientY, winX: win.x, winY: win.y };
    setIsDragging(true);

    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      onMove(dragRef.current.winX + dx, Math.max(0, dragRef.current.winY + dy));
    };
    const handleMouseUp = () => {
      dragRef.current = null;
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [win.maximized, win.x, win.y, onFocus, onMove]);

  const handleMouseDownResize = useCallback((e: React.MouseEvent) => {
    if (win.maximized) return;
    e.preventDefault();
    e.stopPropagation();
    resizeRef.current = { startX: e.clientX, startY: e.clientY, winW: win.width, winH: win.height };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return;
      const dw = ev.clientX - resizeRef.current.startX;
      const dh = ev.clientY - resizeRef.current.startY;
      onResize(resizeRef.current.winW + dw, resizeRef.current.winH + dh);
    };
    const handleMouseUp = () => {
      resizeRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [win.maximized, win.width, win.height, onResize]);

  if (win.minimized) return null;

  const style: React.CSSProperties = win.maximized
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 48px)', zIndex: win.zIndex }
    : { top: win.y, left: win.x, width: win.width, height: win.height, zIndex: win.zIndex };

  return (
    <div
      className="absolute animate-window-open flex flex-col rounded-lg overflow-hidden shadow-2xl border border-os-panel-border"
      style={style}
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div
        className="h-9 flex items-center justify-between px-3 shrink-0 bg-os-window-chrome select-none"
        onMouseDown={handleMouseDownDrag}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <span className="text-xs font-medium text-os-window-chrome-foreground truncate">{win.title}</span>
        <div className="flex items-center gap-1">
          <button onClick={onMinimize} className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 transition-colors">
            <Minus size={13} className="text-os-window-chrome-foreground" />
          </button>
          <button onClick={onMaximize} className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 transition-colors">
            {win.maximized ? <Minimize2 size={13} className="text-os-window-chrome-foreground" /> : <Maximize2 size={13} className="text-os-window-chrome-foreground" />}
          </button>
          <button onClick={onClose} className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-500/80 transition-colors">
            <X size={13} className="text-os-window-chrome-foreground" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 bg-os-window-body overflow-hidden relative">
        {children}
      </div>

      {/* Resize handle */}
      {!win.maximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleMouseDownResize}
        />
      )}
    </div>
  );
};

export default Window;

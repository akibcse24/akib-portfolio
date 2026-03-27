import { useEffect, useState } from 'react';
import { playBootChime } from '@/lib/sounds';
import logoImg from '@/assets/logo.png';

interface BootScreenProps {
  onBootComplete: () => void;
}

const bootLogs = [
  '[OK] Starting AkibOS kernel 6.2.0...',
  '[OK] Initializing hardware abstraction layer',
  '[OK] Loading device drivers',
  '[OK] Mounting root filesystem',
  '[OK] Starting system services',
  '[OK] Initializing network stack',
  '[OK] Loading desktop environment',
  '[OK] Starting compositor',
  '[OK] Applying user preferences',
  '[OK] Desktop ready',
];

const BootScreen = ({ onBootComplete }: BootScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);

  useEffect(() => {
    const duration = 3000;
    const interval = 30;
    const step = 100 / (duration / interval);
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + step + (Math.random() * step * 0.5);
        if (next >= 100) {
          clearInterval(timer);
          playBootChime();
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onBootComplete, 500);
          }, 200);
          return 100;
        }
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [onBootComplete]);

  // Show logs based on progress
  useEffect(() => {
    const logCount = Math.floor((progress / 100) * bootLogs.length);
    setVisibleLogs(bootLogs.slice(0, logCount));
  }, [progress]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-[9999] transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{ background: 'linear-gradient(135deg, hsl(220, 60%, 5%), hsl(240, 50%, 10%))' }}
    >
      {/* Terminal logs behind */}
      <div className="absolute inset-x-0 top-8 bottom-1/2 px-12 overflow-hidden opacity-30 pointer-events-none">
        <div className="font-mono text-[10px] leading-relaxed" style={{ color: 'hsl(142, 71%, 55%)' }}>
          {visibleLogs.map((log, i) => (
            <div key={i} className="animate-slide-up">{log}</div>
          ))}
        </div>
      </div>

      {/* Logo */}
      <div className="animate-boot-in flex flex-col items-center gap-6 z-10">
        <div className="animate-boot-pulse">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="hsl(217, 91%, 60%)" />
                <stop offset="1" stopColor="hsl(260, 80%, 65%)" />
              </linearGradient>
            </defs>
            <rect x="4" y="4" width="72" height="72" rx="18" fill="url(#logoGrad)" opacity="0.15" />
            <rect x="10" y="10" width="60" height="60" rx="14" stroke="url(#logoGrad)" strokeWidth="2" fill="none" />
            <text x="40" y="48" textAnchor="middle" fill="url(#logoGrad)" fontSize="24" fontWeight="700" fontFamily="Inter, sans-serif">
              A
            </text>
          </svg>
        </div>

        <h1 className="text-2xl font-semibold tracking-wider" style={{ color: 'hsl(217, 91%, 70%)' }}>
          AkibOS
        </h1>

        <div className="w-64 h-1 rounded-full overflow-hidden" style={{ background: 'hsl(220, 20%, 15%)' }}>
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: 'linear-gradient(90deg, hsl(217, 91%, 60%), hsl(260, 80%, 65%))',
            }}
          />
        </div>

        <p className="text-xs tracking-widest" style={{ color: 'hsl(220, 15%, 45%)' }}>
          {progress < 30 ? 'Initializing system...' : progress < 70 ? 'Loading desktop...' : progress < 100 ? 'Almost ready...' : 'Welcome'}
        </p>
      </div>
    </div>
  );
};

export default BootScreen;

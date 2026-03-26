import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
}

const LockScreen = ({ onUnlock }: LockScreenProps) => {
  const [time, setTime] = useState(new Date());
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlock = () => {
    setFadeOut(true);
    setTimeout(onUnlock, 500);
  };

  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (d: Date) => d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center z-[9999] transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{ background: 'linear-gradient(135deg, hsl(220, 60%, 8%), hsl(260, 50%, 12%))' }}
      onClick={handleUnlock}
    >
      {/* Time */}
      <div className="animate-boot-in flex flex-col items-center gap-2 mb-12">
        <h1 className="text-7xl font-light tracking-tight" style={{ color: 'hsl(210, 20%, 92%)' }}>
          {formatTime(time)}
        </h1>
        <p className="text-lg font-light tracking-wide" style={{ color: 'hsl(220, 15%, 55%)' }}>
          {formatDate(time)}
        </p>
      </div>

      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, hsl(217, 91%, 50%), hsl(260, 80%, 55%))' }}
        >
          <User size={36} color="white" />
        </div>
        <h2 className="text-xl font-medium" style={{ color: 'hsl(210, 20%, 90%)' }}>
          Akib
        </h2>
      </div>

      {/* Login button */}
      <button
        onClick={(e) => { e.stopPropagation(); handleUnlock(); }}
        className="px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
        style={{
          background: 'hsla(217, 91%, 60%, 0.2)',
          border: '1px solid hsla(217, 91%, 60%, 0.4)',
          color: 'hsl(217, 91%, 75%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        Click to Login
      </button>

      <p className="absolute bottom-8 text-xs animate-pulse" style={{ color: 'hsl(220, 15%, 40%)' }}>
        Click anywhere to unlock
      </p>
    </div>
  );
};

export default LockScreen;

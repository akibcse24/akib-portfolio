import { useState, useCallback } from 'react';
import BootScreen from '@/components/os/BootScreen';
import LockScreen from '@/components/os/LockScreen';
import Desktop from '@/components/os/Desktop';

const Index = () => {
  const [phase, setPhase] = useState<'boot' | 'lock' | 'desktop'>('boot');

  const handleBootComplete = useCallback(() => {
    setPhase('lock');
  }, []);

  const handleUnlock = useCallback(() => {
    setPhase('desktop');
    try {
      document.documentElement.requestFullscreen?.();
    } catch {}
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden" style={{ background: '#000' }}>
      {phase === 'boot' && <BootScreen onBootComplete={handleBootComplete} />}
      {phase === 'lock' && <LockScreen onUnlock={handleUnlock} />}
      {phase === 'desktop' && <Desktop />}
    </div>
  );
};

export default Index;

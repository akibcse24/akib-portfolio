import { useState, useCallback } from 'react';
import BootScreen from '@/components/os/BootScreen';
import Desktop from '@/components/os/Desktop';

const Index = () => {
  const [phase, setPhase] = useState<'boot' | 'desktop'>('boot');

  const handleBootComplete = useCallback(() => {
    setPhase('desktop');
    // Try to enter fullscreen
    try {
      document.documentElement.requestFullscreen?.();
    } catch {}
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden" style={{ background: '#000' }}>
      {phase === 'boot' && <BootScreen onBootComplete={handleBootComplete} />}
      {phase === 'desktop' && <Desktop />}
    </div>
  );
};

export default Index;

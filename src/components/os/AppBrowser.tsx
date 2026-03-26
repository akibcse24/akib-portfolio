import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Lock, Star } from 'lucide-react';

interface AppBrowserProps {
  initialUrl?: string;
}

const AppBrowser = ({ initialUrl = 'https://www.google.com' }: AppBrowserProps) => {
  const [url, setUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [history, setHistory] = useState<string[]>([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = (newUrl: string) => {
    let finalUrl = newUrl;
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    setUrl(finalUrl);
    setInputUrl(finalUrl);
    setLoading(true);
    const newHistory = [...history.slice(0, historyIndex + 1), finalUrl];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const i = historyIndex - 1;
      setHistoryIndex(i);
      setUrl(history[i]);
      setInputUrl(history[i]);
      setLoading(true);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const i = historyIndex + 1;
      setHistoryIndex(i);
      setUrl(history[i]);
      setInputUrl(history[i]);
      setLoading(true);
    }
  };

  const refresh = () => {
    setLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  };

  useEffect(() => {
    setUrl(initialUrl);
    setInputUrl(initialUrl);
    setHistory([initialUrl]);
    setHistoryIndex(0);
    setLoading(true);
  }, [initialUrl]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-os-window-chrome border-b border-os-panel-border">
        <button onClick={goBack} disabled={historyIndex <= 0} className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/10 disabled:opacity-30 transition-colors">
          <ArrowLeft size={14} className="text-os-window-chrome-foreground" />
        </button>
        <button onClick={goForward} disabled={historyIndex >= history.length - 1} className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/10 disabled:opacity-30 transition-colors">
          <ArrowRight size={14} className="text-os-window-chrome-foreground" />
        </button>
        <button onClick={refresh} className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/10 transition-colors">
          <RotateCw size={14} className={`text-os-window-chrome-foreground ${loading ? 'animate-spin' : ''}`} />
        </button>
        <div className="flex-1 flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs" style={{ background: 'hsl(220, 20%, 10%)' }}>
          <Lock size={11} style={{ color: 'hsl(142, 71%, 45%)' }} />
          <input
            className="flex-1 bg-transparent text-os-window-chrome-foreground outline-none text-xs"
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') navigate(inputUrl); }}
          />
        </div>
        <button className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/10 transition-colors">
          <Star size={14} className="text-os-window-chrome-foreground" />
        </button>
      </div>

      {/* Loading bar */}
      {loading && (
        <div className="h-0.5 w-full overflow-hidden" style={{ background: 'hsl(220, 20%, 15%)' }}>
          <div className="h-full animate-pulse" style={{ width: '60%', background: 'hsl(217, 91%, 60%)' }} />
        </div>
      )}

      {/* iframe */}
      <iframe
        ref={iframeRef}
        src={url}
        className="flex-1 w-full border-0 bg-white"
        onLoad={() => setLoading(false)}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
        title="Browser"
      />
    </div>
  );
};

export default AppBrowser;

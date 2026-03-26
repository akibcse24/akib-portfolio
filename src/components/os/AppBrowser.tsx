import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Lock, Star, ExternalLink, AlertTriangle } from 'lucide-react';
import { osApps } from '@/lib/os-apps';

interface AppBrowserProps {
  initialUrl?: string;
}

const AppBrowser = ({ initialUrl = 'https://www.google.com' }: AppBrowserProps) => {
  const [url, setUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [history, setHistory] = useState<string[]>([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Check if the URL belongs to a known blocked app
  const isKnownBlocked = (checkUrl: string) => {
    return osApps.some(app => app.iframeBlocked && checkUrl.includes(new URL(app.url || '').hostname));
  };

  const navigate = (newUrl: string) => {
    let finalUrl = newUrl;
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    setUrl(finalUrl);
    setInputUrl(finalUrl);
    setLoading(true);
    setBlocked(isKnownBlocked(finalUrl));
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
      setBlocked(isKnownBlocked(history[i]));
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const i = historyIndex + 1;
      setHistoryIndex(i);
      setUrl(history[i]);
      setInputUrl(history[i]);
      setLoading(true);
      setBlocked(isKnownBlocked(history[i]));
    }
  };

  const refresh = () => {
    if (blocked) return;
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
    setBlocked(isKnownBlocked(initialUrl));
  }, [initialUrl]);

  // Find matching app for fallback UI
  const matchedApp = osApps.find(app => app.url && url.includes(new URL(app.url).hostname));

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
          <RotateCw size={14} className={`text-os-window-chrome-foreground ${loading && !blocked ? 'animate-spin' : ''}`} />
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
      {loading && !blocked && (
        <div className="h-0.5 w-full overflow-hidden" style={{ background: 'hsl(220, 20%, 15%)' }}>
          <div className="h-full animate-pulse" style={{ width: '60%', background: 'hsl(217, 91%, 60%)' }} />
        </div>
      )}

      {/* Blocked fallback or iframe */}
      {blocked ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 bg-os-window-body">
          <div className="flex flex-col items-center gap-4">
            {matchedApp?.iconImage ? (
              <img src={matchedApp.iconImage} alt={matchedApp.name} className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
            ) : (
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: matchedApp?.iconBg || 'hsl(220, 20%, 20%)' }}>
                <AlertTriangle size={32} className="text-os-accent" />
              </div>
            )}
            <h2 className="text-lg font-semibold text-os-window-body-foreground">{matchedApp?.name || 'Website'}</h2>
            <p className="text-sm text-os-window-body-foreground/60 text-center max-w-xs">
              This site cannot be displayed in an embedded frame due to its security policy.
            </p>
          </div>
          <button
            onClick={() => window.open(url, '_blank')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors bg-os-accent text-white hover:bg-os-accent/80"
          >
            <ExternalLink size={16} />
            Open in New Tab
          </button>
          {matchedApp?.description && (
            <p className="text-xs text-os-window-body-foreground/40 mt-2">{matchedApp.description}</p>
          )}
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          src={url}
          className="flex-1 w-full border-0 bg-white"
          onLoad={() => setLoading(false)}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
          title="Browser"
        />
      )}
    </div>
  );
};

export default AppBrowser;

import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Lock, Star, ExternalLink, AlertTriangle, Shield, ShieldOff } from 'lucide-react';
import { osApps } from '@/lib/os-apps';
import { supabase } from '@/integrations/supabase/client';

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
  const [proxyMode, setProxyMode] = useState(true); // proxy enabled by default
  const [proxyHtml, setProxyHtml] = useState<string | null>(null);
  const [proxyError, setProxyError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isKnownBlocked = (checkUrl: string) => {
    try {
      return osApps.some(app => app.iframeBlocked && app.url && checkUrl.includes(new URL(app.url).hostname));
    } catch { return false; }
  };

  const fetchViaProxy = useCallback(async (targetUrl: string) => {
    setLoading(true);
    setProxyError(null);
    setProxyHtml(null);
    try {
      const { data, error } = await supabase.functions.invoke('web-proxy', {
        body: { url: targetUrl },
      });
      if (error) throw error;
      if (typeof data === 'string') {
        setProxyHtml(data);
      } else if (data?.error) {
        setProxyError(data.error);
      } else {
        // Edge function returned HTML as text
        setProxyHtml(JSON.stringify(data));
      }
    } catch (err: any) {
      setProxyError(err.message || 'Proxy request failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUrl = useCallback((targetUrl: string) => {
    setBlocked(false);
    setProxyHtml(null);
    setProxyError(null);

    if (proxyMode) {
      fetchViaProxy(targetUrl);
    } else {
      setLoading(true);
      setBlocked(isKnownBlocked(targetUrl));
    }
  }, [proxyMode, fetchViaProxy]);

  const navigate = (newUrl: string) => {
    let finalUrl = newUrl;
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    setUrl(finalUrl);
    setInputUrl(finalUrl);
    const newHistory = [...history.slice(0, historyIndex + 1), finalUrl];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    loadUrl(finalUrl);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const i = historyIndex - 1;
      setHistoryIndex(i);
      setUrl(history[i]);
      setInputUrl(history[i]);
      loadUrl(history[i]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const i = historyIndex + 1;
      setHistoryIndex(i);
      setUrl(history[i]);
      setInputUrl(history[i]);
      loadUrl(history[i]);
    }
  };

  const refresh = () => {
    loadUrl(url);
  };

  useEffect(() => {
    setUrl(initialUrl);
    setInputUrl(initialUrl);
    setHistory([initialUrl]);
    setHistoryIndex(0);
    loadUrl(initialUrl);
  }, [initialUrl]);

  // Re-load when proxy mode toggles
  useEffect(() => {
    loadUrl(url);
  }, [proxyMode]);

  const matchedApp = osApps.find(app => {
    try { return app.url && url.includes(new URL(app.url).hostname); }
    catch { return false; }
  });

  // Build proxy blob URL for iframe srcdoc
  const iframeSrc = proxyMode && proxyHtml ? undefined : (proxyMode ? undefined : url);
  const iframeSrcDoc = proxyMode && proxyHtml ? proxyHtml : undefined;

  const showBlockedFallback = !proxyMode && blocked;
  const showProxyError = proxyMode && proxyError;
  const showIframe = !showBlockedFallback && !showProxyError && (!proxyMode || proxyHtml);

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
          {proxyMode ? (
            <Shield size={11} className="text-os-accent shrink-0" />
          ) : (
            <Lock size={11} style={{ color: 'hsl(142, 71%, 45%)' }} className="shrink-0" />
          )}
          <input
            className="flex-1 bg-transparent text-os-window-chrome-foreground outline-none text-xs"
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') navigate(inputUrl); }}
          />
        </div>
        <button
          onClick={() => setProxyMode(!proxyMode)}
          title={proxyMode ? 'Proxy mode ON — bypasses frame restrictions (some sites may break)' : 'Proxy mode OFF — direct iframe loading'}
          className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${proxyMode ? 'bg-os-accent/20 hover:bg-os-accent/30' : 'hover:bg-white/10'}`}
        >
          {proxyMode ? (
            <Shield size={14} className="text-os-accent" />
          ) : (
            <ShieldOff size={14} className="text-os-window-chrome-foreground/50" />
          )}
        </button>
        <button className="w-7 h-7 rounded flex items-center justify-center hover:bg-white/10 transition-colors">
          <Star size={14} className="text-os-window-chrome-foreground" />
        </button>
      </div>

      {/* Proxy mode indicator */}
      {proxyMode && (
        <div className="flex items-center gap-2 px-3 py-1 text-[10px] bg-os-accent/10 text-os-accent border-b border-os-panel-border">
          <Shield size={10} />
          <span>Proxy mode — pages load through a server proxy. JS-heavy sites may not work correctly.</span>
          <button onClick={() => window.open(url, '_blank')} className="ml-auto flex items-center gap-1 hover:underline">
            <ExternalLink size={10} /> Open directly
          </button>
        </div>
      )}

      {/* Loading bar */}
      {loading && (
        <div className="h-0.5 w-full overflow-hidden" style={{ background: 'hsl(220, 20%, 15%)' }}>
          <div className="h-full animate-pulse" style={{ width: '60%', background: 'hsl(217, 91%, 60%)' }} />
        </div>
      )}

      {/* Proxy error */}
      {showProxyError && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-os-window-body">
          <AlertTriangle size={40} className="text-os-accent" />
          <h2 className="text-base font-semibold text-os-window-body-foreground">Failed to load page</h2>
          <p className="text-xs text-os-window-body-foreground/60 text-center max-w-sm">{proxyError}</p>
          <div className="flex gap-2">
            <button
              onClick={() => window.open(url, '_blank')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-os-accent text-white hover:bg-os-accent/80 transition-colors"
            >
              <ExternalLink size={14} /> Open in New Tab
            </button>
            <button
              onClick={() => { setProxyMode(false); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border border-os-panel-border text-os-window-body-foreground hover:bg-white/5 transition-colors"
            >
              <ShieldOff size={14} /> Try Direct Mode
            </button>
          </div>
        </div>
      )}

      {/* Blocked fallback (direct mode only) */}
      {showBlockedFallback && (
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
              This site blocks iframe embedding. Try proxy mode or open in a new tab.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setProxyMode(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-os-accent text-white hover:bg-os-accent/80 transition-colors"
            >
              <Shield size={16} /> Enable Proxy
            </button>
            <button
              onClick={() => window.open(url, '_blank')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border border-os-panel-border text-os-window-body-foreground hover:bg-white/5 transition-colors"
            >
              <ExternalLink size={16} /> Open in New Tab
            </button>
          </div>
        </div>
      )}

      {/* Iframe */}
      {showIframe && (
        <iframe
          ref={iframeRef}
          src={iframeSrc}
          srcDoc={iframeSrcDoc}
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

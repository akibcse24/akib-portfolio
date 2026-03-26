import { useState } from 'react';

const AppTextEditor = () => {
  const [content, setContent] = useState('# Welcome to AkibOS Text Editor\n\nStart typing here...');
  const [filename, setFilename] = useState('untitled.txt');

  return (
    <div className="flex flex-col h-full">
      {/* Menu bar */}
      <div className="flex items-center gap-3 px-3 py-1.5 text-xs border-b border-os-panel-border bg-os-window-chrome">
        <span className="text-os-window-chrome-foreground opacity-70">File</span>
        <span className="text-os-window-chrome-foreground opacity-70">Edit</span>
        <span className="text-os-window-chrome-foreground opacity-70">View</span>
        <span className="flex-1" />
        <input
          className="bg-transparent text-os-window-chrome-foreground text-xs text-right outline-none w-32"
          value={filename}
          onChange={e => setFilename(e.target.value)}
        />
      </div>
      {/* Editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line numbers */}
        <div className="w-10 pt-2 text-right pr-2 text-[10px] select-none shrink-0 overflow-hidden" style={{ color: 'hsl(220, 15%, 35%)', background: 'hsl(220, 25%, 10%)' }}>
          {content.split('\n').map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          className="flex-1 resize-none p-2 font-mono text-xs outline-none"
          style={{ background: 'hsl(220, 25%, 8%)', color: 'hsl(210, 20%, 85%)' }}
          value={content}
          onChange={e => setContent(e.target.value)}
          spellCheck={false}
        />
      </div>
      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 text-[10px] border-t border-os-panel-border" style={{ background: 'hsl(217, 91%, 30%)', color: 'hsl(210, 20%, 92%)' }}>
        <span>{filename}</span>
        <span>Lines: {content.split('\n').length} | Chars: {content.length}</span>
      </div>
    </div>
  );
};

export default AppTextEditor;

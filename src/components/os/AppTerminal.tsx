import { useState, useRef, useEffect } from 'react';

const MOTD = `AkibOS Terminal v1.0
Type 'help' for available commands.\n`;

const commands: Record<string, (args: string[]) => string> = {
  help: () => `Available commands:
  help       - Show this message
  ls         - List files
  pwd        - Print working directory
  whoami     - Display current user
  date       - Show current date/time
  echo       - Echo text
  clear      - Clear terminal
  neofetch   - System info
  uname      - System name`,
  ls: () => 'Documents  Pictures  Downloads  .bashrc  .config',
  pwd: () => '/home/akib',
  whoami: () => 'akib',
  date: () => new Date().toString(),
  echo: (args) => args.join(' '),
  uname: () => 'AkibOS 1.0 x86_64',
  neofetch: () => `
       ___       akib@akibos
      /   \\      OS: AkibOS 1.0
     / A   \\     Kernel: web-5.0
    /  kib   \\   Shell: akibsh 1.0
   /   OS     \\  DE: Plasma Web
  /____________\\ CPU: Browser Engine
                 Memory: ∞ MB`,
};

const AppTerminal = () => {
  const [lines, setLines] = useState<string[]>([MOTD]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [lines]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    const prompt = `akib@akibos:~$ ${trimmed}`;
    if (!trimmed) {
      setLines(prev => [...prev, prompt]);
      setInput('');
      return;
    }

    if (trimmed === 'clear') {
      setLines([]);
      setInput('');
      return;
    }

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    const handler = commands[cmd];
    const output = handler ? handler(args) : `${cmd}: command not found`;
    setLines(prev => [...prev, prompt, output]);
    setCmdHistory(prev => [...prev, trimmed]);
    setHistIdx(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const newIdx = histIdx === -1 ? cmdHistory.length - 1 : Math.max(0, histIdx - 1);
        setHistIdx(newIdx);
        setInput(cmdHistory[newIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx >= 0) {
        const newIdx = histIdx + 1;
        if (newIdx >= cmdHistory.length) {
          setHistIdx(-1);
          setInput('');
        } else {
          setHistIdx(newIdx);
          setInput(cmdHistory[newIdx]);
        }
      }
    }
  };

  return (
    <div
      className="h-full p-3 font-mono text-xs overflow-auto cursor-text"
      style={{ background: 'hsl(220, 30%, 6%)', color: 'hsl(120, 50%, 75%)' }}
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, i) => (
        <pre key={i} className="whitespace-pre-wrap">{line}</pre>
      ))}
      <div className="flex items-center gap-0">
        <span style={{ color: 'hsl(217, 91%, 60%)' }}>akib@akibos</span>
        <span style={{ color: 'hsl(210, 20%, 50%)' }}>:</span>
        <span style={{ color: 'hsl(260, 80%, 70%)' }}>~</span>
        <span style={{ color: 'hsl(210, 20%, 50%)' }}>$ </span>
        <input
          ref={inputRef}
          className="flex-1 bg-transparent outline-none caret-green-400"
          style={{ color: 'hsl(120, 50%, 75%)' }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default AppTerminal;

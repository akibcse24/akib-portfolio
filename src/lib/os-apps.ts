export interface OsApp {
  id: string;
  name: string;
  icon: string; // lucide icon name
  iconColor: string;
  iconBg: string;
  type: 'browser' | 'native';
  url?: string;
  description?: string;
  desktopShortcut?: boolean;
}

export const osApps: OsApp[] = [
  {
    id: 'ctxnote',
    name: 'CtxNote',
    icon: 'Network',
    iconColor: '#60a5fa',
    iconBg: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
    type: 'browser',
    url: 'https://cn.akib.qzz.io',
    description: 'Visual Knowledge Base & Infinite Canvas',
    desktopShortcut: true,
  },
  {
    id: 'routine-tracker',
    name: 'RT - Routine Tracker',
    icon: 'Target',
    iconColor: '#34d399',
    iconBg: 'linear-gradient(135deg, #064e3b, #059669)',
    type: 'browser',
    url: 'https://rt.akib.qzz.io',
    description: 'Premium Routine Tracking',
    desktopShortcut: true,
  },
  {
    id: 'hisabkhata',
    name: 'Hisabkhata',
    icon: 'Wallet',
    iconColor: '#fbbf24',
    iconBg: 'linear-gradient(135deg, #78350f, #d97706)',
    type: 'browser',
    url: 'https://hk.akib.qzz.io',
    description: 'Credit & Loan Tracker',
    desktopShortcut: true,
  },
  {
    id: 'browser',
    name: 'Browser',
    icon: 'Globe',
    iconColor: '#818cf8',
    iconBg: 'linear-gradient(135deg, #312e81, #6366f1)',
    type: 'browser',
    url: 'https://www.google.com',
    description: 'Web Browser',
  },
  {
    id: 'file-manager',
    name: 'Files',
    icon: 'FolderOpen',
    iconColor: '#fb923c',
    iconBg: 'linear-gradient(135deg, #7c2d12, #ea580c)',
    type: 'native',
    description: 'File Manager',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: 'Terminal',
    iconColor: '#a3e635',
    iconBg: 'linear-gradient(135deg, #1a2e05, #365314)',
    type: 'native',
    description: 'System Terminal',
  },
  {
    id: 'text-editor',
    name: 'Text Editor',
    icon: 'FileText',
    iconColor: '#e2e8f0',
    iconBg: 'linear-gradient(135deg, #1e293b, #475569)',
    type: 'native',
    description: 'Simple Text Editor',
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: 'Settings',
    iconColor: '#94a3b8',
    iconBg: 'linear-gradient(135deg, #0f172a, #334155)',
    type: 'native',
    description: 'System Settings',
  },
];

import { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Home, HardDrive } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'folder' | 'file';
  children?: FileNode[];
}

const fileTree: FileNode[] = [
  {
    name: 'Home', type: 'folder', children: [
      { name: 'Documents', type: 'folder', children: [
        { name: 'notes.txt', type: 'file' },
        { name: 'report.pdf', type: 'file' },
      ]},
      { name: 'Pictures', type: 'folder', children: [
        { name: 'wallpaper.jpg', type: 'file' },
        { name: 'screenshot.png', type: 'file' },
      ]},
      { name: 'Downloads', type: 'folder', children: [] },
      { name: '.bashrc', type: 'file' },
    ],
  },
  {
    name: 'System', type: 'folder', children: [
      { name: 'etc', type: 'folder', children: [
        { name: 'config.sys', type: 'file' },
      ]},
      { name: 'bin', type: 'folder', children: [] },
    ],
  },
];

const FileTreeItem = ({ node, depth = 0 }: { node: FileNode; depth?: number }) => {
  const [open, setOpen] = useState(depth === 0);

  return (
    <div>
      <button
        className="w-full flex items-center gap-1.5 py-1 px-2 text-xs hover:bg-white/5 transition-colors text-os-window-body-foreground"
        style={{ paddingLeft: depth * 16 + 8 }}
        onClick={() => node.type === 'folder' && setOpen(!open)}
      >
        {node.type === 'folder' ? (
          <>
            {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            <Folder size={14} className="text-os-warning" />
          </>
        ) : (
          <>
            <span className="w-3" />
            <File size={14} className="text-os-panel-foreground" />
          </>
        )}
        <span>{node.name}</span>
      </button>
      {open && node.children?.map((child, i) => (
        <FileTreeItem key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  );
};

const AppFileManager = () => {
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-40 border-r border-os-panel-border p-2 space-y-1 shrink-0">
        <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-os-window-body-foreground hover:bg-white/5 bg-white/5">
          <Home size={13} /> Home
        </button>
        <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-os-window-body-foreground hover:bg-white/5">
          <HardDrive size={13} /> System
        </button>
      </div>
      {/* Tree */}
      <div className="flex-1 overflow-auto p-1">
        {fileTree.map((node, i) => (
          <FileTreeItem key={i} node={node} />
        ))}
      </div>
    </div>
  );
};

export default AppFileManager;

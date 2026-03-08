import { useEffect, useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Minus, Square, Copy, X } from 'lucide-react';
import icon from './icon.png';

export default function CustomTitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const appWindow = getCurrentWindow();

  const [minimizeToTray, setMinimizeToTray] = useState(() => {
    return localStorage.getItem("minimizeToTray") !== "false";
  });

  useEffect(() => {
    // Check if window is maximized on mount
    appWindow.isMaximized().then(setIsMaximized);

    // Listen for resize events to update maximize state
    const unlistenResize = appWindow.listen('tauri://resize', async () => {
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    });

    // Listen for setting changes from App.jsx
    const handleSettingsChange = (event) => {
      setMinimizeToTray(event.detail);
    };
    window.addEventListener('setting-minimize-to-tray', handleSettingsChange);

    return () => {
      unlistenResize.then(fn => fn());
      window.removeEventListener('setting-minimize-to-tray', handleSettingsChange);
    };
  }, []);

  const minimizeWindow = () => appWindow.minimize();
  const maximizeWindow = () => appWindow.toggleMaximize();
  const closeWindow = () => {
    if (minimizeToTray) {
      appWindow.hide();
    } else {
      appWindow.close();
    }
  };

  return (
    <div 
      data-tauri-drag-region 
      className="h-8 bg-card border-b border-border flex items-center justify-between select-none z-[9999999]"
    >
      {/* Left side - Logo and Title */}
      <div className="flex items-center gap-3 px-3" data-tauri-drag-region>
        <div className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center">
          <img src={icon} alt="Logo" className="w-4 h-4" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">MyApp</span>
      </div>

      {/* Center - draggable area */}
      <div className="flex-1" data-tauri-drag-region />

      {/* Right side - Window Controls */}
      <div className="flex items-center h-full">
        <button
          onClick={minimizeWindow}
          className="h-full w-12 inline-flex items-center justify-center hover:bg-secondary/80 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Minimize"
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <button
          onClick={maximizeWindow}
          className="h-full w-12 inline-flex items-center justify-center hover:bg-secondary/80 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Maximize"
        >
          {isMaximized ? (
            <Copy className="w-3.5 h-3.5" />
          ) : (
            <Square className="w-3.5 h-3.5" />
          )}
        </button>
        
        <button
          onClick={closeWindow}
          className="h-full w-12 inline-flex items-center justify-center hover:bg-destructive transition-colors text-muted-foreground hover:text-white"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}